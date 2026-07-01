# V41 Historical Performance Engine

## Purpose
This update turns the uploaded MLB result ledger into a reusable Historical Performance Database.

## Files added
- `data/mlb/historical-performance.js`
- `scripts/v41-historical-performance-engine.js`
- `styles-v41-historical-engine.css`

## What it does
- Calculates category records from historical result rows.
- Calculates net units from the `RESULT` column.
- Calculates ROI from net units divided by number of graded rows.
- Highlights positive numbers green, negative numbers red, key odds/metrics gold, and record/sample sizes blue.
- Adds a Historical Performance Engine panel to Performance Lab.
- Adds Historical Performance Match evidence inside Bet Details when a current pick matches historical rows.
- Includes pitching matchup notes from the historical notes column when available.

## Rules
- Positive RESULT = win.
- Negative RESULT = loss.
- Zero RESULT = push.
- ROI is calculated from the result column as net units.
- This update is additive and does not remove existing MLB, CFB, Series Board, or Today's Picks behavior.
