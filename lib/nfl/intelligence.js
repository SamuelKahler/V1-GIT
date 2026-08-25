import { callRpc } from '../mlb/supabase.js';
import { importNflHistoricalSchedules } from './historical-ingestion.js';


export async function getNflHydrationAudit() {
  return callRpc('sports_edge_nfl_hydration_audit', {});
}

export async function getNflBackboneAudit() {
  return callRpc('sports_edge_nfl_backbone_audit', {});
}

export async function getNflHistoricalIngestionAudit() {
  return callRpc('sports_edge_nfl_historical_ingestion_audit', {});
}

export async function getNflDashboard() {
  return callRpc('sports_edge_nfl_consumer_dashboard', {});
}

export async function getNflReferenceTrends({ limit = 12 } = {}) {
  return callRpc('sports_edge_nfl_reference_trends', { p_limit: Math.max(1, Math.min(50, Number(limit) || 12)) });
}

export async function getNflPropProfiles({ limit = 12 } = {}) {
  return callRpc('sports_edge_nfl_prop_profiles', { p_limit: Math.max(1, Math.min(50, Number(limit) || 12)) });
}

export async function importNflSchedules(options = {}) {
  return importNflHistoricalSchedules(options);
}

export async function getNflMinedTrends({ limit = 100, minGames = 6, team = null, market = null } = {}) {
  return callRpc('sports_edge_nfl_mined_trends', {
    p_limit: Math.max(1, Math.min(500, Number(limit) || 100)),
    p_min_games: Math.max(1, Math.min(50, Number(minGames) || 6)),
    p_team: team ? String(team).toUpperCase() : null,
    p_market: market ? String(market).toUpperCase() : null
  });
}

export async function getNflWeeklyIntelligence() {
  return callRpc('sports_edge_nfl_weekly_intelligence', {});
}

export async function getNflTrendHistory({ team, market, environment, startYear = 2023, limit = 100 } = {}) {
  if (!team || !market || !environment) throw new Error('team, market and environment are required.');
  return callRpc('sports_edge_nfl_team_trend_history', {
    p_team: String(team).toUpperCase(),
    p_market: String(market).toUpperCase(),
    p_environment: String(environment).toUpperCase(),
    p_start_year: Number(startYear) || 2023,
    p_limit: Math.max(1, Math.min(250, Number(limit) || 100))
  });
}

export async function getNflTrendMinerAudit() {
  return callRpc('sports_edge_nfl_trend_miner_audit', {});
}

export async function importNflPlayers(options = {}) {
  const { importNflPlayerStats } = await import('./player-ingestion.js');
  return importNflPlayerStats(options);
}

export async function getNflPlayerProfiles({ limit = 50, team = null, position = null } = {}) {
  return callRpc('sports_edge_nfl_player_profiles', {
    p_limit: Math.max(1, Math.min(250, Number(limit) || 50)),
    p_team: team ? String(team).toUpperCase() : null,
    p_position: position ? String(position).toUpperCase() : null
  });
}

export async function getNflPlayerGameLog({ playerId = null, playerName = null, limit = 40 } = {}) {
  if (!playerId && !playerName) throw new Error('playerId or playerName is required.');
  return callRpc('sports_edge_nfl_player_game_log', {
    p_player_id: playerId || null,
    p_player_name: playerName || null,
    p_limit: Math.max(1, Math.min(100, Number(limit) || 40))
  });
}

export async function getNflPlayerIntelligenceAudit() {
  return callRpc('sports_edge_nfl_player_intelligence_audit', {});
}

export async function getNflPropBoard({ limit = 100, minGames = 8, window = '3Y', market = null, team = null, position = null } = {}) {
  return callRpc('sports_edge_nfl_prop_board', {
    p_limit: Math.max(1, Math.min(500, Number(limit) || 100)),
    p_min_games: Math.max(1, Math.min(50, Number(minGames) || 8)),
    p_window: String(window || '3Y').toUpperCase(),
    p_market: market ? String(market).toUpperCase() : null,
    p_team: team ? String(team).toUpperCase() : null,
    p_position: position ? String(position).toUpperCase() : null
  });
}

