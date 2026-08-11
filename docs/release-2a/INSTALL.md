# Sports Edge MLB Intelligence — Release 2A Installation

## 1. Install the repository update
Upload the contents of the release ZIP to the GitHub branch `phase-2-mlb-database` and replace matching files. Commit with `Install MLB Intelligence Release 2A`.

## 2. Install the database migration
In Supabase, open **SQL Editor → New query**. Copy the complete contents of:

`supabase/migrations/003_mlb_environment_and_query_engine.sql`

Paste and run it. The expected response is `Success. No rows returned.` This migration is idempotent and extends the existing migration-002 database.

## 3. Redeploy Preview
In Vercel, redeploy the newest `phase-2-mlb-database` Preview after confirming these Preview variables exist:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
- `MLB_IMPORT_ADMIN_TOKEN`

## 4. Test status
Replace the domain and token below with your private values:

```bash
curl "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/status" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN"
```

## 5. Dry-run one completed MLB date

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":true}'
```

A dry run stores nothing.

## 6. Import the same date

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/import" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":false}'
```

The importer automatically rebuilds environments for the imported range.

## 7. Run the audit

```bash
curl "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/audit" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN"
```

Required result: `duplicateGamePks` must equal `0`.

## 8. Run the first verified game-log query

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/query" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"criteria":{"teamAbbreviation":"MIL","role":"HOME","limit":25}}'
```

The response contains `summary` and `supportingGames`. Favorite, ROI and odds-bucket fields remain unavailable until odds rows exist.
