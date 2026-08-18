import { callRpc } from './supabase.js';
import { loadCanonicalDailyPicks } from './daily-operations.js';

const DEFAULT_F5_WEIGHTS = Object.freeze({
  starter_history: 25,
  opponent_early_offense: 15,
  team_f5_split: 15,
  recent_f5_form: 15,
  matchup_history: 10,
  situation_match: 10,
  rest_location: 5,
  market_baseline: 5
});

const FACTOR_ORDER = Object.freeze([
  'starter_history',
  'opponent_early_offense',
  'team_f5_split',
  'recent_f5_form',
  'matchup_history',
  'situation_match',
  'rest_location',
  'market_baseline'
]);

const FACTOR_LABELS = Object.freeze({
  starter_history: 'Starting Pitcher History',
  opponent_early_offense: 'Opponent Early Offense',
  team_f5_split: 'Team F5 Split',
  recent_f5_form: 'Recent F5 Form',
  matchup_history: 'Matchup History',
  situation_match: 'Situation Match',
  rest_location: 'Rest / Location',
  market_baseline: 'Market Baseline'
});

const TEAM_ALIASES = Object.freeze({
  ARI:'ARI',ATL:'ATL',BAL:'BAL',BOS:'BOS',CHC:'CHC',CWS:'CWS',CIN:'CIN',CLE:'CLE',COL:'COL',DET:'DET',HOU:'HOU',KC:'KC',KCR:'KC',LAA:'LAA',LAD:'LAD',MIA:'MIA',MIL:'MIL',MIN:'MIN',NYM:'NYM',NYY:'NYY',ATH:'ATH',OAK:'ATH',PHI:'PHI',PIT:'PIT',SD:'SD',SDP:'SD',SEA:'SEA',SF:'SF',SFG:'SF',STL:'STL',TB:'TB',TBR:'TB',TEX:'TEX',TOR:'TOR',WSH:'WSH',WAS:'WSH'
});

function finite(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function normalizeTeam(value) {
  const raw = String(value || '').trim().toUpperCase().replace(/\./g, '');
  return TEAM_ALIASES[raw] || null;
}

function parseF5SidePick(pick) {
  const raw = String(pick?.rawPick || pick?.pick || '').trim().toUpperCase();
  if (!/^F5\b/.test(raw)) return null;
  const teamMatch = raw.match(/^F5\s+([A-Z]{2,3})\b/);
  const lineMatch = raw.match(/^F5\s+[A-Z]{2,3}\s+([+-](?:0?\.5|1(?:\.0)?|1\.5|2(?:\.0)?))/);
  const team = normalizeTeam(teamMatch?.[1]);
  const line = finite(lineMatch?.[1]);
  if (!team || line === null) return null;
  return {
    id: pick.id || pick.sourceId || null,
    date: pick.date,
    team,
    line,
    odds: finite(pick.odds),
    rawPick: pick.rawPick,
    notes: pick.notes || pick.rawPick,
    hasExplicitUnits: Boolean(pick.hasExplicitUnits),
    units: pick.hasExplicitUnits ? finite(pick.units) : null
  };
}

function americanImpliedProbability(odds) {
  const value = finite(odds);
  if (value === null || value === 0) return null;
  if (value > 0) return 100 / (value + 100) * 100;
  return Math.abs(value) / (Math.abs(value) + 100) * 100;
}

function normalizeWeights(input = {}) {
  const weights = {};
  for (const key of FACTOR_ORDER) {
    const candidate = input[key] === undefined ? DEFAULT_F5_WEIGHTS[key] : Number(input[key]);
    if (!Number.isFinite(candidate) || candidate < 0 || candidate > 100) {
      const error = new Error(`Invalid weight for ${key}. Weights must be between 0 and 100.`);
      error.statusCode = 400;
      throw error;
    }
    weights[key] = Math.round(candidate * 10) / 10;
  }
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 100) > 0.01) {
    const error = new Error(`Model weights must total 100%. Current total: ${total.toFixed(1)}%.`);
    error.statusCode = 400;
    throw error;
  }
  return weights;
}

function marketFactor(odds) {
  const score = americanImpliedProbability(odds);
  return {
    key: 'market_baseline',
    label: FACTOR_LABELS.market_baseline,
    available: score !== null,
    score: score === null ? null : Math.round(score * 10) / 10,
    sample: null,
    wins: null,
    losses: null,
    pushes: null,
    rawRate: null,
    extra: odds === null ? null : { odds }
  };
}

function normalizeSnapshotFactors(snapshot, odds) {
  const raw = snapshot?.factors && typeof snapshot.factors === 'object' ? snapshot.factors : {};
  const factors = { ...raw, market_baseline: marketFactor(odds) };
  return FACTOR_ORDER.map(key => {
    const factor = factors[key] || {};
    const score = finite(factor.score);
    return {
      key,
      label: factor.label || FACTOR_LABELS[key],
      available: Boolean(factor.available) && score !== null,
      score,
      sample: finite(factor.sample),
      wins: finite(factor.wins),
      losses: finite(factor.losses),
      pushes: finite(factor.pushes),
      rawRate: finite(factor.rawRate),
      extra: factor.extra || null
    };
  });
}

