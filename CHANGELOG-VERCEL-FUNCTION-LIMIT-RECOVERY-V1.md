# Vercel Function Limit Recovery V1

- Removed four Copilot-era serverless endpoints that are not referenced by the verified Sports Edge runtime:
  - `api/admin/ingest-prop-trends.js`
  - `api/trends/cfb.js`
  - `api/trends/nfl.js`
  - `pages/api/nfl/backfill-kickoffs.js`
- Reduces deployable serverless functions from 15 to 11, under the Vercel Hobby limit of 12.
- Does not modify Supabase data or migrations.
- Preserves verified MLB/NFL APIs and admin workflows.
