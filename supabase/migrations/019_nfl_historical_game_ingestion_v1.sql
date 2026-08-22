-- Sports Edge NFL Historical Game Ingestion V1
-- Adds canonical NFL schedule/result/market ingestion on top of migration 018.
-- Does not modify MLB tables.

alter table nfl.games add column if not exists weekday text;
alter table nfl.games add column if not exists game_time text;
alter table nfl.games add column if not exists location text;
alter table nfl.games add column if not exists stadium_id text;
alter table nfl.games add column if not exists espn_id text;
alter table nfl.games add column if not exists gsis_id text;
alter table nfl.games add column if not exists away_rest integer;
alter table nfl.games add column if not exists home_rest integer;
alter table nfl.games add column if not exists away_moneyline integer;
alter table nfl.games add column if not exists home_moneyline integer;
alter table nfl.games add column if not exists spread_line numeric;
alter table nfl.games add column if not exists away_spread_odds integer;
alter table nfl.games add column if not exists home_spread_odds integer;
alter table nfl.games add column if not exists total_line numeric;
alter table nfl.games add column if not exists under_odds integer;
alter table nfl.games add column if not exists over_odds integer;
alter table nfl.games add column if not exists division_game boolean;
alter table nfl.games add column if not exists primetime boolean;
alter table nfl.games add column if not exists roof text;
alter table nfl.games add column if not exists surface text;
alter table nfl.games add column if not exists temperature numeric;
alter table nfl.games add column if not exists wind numeric;
alter table nfl.games add column if not exists away_qb_name text;
alter table nfl.games add column if not exists home_qb_name text;
alter table nfl.games add column if not exists away_coach text;
alter table nfl.games add column if not exists home_coach text;
alter table nfl.games add column if not exists referee text;

alter table nfl.market_history add column if not exists source_key text;
create unique index if not exists nfl_market_history_source_key_uidx
  on nfl.market_history(source_key)
  where source_key is not null;

