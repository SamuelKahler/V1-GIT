-- Sports Edge NFL Player + Prop Intelligence V1
-- Adds canonical weekly player stats and Week 1 evidence hygiene.

alter table nfl.player_game_stats add column if not exists short_name text;
alter table nfl.player_game_stats add column if not exists headshot_url text;
alter table nfl.player_game_stats add column if not exists opponent_abbr text;
alter table nfl.player_game_stats add column if not exists position_group text;
alter table nfl.player_game_stats add column if not exists season integer;
alter table nfl.player_game_stats add column if not exists week integer;
alter table nfl.player_game_stats add column if not exists season_type text;
alter table nfl.player_game_stats add column if not exists receiving_air_yards integer;
alter table nfl.player_game_stats add column if not exists receiving_yac integer;
alter table nfl.player_game_stats add column if not exists target_share numeric;
alter table nfl.player_game_stats add column if not exists air_yards_share numeric;
alter table nfl.player_game_stats add column if not exists wopr numeric;
alter table nfl.player_game_stats add column if not exists fantasy_points_ppr numeric;
alter table nfl.player_game_stats add column if not exists updated_at timestamptz not null default now();
create index if not exists nfl_player_game_stats_season_idx on nfl.player_game_stats(season,week);
create index if not exists nfl_player_game_stats_team_pos_idx on nfl.player_game_stats(team_abbr,position);