export async function getNflPlayerPropIntelligence({ playerId = null, playerName = null } = {}) {
  if (!playerId && !playerName) throw new Error('playerId or playerName is required.');
  return callRpc('sports_edge_nfl_player_prop_intelligence', { p_player_id: playerId || null, p_player_name: playerName || null });
}

export async function getNflPlayerThresholdSplits({ playerId, market, threshold, window = '3Y' } = {}) {
  if (!playerId || !market || threshold == null) throw new Error('playerId, market and threshold are required.');
  return callRpc('sports_edge_nfl_player_threshold_splits', {
    p_player_id: playerId, p_market: String(market).toUpperCase(), p_threshold: Number(threshold), p_window: String(window || '3Y').toUpperCase()
  });
}

export async function getNflPropIntelligenceAudit() {
  return callRpc('sports_edge_nfl_prop_intelligence_audit', {});
}

export async function importNflRealPropLines(options = {}) {
  const { importNflRealPropLines: run } = await import('./prop-line-ingestion.js');
  return run(options);
}

export async function getNflRealLinePropBoard({ limit = 100, minGames = 6, market = null, team = null, position = null } = {}) {
  return callRpc('sports_edge_nfl_real_line_prop_board', {
    p_limit: Math.max(1, Math.min(500, Number(limit) || 100)),
    p_min_games: Math.max(1, Math.min(50, Number(minGames) || 6)),
    p_market: market ? String(market).toUpperCase() : null,
    p_team: team ? String(team).toUpperCase() : null,
    p_position: position ? String(position).toUpperCase() : null
  });
}

export async function getNflPlayerRealLineHistory({ playerId = null, playerName = null, market = null, direction = null, limit = 80 } = {}) {
  if (!playerId && !playerName) throw new Error('playerId or playerName is required.');
  return callRpc('sports_edge_nfl_player_real_line_history', {
    p_player_id: playerId || null,
    p_player_name: playerName || null,
    p_market: market ? String(market).toUpperCase() : null,
    p_direction: direction ? String(direction).toUpperCase() : null,
    p_limit: Math.max(1, Math.min(200, Number(limit) || 80))
  });
}

export async function gradeNflRealPropLines() {
  return callRpc('sports_edge_nfl_grade_real_prop_lines', {});
}

export async function getNflRealLinePropAudit() {
  return callRpc('sports_edge_nfl_real_line_prop_audit', {});
}


export async function importNflRoster(options = {}) {
  const { importNflRosterSeason } = await import('./roster-ingestion.js');
  return importNflRosterSeason(options);
}

export async function getNflQualifiedRealLinePropBoard({ limit = 100, minGames = 10, minHitRate = 60, market = null, team = null, position = null } = {}) {
  return callRpc('sports_edge_nfl_qualified_real_line_prop_board', {
    p_limit: Math.max(1, Math.min(500, Number(limit) || 100)),
    p_min_games: Math.max(1, Math.min(50, Number(minGames) || 10)),
    p_min_hit_rate: Math.max(0, Math.min(100, Number(minHitRate) || 60)),
    p_market: market ? String(market).toUpperCase() : null,
    p_team: team ? String(team).toUpperCase() : null,
    p_position: position ? String(position).toUpperCase() : null
  });
}

export async function previewNflPropBackfill(options = {}) {
  const { previewNflPropSmartBackfill } = await import('./prop-line-ingestion.js');
  return previewNflPropSmartBackfill(options);
}

export async function runNflPropBackfill(options = {}) {
  const { runNflPropSmartBackfill } = await import('./prop-line-ingestion.js');
  return runNflPropSmartBackfill(options);
}

export async function getNflPropQualificationAudit() {
  return callRpc('sports_edge_nfl_prop_qualification_audit', {});
}
