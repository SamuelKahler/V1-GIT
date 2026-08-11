SPORTS EDGE MLB INTELLIGENCE - RELEASE A

PURPOSE
Prove one completed MLB date can be imported twice without duplicates while storing final scores, F5 scores, innings, teams, venues, pitchers and import audits.

INSTALL ORDER
1. Upload this repository to GitHub branch phase-2-mlb-database.
2. In Supabase SQL Editor run:
   supabase/migrations/004_release_a_ingestion_acceptance.sql
3. Wait for the Vercel Preview deployment to show Ready.
4. Open this Preview-only page:
   https://YOUR-PREVIEW-DOMAIN/release-a-admin.html
5. Enter:
   - a completed MLB date (recommended: at least two days ago)
   - your private MLB_IMPORT_ADMIN_TOKEN
6. Click Run Release A Test.
7. Do not proceed unless the page says RELEASE A PASSED.

DO NOT MERGE TO MAIN YET.
