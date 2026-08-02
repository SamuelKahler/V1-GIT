SPORTS EDGE MLB — EVIDENCE ENGINE V2

PURPOSE
Retire legacy spreadsheet-driven customer trend cards and make the imported 2026 MLB database the single source of customer historical percentages.

INSTALL
1. Upload the contents of V1-GIT-phase-2-mlb-database to GitHub branch phase-2-mlb-database.
2. Replace matching files.
3. Commit: Install market-specific MLB Evidence Engine V2
4. In Supabase SQL Editor run supabase/migrations/006_evidence_engine_v2.sql.
5. Wait for the v1-git Preview deployment to become Ready.
6. Test the unique Preview URL. Do not merge to main yet.

WHAT CHANGED
- Today's Picks cards no longer display legacy spreadsheet trend percentages.
- The Trend Database page no longer renders imported Excel trend rows. It now routes customers to current picks and their database-backed evidence.
- Pick details show This Season MLB Evidence first.
- F5 bets use F5 results only and evaluate the actual F5 line, including -0.5 and +0.5.
- F5 bets never use full-game spread or full-game moneyline records as evidence.
- Full-game moneyline bets remain separate from F5 evidence.
- Exact environment evidence uses team, opponent, role, date range, series position, day/night, and other verified fields when available.
- A this-season team/market baseline is shown separately from the exact environment sample.
- Sports Edge Official F5 Performance remains separately labeled and uses official unit-sized plays only.
- Legacy spreadsheet percentages are not used in customer-facing evidence.

PREVIEW ACCEPTANCE TEST
1. Open an F5 -0.5 pick.
2. Confirm the first evidence section says This Season MLB Evidence.
3. Confirm it explicitly says F5 evidence ends after five innings.
4. Confirm no ML or SPRD trend card appears.
5. Confirm the exact sample and season baseline are F5 records at the listed F5 line.
6. Open an F5 +0.5 pick and confirm ties are graded as covers in the historical sample.
7. Confirm Official Sports Edge F5 Performance is separate from MLB historical evidence.
8. Open a full-game moneyline pick and confirm it uses full-game moneyline evidence only.
9. Open the Trend Database page and confirm legacy spreadsheet cards are gone.
10. Confirm Today’s Picks, F5 Performance, Overall Performance, Series Board, and navigation still work.

ROLLBACK
Revert the GitHub commit and do not rerun migration 005. Migration 006 only replaces the query function and does not delete season data.
