import { callRpc } from '../mlb/supabase.js';

export async function getNflBackboneAudit() {
  return callRpc('sports_edge_nfl_backbone_audit', {});
}

export async function getNflDashboard() {
  return callRpc('sports_edge_nfl_reference_dashboard', {});
}

export async function getNflReferenceTrends({ limit = 12 } = {}) {
  return callRpc('sports_edge_nfl_reference_trends', { p_limit: Math.max(1, Math.min(50, Number(limit) || 12)) });
}

export async function getNflPropProfiles({ limit = 12 } = {}) {
  return callRpc('sports_edge_nfl_prop_profiles', { p_limit: Math.max(1, Math.min(50, Number(limit) || 12)) });
}
