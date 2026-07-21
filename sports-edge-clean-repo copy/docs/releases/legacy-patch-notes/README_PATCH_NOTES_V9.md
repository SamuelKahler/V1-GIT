# Sports Edge V9 Patch - Today's Picks Performance Dashboard

This patch rebuilds Today's Picks into a betting performance dashboard.

## What changed
- Active bets are separated from the historical archive.
- Only the latest slate date is treated as active/live/pending.
- Older picks marked LIVE or PENDING are now shown as UNGRADED, not LIVE.
- Added performance metrics:
  - Graded record
  - Win rate
  - Net units
  - ROI
  - Active today
  - Past ungraded
- Added category performance:
  - F5
  - Moneyline
  - Totals
  - Series
  - Other
- Added automatic profit/loss calculation from odds and units.
- If units were not entered, the dashboard uses a 1U default for performance math.

## Important
This patch does not auto-grade past ungraded picks from box scores yet. Those remain UNGRADED until results are entered or a grading engine is connected.
