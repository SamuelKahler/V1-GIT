const MLB_API_V1 = 'https://statsapi.mlb.com/api/v1';
const MLB_GAME_FEED = 'https://statsapi.mlb.com/api/v1.1/game';
const DEFAULT_TIMEOUT_MS = 20000;
const DEFAULT_ATTEMPTS = 3;
const DEFAULT_HEADERS = Object.freeze({ Accept: 'application/json', 'User-Agent': 'Sports-Edge-MLB-Intelligence/2.0' });

function clientError(message, statusCode = 502, details = null) {
  const error = new Error(message); error.statusCode = statusCode; error.details = details; return error;
}
function requirePositiveInteger(value, fieldName) {
  const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw clientError(`${fieldName} must be a positive integer.`, 400); return parsed;
}
function requireIsoDate(value, fieldName) {
  const text = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw clientError(`${fieldName} must use YYYY-MM-DD format.`, 400);
  const parsed = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) throw clientError(`${fieldName} is not a valid calendar date.`, 400);
  return text;
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function fetchJson(url, { attempts = DEFAULT_ATTEMPTS, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  let finalError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { method: 'GET', headers: DEFAULT_HEADERS, signal: controller.signal });
      const text = await response.text(); let payload;
      try { payload = text ? JSON.parse(text) : null; } catch { throw clientError(`MLB returned invalid JSON for ${url}.`, 502); }
      if (!response.ok) throw clientError(`MLB request failed (${response.status}) for ${url}.`, response.status >= 500 ? 502 : response.status, payload);
      return payload;
    } catch (error) {
      finalError = error;
      const retryable = error?.name === 'AbortError' || !error?.statusCode || Number(error.statusCode) >= 500;
      if (!retryable || attempt === attempts) break;
      await sleep(500 * attempt);
    } finally { clearTimeout(timeout); }
  }
  if (finalError?.name === 'AbortError') throw clientError(`MLB request timed out after ${timeoutMs} milliseconds.`, 504);
  throw finalError || clientError('Unknown MLB API request failure.', 502);
}
function buildUrl(baseUrl, path = '', parameters = {}) {
  const url = new URL(`${baseUrl}${path}`);
  for (const [name, value] of Object.entries(parameters)) if (value !== undefined && value !== null && value !== '') url.searchParams.set(name, String(value));
  return url.toString();
}
async function getSchedule({ startDate, endDate, sportId = 1 }) {
  const start = requireIsoDate(startDate, 'startDate'); const end = requireIsoDate(endDate, 'endDate');
  if (new Date(`${start}T00:00:00Z`) > new Date(`${end}T00:00:00Z`)) throw clientError('startDate cannot be after endDate.', 400);
  const url = buildUrl(MLB_API_V1, '/schedule', { sportId: requirePositiveInteger(sportId, 'sportId'), startDate: start, endDate: end, hydrate: 'team,venue,probablePitcher,linescore' });
  const schedule = await fetchJson(url); if (!Array.isArray(schedule?.dates)) throw clientError('MLB schedule response did not contain a dates array.', 502, schedule); return schedule;
}
async function getGame(gamePk) {
  const id = requirePositiveInteger(gamePk, 'gamePk'); const feed = await fetchJson(buildUrl(MLB_GAME_FEED, `/${id}/feed/live`));
  if (!feed?.gameData || !feed?.liveData) throw clientError(`MLB game ${id} did not contain gameData and liveData.`, 502, feed); return feed;
}
export { buildUrl, fetchJson, getGame, getSchedule, requireIsoDate, requirePositiveInteger };
