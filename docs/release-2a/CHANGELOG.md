# Release 2A Changelog

## Added
- `supabase/migrations/003_mlb_environment_and_query_engine.sql`
- `lib/mlb/environment-engine.js`
- `lib/mlb/query-engine.js`
- `api/mlb/environments.js`
- `api/mlb/query.js`
- `scripts/validate-release2a.mjs`

## Changed
- Corrected the repository copy of migration 002.
- Importer now rebuilds verified environments after successful non-dry imports.
- Supabase transport accepts the current `SUPABASE_SECRET_KEY` and legacy `SUPABASE_SERVICE_ROLE_KEY` names.
- Package validation now includes all Release 2A modules.

## Not changed
- Customer UI and navigation
- Sports Edge grading and performance records
- Existing pick database
- Stored research trends
