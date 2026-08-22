import { callRpc } from '../mlb/supabase.js';
import { importNflHistoricalSchedules } from './historical-ingestion.js';

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
