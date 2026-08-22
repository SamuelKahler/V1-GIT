-- Sports Edge NFL Environment + Trend Miner V1
-- Computes NFL trends from canonical imported games; seed/reference trends remain reference-only.
-- Does not modify MLB tables.

create or replace function nfl.canonical_trend_strength(
  p_hit_rate numeric,
  p_games integer,
  p_seasons integer,
  p_latest_season integer
) returns numeric
language sql immutable as $$
  select round(greatest(0, least(100,
      ((coalesce(p_hit_rate,50)-50) * 1.35)
      + least(coalesce(p_games,0),40) * 0.78
      + case when coalesce(p_games,0) >= 20 then 9 when coalesce(p_games,0) >= 12 then 6 when coalesce(p_games,0) >= 8 then 3 else 0 end
      + case when coalesce(p_seasons,0) >= 3 then 8 when coalesce(p_seasons,0) = 2 then 4 else 0 end
      + case when coalesce(p_latest_season,0) >= 2025 then 4 when coalesce(p_latest_season,0) >= 2024 then 2 else 0 end
  )),1);
$$;

create or replace function public.sports_edge_nfl_mined_trends(
  p_limit integer default 100,
  p_min_games integer default 6,
  p_team text default null,
  p_market text default null
) returns jsonb
language sql stable security definer
set search_path = public,nfl
as $$
with windows(start_year) as (
  values (2023),(2024),(2025)
), outcomes as (
  select
    f.team_abbr, g.season, g.game_date,
    env.environment,
    m.market,
    case
      when m.market='ATS' then f.ats_result='COVER'
      when m.market='ML' then f.moneyline_result='WIN'
      when m.market='OVER' then f.total_result='OVER'
      when m.market='UNDER' then f.total_result='UNDER'
      else false
    end as hit,
    case
      when m.market='ATS' then f.ats_result
      when m.market='ML' then f.moneyline_result
      else f.total_result
    end as result_value
  from nfl.team_game_facts f
  join nfl.games g on g.game_id=f.game_id
  cross join lateral unnest(f.environment_tags) env(environment)
  cross join lateral (values ('ATS'),('ML'),('OVER'),('UNDER')) m(market)
  where g.status='FINAL'
    and g.season >= 2023
    and env.environment is not null
    and case
      when m.market='ATS' then f.ats_result in ('COVER','NO COVER')
      when m.market='ML' then f.moneyline_result in ('WIN','LOSS')
      when m.market in ('OVER','UNDER') then f.total_result in ('OVER','UNDER')
      else false
    end
), grouped as (
  select
    o.team_abbr,o.market,o.environment,w.start_year,
    count(*)::int games,
    count(*) filter(where o.hit)::int wins,
    count(*) filter(where not o.hit)::int losses,
    round(100.0*count(*) filter(where o.hit)/nullif(count(*),0),1) hit_rate,
    count(distinct o.season)::int seasons,
    max(o.season)::int latest_season,
    min(o.game_date) first_game_date,
    max(o.game_date) last_game_date
  from outcomes o
  join windows w on o.season>=w.start_year
  where (p_team is null or o.team_abbr=upper(p_team))
    and (p_market is null or o.market=upper(p_market))
  group by o.team_abbr,o.market,o.environment,w.start_year
  having count(*) >= greatest(1,coalesce(p_min_games,6))
), ranked as (
  select g.*,
    nfl.canonical_trend_strength(g.hit_rate,g.games,g.seasons,g.latest_season) strength_score,
    case
      when g.games >= 20 and g.seasons >= 2 then 'STRONG SAMPLE'
      when g.games >= 12 then 'QUALIFIED SAMPLE'
      else 'SMALL SAMPLE'
    end sample_label,
    row_number() over(
      partition by g.team_abbr,g.market,g.environment
      order by nfl.canonical_trend_strength(g.hit_rate,g.games,g.seasons,g.latest_season) desc,
               g.games desc,
               g.start_year desc
    ) as best_window
  from grouped g
), selected as (
  select * from ranked where best_window=1
), top_rows as (
  select * from selected
  order by strength_score desc, hit_rate desc, games desc
  limit greatest(1,least(coalesce(p_limit,100),500))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'team',team_abbr,
  'market',market,
  'environment',environment,
  'startYear',start_year,
  'games',games,
  'wins',wins,
  'losses',losses,
  'hitRate',hit_rate,
  'seasons',seasons,
  'latestSeason',latest_season,
  'firstGameDate',first_game_date,
  'lastGameDate',last_game_date,
  'strengthScore',strength_score,
  'sampleLabel',sample_label,
  'source','CANONICAL_NFL_GAMES'
) order by strength_score desc,hit_rate desc,games desc),'[]'::jsonb)
from top_rows;
$$;

