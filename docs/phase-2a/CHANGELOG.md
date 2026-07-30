# Phase 2A Changelog

## Added

- Separate `mlb`, `ops`, `trends`, and `performance` PostgreSQL schemas.
- MLB teams, venues, pitchers, games, innings, and game-pitcher tables.
- Import-run and import-error audit tables.
- Service-role-only RPC functions for transactional data writes.
- Official MLB schedule/feed importer with retries and bounded concurrency.
- Verified final and first-five scoring transformation.
- Protected import, status, and audit Vercel endpoints.
- Deterministic validation script.
- Installation, validation, audit, and rollback documentation.

## Modified

- `package.json` version raised from `10.0.0` to `11.1.0`.
- `package.json` check script expanded for Phase 2A files.

## Unchanged

- Customer-facing UI and styling.
- Existing tabs and navigation.
- Sports Edge pick database and grading flow.
- Existing MLB data file.
- `public.pick_observations` migration and data.
