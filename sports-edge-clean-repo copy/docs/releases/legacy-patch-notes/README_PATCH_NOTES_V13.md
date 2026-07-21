# Sports Edge V13 - Trend Database Scenario History Cleanup

## What changed

- Renamed `ML Win Trend` to `Win Trend Hit Rate` everywhere in the user-facing filters and table logic.
- Removed the `Live Matchup` table column from the Trend Database.
- Changed the old `Evidence` column into `Result Evidence` so it is focused on win/loss support and whether the row is hit-rate backed or still needs data.
- Changed the Trend Database `Description` display into `Opponent / Location` using Home/Away labels:
  - `@ TEAM` becomes Away
  - `vs. TEAM` becomes Home
  - blank opponents fall back to current live slate matchup when available
- Game Log Trend styles now use checkboxes instead of a single dropdown, so users can select multiple categories at the same time.
- Removed `ML` and `SPRD` from Game Log Trend styles.
- Added a `Scenario History` section above the table that shows applicable current-slate games after Sport + Category + selected styles are applied.
- Preserved dated historical rows and grouped matching rows by today's game when live slate data is available.

## Important data rule

Rows with a numeric hit rate are treated as hit-rate-backed trends. Rows without a numeric hit rate are Game Log Trends / Needs Data and are used to build the future scenario history database.
