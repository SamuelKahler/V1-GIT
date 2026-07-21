# Sports Edge Netlify Patch V5

## What changed
- Live games now sort by first pitch time.
- Live game cards now display starting pitcher matchups when MLB Stats API provides probable pitchers.
- Live game cards now always show a moneyline area. If odds are missing, they show `No ML` instead of silently omitting the line.
- Odds cards are sorted by commence time and focused on moneyline.
- Trend filters now use a dropdown flow:
  1. Sport
  2. Today's Teams
  3. Style
  4. Minimum Hit Rate
  5. Search
- Team dropdown is restricted to teams playing on the current live MLB slate after live data loads. If live data has not loaded yet, it falls back to all entered teams so the page is not blank.
- Situation and Opponent user filters were removed from the UI. Situation still exists in code/data and is auto-displayed for matching trend rows.
- `ATS` is now displayed as `AtS` for Avoid the Sweep.
- `PROP` rows are hidden from the public Style dropdown/results because the current style view is for ML/trend-style bets.

## Database change required
Run/apply the included migration:
`netlify/database/migrations/0002_live_game_metadata.sql`

This adds:
- home_team_name
- away_team_name
- home_pitcher
- away_pitcher
- game_time

## Files to replace/upload
- index.html
- app.js
- data.js
- styles.css
- db/schema.ts
- netlify/functions/live-data.mts
- netlify/functions/sync-live-data.mts
- netlify/database/migrations/0002_live_game_metadata.sql
