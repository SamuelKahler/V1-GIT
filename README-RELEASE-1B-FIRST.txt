SPORTS EDGE MLB INTELLIGENCE - RELEASE 1B

THIS PACKAGE IS A COMPLETE REPOSITORY UPDATE.

WHAT IT DOES
- Preserves the current customer UI and Sports Edge performance pipeline.
- Completes the MLB Stats API client, importer, transformer, auth, HTTP, and Supabase layers.
- Adds automatic verified environment rebuilding after each successful import.
- Adds division/interleague, rest, previous result/scoring, starter hand, series position, day/night, odds buckets, total buckets, and completeness metrics.
- Leaves unavailable values NULL. No field is guessed.

INSTALL WITHOUT VS CODE
1. Unzip this package.
2. Upload the CONTENTS of the V1-GIT-main folder to the phase-2-mlb-database GitHub branch and replace matching files.
3. Commit: Install MLB Intelligence Release 1B
4. Create a Supabase project if one does not exist.
5. In Supabase SQL Editor, run migrations in order:
   supabase/migrations/001_sports_edge_intelligence.sql (only if needed for existing picks)
   supabase/migrations/002_mlb_intelligence_foundation.sql
   supabase/migrations/003_mlb_environment_engine.sql
6. In Vercel add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and MLB_IMPORT_ADMIN_TOKEN (32+ private characters) for Preview and Production.
7. Redeploy the feature-branch Preview.

DO NOT MERGE TO MAIN UNTIL THE PREVIEW IMPORT AND AUDIT PASS.

VALIDATION ALREADY RUN
- npm run check: PASS
- npm run validate:phase2a: PASS