create or replace function public.sports_edge_nfl_team_trend_history(
  p_team text,
  p_market text,
  p_environment text,
  p_start_year integer default 2023,
  p_limit integer default 100
) returns jsonb
language sql stable security definer
set search_path = public,nfl
as $$
with rows as (
  select
    g.game_date,g.season,g.week,
    f.team_abbr,f.opponent_abbr,
    f.is_home,
    f.closing_moneyline,f.closing_spread,f.closing_total,
    f.moneyline_result,f.ats_result,f.total_result,
    case
      when upper(p_market)='ATS' then f.ats_result='COVER'
      when upper(p_market)='ML' then f.moneyline_result='WIN'
      when upper(p_market)='OVER' then f.total_result='OVER'
      when upper(p_market)='UNDER' then f.total_result='UNDER'
      else false
    end as hit,
    g.away_final,g.home_final,g.venue,
    g.away_qb_name,g.home_qb_name,
    g.away_coach,g.home_coach
  from nfl.team_game_facts f
  join nfl.games g on g.game_id=f.game_id
  where f.team_abbr=upper(p_team)
    and g.status='FINAL'
    and g.season>=coalesce(p_start_year,2023)
    and upper(p_environment)=any(f.environment_tags)
    and case
      when upper(p_market)='ATS' then f.ats_result in ('COVER','NO COVER')
      when upper(p_market)='ML' then f.moneyline_result in ('WIN','LOSS')
      when upper(p_market) in ('OVER','UNDER') then f.total_result in ('OVER','UNDER')
      else false
    end
  order by g.game_date desc nulls last,g.season desc,g.week desc
  limit greatest(1,least(coalesce(p_limit,100),250))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'date',game_date,'season',season,'week',week,'team',team_abbr,'opponent',opponent_abbr,
  'location',case when is_home then 'HOME' else 'AWAY' end,
  'moneyline',closing_moneyline,'spread',closing_spread,'total',closing_total,
  'moneylineResult',moneyline_result,'atsResult',ats_result,'totalResult',total_result,
  'hit',hit,'awayFinal',away_final,'homeFinal',home_final,'venue',venue,
  'awayQb',away_qb_name,'homeQb',home_qb_name,'awayCoach',away_coach,'homeCoach',home_coach
) order by game_date desc nulls last,season desc,week desc),'[]'::jsonb)
from rows;
$$;

create or replace function public.sports_edge_nfl_weekly_intelligence()
returns jsonb
language plpgsql stable security definer
set search_path = public,nfl
as $$
declare
  v_season integer;
  v_week integer;
  v_games jsonb;
begin
  select season,week into v_season,v_week
  from nfl.games
  where status<>'FINAL' and game_date>=current_date
  order by game_date,season,week
  limit 1;

  if v_season is null then
    select season,week into v_season,v_week
    from nfl.games
    order by season desc,week desc nulls last
    limit 1;
  end if;

  with mined as (
    select * from jsonb_to_recordset(public.sports_edge_nfl_mined_trends(500,6,null,null)) as x(
      team text, market text, environment text, "startYear" integer, games integer, wins integer, losses integer,
      "hitRate" numeric, seasons integer, "latestSeason" integer, "firstGameDate" date, "lastGameDate" date,
      "strengthScore" numeric, "sampleLabel" text, source text
    )
  ), match_rows as (
    select
      g.game_id,g.external_game_id,g.season,g.week,g.game_date,g.game_time,g.weekday,g.away_team,g.home_team,g.venue,g.status,
      g.away_moneyline,g.home_moneyline,g.spread_line,g.total_line,g.away_qb_name,g.home_qb_name,
      f.team_abbr,f.opponent_abbr,f.environment_tags,
      t.market,t.environment,t."hitRate",t.games,t.wins,t.losses,t."strengthScore",t."sampleLabel",t."startYear"
    from nfl.games g
    join nfl.team_game_facts f on f.game_id=g.game_id
    left join mined t on t.team=f.team_abbr and t.environment=any(f.environment_tags)
    where g.season=v_season and g.week=v_week
  ), games_grouped as (
    select
      game_id,external_game_id,season,week,game_date,game_time,weekday,away_team,home_team,venue,status,
      away_moneyline,home_moneyline,spread_line,total_line,away_qb_name,home_qb_name,
      count(*) filter(where market is not null)::int evidence_count,
      coalesce(jsonb_agg(jsonb_build_object(
        'team',team_abbr,'market',market,'environment',environment,'hitRate',"hitRate",'games',games,
        'wins',wins,'losses',losses,'strengthScore',"strengthScore",'sampleLabel',"sampleLabel",'startYear',"startYear"
      ) order by "strengthScore" desc nulls last,"hitRate" desc nulls last) filter(where market is not null),'[]'::jsonb) evidence
    from match_rows
    group by game_id,external_game_id,season,week,game_date,game_time,weekday,away_team,home_team,venue,status,
      away_moneyline,home_moneyline,spread_line,total_line,away_qb_name,home_qb_name
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'gameId',game_id,'externalGameId',external_game_id,'season',season,'week',week,'date',game_date,'time',game_time,'weekday',weekday,
    'awayTeam',away_team,'homeTeam',home_team,'venue',venue,'status',status,
    'awayMoneyline',away_moneyline,'homeMoneyline',home_moneyline,'spreadLine',spread_line,'totalLine',total_line,
    'awayQb',away_qb_name,'homeQb',home_qb_name,'evidenceCount',evidence_count,'evidence',evidence
  ) order by game_date,game_time,away_team),'[]'::jsonb) into v_games
  from games_grouped;

  return jsonb_build_object('season',v_season,'week',v_week,'games',coalesce(v_games,'[]'::jsonb),'checkedAt',now());
