# Sports Edge MLB Intelligence Database V2 — Phase 2A Installation

## Release boundary

This release adds the MLB database foundation and protected import APIs. It does not change the customer-facing UI, current tabs, Sports Edge grading, or `public.pick_observations`.

## Files to install

Upload the complete repository ZIP to the existing `phase-2-mlb-database` branch, replacing matching files and preserving all others.

## Required one-time database action

A database owner must run this file once in the Supabase SQL Editor:

`supabase/migrations/002_mlb_intelligence_foundation.sql`

This cannot be performed safely from a public browser endpoint because it creates schemas, tables, indexes, grants, and security-definer functions.

### How to find the Supabase project

1. Open the Sports Edge project in Vercel.
2. Open **Settings → Environment Variables**.
3. Confirm these names exist: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Copy only the hostname from `SUPABASE_URL`, for example `abcdefgh.supabase.co`.
5. Sign in at Supabase using the account that owns that project and match the project reference at the start of the hostname.

Never paste the service-role key into chat, source code, GitHub, or screenshots.

## Vercel environment variable

Add one new secret in Vercel for Preview and Production:

`MLB_IMPORT_ADMIN_TOKEN`

Use a long random value of at least 32 characters. Example generation command:

```bash
openssl rand -hex 32
```

Do not put the generated value in the repository.

## Deploy safely

1. Push this package to `phase-2-mlb-database`.
2. Allow Vercel to create a Preview deployment.
3. Do not merge to `main` yet.
4. Run the database migration once.
5. Redeploy the Preview after adding `MLB_IMPORT_ADMIN_TOKEN`.

## First test: dry run

Replace the placeholders below. Dry run fetches and validates official MLB data but does not write games.

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":true}'
```

Expected result:

- HTTP 200, or 207 if individual upstream feeds fail
- `counters.discovered` greater than zero on a normal MLB date
- `counters.dryRun` equals the number of successfully validated games
- no database rows written

## First database import

After dry run succeeds:

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":false}'
```

## Verify import

```bash
curl "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/status" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN"
```

Verify:

- `database.games` equals the games discovered for the test date
- `database.duplicate_game_pks` equals `0`
- `database.innings` is greater than zero for completed games
- recent import status is `COMPLETED` or a reviewed `COMPLETED_WITH_ERRORS`

## Deduplication test

Run the same non-dry import a second time. Expected behavior:

- total game count does not increase
- second run reports games as `updated`, not duplicated
- `duplicate_game_pks` remains `0`

## Merge rule

Merge into `main` only after:

- dry run succeeds
- first import succeeds
- second import proves idempotency
- status endpoint shows no unexplained errors
- current customer UI is visually unchanged
