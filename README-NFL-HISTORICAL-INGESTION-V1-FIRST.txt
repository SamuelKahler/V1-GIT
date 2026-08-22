SPORTS EDGE — NFL HISTORICAL GAME INGESTION V1

1. Run supabase/migrations/019_nfl_historical_game_ingestion_v1.sql in Supabase.
2. Deploy this repository to a Preview branch.
3. Open /developer and unlock with the existing MLB_IMPORT_ADMIN_TOKEN.
4. In NFL Historical Game Ingestion, leave seasons as 2023,2024,2025,2026.
5. Click Preview NFL Import first. Confirm the source returns games.
6. Click Import NFL History once.
7. Click NFL Ingestion Audit.
8. Confirm passed=true, duplicateExternalGameIds=0, finalGamesMissingScores=0, and teamGameFacts=games*2.
9. Open the NFL page and confirm Canonical Games is now greater than zero.

This release does not touch MLB tables.
