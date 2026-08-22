import { requireAdmin } from '../lib/mlb/auth.js';
import { createHttpError, getQueryValue, handleOptions, requireMethod, sendError, sendSuccess } from '../lib/mlb/http.js';
import { getNflBackboneAudit, getNflDashboard, getNflPropProfiles, getNflReferenceTrends } from '../lib/nfl/intelligence.js';

const ACTIONS = Object.freeze({
  dashboard: { method: 'GET', admin: false },
  trends: { method: 'GET', admin: false },
  props: { method: 'GET', admin: false },
  audit: { method: 'GET', admin: true }
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
    else if (action === 'trends') data = { trends: await getNflReferenceTrends({ limit }) };
    else if (action === 'props') data = { props: await getNflPropProfiles({ limit }) };
    else data = { dashboard: await getNflDashboard() };
    sendSuccess(response, { service: 'sports-edge-nfl-intelligence', ...data });
  } catch (error) {
    sendError(response, error);
  }
}
