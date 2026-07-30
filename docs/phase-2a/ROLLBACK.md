# Phase 2A Rollback

## Application rollback

Do not merge the feature branch into `main` until validation passes. If a Preview deployment fails, return to the previous Git commit or delete the Preview deployment. The production UI is unaffected.

## Database rollback

Only perform this if all Phase 2A data can be discarded:

```sql
begin;
drop function if exists public.sports_edge_mlb_status();
drop function if exists public.sports_edge_mlb_log_error(uuid,bigint,text,text,jsonb);
drop function if exists public.sports_edge_mlb_finish_import(uuid,text,integer,integer,integer,integer,text,jsonb);
drop function if exists public.sports_edge_mlb_upsert_game(jsonb);
drop function if exists public.sports_edge_mlb_start_import(date,date,boolean);
drop schema if exists ops cascade;
drop schema if exists mlb cascade;
drop schema if exists trends cascade;
drop schema if exists performance cascade;
commit;
```

This rollback does not delete `public.pick_observations`.
