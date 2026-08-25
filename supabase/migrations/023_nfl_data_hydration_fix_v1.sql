-- Sports Edge NFL Data Hydration Fix V1
-- Keeps the public NFL dashboard lightweight so a slow prop-threshold aggregation
-- cannot blank the entire consumer experience.

create or replace function public.sports_edge_nfl_consumer_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path=public,nfl
as $$
declare
  history jsonb;
  weekly jsonb;
  trends jsonb;
  v_player_rows integer := 0;
  v_players integer := 0;
  v_latest_player_season integer;
begin
  history := public.sports_edge_nfl_historical_ingestion_audit();
  weekly := public.sports_edge_nfl_weekly_intelligence();
  trends := public.sports_edge_nfl_mined_trends(12,6,null,null);

  select count(*)::int,
         count(distinct player_id)::int,
         max(season)::int
    into v_player_rows, v_players, v_latest_player_season
  from nfl.player_game_stats
  where season_type='REG';

  return jsonb_build_object(
    'release','NFL_DATA_HYDRATION_FIX_V1',
    'canonical',jsonb_build_object(
      'teams',(select count(*) from nfl.teams where active),
      'games',(select count(*) from nfl.games),
      'finalGames',(select count(*) from nfl.games where status='FINAL'),
      'teamGameFacts',(select count(*) from nfl.team_game_facts),
      'marketSnapshots',(select count(*) from nfl.market_history),
      'playerGameRows',v_player_rows,
      'players',v_players,
      -- Qualified profiles are intentionally lazy-loaded by the Prop Lab.
      'qualifiedPropProfiles',null
    ),
    'marketCoverage',coalesce(history->'closingMarketCoveragePercent','0'::jsonb),
    'seasons',coalesce(history->'seasons','[]'::jsonb),
    'latestCompletedGameDate',history->'latestCompletedGameDate',
    'latestPlayerSeason',v_latest_player_season,
    'hotTrends',coalesce(trends,'[]'::jsonb),
    -- Prop profiles and player cards are intentionally lazy-loaded by their own API actions.
    'hotProps','[]'::jsonb,
    'playerProfiles','[]'::jsonb,
    'weekly',coalesce(weekly,'{}'::jsonb),
    'qualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),
    'checkedAt',now()
  );
end $$;

grant execute on function public.sports_edge_nfl_consumer_dashboard() to anon,authenticated,service_role;

create or replace function public.sports_edge_nfl_hydration_audit()
returns jsonb
language plpgsql
stable
security definer
set search_path=public,nfl
as $$
declare
  v_games integer;
  v_finals integer;
  v_facts integer;
  v_market integer;
  v_player_rows integer;
  v_players integer;
  v_latest_game date;
  v_latest_player_season integer;
begin
  select count(*)::int,
         count(*) filter(where status='FINAL')::int,
         max(game_date)
    into v_games,v_finals,v_latest_game
  from nfl.games;

  select count(*)::int into v_facts from nfl.team_game_facts;
  select count(*)::int into v_market from nfl.market_history;
  select count(*)::int,count(distinct player_id)::int,max(season)::int
    into v_player_rows,v_players,v_latest_player_season
  from nfl.player_game_stats
  where season_type='REG';

  return jsonb_build_object(
    'release','NFL_DATA_HYDRATION_FIX_V1',
    'passed',(v_games>0 and v_finals>0 and v_facts=v_games*2 and v_market>0 and v_player_rows>0 and v_players>100),
    'games',v_games,
    'finalGames',v_finals,
    'teamGameFacts',v_facts,
    'marketSnapshots',v_market,
    'playerGameRows',v_player_rows,
    'canonicalPlayers',v_players,
    'latestGameDate',v_latest_game,
    'latestPlayerSeason',v_latest_player_season,
    'checkedAt',now()
  );
end $$;

grant execute on function public.sports_edge_nfl_hydration_audit() to service_role;
