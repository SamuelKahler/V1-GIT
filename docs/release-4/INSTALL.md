# Release 4 Installation

## Files changed

- `api/mlb/public-evidence.js` — new customer-safe, read-only evidence endpoint.
- `lib/mlb/evidence-engine.js` — period-aware FULL_GAME and F5 evidence summaries.
- `sports/mlb/core/mlb-intelligence-client.js` — public evidence client method.
- `sports/mlb/mlb-app.js` — customer-facing verified game-log report and strict separation from stored trends.
- `styles.css` — verified evidence presentation.
- `scripts/validate-release4.mjs` — deterministic Release 4 tests.
- `package.json` — version and validation updates.

## Installation

Upload the repository contents to `phase-2-mlb-database`, replace matching files, and commit with:

`Install MLB Intelligence Release 4`

No Supabase migration is required.

## Preview validation

1. Wait for the Vercel Preview deployment to show `Ready`.
2. Open the Preview URL.
3. Navigate to MLB Today's Picks.
4. Open a team-side moneyline or F5 pick.
5. Expand `Verified MLB Game Logs`.
6. Confirm the report displays either verified records or a truthful empty-data state.
7. Expand `Stored Trend Database` and verify it is separate.
