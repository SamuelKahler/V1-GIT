SPORTS EDGE MLB CUSTOMER INTELLIGENCE INTEGRATION

INSTALL
1. Upload this repository contents to phase-2-mlb-database.
2. Replace matching files.
3. Commit: Connect MLB Intelligence Database to customer evidence UI
4. Wait for the v1-git Preview deployment to become Ready.
5. No Supabase migration is required.

PREVIEW ACCEPTANCE
1. Open the unique Preview URL, not the production main URL.
2. Open MLB Today's Picks.
3. Open a supported team moneyline or F5 pick.
4. Verified Game Logs must load from /api/mlb action customerIntelligence.
5. Confirm hit rate, record, sample, exact match, contradictions and supporting games appear.
6. Confirm Stored Trend Database remains separate.
7. Confirm totals/series do not receive unrelated evidence.
8. Confirm F5 Performance and Overall Performance still load.

DO NOT MERGE TO MAIN until all acceptance checks pass.
