import sportsEdgeEvidenceEngine, { periodSummary } from './evidence-engine.js';
import sportsEdgeQueryEngine from './query-engine.js';

function finite(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function percent(value) {
  const parsed = finite(value);
  return parsed === null ? null : Math.round(parsed * 10) / 10;
}

function record(summary = {}) {
  return {
    wins: finite(summary.wins, 0),
    losses: finite(summary.losses, 0),
    pushes: finite(summary.pushes, 0),
    sampleSize: finite(summary.sample_size, 0),
    hitRate: percent(summary.hit_rate),
    roiPercent: summary.roi_percent === null || summary.roi_percent === undefined
      ? null
      : percent(summary.roi_percent),
    profitUnits: summary.profit_units === null || summary.profit_units === undefined
      ? null
      : finite(summary.profit_units),
    roiSample: finite(summary.roi_sample, 0),
    averageCompleteness: percent(summary.average_completeness)
  };
}

function normalizeSupportingGame(game = {}, period = 'FULL_GAME') {
  return {
    gamePk: game.game_pk,
    date: game.official_date,
    team: game.team_abbreviation,
    opponent: game.opponent_abbreviation,
    role: game.role,
    result: period === 'F5' ? game.f5_result : game.full_game_result,
    teamScore: period === 'F5' ? game.team_f5_score : game.team_score,
    opponentScore: period === 'F5' ? game.opponent_f5_score : game.opponent_score,
    moneyline: game.moneyline,
    favorite: game.favorite,
    underdog: game.underdog,
    oddsBucket: game.odds_bucket,
    divisionGame: game.division_game,
    interleagueGame: game.interleague_game,
    seriesGameNumber: game.series_game_number,
    gamesInSeries: game.games_in_series,
    dayNight: game.day_night,
    restDays: game.rest_days,
    restAdvantage: game.rest_advantage,
    previousResult: game.previous_result,
    previousRunsScored: game.previous_runs_scored,
    previousRunsAllowed: game.previous_runs_allowed,
    pitcherHand: game.pitcher_hand,
    opponentPitcherHand: game.opponent_pitcher_hand,
    total: game.total_value,
    totalBucket: game.total_bucket,
    completenessPercent: percent(game.completeness_percent)
  };
}

function sectionFromResult(result, period) {
  const summary = result?.summary || {};
  return {
    name: result?.name || 'Exact environment',
    record: record(summary),
    supportingGames: (Array.isArray(result?.supportingGames) ? result.supportingGames : [])
      .map((game) => normalizeSupportingGame(game, period))
  };
}

function compactCriteria(criteria, keys) {
  const result = {};
  for (const key of keys) {
    if (criteria[key] !== undefined) result[key] = criteria[key];
  }
  result.limit = Math.min(Number(criteria.limit || 100), 100);
  return result;
}

function oppositeRole(role) {
  return role === 'HOME' ? 'AWAY' : role === 'AWAY' ? 'HOME' : undefined;
}

function selectedTrendDefinitions(criteria, period) {
  const base = ['teamAbbreviation', 'dateFrom', 'dateTo'];
  const definitions = [];
  const add = (label, keys) => {
    const query = compactCriteria(criteria, [...base, ...keys]);
    const meaningful = Object.keys(query).filter((key) => !['teamAbbreviation', 'dateFrom', 'dateTo', 'limit'].includes(key));
    if (meaningful.length) definitions.push({ label, side: 'SELECTED', criteria: query });
  };

  add(criteria.role === 'HOME' ? 'Home Performance' : 'Road Performance', ['role']);
  if (criteria.favorite === true) add('As Favorite', ['role', 'favorite']);
  if (criteria.underdog === true) add('As Underdog', ['role', 'underdog']);
  if (criteria.opponentAbbreviation) add(`vs ${criteria.opponentAbbreviation}`, ['role', 'opponentAbbreviation']);
  if (criteria.seriesGameNumber) add(`Series Game ${criteria.seriesGameNumber}`, ['role', 'seriesGameNumber']);
  if (criteria.previousResult) add(`After ${criteria.previousResult}`, ['role', 'previousResult']);
  if (criteria.opponentPitcherHand) add(`vs ${criteria.opponentPitcherHand}HP`, ['role', 'opponentPitcherHand']);
  if (period === 'F5' && criteria.f5Line !== undefined) add(`F5 ${Number(criteria.f5Line) > 0 ? '+' : ''}${criteria.f5Line}`, ['role', 'f5Line']);
  if (period === 'FULL_GAME' && criteria.oddsBucket) add(`Odds ${criteria.oddsBucket}`, ['role', 'oddsBucket']);
  return definitions;
}

function opponentTrendDefinitions(criteria, period) {
  if (!criteria.opponentAbbreviation || !criteria.teamAbbreviation) return [];
  const opponentCriteria = {
    teamAbbreviation: criteria.opponentAbbreviation,
    opponentAbbreviation: criteria.teamAbbreviation,
    role: oppositeRole(criteria.role),
    dateFrom: criteria.dateFrom,
    dateTo: criteria.dateTo,
    limit: criteria.limit
  };
  if (criteria.favorite === true) opponentCriteria.underdog = true;
  if (criteria.underdog === true) opponentCriteria.favorite = true;
  if (period === 'F5' && criteria.f5Line !== undefined) opponentCriteria.f5Line = Number(criteria.f5Line) * -1;

  const definitions = [];
  const add = (label, keys) => {
    const query = compactCriteria(opponentCriteria, ['teamAbbreviation', 'dateFrom', 'dateTo', ...keys]);
    definitions.push({ label, side: 'OPPONENT', criteria: query });
  };
  add(opponentCriteria.role === 'HOME' ? 'Opponent at Home' : 'Opponent on Road', ['role']);
  if (opponentCriteria.favorite === true) add('Opponent as Favorite', ['role', 'favorite']);
  if (opponentCriteria.underdog === true) add('Opponent as Underdog', ['role', 'underdog']);
  add(`Opponent vs ${criteria.teamAbbreviation}`, ['role', 'opponentAbbreviation']);
  if (period === 'F5' && opponentCriteria.f5Line !== undefined) {
    add(`Opponent F5 ${Number(opponentCriteria.f5Line) > 0 ? '+' : ''}${opponentCriteria.f5Line}`, ['role', 'f5Line']);
  }
  return definitions;
}

async function buildTrendSignals(criteria, period) {
  const definitions = [
    ...selectedTrendDefinitions(criteria, period),
    ...opponentTrendDefinitions(criteria, period)
  ];
  const seen = new Set();
  const unique = definitions.filter((item) => {
    const key = JSON.stringify(item.criteria);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const signals = [];
  for (const definition of unique) {
    const response = await sportsEdgeQueryEngine.query(definition.criteria);
    const summary = periodSummary(response?.summary || {}, period);
    const normalizedRecord = record(summary);
    if (normalizedRecord.sampleSize < 3) continue;
    signals.push({
      label: definition.label,
      side: definition.side,
      record: normalizedRecord
    });
  }
  return signals;
}

export async function buildCustomerIntelligence(criteria = {}, options = {}) {
  const report = await sportsEdgeEvidenceEngine.report(criteria, {
    ...options,
    minimumSample: 1,
    maximumVariants: 1
  });
  const period = report.period || 'FULL_GAME';
  const exact = sectionFromResult(report.exactMatch, period);
  const trendSignals = await buildTrendSignals(report.criteria, period);

  return {
    version: 'DECISION_ENGINE_V1',
    release: 'LEGACY_PURGE_DECISION_ENGINE_V1',
    source: 'MLB_INTELLIGENCE_GAME_LOGS',
    period,
    teamAbbreviation: report.criteria?.teamAbbreviation || null,
    opponentAbbreviation: report.criteria?.opponentAbbreviation || null,
    criteria: report.criteria,
    historicalEvidence: exact,
    exactMatch: exact,
    trendSignals,
    matchingConditions: Array.isArray(report.exactEnvironmentMatchDetails)
      ? report.exactEnvironmentMatchDetails
      : [],
    generatedAt: report.generatedAt || new Date().toISOString()
  };
}

export {
  buildTrendSignals,
  opponentTrendDefinitions,
  selectedTrendDefinitions
};

export default { buildCustomerIntelligence };
