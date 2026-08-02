-- Sports Edge MLB Legacy Purge + Decision Engine acceptance audit.
-- Read-only reporting function. No game, odds, environment, or pick rows are changed.

create or replace function public.sports_edge_mlb_decision_engine_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
  with game_counts as (
    select
      count(*)::integer as games,
      count(*) filter (where status_abstract_state = 'Final')::integer as final_games,
      count(*) filter (where status_abstract_state = 'Final' and home_score is not null and away_score is not null)::integer as final_scores,
      count(*) filter (where status_abstract_state = 'Final' and home_f5_score is not null and away_f5_score is not null)::integer as f5_scores
    from mlb.games
  ), duplicate_counts as (
    select count(*)::integer as duplicate_game_pks
    from (
      select game_pk from mlb.games group by game_pk having count(*) > 1
    ) duplicates
  ), environment_counts as (
    select count(*)::integer as environments from mlb.environments
  )
  select jsonb_build_object(
    'release', 'LEGACY_PURGE_DECISION_ENGINE_V1',
    'games', game_counts.games,
    'finalGames', game_counts.final_games,
    'finalScores', game_counts.final_scores,
    'f5Scores', game_counts.f5_scores,
    'environments', environment_counts.environments,
    'duplicateGamePks', duplicate_counts.duplicate_game_pks,
    'passed', duplicate_counts.duplicate_game_pks = 0
      and game_counts.games > 0
      and environment_counts.environments > 0
  )
  from game_counts, duplicate_counts, environment_counts;
$$;

revoke all on function public.sports_edge_mlb_decision_engine_audit() from public;
grant execute on function public.sports_edge_mlb_decision_engine_audit() to service_role;
