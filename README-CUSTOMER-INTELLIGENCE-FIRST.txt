SPORTS EDGE MLB CUSTOMER INTELLIGENCE INTEGRATION

INSTALL
1. Upload this repository's contents to GitHub branch phase-2-mlb-database.
2. Commit: Integrate MLB customer intelligence database
3. Wait for the v1-git Vercel Preview deployment to become Ready.
4. No Supabase migration is required.

PREVIEW ACCEPTANCE
1. Open the Preview website, not the Production/main URL.
2. Open MLB Today's Picks.
3. Open a full-game moneyline or F5 team pick.
4. Verified MLB Game Logs must load from /api/mlb action publicCustomerIntelligence.
5. Confirm the report displays:
   - Best Qualified Hit Rate
   - Exact Match
   - Evidence Score
   - ROI or Odds unavailable
   - Strongest Reasons
   - Contradicting Evidence
   - Supporting Historical Games
   - Exact Environment Match Details
6. Stored Trend Database must remain separate.
7. Sports Edge pick performance must not be labeled Verified Game Logs.

ROLLBACK
Revert the single installation commit. No database rollback is required.
