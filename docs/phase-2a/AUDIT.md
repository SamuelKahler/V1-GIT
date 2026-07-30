# Phase 2A Audit

## Baseline

The supplied repository was a static Vercel application with MLB Stats API and odds endpoints. It had one Supabase migration for `public.pick_observations`, but the active Vercel project showed only `ODDS_API_KEY`; no active Supabase connection was configured.

## Separation enforced

- Existing Sports Edge pick grading remains unchanged.
- Existing `public.pick_observations` remains unchanged.
- New official MLB games live only in `mlb.*`.
- Import operational records live only in `ops.*`.
- No UI reads from the new database in Phase 2A.
- No imported trend is represented as calculated game-log evidence.

## Data integrity

- `mlb.games.game_pk` is the primary key.
- Game import uses a database upsert function.
- Innings use `(game_pk, inning_number)` as the primary key.
- Pitcher assignments use `(game_pk, team_side, role)` as the primary key.
- Unknown fields remain null.
- F5 requires five verified inning rows.
- Imports are limited to seven days per request.
- Administrative endpoints require a constant-time token check.
