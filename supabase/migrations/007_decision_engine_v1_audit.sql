begin;

create or replace function public.sports_edge_mlb_decision_engine_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
  select jsonb_build_object(
    'completed_games', (select count(*) from mlb.games where lower(coalesce(status_detailed, '')) like '%final%'),
    'games_with_f5', (select count(*) from mlb.games where f5_home_score is not null and f5_away_score is not null),
    'environment_rows', (select count(*) from mlb.environments),
    'games_with_odds', (select count(distinct game_id) from mlb.odds),
    'duplicate_game_pks', (
      select count(*) from (
        select game_pk from mlb.games group by game_pk having count(*) > 1
      ) duplicates
    )
  );
$$;

revoke all on function public.sports_edge_mlb_decision_engine_audit() from public;
grant execute on function public.sports_edge_mlb_decision_engine_audit() to service_role;

commit;