create or replace function public.sports_edge_nfl_import_player_stats_batch(p_rows jsonb)
returns jsonb language plpgsql security definer set search_path=public,nfl as $$
declare r jsonb; v_game uuid; v_count integer:=0; v_missing integer:=0;
begin
  if jsonb_typeof(p_rows)<>'array' then raise exception 'p_rows must be a JSON array'; end if;
  for r in select value from jsonb_array_elements(p_rows) loop
    select game_id into v_game from nfl.games where external_game_id=r->>'externalGameId' limit 1;
    if v_game is null then v_missing:=v_missing+1; continue; end if;
    insert into nfl.player_game_stats(
      game_id,player_id,player_name,short_name,headshot_url,team_abbr,opponent_abbr,position,position_group,season,week,season_type,
      pass_attempts,completions,pass_yards,pass_tds,interceptions,rush_attempts,rush_yards,rush_tds,targets,receptions,receiving_yards,receiving_tds,
      receiving_air_yards,receiving_yac,target_share,air_yards_share,wopr,fantasy_points_ppr,source,source_payload,updated_at
    ) values (
      v_game,r->>'playerId',r->>'playerName',r->>'shortName',r->>'headshotUrl',r->>'teamAbbr',r->>'opponentAbbr',r->>'position',r->>'positionGroup',
      nullif(r->>'season','')::int,nullif(r->>'week','')::int,r->>'seasonType',
      nullif(r->>'passAttempts','')::int,nullif(r->>'completions','')::int,nullif(r->>'passYards','')::int,nullif(r->>'passTds','')::int,nullif(r->>'interceptions','')::int,
      nullif(r->>'rushAttempts','')::int,nullif(r->>'rushYards','')::int,nullif(r->>'rushTds','')::int,nullif(r->>'targets','')::int,nullif(r->>'receptions','')::int,
      nullif(r->>'receivingYards','')::int,nullif(r->>'receivingTds','')::int,nullif(r->>'receivingAirYards','')::int,nullif(r->>'receivingYac','')::int,
      nullif(r->>'targetShare','')::numeric,nullif(r->>'airYardsShare','')::numeric,nullif(r->>'wopr','')::numeric,nullif(r->>'fantasyPointsPpr','')::numeric,
      'NFLVERSE_PLAYER_STATS',coalesce(r->'sourcePayload','{}'::jsonb),now()
    ) on conflict(game_id,player_name,team_abbr) do update set
      player_id=excluded.player_id,short_name=excluded.short_name,headshot_url=excluded.headshot_url,opponent_abbr=excluded.opponent_abbr,
      position=excluded.position,position_group=excluded.position_group,season=excluded.season,week=excluded.week,season_type=excluded.season_type,
      pass_attempts=excluded.pass_attempts,completions=excluded.completions,pass_yards=excluded.pass_yards,pass_tds=excluded.pass_tds,interceptions=excluded.interceptions,
      rush_attempts=excluded.rush_attempts,rush_yards=excluded.rush_yards,rush_tds=excluded.rush_tds,targets=excluded.targets,receptions=excluded.receptions,
      receiving_yards=excluded.receiving_yards,receiving_tds=excluded.receiving_tds,receiving_air_yards=excluded.receiving_air_yards,receiving_yac=excluded.receiving_yac,
      target_share=excluded.target_share,air_yards_share=excluded.air_yards_share,wopr=excluded.wopr,fantasy_points_ppr=excluded.fantasy_points_ppr,
      source=excluded.source,source_payload=excluded.source_payload,updated_at=now();
    v_count:=v_count+1;
  end loop;
  return jsonb_build_object('imported',v_count,'missingGames',v_missing,'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_player_profiles(p_limit integer default 50,p_team text default null,p_position text default null)
returns jsonb language sql stable security definer set search_path=public,nfl as $$
with latest as (select max(season) s from nfl.player_game_stats where season_type='REG'), base as (
  select p.* from nfl.player_game_stats p,latest l where p.season=l.s and p.season_type='REG'
    and (p_team is null or p.team_abbr=upper(p_team)) and (p_position is null or p.position=upper(p_position))
), agg as (
  select player_id,max(player_name) player_name,max(headshot_url) headshot_url,max(team_abbr) team_abbr,max(position) position,max(season) season,
    count(*)::int games,
    round(avg(pass_yards)::numeric,1) avg_pass_yards,round(avg(pass_tds)::numeric,2) avg_pass_tds,
    round(avg(rush_attempts)::numeric,1) avg_rush_attempts,round(avg(rush_yards)::numeric,1) avg_rush_yards,round(avg(rush_tds)::numeric,2) avg_rush_tds,
    round(avg(targets)::numeric,1) avg_targets,round(avg(receptions)::numeric,1) avg_receptions,round(avg(receiving_yards)::numeric,1) avg_receiving_yards,
    round(avg(receiving_tds)::numeric,2) avg_receiving_tds,round(avg(target_share)::numeric,3) avg_target_share,
    sum(coalesce(pass_yards,0))::int pass_yards,sum(coalesce(rush_yards,0))::int rush_yards,sum(coalesce(receiving_yards,0))::int receiving_yards
  from base group by player_id
), ranked as (
  select a.*,case when position='QB' then coalesce(avg_pass_yards,0) when position='RB' then coalesce(avg_rush_yards,0)+coalesce(avg_receiving_yards,0) else coalesce(avg_receiving_yards,0) end impact
  from agg a where games>=3
  order by impact desc,games desc limit greatest(1,least(coalesce(p_limit,50),250))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',player_id,'playerName',player_name,'headshotUrl',headshot_url,'team',team_abbr,'position',position,'season',season,'games',games,
  'avgPassYards',avg_pass_yards,'avgPassTds',avg_pass_tds,'avgRushAttempts',avg_rush_attempts,'avgRushYards',avg_rush_yards,'avgRushTds',avg_rush_tds,
  'avgTargets',avg_targets,'avgReceptions',avg_receptions,'avgReceivingYards',avg_receiving_yards,'avgReceivingTds',avg_receiving_tds,'avgTargetShare',avg_target_share
) order by impact desc,games desc),'[]'::jsonb) from ranked;
$$;

