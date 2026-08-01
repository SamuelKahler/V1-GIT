SPORTS EDGE MLB INTELLIGENCE — RELEASE 2A

PURPOSE
Release 2A turns the MLB database foundation into a verified environment and game-log query engine. It does not change the customer UI or mix Sports Edge picks into MLB evidence.

INSTALL IN THIS ORDER
1. Upload every file in this repository package to the GitHub branch phase-2-mlb-database, replacing matching files.
2. Commit: Install MLB Intelligence Release 2A
3. In Supabase SQL Editor, run the complete file:
   supabase/migrations/003_mlb_environment_and_query_engine.sql
   Migration 002 has already been run and should not be rerun.
4. Confirm the Vercel Preview environment contains:
   SUPABASE_URL
   SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)
   MLB_IMPORT_ADMIN_TOKEN
5. Redeploy the phase-2-mlb-database Preview deployment.
6. Test the protected status endpoint, then run one dry import, one real import, the audit, and one query using docs/release-2a/INSTALL.md.
7. Do not merge to main until duplicateGamePks is 0 and the query returns supporting games from the MLB database.

WHAT THIS RELEASE ADDS
- Verified environment rebuild after successful imports
- Rest, previous-game, division, series, handedness and available odds environments
- One game-log query RPC using team-side perspective
- Full-game record, hit rate, moneyline units and ROI
- F5 record
- Supporting historical games with exact stored environments
- Protected /api/mlb/environments and /api/mlb/query endpoints
- Release 2A deterministic validation

IMPORTANT
Unavailable fields remain null. Odds-only fields remain null until historical odds are imported. No environment is randomly assigned.
