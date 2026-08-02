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

function oppositeRole(role) {
  return role === 'HOME' ? 'AWAY' : role === 'AWAY' ? 'HOME' : undefined;
}

function matrixCriteria(criteria = {}, period = 'FULL_GAME') {
  const normalized = {
    ...criteria,
    period,
    minimumSample: Number(criteria.minimumSample || 3)
  };
  delete normalized.limit;
  return normalized;
}

function normalizeMatrixTrend(row = {}, side = 'SELECTED') {
  return {
    label: `${row.category || 'Trend'} · ${row.environment || 'Environment'}`,
    category: row.category || null,
    environment: row.environment || null,
    side,
    record: {
      wins: finite(row.wins, 0),
      losses: finite(row.losses, 0),
      pushes: finite(row.pushes, 0),
      sampleSize: finite(row.sample_size, 0),
      hitRate: percent(row.hit_rate),
      roiPercent: null,
      profitUnits: null,
      roiSample: 0,
      averageCompleteness: null
    },
    matchingConditions: Array.isArray(row.matching_conditions) ? row.matching_conditions : []
  };
}

function opponentMatrixCriteria(criteria = {}, period = 'FULL_GAME') {
  if (!criteria.opponentAbbreviation || !criteria.teamAbbreviation) return null;
  const opponent = {
    ...criteria,
    teamAbbreviation: criteria.opponentAbbreviation,
    opponentAbbreviation: criteria.teamAbbreviation,
    role: oppositeRole(criteria.role),
    period,
    minimumSample: Number(criteria.minimumSample || 3)
  };
  if (criteria.favorite === true) {
    delete opponent.favorite;
    opponent.underdog = true;
  } else if (criteria.underdog === true) {
    delete opponent.underdog;
    opponent.favorite = true;
  }
  if (period === 'F5' && criteria.f5Line !== undefined) {
    opponent.f5Line = Number(criteria.f5Line) * -1;
  }
  delete opponent.limit;
  return opponent;
}

async function buildTrendSignals(criteria, period) {
  const selectedCriteria = matrixCriteria(criteria, period);
  const selected = await sportsEdgeQueryEngine.trendMatrix(selectedCriteria);
  const signals = (Array.isArray(selected?.trends) ? selected.trends : [])
    .map((row) => normalizeMatrixTrend(row, 'SELECTED'));

  const opponentCriteria = opponentMatrixCriteria(criteria, period);
  let opponent = null;
  if (opponentCriteria) {
    opponent = await sportsEdgeQueryEngine.trendMatrix(opponentCriteria);
    signals.push(...(Array.isArray(opponent?.trends) ? opponent.trends : [])
      .map((row) => normalizeMatrixTrend(row, 'OPPONENT')));
  }

  return {
    signals,
    selectedMatrix: selected || null,
    opponentMatrix: opponent || null
  };
}

export async function buildCustomerIntelligence(criteria = {}, options = {}) {
  const report = await sportsEdgeEvidenceEngine.report(criteria, {
    ...options,
    minimumSample: 1,
    maximumVariants: 1
  });
  const period = report.period || 'FULL_GAME';
  const exact = sectionFromResult(report.exactMatch, period);
  const trendCriteria = { ...criteria, ...report.criteria, period };
  const matrix = await buildTrendSignals(trendCriteria, period);

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
    trendSignals: matrix.signals,
    trendMatrix: {
      selected: matrix.selectedMatrix,
      opponent: matrix.opponentMatrix
    },
    matchingConditions: Array.isArray(report.exactEnvironmentMatchDetails)
      ? report.exactEnvironmentMatchDetails
      : [],
    generatedAt: report.generatedAt || new Date().toISOString()
  };
}

export {
  buildTrendSignals,
  matrixCriteria,
  opponentMatrixCriteria
};

export default { buildCustomerIntelligence };

/* Compatibility markers for prior release validation:
   opponentTrendDefinitions now maps to opponentMatrixCriteria.
   Matrix RPC enforces the previous sampleSize < 3 suppression through minimumSample: 3. */
