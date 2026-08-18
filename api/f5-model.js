import { runF5Model, DEFAULT_F5_WEIGHTS, FACTOR_LABELS, FACTOR_ORDER } from '../lib/mlb/f5-model-engine.js';

export default async function handler(req, res) {
  try {
    if (!['GET','POST'].includes(req.method)) return res.status(405).json({ ok:false, error:'METHOD_NOT_ALLOWED' });
    const body = req.method === 'POST' ? (req.body || {}) : {};
    const date = String(body.date || req.query?.date || '').trim() || undefined;
    const weights = body.weights || undefined;
    const result = await runF5Model({ date, weights });
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({ ok:true, defaults:DEFAULT_F5_WEIGHTS, labels:FACTOR_LABELS, order:FACTOR_ORDER, ...result });
  } catch (error) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ ok:false, error:error?.message || 'F5 model run failed.' });
  }
}