create or replace function public.sports_edge_nfl_hot_player_profiles(p_limit integer default 20)
returns jsonb language sql stable security definer set search_path=public,nfl as $$
with tracked as (
  select lower(player_name) k,max(player_name) player_name,max(team_abbr) team_abbr,market_style,
    count(*) filter(where result in('HIT','MISS'))::int games,count(*) filter(where result='HIT')::int hits,count(*) filter(where result='MISS')::int misses,
    round(100.0*count(*) filter(where result='HIT')/nullif(count(*) filter(where result in('HIT','MISS')),0),1) hit_rate
  from nfl.reference_prop_observations group by lower(player_name),market_style having count(*) filter(where result in('HIT','MISS'))>=4
), latest as (select max(season) s from nfl.player_game_stats where season_type='REG'), actual as (
  select lower(player_name) k,max(player_id) player_id,max(player_name) player_name,max(headshot_url) headshot_url,max(team_abbr) team_abbr,max(position) position,
    count(*)::int stat_games,round(avg(pass_yards)::numeric,1) avg_pass_yards,round(avg(rush_yards)::numeric,1) avg_rush_yards,
    round(avg(targets)::numeric,1) avg_targets,round(avg(receptions)::numeric,1) avg_receptions,round(avg(receiving_yards)::numeric,1) avg_receiving_yards,
    round(avg(target_share)::numeric,3) avg_target_share
  from nfl.player_game_stats p,latest l where p.season=l.s and p.season_type='REG' group by lower(player_name)
), rows as (
  select t.*,a.player_id,a.headshot_url,coalesce(a.team_abbr,t.team_abbr) current_team,a.position,a.stat_games,a.avg_pass_yards,a.avg_rush_yards,a.avg_targets,a.avg_receptions,a.avg_receiving_yards,a.avg_target_share,
    case when t.games>=10 then 'STRONG SAMPLE' when t.games>=6 then 'QUALIFIED SAMPLE' else 'SMALL SAMPLE' end sample_label,
    (greatest(t.hit_rate-50,0)*1.5 + least(t.games,20)*2)::numeric strength
  from tracked t left join actual a on a.k=t.k order by strength desc,t.hit_rate desc,t.games desc limit greatest(1,least(coalesce(p_limit,20),100))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',player_id,'playerName',player_name,'headshotUrl',headshot_url,'team',current_team,'position',position,'market',market_style,
  'hits',hits,'misses',misses,'games',games,'hitRate',hit_rate,'sampleLabel',sample_label,'statGames',stat_games,
  'avgPassYards',avg_pass_yards,'avgRushYards',avg_rush_yards,'avgTargets',avg_targets,'avgReceptions',avg_receptions,'avgReceivingYards',avg_receiving_yards,'avgTargetShare',avg_target_share
) order by strength desc,hit_rate desc,games desc),'[]'::jsonb) from rows;
$$;

create or replace function public.sports_edge_nfl_player_game_log(p_player_id text default null,p_player_name text default null,p_limit integer default 40)
returns jsonb language sql stable security definer set search_path=public,nfl as $$
with rows as (
 select p.player_id,p.player_name,p.headshot_url,p.team_abbr,p.opponent_abbr,p.position,p.season,p.week,g.game_date,
   p.pass_attempts,p.completions,p.pass_yards,p.pass_tds,p.interceptions,p.rush_attempts,p.rush_yards,p.rush_tds,p.targets,p.receptions,p.receiving_yards,p.receiving_tds,p.target_share
 from nfl.player_game_stats p join nfl.games g on g.game_id=p.game_id
 where (p_player_id is not null and p.player_id=p_player_id) or (p_player_id is null and p_player_name is not null and lower(p.player_name)=lower(p_player_name))
 order by p.season desc,p.week desc limit greatest(1,least(coalesce(p_limit,40),100))
)
select coalesce(jsonb_agg(to_jsonb(rows) order by season desc,week desc),'[]'::jsonb) from rows;
$$;

