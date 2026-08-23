-- Sports Edge NFL Prop Intelligence Engine V2
-- Turns canonical weekly player production into sample-qualified historical prop profiles.
-- Tracked spreadsheet props remain supporting research only; they no longer drive the Hot Props leaderboard.

create or replace function public.sports_edge_nfl_prop_board(
  p_limit integer default 100,
  p_min_games integer default 8,
  p_window text default '3Y',
  p_market text default null,
  p_team text default null,
  p_position text default null
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
with latest as (
  select max(season)::int latest_season from nfl.player_game_stats where season_type='REG'
), config as (
  select latest_season,
    case upper(coalesce(p_window,'3Y')) when '1Y' then latest_season when '2Y' then latest_season-1 else latest_season-2 end start_season,
    upper(coalesce(p_window,'3Y')) window_key
  from latest
), base as (
  select p.* from nfl.player_game_stats p, config c
  where p.season_type='REG' and p.season between c.start_season and c.latest_season
    and p.position in ('QB','RB','WR','TE')
    and (p_team is null or p.team_abbr=upper(p_team))
    and (p_position is null or p.position=upper(p_position))
), observations as (
  select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'PASS_YARDS'::text market,pass_yards::numeric stat_value from base where position='QB' and pass_attempts is not null
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'COMPLETIONS',completions::numeric from base where position='QB' and pass_attempts is not null
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'PASS_TDS',pass_tds::numeric from base where position='QB' and pass_attempts is not null
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'RUSH_YARDS',rush_yards::numeric from base where rush_attempts is not null and position in ('QB','RB','WR')
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'RUSH_ATTEMPTS',rush_attempts::numeric from base where rush_attempts is not null and position in ('QB','RB')
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'RECEPTIONS',receptions::numeric from base where targets is not null and position in ('RB','WR','TE')
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'REC_YARDS',receiving_yards::numeric from base where targets is not null and position in ('RB','WR','TE')
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'TARGETS',targets::numeric from base where targets is not null and position in ('RB','WR','TE')
  union all select player_id,player_name,headshot_url,team_abbr,position,season,game_id,'ANY_TD',(coalesce(rush_tds,0)+coalesce(receiving_tds,0))::numeric from base where position in ('QB','RB','WR','TE')
), threshold_values(market,threshold) as (
  values
    ('PASS_YARDS',200::numeric),('PASS_YARDS',225),('PASS_YARDS',250),('PASS_YARDS',275),('PASS_YARDS',300),
    ('COMPLETIONS',18),('COMPLETIONS',20),('COMPLETIONS',22),('COMPLETIONS',25),
    ('PASS_TDS',1),('PASS_TDS',2),('PASS_TDS',3),
    ('RUSH_YARDS',20),('RUSH_YARDS',30),('RUSH_YARDS',40),('RUSH_YARDS',50),('RUSH_YARDS',60),('RUSH_YARDS',70),('RUSH_YARDS',80),('RUSH_YARDS',90),('RUSH_YARDS',100),
    ('RUSH_ATTEMPTS',8),('RUSH_ATTEMPTS',10),('RUSH_ATTEMPTS',12),('RUSH_ATTEMPTS',15),('RUSH_ATTEMPTS',18),('RUSH_ATTEMPTS',20),
    ('RECEPTIONS',2),('RECEPTIONS',3),('RECEPTIONS',4),('RECEPTIONS',5),('RECEPTIONS',6),('RECEPTIONS',7),('RECEPTIONS',8),
    ('REC_YARDS',25),('REC_YARDS',40),('REC_YARDS',50),('REC_YARDS',60),('REC_YARDS',70),('REC_YARDS',80),('REC_YARDS',90),('REC_YARDS',100),
    ('TARGETS',4),('TARGETS',5),('TARGETS',6),('TARGETS',8),('TARGETS',10),('TARGETS',12),
    ('ANY_TD',1)
), joined as (
  select o.*,t.threshold from observations o join threshold_values t using(market)
  where p_market is null or o.market=upper(p_market)
), agg as (
  select player_id,max(player_name) player_name,max(headshot_url) headshot_url,
    (array_agg(team_abbr order by season desc))[1] team_abbr,max(position) position,market,threshold,
    count(*)::int games,count(*) filter(where stat_value>=threshold)::int hits,
    count(*) filter(where stat_value<threshold)::int misses,
    round(100.0*count(*) filter(where stat_value>=threshold)/nullif(count(*),0),1) hit_rate,
    round(avg(stat_value)::numeric,1) avg_stat,
    round((percentile_cont(.5) within group(order by stat_value))::numeric,1) median_stat,
    count(distinct season)::int seasons,min(season)::int start_season,max(season)::int latest_season
  from joined group by player_id,market,threshold
  having count(*)>=greatest(1,coalesce(p_min_games,8))
), scored as (
  select a.*,
    case when games>=16 and hit_rate>=60 then 'STRONG SAMPLE'
         when games>=10 and hit_rate>=58 then 'QUALIFIED SAMPLE'
         else 'DEVELOPING SAMPLE' end sample_label,
    round((greatest(hit_rate-50,0)*1.35 + least(games,24)*1.35 + greatest(seasons-1,0)*3.5)::numeric,1) strength_score
  from agg a
), ranked as (
  select * from scored
  order by strength_score desc,hit_rate desc,games desc,threshold desc
  limit greatest(1,least(coalesce(p_limit,100),5000))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',player_id,'playerName',player_name,'headshotUrl',headshot_url,'team',team_abbr,'position',position,
  'market',market,'threshold',threshold,'hits',hits,'misses',misses,'games',games,'hitRate',hit_rate,
  'avgStat',avg_stat,'medianStat',median_stat,'seasons',seasons,'startSeason',start_season,'latestSeason',latest_season,
  'window',upper(coalesce(p_window,'3Y')),'sampleLabel',sample_label,'strengthScore',strength_score,'source','CANONICAL_PLAYER_GAME_STATS'
) order by strength_score desc,hit_rate desc,games desc),'[]'::jsonb) from ranked;
$$;

