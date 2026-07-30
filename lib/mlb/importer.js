import { fetchJson, mapWithConcurrency } from './http.js';
import { rpc } from './supabase.js';
import { buildGameBundle } from './transform.js';

const SCHEDULE_URL = 'https://statsapi.mlb.com/api/v1/schedule';
const FEED_URL = 'https://statsapi.mlb.com/api/v1.1/game';

export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) throw new Error('DATE_MUST_BE_YYYY_MM_DD');
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error('INVALID_DATE');
  return value;
}

export function dayCount(start, end) {
  return Math.floor((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000) + 1;
}

async function schedule(startDate, endDate) {
  const hydrate = 'team(league,division),venue,probablePitcher';
  const url = `${SCHEDULE_URL}?sportId=1&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&hydrate=${encodeURIComponent(hydrate)}`;
  const payload = await fetchJson(url);
  return (payload.dates || []).flatMap(day => day.games || []);
}

async function logError(runId, game, stage, error) {
  try {
    await rpc('mlb_log_import_error', {
      p_import_run_id: runId,
      p_game_pk: game?.gamePk || null,
      p_official_date: game?.officialDate || null,
      p_stage: stage,
      p_error_code: String(error?.message || 'UNKNOWN').split(':')[0],
      p_error_message: String(error?.message || error || 'UNKNOWN_ERROR').slice(0, 2000),
      p_retryable: true,
      p_context: { status: game?.status || null }
    });
  } catch (_) {}
}

export async function importDateRange({ startDate, endDate, requestedBy = 'SPORTS_EDGE_API', dryRun = false }) {
  parseDate(startDate);
  parseDate(endDate);
  const days = dayCount(startDate, endDate);
  if (days < 1 || days > 7) throw new Error('DATE_RANGE_MUST_BE_1_TO_7_DAYS');
  const runId = dryRun ? null : await rpc('mlb_start_import_run', { p_start_date: startDate, p_end_date: endDate, p_requested_by: requestedBy });
  const games = await schedule(startDate, endDate);
  const counters = { discovered: games.length, inserted: 0, updated: 0, failed: 0, dryRun: 0 };

  const results = await mapWithConcurrency(games, 4, async game => {
    try {
      const feed = await fetchJson(`${FEED_URL}/${game.gamePk}/feed/live`);
      const bundle = buildGameBundle(game, feed);
      if (dryRun) {
        counters.dryRun += 1;
        return { gamePk: game.gamePk, operation: 'DRY_RUN_VALIDATED', final: bundle.game.is_final, f5Complete: bundle.game.f5_complete };
      }
      const outcome = await rpc('mlb_upsert_game_bundle', { p_bundle: bundle });
      const operation = outcome?.operation || outcome?.[0]?.operation || 'UPDATED';
      if (operation === 'INSERTED') counters.inserted += 1; else counters.updated += 1;
      return { gamePk: game.gamePk, operation, final: bundle.game.is_final, f5Complete: bundle.game.f5_complete };
    } catch (error) {
      counters.failed += 1;
      if (!dryRun) await logError(runId, game, 'GAME_IMPORT', error);
      return { gamePk: game.gamePk, operation: 'FAILED', error: error.message };
    }
  });

  if (!dryRun) {
    const status = counters.failed === 0 ? 'COMPLETED' : counters.failed < counters.discovered ? 'COMPLETED_WITH_ERRORS' : 'FAILED';
    await rpc('mlb_finish_import_run', {
      p_import_run_id: runId,
      p_status: status,
      p_games_discovered: counters.discovered,
      p_games_imported: counters.inserted,
      p_games_updated: counters.updated,
      p_games_failed: counters.failed,
      p_summary: { startDate, endDate, sampleFailures: results.filter(r => r.operation === 'FAILED').slice(0, 10) }
    });
  }

  return { version: '2.0.0-phase2a', runId, startDate, endDate, counters, results };
}
