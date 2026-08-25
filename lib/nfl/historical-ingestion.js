import { callRpc } from '../mlb/supabase.js';

const NFLVERSE_SCHEDULE_URL = 'https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv';
const DEFAULT_SEASONS = [2023, 2024, 2025, 2026];
const MAX_SEASONS = 6;
const BATCH_SIZE = 175;

const TEAM_ALIASES = Object.freeze({
  LA: 'LAR', WAS: 'WSH', JAC: 'JAX', OAK: 'LV', SD: 'LAC', STL: 'LAR'
});

function createError(message, statusCode = 500, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function normalizeTeam(value) {
  const key = String(value || '').trim().toUpperCase();
  return TEAM_ALIASES[key] || key;
}

function numberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function integerOrNull(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? null : Math.trunc(parsed);
}

function booleanFromValue(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return ['1', 'true', 't', 'yes', 'y'].includes(text);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  if (!rows.length) return [];

  const headers = rows.shift().map(header => String(header || '').trim());
  return rows
    .filter(values => values.some(value => String(value || '').trim() !== ''))
    .map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function normalizeSeasons(input) {
  const values = Array.isArray(input) ? input : String(input || '').split(',');
  const seasons = [...new Set(values.map(Number).filter(value => Number.isInteger(value) && value >= 1999 && value <= 2100))].sort();
  if (!seasons.length) return [...DEFAULT_SEASONS];
  if (seasons.length > MAX_SEASONS) throw createError(`NFL imports are limited to ${MAX_SEASONS} seasons per run.`, 400);
  return seasons;
}

function isPrimetime(row) {
  const weekday = String(row.weekday || '').toLowerCase();
  const time = String(row.gametime || '').trim();
  const hour = Number(time.split(':')[0]);
  if (weekday.startsWith('thu') || weekday.startsWith('mon')) return true;
  if (weekday.startsWith('sun') && Number.isFinite(hour) && hour >= 19) return true;
  return false;
}

function normalizeGame(row) {
  const season = integerOrNull(row.season);
  const away = normalizeTeam(row.away_team);
  const home = normalizeTeam(row.home_team);
  if (!season || !away || !home) return null;

  return {
    externalGameId: String(row.game_id || '').trim() || `${season}_${row.week || 'NA'}_${away}_${home}`,
    season,
    week: integerOrNull(row.week),
    seasonType: String(row.game_type || 'REG').trim().toUpperCase(),
    gameDate: String(row.gameday || '').trim() || null,
    weekday: String(row.weekday || '').trim() || null,
    gameTime: String(row.gametime || '').trim() || null,
    awayTeam: away,
    homeTeam: home,
    awayFinal: integerOrNull(row.away_score),
    homeFinal: integerOrNull(row.home_score),
    status: integerOrNull(row.away_score) !== null && integerOrNull(row.home_score) !== null ? 'FINAL' : 'SCHEDULED',
    location: String(row.location || '').trim() || null,
    venue: String(row.stadium || '').trim() || null,
    stadiumId: String(row.stadium_id || '').trim() || null,
    espnId: String(row.espn || '').trim() || null,
    gsisId: String(row.gsis || '').trim() || null,
    awayRest: integerOrNull(row.away_rest),
    homeRest: integerOrNull(row.home_rest),
    awayMoneyline: integerOrNull(row.away_moneyline),
    homeMoneyline: integerOrNull(row.home_moneyline),
    spreadLine: numberOrNull(row.spread_line),
    awaySpreadOdds: integerOrNull(row.away_spread_odds),
    homeSpreadOdds: integerOrNull(row.home_spread_odds),
    totalLine: numberOrNull(row.total_line),
    underOdds: integerOrNull(row.under_odds),
    overOdds: integerOrNull(row.over_odds),
    divisionGame: booleanFromValue(row.div_game),
    primetime: isPrimetime(row),
    roof: String(row.roof || '').trim() || null,
    surface: String(row.surface || '').trim() || null,
    temperature: numberOrNull(row.temp),
    wind: numberOrNull(row.wind),
    awayQbName: String(row.away_qb_name || '').trim() || null,
    homeQbName: String(row.home_qb_name || '').trim() || null,
    awayCoach: String(row.away_coach || '').trim() || null,
    homeCoach: String(row.home_coach || '').trim() || null,
    referee: String(row.referee || '').trim() || null,
    sourcePayload: row
  };
}

async function fetchScheduleCsv() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(NFLVERSE_SCHEDULE_URL, {
      signal: controller.signal,
      headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8', 'User-Agent': 'Sports-Edge-NFL-Ingestion/1.0' }
    });
    if (!response.ok) throw createError(`NFL schedule source returned HTTP ${response.status}.`, 502);
    return response.text();
  } catch (error) {
    if (error?.name === 'AbortError') throw createError('NFL schedule source timed out.', 504);
    if (error?.statusCode) throw error;
    throw createError('NFL schedule source could not be reached.', 502, { cause: error?.message || String(error) });
  } finally {
    clearTimeout(timeout);
  }
}

export async function importNflHistoricalSchedules({ seasons, dryRun = false } = {}) {
  const selectedSeasons = normalizeSeasons(seasons);
  const csv = await fetchScheduleCsv();
  const parsedRows = parseCsv(csv);
  const games = parsedRows
    .filter(row => selectedSeasons.includes(Number(row.season)))
    .map(normalizeGame)
    .filter(Boolean);

  if (!games.length) throw createError('No NFL games matched the requested seasons.', 404, { seasons: selectedSeasons });

  const summary = {
    source: NFLVERSE_SCHEDULE_URL,
    seasons: selectedSeasons,
    rowsRead: parsedRows.length,
    matchedGames: games.length,
    finalGames: games.filter(game => game.status === 'FINAL').length,
    scheduledGames: games.filter(game => game.status !== 'FINAL').length,
    batches: 0,
    imported: 0,
    dryRun: Boolean(dryRun)
  };

  if (dryRun) return summary;

  for (let index = 0; index < games.length; index += BATCH_SIZE) {
    const batch = games.slice(index, index + BATCH_SIZE);
    const result = await callRpc('sports_edge_nfl_import_schedule_batch', { p_games: batch }, { timeoutMs: 45_000 });
    summary.batches += 1;
    summary.imported += Number(result?.imported || batch.length);
  }

  summary.rebuild = await callRpc('sports_edge_nfl_rebuild_team_game_facts', {}, { timeoutMs: 45_000 });
  summary.audit = await callRpc('sports_edge_nfl_historical_ingestion_audit', {});
  return summary;
}

export { NFLVERSE_SCHEDULE_URL, DEFAULT_SEASONS, normalizeSeasons, parseCsv, normalizeGame };
