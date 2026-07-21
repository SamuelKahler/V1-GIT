# Sports Edge Netlify Patch V6

## What changed

### New Trend Database filter flow
The Trend Database now follows the desired product logic:

1. Sport
2. Bet Category
3. Category-specific dropdowns
4. Performance / Search

The public Team filter was removed. The app still detects today's teams internally from the live slate and filters trend rows to those teams when live data is available.

### Bet categories

#### Win Trend
Includes:
- PREV_SCORED 10+
- PREV_SCORED 0
- PREV_ALLOWED 10+
- PREV_ALLOWED 0
- SWEEP
- AVOID SWEEP
- FOR SWEEP
- OVER
- UNDER

Existing PREV_SCRD rows are displayed as PREV_SCORED. Existing ATS / AtS rows are treated as AVOID SWEEP.

#### ML Win Trend
ML is now its own category. It filters by environment:
- AFTER A WIN
- 1-DAY REST
- AWAY UNDERDOG
- DIVISION
- NO REST

#### Prop
Prop is no longer part of the public Style dropdown. It has its own category with:
- Opponent Location: AWAY / HOME
- Game Environment: AWAY FAVORITE, AWAY, AWAY UNDERDOG, DIVISION, HOME, HOME FAVORITE, HOME UNDERDOG, NO REST

### Removed filters
- Public team dropdown removed
- Opponent dropdown removed
- Situation dropdown removed

The website still uses team, opponent, and situation internally to match trends against today's slate.

## Files changed
- index.html
- app.js
- styles.css

## Deploy
Upload the full folder contents to Netlify or replace these files in the current Netlify project.