create or replace function public.sports_edge_nfl_player_prop_intelligence(
  p_player_id text default null,
  p_player_name text default null
) returns jsonb
language plpgsql stable security definer set search_path=public,nfl as $$
declare v_player_id text; v_player_name text; v_headshot text; v_team text; v_position text; v_latest integer;
declare v_windows jsonb; v_thresholds jsonb; v_tracked jsonb; v_games jsonb;
begin
  select p.player_id,p.player_name,p.headshot_url,p.team_abbr,p.position
    into v_player_id,v_player_name,v_headshot,v_team,v_position
  from nfl.player_game_stats p
  where (p_player_id is not null and p.player_id=p_player_id)
     or (p_player_id is null and p_player_name is not null and lower(p.player_name)=lower(p_player_name))
  order by p.season desc,p.week desc limit 1;
  if v_player_id is null and v_player_name is null then return jsonb_build_object('found',false); end if;
  select max(season) into v_latest from nfl.player_game_stats where season_type='REG';

  with windows(label,start_season) as (values ('1Y',v_latest),('2Y',v_latest-1),('3Y',v_latest-2)), s as (
    select w.label,w.start_season,count(*)::int games,min(p.season)::int first_season,max(p.season)::int latest_season,
      round(avg(p.pass_attempts)::numeric,1) avg_pass_attempts,round(avg(p.completions)::numeric,1) avg_completions,
      round(avg(p.pass_yards)::numeric,1) avg_pass_yards,round((percentile_cont(.5) within group(order by p.pass_yards))::numeric,1) median_pass_yards,
      round(avg(p.pass_tds)::numeric,2) avg_pass_tds,round(avg(p.rush_attempts)::numeric,1) avg_rush_attempts,
      round(avg(p.rush_yards)::numeric,1) avg_rush_yards,round((percentile_cont(.5) within group(order by p.rush_yards))::numeric,1) median_rush_yards,
      round(avg(p.targets)::numeric,1) avg_targets,round(avg(p.receptions)::numeric,1) avg_receptions,
      round(avg(p.receiving_yards)::numeric,1) avg_receiving_yards,round((percentile_cont(.5) within group(order by p.receiving_yards))::numeric,1) median_receiving_yards,
      round(avg(coalesce(p.rush_tds,0)+coalesce(p.receiving_tds,0))::numeric,2) avg_any_tds
    from windows w join nfl.player_game_stats p on p.season_type='REG' and p.season between w.start_season and v_latest
      and ((v_player_id is not null and p.player_id=v_player_id) or (v_player_id is null and lower(p.player_name)=lower(v_player_name)))
    group by w.label,w.start_season
  ) select coalesce(jsonb_agg(to_jsonb(s) order by case label when '1Y' then 1 when '2Y' then 2 else 3 end),'[]'::jsonb) into v_windows from s;

  with boards as (
    select '1Y' window_key, value row_data from jsonb_array_elements(public.sports_edge_nfl_prop_board(5000,4,'1Y',null,null,null))
    union all select '2Y',value from jsonb_array_elements(public.sports_edge_nfl_prop_board(5000,4,'2Y',null,null,null))
    union all select '3Y',value from jsonb_array_elements(public.sports_edge_nfl_prop_board(5000,4,'3Y',null,null,null))
  ) select coalesce(jsonb_agg(row_data || jsonb_build_object('window',window_key) order by (row_data->>'strengthScore')::numeric desc),'[]'::jsonb)
    into v_thresholds from boards where (v_player_id is not null and row_data->>'playerId'=v_player_id) or (v_player_id is null and lower(row_data->>'playerName')=lower(v_player_name));

  select coalesce(jsonb_agg(jsonb_build_object('season',season,'week',week,'bet',bet_text,'market',market_style,'result',result,'environment',environment,'opponent',opponent_text) order by season desc,week desc),'[]'::jsonb)
    into v_tracked from nfl.reference_prop_observations where lower(player_name)=lower(v_player_name);

  select public.sports_edge_nfl_player_game_log(v_player_id,v_player_name,80) into v_games;

  return jsonb_build_object('found',true,'player',jsonb_build_object('playerId',v_player_id,'playerName',v_player_name,'headshotUrl',v_headshot,'team',v_team,'position',v_position),
    'windows',coalesce(v_windows,'[]'::jsonb),'thresholds',coalesce(v_thresholds,'[]'::jsonb),'trackedResearch',coalesce(v_tracked,'[]'::jsonb),'games',coalesce(v_games,'[]'::jsonb),'latestSeason',v_latest);
