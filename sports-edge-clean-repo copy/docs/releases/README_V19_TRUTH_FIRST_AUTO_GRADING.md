# Sports Edge V19 - Truth-First Auto Grading Update

## What changed
- Added a conservative auto-grading layer for completed MLB picks.
- Verified grades are applied only when a final score/series result is available and the market can be safely graded.
- Full-game Moneyline, full-game Totals, full-game ±0.5, and known completed Series bets can now be graded from verified final scores.
- F5 bets and props are intentionally not guessed. They are marked as `UNVERIFIED / EXCLUDED` until the app has inning-by-inning or prop-level feeds.
- `Needs Grading` language was replaced with `Unverified / Excluded` to make the product clearer and more trustworthy.
- Verification notes were added to the pick details modal so users can see exactly why a pick was graded or excluded.

## Verified source layer
The final-score layer was built from verified MLB schedule/final-score data for June 13-21, 2026. Only picks matching those final-score rows are counted toward record, win rate, units, and ROI.

## Important limitation
This is not yet a full production auto-grader for every market. The next required production step is adding linescore and prop/stat ingestion so F5 and player props can grade automatically without manual confirmation.

## Product principle
If Sports Edge is not sure, it does not grade the bet and does not count it in performance.
