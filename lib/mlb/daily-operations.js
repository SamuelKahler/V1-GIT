import { readFile } from 'node:fs/promises';

const DAY_MS = 86400000;

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
  const match = source.match(/window\.SPORTS_EDGE_DAILY_IMPORT_TEXT\s*=\s*`([\s\S]*?)`;?/);
  if (!match) throw new Error('SPORTS_EDGE_DAILY_IMPORT_TEXT was not found in daily-import.js.');
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
    picks.push({
      id: `SRC-DAILYIMPORTPICKS-${String(index).padStart(6, '0')}`,
      sourceId: `SRC-DAILYIMPORTPICKS-${String(index).padStart(6, '0')}`,
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

export async function loadRecentDailyPicks(days = 28, includeToday = false) {
  const text = await readDailyImportText();
  return filterRecentPicks(parseDailyImportPicks(text), days, includeToday);
}
