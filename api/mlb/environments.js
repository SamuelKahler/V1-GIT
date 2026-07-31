import { requireAdmin } from '../../lib/mlb/auth.js';
import { handleOptions, parseJsonBody, requireMethod, sendError, sendSuccess } from '../../lib/mlb/http.js';
import { rebuildEnvironments } from '../../lib/mlb/environment-engine.js';

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;
  try {
    requireMethod(request, 'POST');
    requireAdmin(request);
    const body = parseJsonBody(request);
    const result = await rebuildEnvironments({
      startDate: String(body.startDate || '').trim(),
      endDate: String(body.endDate || body.startDate || '').trim()
    });
    sendSuccess(response, { environments: result });
  } catch (error) {
    sendError(response, error);
  }
}
