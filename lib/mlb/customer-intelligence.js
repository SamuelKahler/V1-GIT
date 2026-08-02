import sportsEdgeEvidenceEngine, { periodSummary } from './evidence-engine.js';

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
    name: result?.name || 'No qualified result',
    record: record(summary),
    evidenceScore: finite(result?.evidenceScore, 0),
    exactnessPercent: percent(result?.exactnessPercent),
    matchedConditionCount: finite(result?.matchedConditionCount, 0),
    totalConditionCount: finite(result?.totalConditionCount, 0),
    relaxedConditions: Array.isArray(result?.removedConditions) ? result.removedConditions : [],
    supportingGames: (Array.isArray(result?.supportingGames) ? result.supportingGames : [])
      .map((game) => normalizeSupportingGame(game, period)),
    contradictions: result?.contradictions || {
      losses: 0,
      pushes: 0,
      contradictionRate: null,
      statement: 'No contradiction summary is available.'
    }
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

  return {
    version: 'DECISION_ENGINE_V1',
    source: 'MLB_INTELLIGENCE_GAME_LOGS',
    period,
    criteria: report.criteria,
    historicalEvidence: exact,
    exactMatch: exact,
    matchingConditions: Array.isArray(report.exactEnvironmentMatchDetails)
      ? report.exactEnvironmentMatchDetails
      : [],
    generatedAt: report.generatedAt || new Date().toISOString()
  };
}

export default { buildCustomerIntelligence };
