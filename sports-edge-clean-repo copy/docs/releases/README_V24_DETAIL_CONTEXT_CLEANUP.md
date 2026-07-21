# Sports Edge V24 - Detail Context Cleanup

## What changed
- Removed the Live page/navigation from the user-facing app for now because the feed is not reliably loading.
- Brightened the Bet Details / Details buttons so users clearly know where to click for deeper reasoning.
- Merged duplicate detail sections into one: `Matched Trends + Why It Matters`.
- Updated the Starting Pitcher / K Prop History section so it only shows stored pitcher prop rows against the actual opponent in the pick.
- Added strikeout-line extraction from stored prop descriptions, such as `K line: 7` when available.

## Important data rule
Pitcher/K prop history is now opponent-specific. If a pitcher prop row does not match the team being faced in that pick, it is not shown.

## Current limitation
The app can only show K prop lines that exist in the uploaded/stored prop rows. If a sportsbook prop line for today's game is not stored yet, the section will say the exact matchup prop history is not available instead of inventing it.
