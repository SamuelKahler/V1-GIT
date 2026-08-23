import { requireAdmin } from '../lib/mlb/auth.js';
import { createHttpError, getQueryValue, handleOptions, parseJsonBody, requireBoolean, requireMethod, sendError, sendSuccess } from '../lib/mlb/http.js';
import { getNflBackboneAudit, getNflHydrationAudit, getNflDashboard, getNflHistoricalIngestionAudit, getNflPropProfiles, getNflReferenceTrends, getNflMinedTrends, getNflWeeklyIntelligence, getNflTrendHistory, getNflTrendMinerAudit, importNflSchedules, importNflPlayers, getNflPlayerProfiles, getNflPlayerGameLog, getNflPlayerIntelligenceAudit, getNflPropBoard, getNflPlayerPropIntelligence, getNflPlayerThresholdSplits, getNflPropIntelligenceAudit } from '../lib/nfl/intelligence.js';

const ACTIONS = Object.freeze({
  dashboard: { method: 'GET', admin: false },
  hydrationAudit: { method: 'GET', admin: true },
  trends: { method: 'GET', admin: false },
  props: { method: 'GET', admin: false },
  audit: { method: 'GET', admin: true },
  historicalAudit: { method: 'GET', admin: true },
  importSchedules: { method: 'POST', admin: true },
  minedTrends: { method: 'GET', admin: false },
  weekly: { method: 'GET', admin: false },
  trendHistory: { method: 'GET', admin: false },
  trendMinerAudit: { method: 'GET', admin: true },
  importPlayers: { method: 'POST', admin: true },
  playerProfiles: { method: 'GET', admin: false },
  playerGameLog: { method: 'GET', admin: false },
  playerAudit: { method: 'GET', admin: true },
  propBoard: { method: 'GET', admin: false },
  playerIntelligence: { method: 'GET', admin: false },
  playerThresholdSplits: { method: 'GET', admin: false },
  propAudit: { method: 'GET', admin: true }
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
    if (action === 'hydrationAudit') data = { audit: await getNflHydrationAudit() };
    else if (action === 'propAudit') data = { audit: await getNflPropIntelligenceAudit() };
    else if (action === 'propBoard') data = { profiles: await getNflPropBoard({ limit, minGames: getQueryValue(request,'minGames'), window: getQueryValue(request,'window'), market: getQueryValue(request,'market'), team: getQueryValue(request,'team'), position: getQueryValue(request,'position') }) };
    else if (action === 'playerIntelligence') data = { intelligence: await getNflPlayerPropIntelligence({ playerId: getQueryValue(request,'playerId'), playerName: getQueryValue(request,'playerName') }) };
    else if (action === 'playerThresholdSplits') data = { splits: await getNflPlayerThresholdSplits({ playerId: getQueryValue(request,'playerId'), market: getQueryValue(request,'market'), threshold: getQueryValue(request,'threshold'), window: getQueryValue(request,'window') }) };
    else if (action === 'playerAudit') data = { audit: await getNflPlayerIntelligenceAudit() };
    else if (action === 'importPlayers') { const body = parseJsonBody(request); data = { ingestion: await importNflPlayers({ seasons: body.seasons, dryRun: requireBoolean(body.dryRun, 'dryRun', false) }) }; }
    else if (action === 'playerProfiles') data = { players: await getNflPlayerProfiles({ limit, team: getQueryValue(request,'team'), position: getQueryValue(request,'position') }) };
    else if (action === 'playerGameLog') data = { games: await getNflPlayerGameLog({ playerId: getQueryValue(request,'playerId'), playerName: getQueryValue(request,'playerName'), limit }) };
    else if (action === 'audit') data = { audit: await getNflBackboneAudit() };
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
