# Sports Edge V2 Architecture

## Browser application

- `index.html`: one application shell and all page containers
- `styles.css`: shared visual system and sport themes
- `sports/mlb/mlb-data.js`: preserved MLB source dataset
- `sports/mlb/core/master-ledger.js`: normalized, deduplicated MLB ledger view
- `sports/mlb/mlb-app.js`: MLB page rendering and interactions
- `sports/nfl/`: NFL data and rendering

## Vercel APIs

- `api/live-data.js`: MLB schedule, matchup resolution, and official game results
- `api/grade-picks.js`: traceable MLB grading
- `api/odds.js`: The Odds API proxy using `ODDS_API_KEY`

## Rules

1. Vercel is the only deployment target.
2. No Netlify runtime or migrations are retained.
3. No dated patch scripts are loaded.
4. Each active script is loaded once.
5. Legacy source data is preserved until the master ledger fully replaces it.
6. New features must read normalized records rather than create another pick array.
