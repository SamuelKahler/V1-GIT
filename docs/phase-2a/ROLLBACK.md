# Phase 2A Rollback

## Application rollback

1. Do not merge the Preview branch, or revert the Phase 2A commit if already merged.
2. Redeploy the last known-good Vercel deployment.
3. Remove `MLB_IMPORT_ADMIN_TOKEN` if the import endpoints are no longer deployed.

The old UI and performance pipeline do not depend on the new tables, so application rollback is immediate.

## Database rollback

Keep the MLB data by default. Unused tables do not affect the existing application.

Only after confirming the data is disposable, run:

```sql
begin;

drop function if exists public.mlb_import_audit(integer);
drop function if exists public.mlb_finish_import_run(uuid,text,integer,integer,integer,integer,jsonb);
drop function if exists public.mlb_log_import_error(uuid,bigint,date,text,text,text,boolean,jsonb);
drop function if exists public.mlb_upsert_game_bundle(jsonb);
drop function if exists public.mlb_start_import_run(date,date,text);

drop schema if exists mlb cascade;
drop schema if exists ops cascade;

-- performance and trends are intentionally retained because future releases may use them.
commit;
```

This rollback does not alter or delete `public.pick_observations`.
