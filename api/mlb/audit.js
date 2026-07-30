import { requireAdmin } from '../../lib/mlb/auth.js';
import { hasSupabaseCredentials, rpc } from '../../lib/mlb/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  if (!requireAdmin(req, res)) return;
  if (!hasSupabaseCredentials()) return res.status(503).json({ error: 'SUPABASE_ENV_NOT_CONFIGURED' });
  try {
    const requestedLimit = Number(req.query?.limit || 20);
    const audit = await rpc('mlb_import_audit', { p_limit: Number.isFinite(requestedLimit) ? requestedLimit : 20 });
    return res.status(200).json({ version: '2.0.0-phase2a', generatedAt: new Date().toISOString(), audit });
  } catch (error) {
    return res.status(500).json({ error: 'MLB_AUDIT_FAILED', message: error.message });
  }
}
