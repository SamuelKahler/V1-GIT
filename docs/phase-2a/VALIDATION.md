# Phase 2A Validation Checklist

## Automated checks performed

- `npm run check` — passed
- `npm run validate:phase2a` — passed
- mock official-feed transformation — passed
- mock first-five scoring — passed
- required-file manifest — passed

The build environment could not resolve external DNS for `statsapi.mlb.com`, so a live upstream request could not be completed during packaging. The included Preview dry-run command is the required live validation in Vercel.

## Data validation rules

1. `game_pk` is the permanent primary key.
2. A game cannot have the same home and away team.
3. Missing values remain SQL `NULL`; they are not guessed.
4. F5 scores are populated only when innings 1 through 5 each contain both team run values.
5. Final status is based on official MLB status codes or final-state text.
6. Team and venue records are upserted from official feed identifiers.
7. Re-importing a `game_pk` updates the existing record.
8. Inning and pitcher child records are replaced transactionally per game bundle.
9. Import failures are written to `ops.mlb_import_errors`.
10. Sports Edge picks are never inserted into MLB game tables.

## UI regression check

Open the Preview deployment and verify all existing pages and tabs still render. This release does not reference the new database from `mlb-app.js`, so no visible data or design change is expected.
