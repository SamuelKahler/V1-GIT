import { callRpc } from './supabase.js';
import { requireIsoDate } from './stats-api-client.js';

const MAX_ENVIRONMENT_DAYS = 31;

function validateRange(startDate, endDate) {
  const start = requireIsoDate(startDate, 'startDate');
  const end = requireIsoDate(endDate, 'endDate');
  const startTime = new Date(`${start}T00:00:00Z`).getTime();
  const endTime = new Date(`${end}T00:00:00Z`).getTime();
  if (startTime > endTime) { const error = new Error('startDate cannot be after endDate.'); error.statusCode = 400; throw error; }
  const dayCount = Math.floor((endTime - startTime) / 86400000) + 1;
  if (dayCount > MAX_ENVIRONMENT_DAYS) { const error = new Error(`Environment rebuilds are limited to ${MAX_ENVIRONMENT_DAYS} days per request.`); error.statusCode = 400; throw error; }
  return { startDate: start, endDate: end, dayCount };
}

async function rebuildEnvironments({ startDate, endDate }) {
  const range = validateRange(startDate, endDate);
  const result = await callRpc('sports_edge_mlb_rebuild_environments', {
    p_start_date: range.startDate,
    p_end_date: range.endDate
  });
  return { ...range, database: result };
}

export { MAX_ENVIRONMENT_DAYS, rebuildEnvironments, validateRange as validateEnvironmentRange };
