# Sports Edge V16 Master Build

This folder is the cleaned V16 baseline for the Sports Edge website. It combines the latest uploaded frontend files, trend data, Netlify functions, database schema, and migrations into one deployable project.

## Included

- `index.html` - main website shell
- `app.js` - frontend rendering, filters, live slate matching, performance dashboard logic
- `data.js` - current Sports Edge trend database, tracked picks, research data
- `styles.css` - site styling
- `db/schema.ts` - Drizzle/Netlify DB schema
- `db/index.ts` - Netlify DB connection
- `netlify/functions/live-data.mts` - API endpoint returning live games/odds
- `netlify/functions/sync-live-data.mts` - sync job for MLB schedule, scores, pitchers, box scores, and odds
- `netlify/database/migrations/0001_live_data.sql` - initial live data tables
- `netlify/database/migrations/0002_live_game_metadata.sql` - game time, team name, and pitcher metadata
- `docs/` - patch notes from V6 through V16

## Current V16 Features

- Live games page
- Games sorted by first pitch
- Probable pitcher matchup support
- Moneyline display support
- Trend Database with Sport -> Category -> Environment / Team Search flows
- Win Trend, Win Trend Hit Rate, Prop, and Game Log Trend categories
- Outcome-backed Game Log rows with WIN / LOSS / MIXED / UNDEFINED states
- Today's Picks & Results performance dashboard
- Units, ROI, record, category performance
- Research Journal and Model Center pages

## Deploy on Netlify

1. Upload this whole folder to your GitHub repository or Netlify project.
2. In Netlify, set the publish directory to the project root (`.`).
3. Make sure Netlify Functions are enabled and point to `netlify/functions`.
4. Apply database migrations in order:
   - `netlify/database/migrations/0001_live_data.sql`
   - `netlify/database/migrations/0002_live_game_metadata.sql`
5. Add environment variables for live odds if using The Odds API:
   - `ODDS_API_KEY`
6. Deploy.

## Daily Live Data Workflow

The intended live-data flow is:

1. `sync-live-data` pulls MLB schedule, scores, probable pitchers, and odds.
2. It stores that data in Netlify DB.
3. `live-data` returns the latest games/odds to the frontend.
4. The frontend uses live slate teams/environments to filter the Trend Database automatically.

## Next Build Target: V17

Recommended V17 focus:

- Auto-detect `DIVISION`, `NO REST`, `AFTER A WIN`, and `AFTER A LOSS` from live schedule/history.
- Auto-grade picks from final scores and box scores.
- Move hardcoded trend/pick data from `data.js` into database tables.
- Add admin upload page for daily trend/pick imports.

## Important Notes

This is a master baseline package. Do not keep patching scattered older ZIPs. Use this V16 folder as the new source of truth before building V17.
