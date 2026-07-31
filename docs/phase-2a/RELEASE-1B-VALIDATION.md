# Release 1B Preview Validation

After migrations and Vercel variables are installed, call the Preview deployment.

## Dry run
POST `/api/mlb/import` with the admin-token header and:

```json
{"startDate":"2026-07-29","endDate":"2026-07-29","dryRun":true}
```

## Real import
Repeat with `dryRun:false`. The response includes both `import` and `environments` results.

## Audit
GET `/api/mlb/audit` with the same admin-token header.

Required checks:
- `duplicateGamePks` is 0.
- `games` is greater than 0.
- `gamesWithInnings` is greater than 0 for completed games.
- `environmentRows` is greater than 0.
- Reimporting the same date does not increase the game count.

Odds-derived fields remain NULL until historical or captured odds exist in `mlb.odds`.
