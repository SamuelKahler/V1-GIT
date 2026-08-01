SPORTS EDGE MLB INTELLIGENCE - RELEASE 3

INSTALL
1. Upload this repository to the GitHub branch phase-2-mlb-database.
2. Replace matching files and commit: Install MLB Intelligence Release 3.
3. No new Supabase migration is required for this release.
4. In Vercel, confirm Preview variables exist:
   SUPABASE_URL
   SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)
   MLB_IMPORT_ADMIN_TOKEN
5. Redeploy the phase-2-mlb-database Preview.
6. Test POST /api/mlb/evidence using the instructions in docs/release-3/INSTALL.md.
7. Do not merge to main until the evidence endpoint returns a verified report from imported games.

WHAT THIS RELEASE ADDS
- Evidence report engine built only from MLB Intelligence game logs.
- Best-qualified and exact-environment results shown separately.
- Deterministic Evidence Score with visible components.
- Contradicting historical evidence.
- Supporting historical games.
- Exact environment match descriptions.
- Browser integration client without changing the current design.
