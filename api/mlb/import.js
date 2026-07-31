import { requireAdmin } from '../../lib/mlb/auth.js';
import { handleOptions, parseJsonBody, requireBoolean, requireInteger, requireMethod, sendError, sendSuccess } from '../../lib/mlb/http.js';
import { importDateRange } from '../../lib/mlb/importer.js';
import { rebuildEnvironments } from '../../lib/mlb/environment-engine.js';

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;
  try {
    requireMethod(request, 'POST'); requireAdmin(request);
    const body = parseJsonBody(request);
    const startDate = String(body.startDate || '').trim();
    const endDate = String(body.endDate || body.startDate || '').trim();
    const dryRun = requireBoolean(body.dryRun, 'dryRun', false);
    const concurrency = requireInteger(body.concurrency, 'concurrency', { defaultValue: 3, minimum: 1, maximum: 5 });
    const importResult = await importDateRange({ startDate, endDate, dryRun, concurrency });
    const environments = dryRun || importResult.counters.failed === importResult.counters.discovered
      ? null
      : await rebuildEnvironments({ startDate, endDate });
    sendSuccess(response, { import: importResult, environments });
  } catch (error) { sendError(response, error); }
}
