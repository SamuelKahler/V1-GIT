# Sports Edge V12 Patch - Trend Database Cleanup

## What changed
- Added precise row classification:
  - `Win Trend` = non-ML, non-prop trend with a numeric hit rate.
  - `ML Win Trend` = ML trend with a numeric hit rate.
  - `Prop` = PROP rows.
  - `Game Log Trend` = rows without a numeric hit rate that need more samples before becoming a true hit-rate-backed trend.
- Added a visible Date column to the Trend Database table.
- Sorted trend records newest to oldest.
- Added `Hit Rate / Status` so Game Log rows show `Needs Data` instead of pretending they are Win Trends.
- Added a Game Log Trend category/filter so event records like `PREV_ALLOWED 10+` without hit-rate evidence are separated from true Win Trends.

## Important data-quality rule
The app does not invent dates for supporting examples. It preserves the row date from the uploaded sheet. Supporting games/examples still need a future structured history table if you want every supporting example to have its own date and result.