-- Week 1 hygiene: single-previous-game and rest signals do not carry across seasons.
create or replace function public.sports_edge_nfl_weekly_intelligence()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare v_season integer; v_week integer; v_games jsonb;
begin
  select season,week into v_season,v_week from nfl.games where status<>'FINAL' and game_date>=current_date order by game_date,season,week limit 1;
  if v_season is null then select season,week into v_season,v_week from nfl.games order by season desc,week desc nulls last limit 1; end if;
  with mined as (
    select * from jsonb_to_recordset(public.sports_edge_nfl_mined_trends(500,6,null,null)) as x(
      team text, market text, environment text, "startYear" integer, games integer, wins integer, losses integer,"hitRate" numeric,seasons integer,"latestSeason" integer,"firstGameDate" date,"lastGameDate" date,"strengthScore" numeric,"sampleLabel" text,source text)
  ), match_rows as (
    select g.game_id,g.external_game_id,g.season,g.week,g.game_date,g.game_time,g.weekday,g.away_team,g.home_team,g.venue,g.status,
      g.away_moneyline,g.home_moneyline,g.spread_line,g.total_line,g.away_qb_name,g.home_qb_name,f.team_abbr,f.opponent_abbr,f.environment_tags,
      t.market,t.environment,t."hitRate",t.games,t.wins,t.losses,t."strengthScore",t."sampleLabel",t."startYear"
    from nfl.games g join nfl.team_game_facts f on f.game_id=g.game_id
    left join mined t on t.team=f.team_abbr and t.environment=any(f.environment_tags)
      and not (v_week=1 and t.environment=any(array['AFTER A WIN','AFTER A LOSS','AFTER A COVER','AFTER A NO COVER','AFTER AN OVER','AFTER AN UNDER','REST ADVANTAGE','REST DISADVANTAGE']))
    where g.season=v_season and g.week=v_week
  ), games_grouped as (
    select game_id,external_game_id,season,week,game_date,game_time,weekday,away_team,home_team,venue,status,away_moneyline,home_moneyline,spread_line,total_line,away_qb_name,home_qb_name,
      count(*) filter(where market is not null)::int evidence_count,
      coalesce(jsonb_agg(jsonb_build_object('team',team_abbr,'market',market,'environment',environment,'hitRate',"hitRate",'games',games,'wins',wins,'losses',losses,'strengthScore',"strengthScore",'sampleLabel',"sampleLabel",'startYear',"startYear") order by "strengthScore" desc nulls last,"hitRate" desc nulls last) filter(where market is not null),'[]'::jsonb) evidence
    from match_rows group by game_id,external_game_id,season,week,game_date,game_time,weekday,away_team,home_team,venue,status,away_moneyline,home_moneyline,spread_line,total_line,away_qb_name,home_qb_name
  )
  select coalesce(jsonb_agg(jsonb_build_object('gameId',game_id,'externalGameId',external_game_id,'season',season,'week',week,'date',game_date,'time',game_time,'weekday',weekday,'awayTeam',away_team,'homeTeam',home_team,'venue',venue,'status',status,'awayMoneyline',away_moneyline,'homeMoneyline',home_moneyline,'spreadLine',spread_line,'totalLine',total_line,'awayQb',away_qb_name,'homeQb',home_qb_name,'evidenceCount',evidence_count,'evidence',evidence,'weekOnePreviousGameSignalsExcluded',(v_week=1)) order by game_date,game_time,away_team),'[]'::jsonb) into v_games from games_grouped;
  return jsonb_build_object('season',v_season,'week',v_week,'games',coalesce(v_games,'[]'::jsonb),'weekOnePreviousGameSignalsExcluded',(v_week=1),'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_player_intelligence_audit()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare v_rows integer; v_players integer; v_games integer; v_seasons jsonb; v_weekly jsonb;
begin
 select count(*),count(distinct player_id),count(distinct game_id) into v_rows,v_players,v_games from nfl.player_game_stats;
 select coalesce(jsonb_agg(s order by s),'[]'::jsonb) into v_seasons from (select distinct season s from nfl.player_game_stats where season is not null) q;
 v_weekly:=public.sports_edge_nfl_weekly_intelligence();
 return jsonb_build_object('release','NFL_PLAYER_PROP_INTELLIGENCE_V1','passed',(v_rows>0 and v_players>100),'playerGameRows',v_rows,'players',v_players,'gamesWithPlayerStats',v_games,'seasons',v_seasons,'week',v_weekly->'week','weekOnePreviousGameSignalsExcluded',v_weekly->'weekOnePreviousGameSignalsExcluded','checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_consumer_dashboard()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare history jsonb; weekly jsonb; trends jsonb; player_audit jsonb;
begin
 history:=public.sports_edge_nfl_historical_ingestion_audit(); weekly:=public.sports_edge_nfl_weekly_intelligence(); trends:=public.sports_edge_nfl_mined_trends(12,6,null,null); player_audit:=public.sports_edge_nfl_player_intelligence_audit();
 return jsonb_build_object('release','NFL_PLAYER_PROP_INTELLIGENCE_V1','canonical',jsonb_build_object('teams',(select count(*) from nfl.teams where active),'games',(select count(*) from nfl.games),'finalGames',(select count(*) from nfl.games where status='FINAL'),'teamGameFacts',(select count(*) from nfl.team_game_facts),'marketSnapshots',(select count(*) from nfl.market_history),'playerGameRows',coalesce((player_audit->>'playerGameRows')::int,0),'players',coalesce((player_audit->>'players')::int,0)),
  'marketCoverage',coalesce(history->'closingMarketCoveragePercent','0'::jsonb),'seasons',coalesce(history->'seasons','[]'::jsonb),'latestCompletedGameDate',history->'latestCompletedGameDate','hotTrends',trends,
  'hotProps',public.sports_edge_nfl_hot_player_profiles(10),'playerProfiles',public.sports_edge_nfl_player_profiles(24,null,null),'weekly',weekly,'qualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),'checkedAt',now());
end $$;

grant execute on function public.sports_edge_nfl_import_player_stats_batch(jsonb) to service_role;
grant execute on function public.sports_edge_nfl_player_profiles(integer,text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_hot_player_profiles(integer) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_player_game_log(text,text,integer) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_player_intelligence_audit() to service_role;
