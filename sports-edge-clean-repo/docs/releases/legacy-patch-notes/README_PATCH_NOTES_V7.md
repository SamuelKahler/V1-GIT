# Sports Edge Netlify Patch V7

## Requested change
Prop filtering no longer uses a public "Prop opponent location" dropdown.

## What changed
- Replaced the prop opponent/location dropdown with a `Search Team` input.
- Added team abbreviation/name matching, so users can type `NYY`, `Yankees`, `Seattle`, etc.
- The app now detects the selected team's current game environment from live slate data:
  - AWAY
  - HOME
  - AWAY FAVORITE / AWAY UNDERDOG when moneyline odds are available
  - HOME FAVORITE / HOME UNDERDOG when moneyline odds are available
- The app still keeps the full prop environment list available for manual override:
  - AWAY FAVORITE
  - AWAY
  - AWAY UNDERDOG
  - DIVISION
  - HOME
  - HOME FAVORITE
  - HOME UNDERDOG
  - NO REST
- If live odds/schedule data has not loaded, the app falls back to showing stored prop rows for the searched team instead of failing.

## Important limitation
DIVISION and NO REST require extra live metadata beyond the current game/odds feed. The code keeps these environments in the system, but it does not auto-claim those statuses unless future live data provides division/rest context or the stored trend row already contains that situation.

## Files changed
- `index.html`
- `app.js`
