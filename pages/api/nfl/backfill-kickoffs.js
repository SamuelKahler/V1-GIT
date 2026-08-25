import { backfillNflGameKickoffTimes } from '../../lib/nfl/kickoff-backfill.js';

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Only POST allowed
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check admin token
    const token = String(req.headers['x-sports-edge-admin-token'] || '').trim();
    if (token !== process.env.MLB_IMPORT_ADMIN_TOKEN) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { season = 2025, week = 1, dryRun = true } = req.body;

    // Run backfill
    const result = await backfillNflGameKickoffTimes({ season, week, dryRun });

    return res.status(200).json({
      ok: true,
      service: 'sports-edge-nfl-intelligence',
      backfill: result,
      elapsed: `${Date.now() - startTime}ms`
    });
  } catch (error) {
    console.error('[ERROR] NFL kickoff backfill:', error);
    return res.status(error.statusCode || 500).json({
      ok: false,
      service: 'sports-edge-nfl-intelligence',
      error: error.message,
      details: error.details || null
    });
  }
}