end;
$$;

create or replace function public.sports_edge_nfl_trend_miner_audit()
returns jsonb
language plpgsql stable security definer
set search_path = public,nfl
as $$
declare
  trend_count integer;
  strong_count integer;
  team_count integer;
  weekly jsonb;
begin
  select count(*) into trend_count
  from jsonb_array_elements(public.sports_edge_nfl_mined_trends(500,6,null,null));
  select count(*) into strong_count
  from jsonb_array_elements(public.sports_edge_nfl_mined_trends(500,6,null,null)) e
  where (e->>'sampleLabel')='STRONG SAMPLE';
  select count(distinct e->>'team') into team_count
  from jsonb_array_elements(public.sports_edge_nfl_mined_trends(500,6,null,null)) e;
  weekly := public.sports_edge_nfl_weekly_intelligence();
  return jsonb_build_object(
    'release','NFL_ENVIRONMENT_TREND_MINER_V1',
    'passed',(trend_count>0 and team_count>=20),
    'minedTrends',trend_count,
    'strongSamples',strong_count,
    'teamsWithTrends',team_count,
    'weeklySeason',weekly->'season',
    'weeklyWeek',weekly->'week',
    'weeklyGames',jsonb_array_length(coalesce(weekly->'games','[]'::jsonb)),
    'checkedAt',now()
  );
end;
$$;

create or replace function public.sports_edge_nfl_consumer_dashboard()
returns jsonb
language plpgsql stable security definer
set search_path = public,nfl
as $$
declare
  history jsonb;
  weekly jsonb;
  trends jsonb;
begin
  history := public.sports_edge_nfl_historical_ingestion_audit();
  weekly := public.sports_edge_nfl_weekly_intelligence();
  trends := public.sports_edge_nfl_mined_trends(12,6,null,null);
  return jsonb_build_object(
    'release','NFL_ENVIRONMENT_TREND_MINER_V1',
    'canonical',jsonb_build_object(
      'teams',(select count(*) from nfl.teams where active),
      'games',(select count(*) from nfl.games),
      'finalGames',(select count(*) from nfl.games where status='FINAL'),
      'teamGameFacts',(select count(*) from nfl.team_game_facts),
      'marketSnapshots',(select count(*) from nfl.market_history)
    ),
    'marketCoverage',coalesce(history->'closingMarketCoveragePercent','0'::jsonb),
    'seasons',coalesce(history->'seasons','[]'::jsonb),
    'latestCompletedGameDate',history->'latestCompletedGameDate',
    'hotTrends',trends,
    'hotProps',public.sports_edge_nfl_prop_profiles(10),
    'weekly',weekly,
    'qualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),
    'checkedAt',now()
  );
end;
$$;

grant execute on function public.sports_edge_nfl_mined_trends(integer,integer,text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_team_trend_history(text,text,text,integer,integer) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_weekly_intelligence() to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_consumer_dashboard() to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_trend_miner_audit() to service_role;
