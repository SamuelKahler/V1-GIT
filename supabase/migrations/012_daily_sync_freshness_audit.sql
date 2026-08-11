create or replace function public.sports_edge_mlb_freshness_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
  select jsonb_build_object(
    'release', 'DAILY_SYNC_V1',
    'passed', (
      (select count(*) from mlb.games where is_final and (away_score is null or home_score is null)) = 0
      and (select count(*) from (select game_pk from mlb.games group by game_pk having count(*) > 1) d) = 0
    ),
    'games', (select count(*) from mlb.games),
    'finalGames', (select count(*) from mlb.games where is_final),
    'latestGameDate', (select max(official_date) from mlb.games),
    'latestFinalDate', (select max(official_date) from mlb.games where is_final),
    'latestEnvironmentDate', (select max(g.official_date) from mlb.environments e join mlb.games g on g.id=e.game_id),
    'finalGamesMissingScores', (select count(*) from mlb.games where is_final and (away_score is null or home_score is null)),
    'duplicateGamePks', (select count(*) from (select game_pk from mlb.games group by game_pk having count(*) > 1) d),
    'recentGames7d', (select count(*) from mlb.games where official_date >= current_date - 7),
    'recentFinalGames7d', (select count(*) from mlb.games where is_final and official_date >= current_date - 7),
    'recentEnvironments7d', (select count(*) from mlb.environments e join mlb.games g on g.id=e.game_id where g.official_date >= current_date - 7)
  );
$$;

grant execute on function public.sports_edge_mlb_freshness_audit() to anon, authenticated, service_role;
