// API Route: /api/admin/ingest-prop-trends
// POST endpoint to ingest all prop trend data
// Requires: ADMIN_TOKEN in Authorization header

import { ingestAllPropTrends } from '../../lib/ingest/complete-prop-ingest.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authorization token
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== process.env.ADMIN_INGEST_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await ingestAllPropTrends();
    return res.status(200).json({ 
      success: true, 
      message: 'All prop trends ingested successfully',
      data: result 
    });
  } catch (error) {
    console.error('Ingest endpoint error:', error);
    return res.status(500).json({ 
      error: 'Ingestion failed',
      message: error.message 
    });
  }
}
