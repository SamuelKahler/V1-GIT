import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const vercel = JSON.parse(read('vercel.json'));
const sync = read('api/intelligence-sync.js');
const recent = read('sports/mlb/core/recent-results.js');
const dailyOps = read('lib/mlb/daily-operations.js');
const migration = read('supabase/migrations/013_daily_operations_automation_v1.sql');

assert(Array.isArray(vercel.crons) && vercel.crons.length >= 2, 'Expected data sync and grade automation cron jobs.');
assert(vercel.crons.some(row => row.path.includes('/api/mlb?action=cronSync')), 'Missing MLB data cron.');
assert(vercel.crons.some(row => row.path.includes('/api/intelligence-sync?mode=cron')), 'Missing automated grading cron.');
assert(sync.includes('loadRecentDailyPicks'), 'Automated grader must load the canonical daily-import source.');
assert(sync.includes("process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY"), 'Supabase secret-key compatibility is missing.');
assert(sync.includes("mode==='stored'"), 'Stored grade hydration endpoint is missing.');
assert(sync.includes("mode==='cron'"), 'Cron grading endpoint is missing.');
assert(recent.includes('hydrateStored'), 'Client must hydrate persisted automated grades.');
assert(dailyOps.includes('SPORTS_EDGE_DAILY_IMPORT_TEXT'), 'Daily operations must use daily-import.js as the single routine pick source.');
assert(dailyOps.includes('SRC-DAILYIMPORTPICKS-'), 'Automated pick IDs must match the browser canonical database IDs.');
assert(migration.includes('sports_edge_daily_operations_audit'), 'Daily operations audit RPC is missing.');

console.log('DAILY_OPERATIONS_AUTOMATION_V1_VALIDATION_PASSED');
