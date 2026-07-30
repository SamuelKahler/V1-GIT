import { requireAdmin } from '../../lib/mlb/auth.js';
import { importDateRange } from '../../lib/mlb/importer.js';
import { hasSupabaseCredentials } from '../../lib/mlb/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  if (!requireAdmin(req, res)) return;
  try {
    const startDate = req.body?.startDate;
    const endDate = req.body?.endDate || startDate;
    const dryRun = req.body?.dryRun === true;
    if (!dryRun && !hasSupabaseCredentials()) return res.status(503).json({ error: 'SUPABASE_ENV_NOT_CONFIGURED' });
    const result = await importDateRange({ startDate, endDate, dryRun, requestedBy: req.body?.requestedBy || 'SPORTS_EDGE_ADMIN' });
    return res.status(result.counters.failed ? 207 : 200).json(result);
  } catch (error) {
    return res.status(400).json({ error: 'MLB_IMPORT_FAILED', message: error.message });
  }
}
