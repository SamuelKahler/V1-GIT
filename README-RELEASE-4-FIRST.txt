SPORTS EDGE MLB INTELLIGENCE — RELEASE 4
CUSTOMER EVIDENCE EXPERIENCE

INSTALLATION
1. Upload this repository's contents to GitHub branch phase-2-mlb-database.
2. Replace matching files and commit: Install MLB Intelligence Release 4.
3. Do not run a Supabase migration. Release 4 uses the existing Release 2A query RPC.
4. Confirm Preview environment variables still exist in Vercel:
   SUPABASE_URL
   SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)
   MLB_IMPORT_ADMIN_TOKEN
5. Let Vercel build the Preview deployment.
6. Open an MLB team-side pick and select Open Bet Details.
7. Verify the Verified MLB Game Logs section loads without asking for an admin token.
8. Confirm Stored Trend Database is displayed separately.

IMPORTANT
- Sports Edge picks are not used as MLB historical game-log evidence.
- The public evidence endpoint is read-only and capped.
- F5 picks use F5 win/loss history. Full-game team picks use full-game history.
- Totals and series picks show a clear unsupported-market message in this release.
- Do not merge to main until Preview tests pass.
