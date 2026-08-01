# Release A installation

## Files added

- `supabase/migrations/004_release_a_ingestion_acceptance.sql`
- `api/mlb/release-a-test.js`
- `api/mlb/release-a-audit.js`
- `scripts/validate-release-a.mjs`
- `release-a-admin.html`

## Files changed

- `package.json`

## Database installation

Run migration `004_release_a_ingestion_acceptance.sql` once in the existing Sports Edge Supabase project after migrations 002 and 003.

The migration is idempotent: columns use `ADD COLUMN IF NOT EXISTS`, functions use `CREATE OR REPLACE FUNCTION`, and permissions are reapplied safely.

## Preview acceptance test

Use the Preview deployment, not Production:

`https://YOUR-PREVIEW-DOMAIN/release-a-admin.html`

Choose a completed MLB date at least two days in the past. Enter the existing `MLB_IMPORT_ADMIN_TOKEN` and run the test.

The test performs:

1. pre-import database audit;
2. first real import;
3. post-import audit;
4. second real import of the same date;
5. final audit and pass/fail checks.
