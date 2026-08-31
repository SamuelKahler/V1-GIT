import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { requestSupabase } from './supabase.js';

const DAY_MS = 86400000;

function pickHash(date, line) {
  return createHash('sha256').update(`${date}|${String(line || '').trim().toUpperCase()}`).digest('hex').slice(0, 20);
}

function canonicalPickId(date, line) {
  return `SRC-DAILYIMPORTPICKS-${pickHash(date, line)}`;
}


function isoDate(value) {
  const raw = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!match) return null;
  const year = match[3] ? (match[3].length === 2 ? `20${match[3]}` : match[3]) : String(new Date().getUTCFullYear());
  return `${year}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
}

function parseUnits(line) {
  const match = String(line || '').match(/(?:,|\s)(\.\d+|\d+(?:\.\d+)?)\s*U\b/i);
  return match ? Number(match[1]) : null;
}

function normalizeImportedPick(line) {
  const original = String(line || '').trim();
  const beforeNotes = original.split(/[;,]/)[0].trim();
  const nowMatch = original.match(/\bNOW\s+([^;,]+?)(?=$|[;,])/i);
  let working = beforeNotes;
  let odds = null;

  const allOdds = [...original.matchAll(/([+-]\d{3,4})/g)].map(match => Number(match[1]));
  if (allOdds.length) odds = allOdds[allOdds.length - 1];

  if (nowMatch) {
    const update = nowMatch[1].trim();
    const totalUpdate = update.match(/^(O|OVER|U|UNDER)\s*(\d+(?:\.5)?)(?:\s+([+-]\d{3,4}))?/i);
    if (totalUpdate) {
      const base = beforeNotes.split(/\bNOW\b/i)[0].replace(/\b(?:O|OVER|U|UNDER)\s*\d+(?:\.5)?(?:\s+[+-]\d{3,4})?/i, '').trim();
      const side = /^U/i.test(totalUpdate[1]) ? 'U' : 'O';
      working = `${base} ${side}${totalUpdate[2]}`.trim();
      if (totalUpdate[3]) odds = Number(totalUpdate[3]);
    } else if (/^[+-]\d{3,4}$/.test(update)) {
      working = beforeNotes.split(/\bNOW\b/i)[0].replace(/\s+[+-]\d{3,4}\s*$/, '').trim();
      odds = Number(update);
    } else {
      working = beforeNotes.split(/\bNOW\b/i)[0].trim();
    }
  } else {
    working = beforeNotes.replace(/\s+[+-]\d{3,4}\s*$/, '').trim();
  }

  working = working
    .replace(/\bml\b/i, 'ML')
    .replace(/^f5\b/i, 'F5')
    .replace(/\s([ou])\s*([0-9])/i, (_, side, number) => ` ${side.toUpperCase()}${number}`)
    .replace(/\+\.5/g, '+0.5')
    .replace(/-\.5/g, '-0.5')
    .replace(/\s+/g, ' ')
    .trim();

  return { rawPick: working || original, odds };
}

export async function readDailyImportText() {
  const fileUrl = new URL('../../daily-import.js', import.meta.url);
  const source = await readFile(fileUrl, 'utf8');
  const match = source.match(/window\.SPORTS_EDGE_DAILY_IMPORT_FALLBACK_TEXT\s*=\s*`([\s\S]*?)`;?/) ||
    source.match(/window\.SPORTS_EDGE_DAILY_IMPORT_TEXT\s*=\s*`([\s\S]*?)`;?/);
  if (!match) throw new Error('Sports Edge daily import fallback text was not found in daily-import.js.');
  return match[1].trim();
}

export function parseDailyImportPicks(text) {
  const picks = [];
  let currentDate = null;
  String(text || '').split(/\n+/).forEach(line => {
    const trimmed = String(line || '').trim();
    if (!trimmed || /^\/\//.test(trimmed)) return;
    const parsedDate = isoDate(trimmed);
    if (parsedDate) {
      currentDate = parsedDate;
      return;
    }
    if (!currentDate) return;

    const normalized = normalizeImportedPick(trimmed);
    const units = parseUnits(trimmed);
    const status = /DISREGARD|\bVOID\b/i.test(trimmed) ? 'VOID' : /✅|\bWIN\b/i.test(trimmed) ? 'WIN' : /❌|\bLOSS\b/i.test(trimmed) ? 'LOSS' : /\bLIVE\b/i.test(trimmed) ? 'LIVE' : 'PENDING';
    const index = picks.length + 1;
    const stableId = canonicalPickId(currentDate, trimmed);
    picks.push({
      id: stableId,
      sourceId: stableId,
      date: currentDate,
      rawPick: normalized.rawPick,
      odds: normalized.odds,
      units: units ?? 1,
      hasExplicitUnits: units !== null,
      status,
      result: ['WIN', 'LOSS', 'PUSH', 'VOID'].includes(status) ? status : null,
      authoritativeResult: ['WIN', 'LOSS', 'PUSH', 'VOID'].includes(status),
      notes: trimmed,
      source: 'DAILY_IMPORT',
      sourceArray: 'dailyImportPicks',
      sourceIndex: index - 1
    });
  });
  return picks;
}

export function filterRecentPicks(picks, days = 28, includeToday = false) {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (!includeToday) end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end.getTime() - Math.max(1, Number(days) || 28) * DAY_MS);
  const startIso = start.toISOString().slice(0, 10);
  const endIso = end.toISOString().slice(0, 10);
  return picks.filter(pick => pick.date >= startIso && pick.date <= endIso);
}

function groupPicksByDate(picks) {
  const groups = new Map();
  for (const pick of picks) {
    if (!groups.has(pick.date)) groups.set(pick.date, []);
    groups.get(pick.date).push(pick);
  }
  return groups;
}

export async function loadAdminStoredPicks() {
  try {
    const rows = await requestSupabase('/rest/v1/sports_edge_picks?select=canonical_key,pick_date,raw_line,raw_pick,odds,units,has_explicit_units,status,notes,batch_id,published_at&order=pick_date.asc,published_at.asc');
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => ({
      id: `SRC-DAILYIMPORTPICKS-${String(row.canonical_key || '').replace(/^ADMIN-/, '')}`,
      sourceId: `SRC-DAILYIMPORTPICKS-${String(row.canonical_key || '').replace(/^ADMIN-/, '')}`,
      date: row.pick_date,
      rawPick: row.raw_pick,
      odds: row.odds,
      units: row.units == null ? 1 : Number(row.units),
      hasExplicitUnits: Boolean(row.has_explicit_units),
      status: row.status || 'PENDING',
      result: ['WIN','LOSS','PUSH','VOID'].includes(row.status) ? row.status : null,
      authoritativeResult: ['WIN','LOSS','PUSH','VOID'].includes(row.status),
      notes: row.notes || row.raw_line,
      source: 'ADMIN_PICK_ENTRY',
      sourceArray: 'sports_edge_picks',
      sourceIndex: index,
      batchId: row.batch_id,
      publishedAt: row.published_at
    }));
  } catch (error) {
    if (/sports_edge_picks|does not exist|42P01/i.test(String(error?.message || ''))) return [];
    throw error;
  }
}



export async function loadObservationBackedPicks() {
  try {
    const rows = await requestSupabase('/rest/v1/sports_edge_pick_grade_canonical?select=pick_id,pick_date,odds,result,source_record,updated_at&order=pick_date.asc,updated_at.asc&limit=2000');
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => {
      const source = row.source_record || {};
      const notes = source.notes || source.raw_line || source.rawLine || source.rawPick || source.raw_pick || source.pick || '';
      const rawPick = source.rawPick || source.raw_pick || source.pick || source.selection || notes || null;
      const units = source.hasExplicitUnits ? source.units : (source.has_explicit_units ? source.units : null);
      const finalResult = ['WIN','LOSS','PUSH','VOID'].includes(row.result) ? row.result : null;
      return {
        id: row.pick_id || `RECOVERY-${pickHash(row.pick_date, notes || rawPick || index)}`,
        sourceId: row.pick_id || `RECOVERY-${pickHash(row.pick_date, notes || rawPick || index)}`,
        date: row.pick_date,
        rawPick,
        odds: row.odds ?? source.odds ?? null,
        units: units == null ? 1 : Number(units),
        hasExplicitUnits: units != null,
        status: finalResult || source.status || 'PENDING',
        result: finalResult,
        authoritativeResult: Boolean(finalResult),
        notes: notes || rawPick || '',
        source: 'PICK_OBSERVATION_RECOVERY',
        sourceArray: 'sports_edge_pick_grade_canonical',
        sourceIndex: index,
        updatedAt: row.updated_at
      };
    }).filter(pick => pick.date && pick.rawPick);
  } catch (error) {
    if (/sports_edge_pick_grade_canonical|does not exist|42P01/i.test(String(error?.message || ''))) return [];
    throw error;
  }
}

export async function loadCanonicalDailyPicks() {
  const text = await readDailyImportText();
  const legacy = parseDailyImportPicks(text);
  const [stored, recovered] = await Promise.all([loadAdminStoredPicks(), loadObservationBackedPicks()]);
  const legacyByDate = groupPicksByDate(legacy);
  const recoveredByDate = groupPicksByDate(recovered);
  const storedByDate = groupPicksByDate(stored);
  const allDates = [...new Set([...legacyByDate.keys(), ...recoveredByDate.keys(), ...storedByDate.keys()])];
  const merged = [];
  for (const date of allDates) {
    const group = storedByDate.get(date) || recoveredByDate.get(date) || legacyByDate.get(date) || [];
    merged.push(...group);
  }
  return merged.sort((a, b) => b.date.localeCompare(a.date) || a.sourceIndex - b.sourceIndex);
}

export async function loadRecentDailyPicks(days = 28, includeToday = false) {
  return filterRecentPicks(await loadCanonicalDailyPicks(), days, includeToday);
}

export async function canonicalDailyImportText() {
  const picks = await loadCanonicalDailyPicks();
  if (!picks.length) return readDailyImportText();
  const byDate = groupPicksByDate(picks);
  const allDates = [...byDate.keys()].sort().reverse();
  const lines = [];
  for (const date of allDates) {
    const [year, month, day] = date.split('-');
    lines.push(`${Number(month)}/${Number(day)}/${year}`);
    const group = byDate.get(date) || [];
    for (const pick of group) lines.push(pick.notes || pick.rawPick);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export { canonicalPickId, pickHash };
