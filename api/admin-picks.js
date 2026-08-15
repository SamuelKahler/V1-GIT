import { randomUUID } from 'node:crypto';
import { requireAdmin } from '../lib/mlb/auth.js';
import { sendError, sendSuccess, requireMethod, parseJsonBody, getQueryValue } from '../lib/mlb/http.js';
import { requestSupabase } from '../lib/mlb/supabase.js';
import { parseDailyImportPicks, canonicalDailyImportText, pickHash } from '../lib/mlb/daily-operations.js';
import { processPicks } from './intelligence-sync.js';

function previewRows(text) {
  const picks = parseDailyImportPicks(text);
  return picks.map((pick, index) => ({
    index: index + 1,
    date: pick.date,
    pick: pick.rawPick,
    odds: pick.odds,
    units: pick.hasExplicitUnits ? pick.units : null,
    official: pick.hasExplicitUnits,
    status: pick.status,
    notes: pick.notes
  }));
}

function distinctDates(picks) {
  return [...new Set(picks.map(pick => pick.date).filter(Boolean))].sort();
}

function publishRows(picks, batchId) {
  return picks.map(pick => ({
    canonical_key: `ADMIN-${pickHash(pick.date, pick.notes)}`,
    pick_date: pick.date,
    raw_line: pick.notes,
    raw_pick: pick.rawPick,
    odds: pick.odds,
    units: pick.hasExplicitUnits ? pick.units : null,
    has_explicit_units: pick.hasExplicitUnits,
    status: pick.status,
    notes: pick.notes,
    source: 'ADMIN_PICK_ENTRY',
    batch_id: batchId,
    published_at: new Date().toISOString()
  }));
}

async function publishPicksAtomically(picks, dates, batchId) {
  const rows = publishRows(picks, batchId);
  return requestSupabase('/rest/v1/rpc/sports_edge_publish_picks', {
    method: 'POST',
    body: { p_dates: dates, p_rows: rows, p_batch_id: batchId }
  });
}

async function recentPublished(limit = 120) {
  return requestSupabase(`/rest/v1/sports_edge_picks?select=canonical_key,pick_date,raw_line,raw_pick,odds,units,has_explicit_units,status,batch_id,published_at&order=pick_date.desc,published_at.desc&limit=${Math.max(1, Math.min(500, Number(limit) || 120))}`);
}

export default async function handler(req, res) {
  try {
    const method = requireMethod(req, ['GET', 'POST']);
    const mode = String(getQueryValue(req, 'mode') || '').trim();

    if (method === 'GET' && mode === 'publicText') {
      const text = await canonicalDailyImportText();
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return sendSuccess(res, { text, source: 'SPORTS_EDGE_CANONICAL_PICKS' });
    }

    requireAdmin(req);

    if (method === 'GET') {
      const rows = await recentPublished(getQueryValue(req, 'limit'));
      return sendSuccess(res, { rows, count: Array.isArray(rows) ? rows.length : 0 });
    }

    const body = parseJsonBody(req);
    const action = String(body.action || 'preview').trim().toLowerCase();
    const text = String(body.text || '').trim();
    if (!text) {
      const error = new Error('Paste at least one dated pick before continuing.');
      error.statusCode = 400;
      throw error;
    }

    const picks = parseDailyImportPicks(text);
    if (!picks.length) {
      const error = new Error('No valid dated picks were detected. Include a date line such as 08/15 followed by picks.');
      error.statusCode = 400;
      throw error;
    }

    const preview = previewRows(text);
    const dates = distinctDates(picks);

    if (action === 'preview') {
      return sendSuccess(res, { preview, dates, count: preview.length });
    }

    if (action !== 'publish') {
      const error = new Error('action must be preview or publish.');
      error.statusCode = 400;
      throw error;
    }

    const batchId = randomUUID();
    await publishPicksAtomically(picks, dates, batchId);
    let grading = null;
    try {
      grading = await processPicks(picks, { persistRows: true });
    } catch (error) {
      grading = { ok: false, error: error.message };
    }
    const stored = await recentPublished(300);

    return sendSuccess(res, {
      published: true,
      batchId,
      dates,
      count: picks.length,
      preview,
      grading,
      storedCount: Array.isArray(stored) ? stored.length : 0
    });
  } catch (error) {
    sendError(res, error);
  }
}
