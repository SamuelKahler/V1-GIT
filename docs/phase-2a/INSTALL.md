# Phase 2A Installation

## Purpose

This release creates a separate MLB Intelligence data system. It does not use Sports Edge picks as historical game evidence and does not change the UI.

## 1. Create the database

The current Vercel project has no Supabase variables, so create a Supabase project at the Supabase dashboard. Keep the generated database password private.

In the new project, open **SQL Editor**, create a query, paste the complete contents of:

`supabase/migrations/002_mlb_intelligence_foundation.sql`

Run it once. The migration is idempotent for tables and indexes and does not alter `public.pick_observations`.

## 2. Add Vercel environment variables

In the `v1-git` Vercel project, add these variables for **Preview and Production**:

- `SUPABASE_URL`: Project Settings > API > Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings > API > service_role key
- `MLB_IMPORT_ADMIN_TOKEN`: a private random string with at least 32 characters

Never place these values in GitHub or send them in chat.

Redeploy the Preview deployment after saving variables.

## 3. Dry-run one completed date

Replace the domain and token below:

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_PRIVATE_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":true}'
```

A dry run downloads and validates official MLB data but writes no game records.

## 4. Import the same date

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_PRIVATE_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":false}'
```

## 5. Validate

```bash
curl "https://YOUR-PREVIEW-DOMAIN/api/mlb/audit" \
  -H "x-sports-edge-admin-token: YOUR_PRIVATE_TOKEN"
```

`uniqueGamePk` must be `true` and `duplicateGamePks` must be `0`.

Run the real import a second time. Game count must stay constant; records should report as updated rather than duplicated.

## Import constraints

Phase 2A limits each request to seven calendar days to stay within serverless execution limits. Full-season backfill belongs to Phase 3 and will use date batching and resumable jobs.