function factorDetail(factor) {
  if (factor.key === 'opponent_early_offense' && factor.extra) {
    const opp = finite(factor.extra.opponentAvgF5Runs);
    const league = finite(factor.extra.leagueAvgF5Runs);
    if (opp !== null && league !== null) return `Opponent ${opp.toFixed(2)} F5 runs vs MLB ${league.toFixed(2)}`;
  }
  if (factor.key === 'market_baseline' && factor.extra?.odds != null) {
    const odds = Number(factor.extra.odds);
    return `Listed price ${odds > 0 ? '+' : ''}${odds}`;
  }
  if (factor.sample !== null && factor.sample > 0) {
    const record = factor.wins !== null && factor.losses !== null ? `${factor.wins}-${factor.losses}${factor.pushes ? `-${factor.pushes}` : ''}` : null;
    return [record, `${factor.sample} games`].filter(Boolean).join(' • ');
  }
  return 'Verified data not available for this factor yet';
}

function scorePick(pick, snapshot, weights) {
  const factors = normalizeSnapshotFactors(snapshot, pick.odds);
  const available = factors.filter(factor => factor.available && weights[factor.key] > 0);
  const activeWeight = available.reduce((sum, factor) => sum + weights[factor.key], 0);
  const modelEstimate = activeWeight > 0
    ? available.reduce((sum, factor) => sum + factor.score * weights[factor.key], 0) / activeWeight
    : null;
  const marketProbability = americanImpliedProbability(pick.odds);
  const edge = modelEstimate !== null && marketProbability !== null ? modelEstimate - marketProbability : null;
  const coverage = Math.round(100 * available.length / FACTOR_ORDER.length);

  return {
    pickId: pick.id,
    date: pick.date,
    team: pick.team,
    opponent: snapshot?.opponent || null,
    role: snapshot?.role || null,
    starter: snapshot?.starter || null,
    line: pick.line,
    odds: pick.odds,
    rawPick: pick.rawPick,
    units: pick.units,
    official: pick.hasExplicitUnits,
    modelProbability: modelEstimate === null ? null : Math.round(clamp(modelEstimate, 1, 99) * 10) / 10,
    marketProbability: marketProbability === null ? null : Math.round(marketProbability * 10) / 10,
    edge: edge === null ? null : Math.round(edge * 10) / 10,
    dataCoverage: coverage,
    activeWeight: Math.round(activeWeight * 10) / 10,
    factors: factors.map(factor => {
      const weight = weights[factor.key];
      const normalizedWeight = factor.available && activeWeight > 0 ? weight / activeWeight * 100 : 0;
      return {
        ...factor,
        configuredWeight: weight,
        effectiveWeight: Math.round(normalizedWeight * 10) / 10,
        contribution: factor.available && activeWeight > 0 ? Math.round(factor.score * normalizedWeight / 100 * 10) / 10 : null,
        detail: factorDetail(factor)
      };
    })
  };
}

export async function runF5Model({ date, weights: inputWeights } = {}) {
  const weights = normalizeWeights(inputWeights || DEFAULT_F5_WEIGHTS);
  const canonical = await loadCanonicalDailyPicks();
  const parsed = canonical.map(parseF5SidePick).filter(Boolean);
  const availableDates = [...new Set(parsed.map(pick => pick.date).filter(Boolean))].sort().reverse();
  const selectedDate = date || availableDates[0] || null;
  if (!selectedDate) return { version: '1A', date: null, weights, rows: [], availableDates: [] };
  const picks = parsed.filter(pick => pick.date === selectedDate);
  const rows = [];
  for (const pick of picks) {
    const snapshot = await callRpc('sports_edge_f5_factor_snapshot', {
      p_pick_date: pick.date,
      p_team_abbreviation: pick.team,
      p_line: pick.line
    });
    rows.push(scorePick(pick, snapshot, weights));
  }
  rows.sort((a, b) => (b.edge ?? -999) - (a.edge ?? -999) || (b.modelProbability ?? -999) - (a.modelProbability ?? -999));
  return {
    version: 'CUSTOM_F5_MODEL_ENGINE_V1A',
    generatedAt: new Date().toISOString(),
    date: selectedDate,
    availableDates,
    weights,
    calibration: 'BETA_WEIGHTED_EMPIRICAL_ESTIMATE',
    rows
  };
}

export { DEFAULT_F5_WEIGHTS, FACTOR_LABELS, FACTOR_ORDER, normalizeWeights, americanImpliedProbability, parseF5SidePick };
