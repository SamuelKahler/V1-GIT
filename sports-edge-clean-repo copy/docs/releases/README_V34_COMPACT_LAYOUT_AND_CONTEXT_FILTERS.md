# Sports Edge V34 - Compact Layout + Context Filters

Built forward from V33.

## What changed
- Performance Dashboard was compacted to four core metrics: Record, Win %, Units, ROI.
- Today's MLB pick board now uses columns: F5, ML, Over, Under, Spread.
- Bet cards remain grouped as Official vs Research, but each group is now easier to scan horizontally.
- Bet Details overlay is now solid/darker instead of translucent to reduce background distraction.
- Series Board cards now show date and are sorted newest to oldest.
- Series cards show home/away context when stored; otherwise they clearly indicate that series home/away order is not stored.
- Starting Pitcher / K Prop History now filters historical prop rows by the current game environment when the app can infer it.
  - Example: if PIT is a HOME UNDERDOG against SEA, the Against SEA bucket prioritizes HOME UNDERDOG and HOME rows only.
- Current K Line remains separate and only appears when the current slate prop line is imported.

## Stability rule
No working V33 data pipelines were removed. Changes were limited to layout, series display, modal styling, and prop-history filtering.
