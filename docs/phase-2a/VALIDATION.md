# Phase 2A Validation

## Local static checks

```bash
npm run check
npm run validate:phase2a
```

## Database checks

After importing a completed date:

1. `/api/mlb/status` reports games greater than zero.
2. Final games have official final scores when MLB provides them.
3. `f5Available` is greater than zero for completed regulation games.
4. Innings are uniquely keyed by `game_pk + inning_number`.
5. `duplicateGamePks` equals zero.
6. Re-importing the same date does not increase total game count.
7. Sports Edge performance views remain unchanged.

## First-five rule

F5 is stored only when innings 1 through 5 each contain both away and home run values. Missing innings never become zero by inference. When incomplete, `f5_available=false` and both F5 scores remain null.
