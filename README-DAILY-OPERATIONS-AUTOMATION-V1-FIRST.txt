SPORTS EDGE - DAILY OPERATIONS AUTOMATION V1

PURPOSE
This release turns the repeated MLB maintenance workflow into two scheduled Production jobs while keeping daily-import.js as the one routine pick-entry source.

AUTOMATED JOB 1 - MLB DATA
Vercel cron: 12:15 UTC daily (approximately 5:15 AM Pacific during daylight saving time)
Endpoint: /api/mlb?action=cronSync
Action: re-import previous 3 MLB dates and rebuild environments.

AUTOMATED JOB 2 - PICK GRADING
Vercel cron: 12:45 UTC daily (approximately 5:45 AM Pacific during daylight saving time)
Endpoint: /api/intelligence-sync?mode=cron&days=28
Action: read daily-import.js, grade recent picks from Official MLB results, and persist grades into public.pick_observations.

CUSTOMER/PERFORMANCE HYDRATION
When the MLB app opens, it first reads persisted grades from Supabase, applies them to the canonical Sports Edge database, and then performs the existing browser reconciliation. This means automated grades flow into Overall Performance and explicit-unit F5 grades flow into F5 Performance.

YOU STILL DO ONE MANUAL THING
Paste or edit the new daily picks in daily-import.js and push the commit. You do not manually grade completed games or manually run the normal daily 3-day backfill after Production automation is live.

VERCEL REQUIRED
CRON_SECRET must exist in Production.
SUPABASE_URL must exist in Production.
SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY must exist in Production.

SUPABASE
Run supabase/migrations/013_daily_operations_automation_v1.sql once.
Then audit with:
select public.sports_edge_daily_operations_audit();
