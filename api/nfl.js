import { requireAdmin } from '../lib/mlb/auth.js';
import { createHttpError, getQueryValue, handleOptions, parseJsonBody, requireBoolean, requireMethod, sendError, sendSuccess } from '../lib/mlb/http.js';
import { getNflBackboneAudit, getNflDashboard, getNflHistoricalIngestionAudit, getNflPropProfiles, getNflReferenceTrends, getNflMinedTrends, getNflWeeklyIntelligence, getNflTrendHistory, getNflTrendMinerAudit, importNflSchedules } from '../lib/nfl/intelligence.js';

const ACTIONS = Object.freeze({
  dashboard: { method: 'GET', admin: false },
  trends: { method: 'GET', admin: false },
  props: { method: 'GET', admin: false },
  audit: { method: 'GET', admin: true },
  historicalAudit: { method: 'GET', admin: true },
  importSchedules: { method: 'POST', admin: true },
  minedTrends: { method: 'GET', admin: false },
  weekly: { method: 'GET', admin: false },
  trendHistory: { method: 'GET', admin: false },
  trendMinerAudit: { method: 'GET', admin: true }
});

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;
  try {
    const action = String(getQueryValue(request, 'action') || 'dashboard').trim();
    const config = ACTIONS[action];
    if (!config) throw createHttpError('Unknown NFL API action.', 400, { allowedActions: Object.keys(ACTIONS) });
    requireMethod(request, config.method);
    if (config.admin) requireAdmin(request);
    const limit = Number(getQueryValue(request, 'limit') || 12);
    let data;
    if (action === 'audit') data = { audit: await getNflBackboneAudit() };
    else if (action === 'historicalAudit') data = { audit: await getNflHistoricalIngestionAudit() };
    else if (action === 'importSchedules') {
      const body = parseJsonBody(request);
      data = { ingestion: await importNflSchedules({ seasons: body.seasons, dryRun: requireBoolean(body.dryRun, 'dryRun', false) }) };
    }
    else if (action === 'minedTrends') data = { trends: await getNflMinedTrends({ limit, minGames: getQueryValue(request,'minGames'), team: getQueryValue(request,'team'), market: getQueryValue(request,'market') }) };
    else if (action === 'weekly') data = { weekly: await getNflWeeklyIntelligence() };
    else if (action === 'trendHistory') data = { history: await getNflTrendHistory({ team: getQueryValue(request,'team'), market: getQueryValue(request,'market'), environment: getQueryValue(request,'environment'), startYear: getQueryValue(request,'startYear'), limit }) };
    else if (action === 'trendMinerAudit') data = { audit: await getNflTrendMinerAudit() };
    else if (action === 'trends') data = { trends: await getNflReferenceTrends({ limit }) };
    else if (action === 'props') data = { props: await getNflPropProfiles({ limit }) };
    else data = { dashboard: await getNflDashboard() };
    sendSuccess(response, { service: 'sports-edge-nfl-intelligence', ...data });
  } catch (error) {
    sendError(response, error);
  }
}