create or replace function public.sports_edge_nfl_import_schedule_batch(p_games jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public,nfl
as $$
declare
  g jsonb;
  v_game_id uuid;
  imported_count integer := 0;
  closing_at timestamptz;
begin
  if p_games is null or jsonb_typeof(p_games) <> 'array' then
    raise exception 'p_games must be a JSON array';
  end if;

  for g in select value from jsonb_array_elements(p_games)
  loop
    insert into nfl.games(
      external_game_id, season, week, season_type, game_date,
      away_team, home_team, venue, status,
      away_final, home_final, source, source_payload,
      weekday, game_time, location, stadium_id, espn_id, gsis_id,
      away_rest, home_rest, away_moneyline, home_moneyline,
      spread_line, away_spread_odds, home_spread_odds,
      total_line, under_odds, over_odds, division_game, primetime,
      roof, surface, temperature, wind,
      away_qb_name, home_qb_name, away_coach, home_coach, referee,
      updated_at
    ) values (
      g->>'externalGameId', (g->>'season')::int, nullif(g->>'week','')::int,
      coalesce(nullif(g->>'seasonType',''),'REG'), nullif(g->>'gameDate','')::date,
      g->>'awayTeam', g->>'homeTeam', nullif(g->>'venue',''), coalesce(nullif(g->>'status',''),'SCHEDULED'),
      nullif(g->>'awayFinal','')::int, nullif(g->>'homeFinal','')::int,
      'NFLVERSE', coalesce(g->'sourcePayload','{}'::jsonb),
      nullif(g->>'weekday',''), nullif(g->>'gameTime',''), nullif(g->>'location',''),
      nullif(g->>'stadiumId',''), nullif(g->>'espnId',''), nullif(g->>'gsisId',''),
      nullif(g->>'awayRest','')::int, nullif(g->>'homeRest','')::int,
      nullif(g->>'awayMoneyline','')::int, nullif(g->>'homeMoneyline','')::int,
      nullif(g->>'spreadLine','')::numeric, nullif(g->>'awaySpreadOdds','')::int, nullif(g->>'homeSpreadOdds','')::int,
      nullif(g->>'totalLine','')::numeric, nullif(g->>'underOdds','')::int, nullif(g->>'overOdds','')::int,
      coalesce((g->>'divisionGame')::boolean,false), coalesce((g->>'primetime')::boolean,false),
      nullif(g->>'roof',''), nullif(g->>'surface',''), nullif(g->>'temperature','')::numeric, nullif(g->>'wind','')::numeric,
      nullif(g->>'awayQbName',''), nullif(g->>'homeQbName',''), nullif(g->>'awayCoach',''), nullif(g->>'homeCoach',''), nullif(g->>'referee',''),
      now()
    )
    on conflict (external_game_id) do update set
      season = excluded.season,
      week = excluded.week,
      season_type = excluded.season_type,
      game_date = excluded.game_date,
      away_team = excluded.away_team,
      home_team = excluded.home_team,
      venue = excluded.venue,
      status = excluded.status,
      away_final = excluded.away_final,
      home_final = excluded.home_final,
      source = excluded.source,
      source_payload = excluded.source_payload,
      weekday = excluded.weekday,
      game_time = excluded.game_time,
      location = excluded.location,
      stadium_id = excluded.stadium_id,
      espn_id = excluded.espn_id,
      gsis_id = excluded.gsis_id,
      away_rest = excluded.away_rest,
      home_rest = excluded.home_rest,
      away_moneyline = excluded.away_moneyline,
      home_moneyline = excluded.home_moneyline,
      spread_line = excluded.spread_line,
      away_spread_odds = excluded.away_spread_odds,
      home_spread_odds = excluded.home_spread_odds,
      total_line = excluded.total_line,
      under_odds = excluded.under_odds,
      over_odds = excluded.over_odds,
      division_game = excluded.division_game,
      primetime = excluded.primetime,
      roof = excluded.roof,
      surface = excluded.surface,
      temperature = excluded.temperature,
      wind = excluded.wind,
      away_qb_name = excluded.away_qb_name,
      home_qb_name = excluded.home_qb_name,
      away_coach = excluded.away_coach,
      home_coach = excluded.home_coach,
      referee = excluded.referee,
      updated_at = now()
    returning game_id into v_game_id;

    closing_at := coalesce((nullif(g->>'gameDate','')::date)::timestamptz, now());

    if nullif(g->>'awayMoneyline','') is not null then
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','MONEYLINE',g->>'awayTeam',(g->>'awayMoneyline')::int,true,'NFLVERSE',(g->>'externalGameId')||':ML:'||(g->>'awayTeam'))
      on conflict (source_key) where source_key is not null do update set american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
    end if;
    if nullif(g->>'homeMoneyline','') is not null then
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','MONEYLINE',g->>'homeTeam',(g->>'homeMoneyline')::int,true,'NFLVERSE',(g->>'externalGameId')||':ML:'||(g->>'homeTeam'))
      on conflict (source_key) where source_key is not null do update set american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
    end if;
    if nullif(g->>'spreadLine','') is not null then
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,line,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','SPREAD',g->>'homeTeam',-1*(g->>'spreadLine')::numeric,nullif(g->>'homeSpreadOdds','')::int,true,'NFLVERSE',(g->>'externalGameId')||':SPREAD:'||(g->>'homeTeam'))
      on conflict (source_key) where source_key is not null do update set line=excluded.line,american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,line,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','SPREAD',g->>'awayTeam',(g->>'spreadLine')::numeric,nullif(g->>'awaySpreadOdds','')::int,true,'NFLVERSE',(g->>'externalGameId')||':SPREAD:'||(g->>'awayTeam'))
      on conflict (source_key) where source_key is not null do update set line=excluded.line,american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
    end if;
    if nullif(g->>'totalLine','') is not null then
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,line,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','TOTAL','OVER',(g->>'totalLine')::numeric,nullif(g->>'overOdds','')::int,true,'NFLVERSE',(g->>'externalGameId')||':TOTAL:OVER')
      on conflict (source_key) where source_key is not null do update set line=excluded.line,american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
      insert into nfl.market_history(game_id,captured_at,sportsbook,market_type,side,line,american_odds,is_closing,source,source_key)
      values(v_game_id,closing_at,'NFLVERSE','TOTAL','UNDER',(g->>'totalLine')::numeric,nullif(g->>'underOdds','')::int,true,'NFLVERSE',(g->>'externalGameId')||':TOTAL:UNDER')
      on conflict (source_key) where source_key is not null do update set line=excluded.line,american_odds=excluded.american_odds,captured_at=excluded.captured_at,is_closing=true;
    end if;

    imported_count := imported_count + 1;
  end loop;

  return jsonb_build_object('imported',imported_count,'checkedAt',now());
end;
$$;

create or replace function public.sports_edge_nfl_rebuild_team_game_facts()
returns jsonb
language plpgsql
security definer
set search_path = public,nfl
as $$
declare
  fact_count integer;
begin
  with perspective as (
    select
      g.game_id,g.season,g.week,g.game_date,g.away_team as team_abbr,g.home_team as opponent_abbr,false as is_home,
      g.away_rest as rest_days,g.home_rest as opponent_rest_days,
      g.away_moneyline as moneyline,g.spread_line as team_spread,g.total_line,
      coalesce(g.division_game,false) as division_game,
      (ta.conference=to2.conference) as conference_game,
      coalesce(g.primetime,false) as primetime,
      false as international_game,
      case when g.away_final is null or g.home_final is null then null when g.away_final>g.home_final then 'WIN' when g.away_final<g.home_final then 'LOSS' else 'TIE' end as moneyline_result,
      case when g.away_final is null or g.home_final is null or g.spread_line is null then null
           when (g.away_final-g.home_final+g.spread_line)>0 then 'COVER'
           when (g.away_final-g.home_final+g.spread_line)<0 then 'NO COVER' else 'PUSH' end as ats_result,
      case when g.away_final is null or g.home_final is null or g.total_line is null then null
           when (g.away_final+g.home_final)>g.total_line then 'OVER'
           when (g.away_final+g.home_final)<g.total_line then 'UNDER' else 'PUSH' end as total_result
    from nfl.games g join nfl.teams ta on ta.abbreviation=g.away_team join nfl.teams to2 on to2.abbreviation=g.home_team
    union all
    select
      g.game_id,g.season,g.week,g.game_date,g.home_team,g.away_team,true,
      g.home_rest,g.away_rest,g.home_moneyline,-1*g.spread_line,g.total_line,
      coalesce(g.division_game,false),(th.conference=to2.conference),coalesce(g.primetime,false),
      false,
      case when g.away_final is null or g.home_final is null then null when g.home_final>g.away_final then 'WIN' when g.home_final<g.away_final then 'LOSS' else 'TIE' end,
      case when g.away_final is null or g.home_final is null or g.spread_line is null then null
           when (g.home_final-g.away_final-g.spread_line)>0 then 'COVER'
           when (g.home_final-g.away_final-g.spread_line)<0 then 'NO COVER' else 'PUSH' end,
      case when g.away_final is null or g.home_final is null or g.total_line is null then null
           when (g.away_final+g.home_final)>g.total_line then 'OVER'
           when (g.away_final+g.home_final)<g.total_line then 'UNDER' else 'PUSH' end
    from nfl.games g join nfl.teams th on th.abbreviation=g.home_team join nfl.teams to2 on to2.abbreviation=g.away_team
  ), sequenced as (
    select p.*,
      lag(moneyline_result) over(partition by team_abbr order by game_date nulls last, season, week, game_id) as previous_result,
      lag(ats_result) over(partition by team_abbr order by game_date nulls last, season, week, game_id) as previous_ats_result,
      lag(total_result) over(partition by team_abbr order by game_date nulls last, season, week, game_id) as previous_total_result
    from perspective p
  ), shaped as (
    select s.*,
      (team_spread < 0) as is_favorite,
      (team_spread > 0) as is_underdog,
      (rest_days is not null and opponent_rest_days is not null and rest_days>opponent_rest_days) as rest_advantage,
      (rest_days is not null and opponent_rest_days is not null and rest_days<opponent_rest_days) as rest_disadvantage,
      array_remove(array[
        case when is_home then 'HOME' else 'AWAY' end,
        case when team_spread<0 and is_home then 'HOME FAVORITE' when team_spread<0 then 'AWAY FAVORITE' end,
        case when team_spread>0 and is_home then 'HOME UNDERDOG' when team_spread>0 then 'AWAY UNDERDOG' end,
        case when division_game then 'DIVISION' end,
        case when conference_game then 'CONFERENCE' end,
        case when primetime then 'PRIMETIME' end,
        case when rest_days is not null and opponent_rest_days is not null and rest_days>opponent_rest_days then 'REST ADVANTAGE' end,
        case when rest_days is not null and opponent_rest_days is not null and rest_days<opponent_rest_days then 'REST DISADVANTAGE' end,
        case when previous_result='WIN' then 'AFTER A WIN' when previous_result='LOSS' then 'AFTER A LOSS' end,
        case when previous_ats_result='COVER' then 'AFTER A COVER' when previous_ats_result='NO COVER' then 'AFTER A NO COVER' end,
        case when previous_total_result='OVER' then 'AFTER AN OVER' when previous_total_result='UNDER' then 'AFTER AN UNDER' end
      ],null)::text[] as environment_tags
    from sequenced s
  )
  insert into nfl.team_game_facts(
    game_id,team_abbr,opponent_abbr,is_home,is_favorite,is_underdog,division_game,conference_game,primetime,international_game,
    rest_days,opponent_rest_days,rest_advantage,rest_disadvantage,previous_result,previous_ats_result,previous_total_result,
    closing_moneyline,closing_spread,closing_total,moneyline_result,ats_result,total_result,environment_tags,data_complete,calculated_at
  )
  select game_id,team_abbr,opponent_abbr,is_home,is_favorite,is_underdog,division_game,conference_game,primetime,international_game,
    rest_days,opponent_rest_days,rest_advantage,rest_disadvantage,previous_result,previous_ats_result,previous_total_result,
    moneyline,team_spread,total_line,moneyline_result,ats_result,total_result,environment_tags,
    (moneyline_result is not null and ats_result is not null and total_result is not null),now()
  from shaped
  on conflict(game_id,team_abbr) do update set
    opponent_abbr=excluded.opponent_abbr,is_home=excluded.is_home,is_favorite=excluded.is_favorite,is_underdog=excluded.is_underdog,
    division_game=excluded.division_game,conference_game=excluded.conference_game,primetime=excluded.primetime,international_game=excluded.international_game,
    rest_days=excluded.rest_days,opponent_rest_days=excluded.opponent_rest_days,rest_advantage=excluded.rest_advantage,rest_disadvantage=excluded.rest_disadvantage,
    previous_result=excluded.previous_result,previous_ats_result=excluded.previous_ats_result,previous_total_result=excluded.previous_total_result,
    closing_moneyline=excluded.closing_moneyline,closing_spread=excluded.closing_spread,closing_total=excluded.closing_total,
    moneyline_result=excluded.moneyline_result,ats_result=excluded.ats_result,total_result=excluded.total_result,
    environment_tags=excluded.environment_tags,data_complete=excluded.data_complete,calculated_at=now();

  select count(*) into fact_count from nfl.team_game_facts;
  return jsonb_build_object('teamGameFacts',fact_count,'checkedAt',now());
end;
$$;

create or replace function public.sports_edge_nfl_historical_ingestion_audit()
returns jsonb
language plpgsql
stable
security definer
set search_path = public,nfl
as $$
declare
  game_count integer;
  final_count integer;
  fact_count integer;
  duplicate_ids integer;
  final_missing_scores integer;
  line_coverage numeric;
begin
  select count(*) into game_count from nfl.games;
  select count(*) into final_count from nfl.games where status='FINAL';
  select count(*) into fact_count from nfl.team_game_facts;
  select count(*) into duplicate_ids from (select external_game_id from nfl.games where external_game_id is not null group by external_game_id having count(*)>1) x;
  select count(*) into final_missing_scores from nfl.games where status='FINAL' and (away_final is null or home_final is null);
  select round(100.0*count(*) filter(where spread_line is not null and total_line is not null and away_moneyline is not null and home_moneyline is not null)/nullif(count(*),0),1)
    into line_coverage from nfl.games where status='FINAL';
  return jsonb_build_object(
    'release','NFL_HISTORICAL_GAME_INGESTION_V1',
    'passed',(game_count>0 and fact_count=game_count*2 and duplicate_ids=0 and final_missing_scores=0),
    'games',game_count,
    'finalGames',final_count,
    'teamGameFacts',fact_count,
    'marketSnapshots',(select count(*) from nfl.market_history),
    'duplicateExternalGameIds',duplicate_ids,
    'finalGamesMissingScores',final_missing_scores,
    'closingMarketCoveragePercent',coalesce(line_coverage,0),
    'seasons',(select coalesce(jsonb_agg(x.season order by x.season),'[]'::jsonb) from (select distinct season from nfl.games) x),
    'seasonCounts',(select coalesce(jsonb_object_agg(season,cnt),'{}'::jsonb) from (select season,count(*) cnt from nfl.games group by season order by season) s),
    'latestCompletedGameDate',(select max(game_date) from nfl.games where status='FINAL'),
    'checkedAt',now()
  );
end;
$$;

create or replace function public.sports_edge_nfl_reference_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public,nfl as $$
declare payload jsonb;
begin
  select jsonb_build_object(
    'release','NFL_HISTORICAL_GAME_INGESTION_V1',
    'canonical',jsonb_build_object(
      'teams',(select count(*) from nfl.teams where active),
      'games',(select count(*) from nfl.games),
      'finalGames',(select count(*) from nfl.games where status='FINAL'),
      'teamGameFacts',(select count(*) from nfl.team_game_facts),
      'playerGameStats',(select count(*) from nfl.player_game_stats),
      'marketSnapshots',(select count(*) from nfl.market_history),
      'continuityEras',(select count(*) from nfl.continuity_eras)
    ),
    'reference',jsonb_build_object(
      'winTrends',(select count(*) from nfl.reference_win_trends),
      'systemRows',(select count(*) from nfl.reference_system_rows),
      'propObservations',(select count(*) from nfl.reference_prop_observations)
    ),
    'hotTrends',public.sports_edge_nfl_reference_trends(8),
    'hotProps',public.sports_edge_nfl_prop_profiles(8),
    'qualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),
    'historicalAudit',public.sports_edge_nfl_historical_ingestion_audit(),
    'checkedAt',now()
  ) into payload;
  return payload;
end;
$$;

grant execute on function public.sports_edge_nfl_import_schedule_batch(jsonb) to service_role;
grant execute on function public.sports_edge_nfl_rebuild_team_game_facts() to service_role;
grant execute on function public.sports_edge_nfl_historical_ingestion_audit() to service_role;
