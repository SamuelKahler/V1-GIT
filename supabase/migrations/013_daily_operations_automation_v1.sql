-- Sports Edge Daily Operations Automation V1
-- Read-only audit function for the automated MLB data + pick grading workflow.

create or replace function public.sports_edge_daily_operations_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
with game_stats as (
  select
    count(*)::integer as games,
    count(*) filter (where is_final)::integer as final_games,
    count(*) filter (where is_final and (away_score is null or home_score is null))::integer as final_games_missing_scores,
    count(*) filter (where is_final and f5_available)::integer as f5_final_games,
    max(official_date) as latest_game_date,
    max(official_date) filter (where is_final) as latest_final_date
  from mlb.games
),
environment_stats as (
  select count(*)::integer as environments, max(g.official_date) as latest_environment_date
  from mlb.environments e
  join mlb.games g on g.id = e.game_id
),
pick_stats as (
  select
    count(*)::integer as stored_pick_grades,
    count(*) filter (where result in ('WIN','LOSS','PUSH','VOID'))::integer as finalized_pick_grades,
    count(*) filter (where result in ('PENDING','UNVERIFIED'))::integer as pending_pick_grades,
    count(*) filter (
      where period = 'FIRST_FIVE'
        and result in ('WIN','LOSS','PUSH')
        and coalesce((source_record->>'hasExplicitUnits')::boolean, false)
    )::integer as official_f5_finalized,
    max(pick_date) as latest_pick_date,
    max(updated_at) as latest_pick_grade_at
  from public.pick_observations
  where pick_id like 'SRC-DAILYIMPORTPICKS-%'
),
duplicates as (
  select count(*)::integer as duplicate_game_pks
  from (
    select game_pk
    from mlb.games
    group by game_pk
    having count(*) > 1
  ) x
)
select jsonb_build_object(
  'release', 'DAILY_OPERATIONS_AUTOMATION_V1',
  'passed', (
    d.duplicate_game_pks = 0
    and g.final_games_missing_scores = 0
    and g.games > 0
    and e.environments > 0
  ),
  'games', g.games,
  'finalGames', g.final_games,
  'finalGamesMissingScores', g.final_games_missing_scores,
  'f5FinalGames', g.f5_final_games,
  'latestGameDate', g.latest_game_date,
  'latestFinalDate', g.latest_final_date,
  'environments', e.environments,
  'latestEnvironmentDate', e.latest_environment_date,
  'storedPickGrades', p.stored_pick_grades,
  'finalizedPickGrades', p.finalized_pick_grades,
  'pendingPickGrades', p.pending_pick_grades,
  'officialF5Finalized', p.official_f5_finalized,
  'latestPickDate', p.latest_pick_date,
  'latestPickGradeAt', p.latest_pick_grade_at,
  'duplicateGamePks', d.duplicate_game_pks,
  'checkedAt', now()
)
from game_stats g
cross join environment_stats e
cross join pick_stats p
cross join duplicates d;
$$;

revoke all on function public.sports_edge_daily_operations_audit() from public;
grant execute on function public.sports_edge_daily_operations_audit() to service_role;
