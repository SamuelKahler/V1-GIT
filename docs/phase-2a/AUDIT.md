# Phase 2A Audit Output

## Existing system preserved

- `sports/mlb/mlb-app.js`: unchanged
- `sports/mlb/mlb-data.js`: unchanged
- `sports/mlb/core/*`: unchanged
- `api/intelligence-sync.js`: unchanged
- `public.pick_observations`: untouched by migration
- existing navigation, tabs, colors, and layouts: unchanged

## Added database objects

Schemas:

- `mlb`
- `ops`
- `trends`
- `performance`

Tables:

- `mlb.teams`
- `mlb.venues`
- `mlb.games`
- `mlb.game_innings`
- `mlb.game_pitchers`
- `ops.mlb_import_runs`
- `ops.mlb_import_errors`

Protected RPC functions:

- `public.mlb_start_import_run`
- `public.mlb_upsert_game_bundle`
- `public.mlb_log_import_error`
- `public.mlb_finish_import_run`
- `public.mlb_import_audit`

All RPC functions are revoked from `public`, `anon`, and `authenticated`; execution is granted only to `service_role`.

## Added server routes

- `POST /api/mlb/import`
- `GET /api/mlb/status`
- `GET /api/mlb/audit`

All require `MLB_IMPORT_ADMIN_TOKEN`.

## Official source fields imported

- MLB `gamePk`
- official date and season
- game status
- home and away official team IDs
- venue
- final score
- inning-by-inning score
- first-five score when verifiable
- probable and confirmed starting pitchers when available
- pitcher handedness when available
- day/night
- series description and position
- doubleheader/game number
- weather condition, temperature, and wind when supplied

## Deliberately deferred

- moneyline, run line, total, closing odds
- favorite/underdog and odds buckets
- rest and previous-game environments
- bullpen workload
- full-season backfill
- customer-facing evidence UI
- daily automation

These belong to later verified releases and are not fabricated in Phase 2A.
