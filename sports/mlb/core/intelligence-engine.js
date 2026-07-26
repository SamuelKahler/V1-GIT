(function () {
  'use strict';

  const FINAL = new Set(['WIN', 'LOSS', 'PUSH', 'VOID']);
  const COUNTED = new Set(['WIN', 'LOSS']);

  function text(value) { return String(value == null ? '' : value).trim(); }
  function upper(value) { return text(value).toUpperCase(); }
  function number(value) {
    const parsed = Number(String(value == null ? '' : value).replace(/[^0-9+-.]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  function uniq(values) { return [...new Set(values.filter(Boolean))]; }
  function hash(value) {
    let h = 2166136261;
    const input = String(value);
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36).toUpperCase();
  }
  function status(value) {
    const raw = upper(value);
    const map = { W:'WIN', WON:'WIN', SUCCESS:'WIN', L:'LOSS', LOST:'LOSS', TIE:'PUSH', OPEN:'PENDING', WAITING:'PENDING' };
    return map[raw] || raw || 'PENDING';
  }
  function americanProfit(odds, result, units) {
    const stake = Number.isFinite(units) && units > 0 ? units : 1;
    if (result === 'LOSS') return -stake;
    if (result !== 'WIN' || !Number.isFinite(odds) || odds === 0) return 0;
    return odds > 0 ? stake * (odds / 100) : stake * (100 / Math.abs(odds));
  }
  function marketFromPick(pick) {
    const stored = upper(pick.market);
    if (stored && stored !== 'UNKNOWN') return stored;
    const raw = upper(pick.pick || pick.rawPick || pick.selection);
    if (/SERIES/.test(raw)) return 'SERIES';
    if (/\bO(?:VER)?\s*\d|\bU(?:NDER)?\s*\d|TOTAL/.test(raw)) return 'TOTAL';
    if (/\bML\b|MONEYLINE/.test(raw)) return 'MONEYLINE';
    if (/[+-]\s*(?:0?\.5|1\.5)|RUN\s*LINE|SPREAD/.test(raw)) return 'SPREAD';
    return 'UNKNOWN';
  }
  function periodFromPick(pick) {
    const stored = upper(pick.period);
    if (stored) return stored;
    return /\bF5\b|FIRST\s*FIVE|FIRST\s*5/.test(upper(pick.pick || pick.rawPick)) ? 'FIRST_FIVE' : 'FULL_GAME';
  }
  function selectedTeam(pick) {
    if (pick.selectedTeam) return upper(pick.selectedTeam);
    const core = window.SportsEdgeCore;
    return core && core.normalizeTeam ? core.normalizeTeam(pick.pick || pick.selection || '') : null;
  }
  function environmentForPick(pick) {
    const team = selectedTeam(pick);
    const opponent = upper(pick.opponent);
    const role = upper(pick.homeAway || pick.role || pick.locationRole);
    const odds = number(pick.odds);
    const oddsBucket = odds == null ? 'NO_ODDS' : odds <= -151 ? 'HEAVY_FAVORITE' : odds <= -111 ? 'FAVORITE' : odds <= 109 ? 'NEAR_PICKEM' : odds <= 150 ? 'UNDERDOG' : 'BIG_UNDERDOG';
    const dimensions = {
      team: team || 'UNKNOWN_TEAM',
      opponent: opponent || 'UNKNOWN_OPPONENT',
      market: marketFromPick(pick),
      period: periodFromPick(pick),
      role: role || 'UNKNOWN_ROLE',
      oddsBucket
    };
    const key = Object.entries(dimensions).map(([k,v]) => `${k}=${v}`).join('|');
    return { id:`ENV-${hash(key)}`, key, dimensions };
  }
  function canonicalObservation(pick, index) {
    const result = status(pick.result || pick.status);
    const odds = number(pick.odds);
    const units = number(pick.units) || 1;
    const environment = environmentForPick(pick);
    return {
      id: pick.id || pick.coreId || `OBS-${hash(`${pick.date || pick.normalizedDate}|${pick.pick || pick.rawPick}|${index}`)}`,
      pickId: pick.id || pick.coreId || null,
      gameId: pick.gamePk ? `MLB-${pick.gamePk}` : null,
      date: pick.date || pick.normalizedDate || pick.slate || null,
      team: selectedTeam(pick),
      opponent: upper(pick.opponent) || null,
      market: marketFromPick(pick),
      period: periodFromPick(pick),
      result,
      odds,
      units,
      profit: americanProfit(odds, result, units),
      environmentId: environment.id,
      environment,
      sourceRecords: pick.sourceRecords || [],
      traceable: Boolean((pick.id || pick.coreId) && (pick.date || pick.normalizedDate || pick.slate)),
      original: pick
    };
  }
  function recordFor(rows) {
    const wins = rows.filter(r => r.result === 'WIN').length;
    const losses = rows.filter(r => r.result === 'LOSS').length;
    const pushes = rows.filter(r => r.result === 'PUSH').length;
    const decisions = wins + losses;
    const profit = rows.reduce((sum, row) => sum + row.profit, 0);
    const risked = rows.filter(r => COUNTED.has(r.result)).reduce((sum, row) => sum + row.units, 0);
    return {
      wins, losses, pushes, decisions,
      hitRate: decisions ? (wins / decisions) * 100 : null,
      profit,
      roi: risked ? (profit / risked) * 100 : null
    };
  }
  function matchScore(current, historical) {
    if (!current.team || current.team !== historical.team) return null;
    if (current.market !== historical.market) return null;
    let score = 55;
    const reasons = [`Same team: ${current.team}`, `Same market: ${current.market}`];
    if (current.period === historical.period) { score += 15; reasons.push(`Same period: ${current.period.replace('_',' ')}`); }
    if (current.opponent && historical.opponent && current.opponent === historical.opponent) { score += 12; reasons.push(`Same opponent: ${current.opponent}`); }
    const c = current.environment.dimensions;
    const h = historical.environment.dimensions;
    if (c.role !== 'UNKNOWN_ROLE' && c.role === h.role) { score += 8; reasons.push(`Same role: ${c.role}`); }
    if (c.oddsBucket !== 'NO_ODDS' && c.oddsBucket === h.oddsBucket) { score += 10; reasons.push(`Same odds bucket: ${c.oddsBucket.replaceAll('_',' ')}`); }
    return { score:Math.min(score,100), reasons };
  }

  const sourcePicks = window.SportsEdgeCore && Array.isArray(window.SportsEdgeCore.picks) ? window.SportsEdgeCore.picks : [];
  const observations = sourcePicks.map(canonicalObservation);
  const graded = observations.filter(row => FINAL.has(row.result));
  const counted = graded.filter(row => COUNTED.has(row.result));
  const pending = observations.filter(row => !FINAL.has(row.result));
  const environments = new Map();
  observations.forEach(row => {
    if (!environments.has(row.environmentId)) environments.set(row.environmentId, { ...row.environment, observationIds:[] });
    environments.get(row.environmentId).observationIds.push(row.id);
  });

  function matchPick(pick, limit) {
    const current = canonicalObservation(pick, -1);
    const candidates = counted.map(row => {
      const match = matchScore(current, row);
      return match ? { row, ...match } : null;
    }).filter(Boolean);
    const buckets = new Map();
    candidates.forEach(candidate => {
      const specificity = candidate.score >= 85 ? 'EXACT' : candidate.score >= 70 ? 'STRONG' : 'RELEVANT';
      const key = `${specificity}|${candidate.row.team}|${candidate.row.market}|${candidate.row.period}`;
      if (!buckets.has(key)) buckets.set(key, { specificity, score:candidate.score, reasons:new Set(), rows:[] });
      const bucket = buckets.get(key);
      bucket.score = Math.max(bucket.score, candidate.score);
      candidate.reasons.forEach(reason => bucket.reasons.add(reason));
      bucket.rows.push(candidate.row);
    });
    return [...buckets.values()].map(bucket => {
      const stats = recordFor(bucket.rows);
      const confidence = stats.decisions >= 30 ? 'HIGH' : stats.decisions >= 15 ? 'MEDIUM' : stats.decisions >= 5 ? 'DEVELOPING' : 'EARLY';
      return {
        evidenceId:`EVD-${hash(`${current.id}|${bucket.specificity}|${bucket.rows.map(r=>r.id).sort().join(',')}`)}`,
        team:current.team,
        market:current.market,
        period:current.period,
        matchScore:bucket.score,
        matchTier:bucket.specificity === 'EXACT' ? 'Exact Environment Match' : bucket.specificity === 'STRONG' ? 'Strong Environment Match' : 'Relevant Team / Market Match',
        matchReasons:[...bucket.reasons],
        confidence,
        ...stats,
        supportingObservations:bucket.rows.sort((a,b)=>String(b.date).localeCompare(String(a.date))),
        environment:current.environment
      };
    }).sort((a,b)=>b.matchScore-a.matchScore || b.decisions-a.decisions).slice(0, limit || 6);
  }

  const audit = {
    version:'4.0.0',
    generatedAt:new Date().toISOString(),
    sourcePicks:sourcePicks.length,
    observations:observations.length,
    graded:graded.length,
    countedInHitRates:counted.length,
    pending:pending.length,
    environments:environments.size,
    untraceable:observations.filter(row=>!row.traceable).length,
    missingGameId:observations.filter(row=>!row.gameId).length,
    missingOpponent:observations.filter(row=>!row.opponent).length,
    unknownMarket:observations.filter(row=>row.market==='UNKNOWN').length
  };

  window.SportsEdgeIntelligence = Object.freeze({
    version:'4.0.0', observations, graded, counted, pending,
    environments:[...environments.values()], audit,
    environmentForPick, matchPick, recordFor,
    rebuild:function () { return 'Reload the page after changing source data to rebuild the immutable intelligence index.'; }
  });
  console.info('[Sports Edge Intelligence] Evidence index initialized', audit);
})();
