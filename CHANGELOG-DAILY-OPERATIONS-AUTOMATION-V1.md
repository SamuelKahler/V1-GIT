# Daily Operations Automation V1

- Added server-side parsing of the canonical `daily-import.js` source.
- Added scheduled grading of the previous 28 days of Sports Edge MLB picks.
- Persisted automated grades to `public.pick_observations`.
- Added compatibility with `SUPABASE_SECRET_KEY` as well as legacy service-role naming.
- Added browser hydration of persisted grades before the existing client reconciliation pass.
- Added a second Vercel cron for grading after the daily MLB data/environment refresh.
- Added `sports_edge_daily_operations_audit()` for operational verification.
- Kept explicit-unit F5 filtering intact in the existing Performance Engine.