end $$;

create or replace function public.sports_edge_nfl_player_threshold_splits(
  p_player_id text,
  p_market text,
  p_threshold numeric,
  p_window text default '3Y'
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
with latest as (select max(season)::int latest_season from nfl.player_game_stats where season_type='REG'), cfg as (
 select latest_season,case upper(coalesce(p_window,'3Y')) when '1Y' then latest_season when '2Y' then latest_season-1 else latest_season-2 end start_season from latest
), base as (
 select p.*,f.is_home,f.is_favorite,f.is_underdog,f.division_game,f.conference_game
 from nfl.player_game_stats p join nfl.team_game_facts f on f.game_id=p.game_id and f.team_abbr=p.team_abbr,cfg c
 where p.player_id=p_player_id and p.season_type='REG' and p.season between c.start_season and c.latest_season
), obs as (
 select *,case upper(p_market)
   when 'PASS_YARDS' then pass_yards::numeric when 'COMPLETIONS' then completions::numeric when 'PASS_TDS' then pass_tds::numeric
   when 'RUSH_YARDS' then rush_yards::numeric when 'RUSH_ATTEMPTS' then rush_attempts::numeric when 'RECEPTIONS' then receptions::numeric
   when 'REC_YARDS' then receiving_yards::numeric when 'TARGETS' then targets::numeric when 'ANY_TD' then (coalesce(rush_tds,0)+coalesce(receiving_tds,0))::numeric end stat_value
 from base
), split_rows as (
 select 'HOME' label,* from obs where is_home=true union all select 'AWAY',* from obs where is_home=false
 union all select 'FAVORITE',* from obs where is_favorite=true union all select 'UNDERDOG',* from obs where is_underdog=true
 union all select 'DIVISION',* from obs where division_game=true union all select 'CONFERENCE',* from obs where conference_game=true
), agg as (
 select label,count(*) filter(where stat_value is not null)::int games,count(*) filter(where stat_value>=p_threshold)::int hits
 from split_rows group by label
)
select coalesce(jsonb_agg(jsonb_build_object('label',label,'games',games,'hits',hits,'misses',games-hits,'hitRate',round(100.0*hits/nullif(games,0),1),'sampleLabel',case when games>=10 then 'QUALIFIED SAMPLE' when games>=6 then 'SUPPORTING SAMPLE' else 'SMALL SAMPLE' end) order by games desc,label),'[]'::jsonb)
from agg where games>0;
$$;

create or replace function public.sports_edge_nfl_prop_intelligence_audit()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare v_rows integer; v_players integer; v_profiles integer; v_featured integer; v_tiny_featured integer;
begin
  select count(*),count(distinct player_id) into v_rows,v_players from nfl.player_game_stats where season_type='REG';
  select jsonb_array_length(public.sports_edge_nfl_prop_board(5000,8,'3Y',null,null,null)) into v_profiles;
  select jsonb_array_length(public.sports_edge_nfl_prop_board(50,10,'3Y',null,null,null)) into v_featured;
  select count(*) into v_tiny_featured from jsonb_array_elements(public.sports_edge_nfl_prop_board(50,10,'3Y',null,null,null)) x where (x->>'games')::int<8;
  return jsonb_build_object('release','NFL_PROP_INTELLIGENCE_ENGINE_V2','passed',(v_rows>0 and v_players>100 and v_profiles>0 and v_tiny_featured=0),
    'playerGameRows',v_rows,'canonicalPlayers',v_players,'qualifiedThresholdProfiles',v_profiles,'featuredProfiles',v_featured,
    'tinySamplesOnFeaturedBoard',v_tiny_featured,'minimumFeaturedSample',10,'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_consumer_dashboard()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare history jsonb; weekly jsonb; trends jsonb; player_audit jsonb; prop_audit jsonb;
begin
 history:=public.sports_edge_nfl_historical_ingestion_audit(); weekly:=public.sports_edge_nfl_weekly_intelligence(); trends:=public.sports_edge_nfl_mined_trends(12,6,null,null); player_audit:=public.sports_edge_nfl_player_intelligence_audit(); prop_audit:=public.sports_edge_nfl_prop_intelligence_audit();
 return jsonb_build_object('release','NFL_PROP_INTELLIGENCE_ENGINE_V2','canonical',jsonb_build_object(
   'teams',(select count(*) from nfl.teams where active),'games',(select count(*) from nfl.games),'finalGames',(select count(*) from nfl.games where status='FINAL'),
   'teamGameFacts',(select count(*) from nfl.team_game_facts),'marketSnapshots',(select count(*) from nfl.market_history),
   'playerGameRows',coalesce((player_audit->>'playerGameRows')::int,0),'players',coalesce((prop_audit->>'canonicalPlayers')::int,0),
   'qualifiedPropProfiles',coalesce((prop_audit->>'qualifiedThresholdProfiles')::int,0)),
  'marketCoverage',coalesce(history->'closingMarketCoveragePercent','0'::jsonb),'seasons',coalesce(history->'seasons','[]'::jsonb),
  'latestCompletedGameDate',history->'latestCompletedGameDate','hotTrends',trends,
  'hotProps',public.sports_edge_nfl_prop_board(12,10,'3Y',null,null,null),
  'playerProfiles',public.sports_edge_nfl_player_profiles(120,null,null),'weekly',weekly,
  'propAudit',prop_audit,'qualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),'checkedAt',now());
end $$;

grant execute on function public.sports_edge_nfl_prop_board(integer,integer,text,text,text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_player_prop_intelligence(text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_player_threshold_splits(text,text,numeric,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_prop_intelligence_audit() to service_role;
