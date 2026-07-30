begin;

create schema if not exists mlb;
create schema if not exists ops;
create schema if not exists trends;
create schema if not exists performance;

create table if not exists mlb.teams (
  team_id integer primary key,
  abbreviation text,
  name text not null,
  league_name text,
  division_name text,
  first_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.venues (
  venue_id integer primary key,
  name text not null,
  city text,
  state text,
  country text,
  time_zone text,
  first_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.pitchers (
  pitcher_id integer primary key,
  full_name text not null,
  pitch_hand_code text check (pitch_hand_code in ('L','R','S') or pitch_hand_code is null),
  pitch_hand_description text,
  first_seen_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.games (
  game_pk bigint primary key,
  official_date date not null,
  season integer not null,
  game_date timestamptz,
  status_abstract text,
  status_detailed text,
  status_code text,
  is_final boolean not null default false,
  game_type text,
  away_team_id integer not null references mlb.teams(team_id),
  home_team_id integer not null references mlb.teams(team_id),
  venue_id integer references mlb.venues(venue_id),
  day_night text,
  scheduled_innings integer,
  double_header text,
  game_number integer,
  series_description text,
  series_game_number integer,
  games_in_series integer,
  away_final_runs integer,
  home_final_runs integer,
  away_f5_runs integer,
  home_f5_runs integer,
  f5_available boolean not null default false,
  weather_condition text,
  temperature_f numeric,
  wind text,
  raw_schedule jsonb,
  raw_feed jsonb,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (away_team_id <> home_team_id),
  check (away_final_runs is null or away_final_runs >= 0),
  check (home_final_runs is null or home_final_runs >= 0),
  check (away_f5_runs is null or away_f5_runs >= 0),
  check (home_f5_runs is null or home_f5_runs >= 0)
);

create table if not exists mlb.game_innings (
  game_pk bigint not null references mlb.games(game_pk) on delete cascade,
  inning_number integer not null check (inning_number > 0),
  ordinal text,
  away_runs integer,
  home_runs integer,
  primary key (game_pk, inning_number)
);

create table if not exists mlb.game_pitchers (
  game_pk bigint not null references mlb.games(game_pk) on delete cascade,
  team_side text not null check (team_side in ('away','home')),
  pitcher_id integer not null references mlb.pitchers(pitcher_id),
  role text not null check (role in ('probable_starter','confirmed_starter')),
  source text not null,
  primary key (game_pk, team_side, role)
);

create table if not exists ops.mlb_import_runs (
  import_run_id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  start_date date not null,
  end_date date not null,
  dry_run boolean not null default false,
  status text not null default 'RUNNING' check (status in ('RUNNING','SUCCESS','PARTIAL','FAILED')),
  discovered_games integer not null default 0,
  inserted_games integer not null default 0,
  updated_games integer not null default 0,
  failed_games integer not null default 0,
  message text,
  audit jsonb not null default '{}'::jsonb
);

create table if not exists ops.mlb_import_errors (
  import_error_id bigserial primary key,
  import_run_id uuid references ops.mlb_import_runs(import_run_id) on delete cascade,
  game_pk bigint,
  stage text not null,
  error_message text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mlb_games_official_date_idx on mlb.games(official_date);
create index if not exists mlb_games_season_idx on mlb.games(season);
create index if not exists mlb_games_away_team_idx on mlb.games(away_team_id, official_date);
create index if not exists mlb_games_home_team_idx on mlb.games(home_team_id, official_date);
create index if not exists mlb_games_final_idx on mlb.games(is_final, official_date);
create index if not exists mlb_game_pitchers_pitcher_idx on mlb.game_pitchers(pitcher_id);
create index if not exists ops_mlb_import_runs_started_idx on ops.mlb_import_runs(started_at desc);

create or replace function public.sports_edge_mlb_start_import(
  p_start_date date,
  p_end_date date,
  p_dry_run boolean default false
) returns uuid
language plpgsql security definer set search_path = public, ops
as $$
declare v_id uuid;
begin
  insert into ops.mlb_import_runs(start_date,end_date,dry_run)
  values (p_start_date,p_end_date,p_dry_run)
  returning import_run_id into v_id;
  return v_id;
end;
$$;

create or replace function public.sports_edge_mlb_upsert_game(p_payload jsonb)
returns text
language plpgsql security definer set search_path = public, mlb
as $$
declare
  v_game_pk bigint := (p_payload->>'gamePk')::bigint;
  v_existed boolean;
begin
  select exists(select 1 from mlb.games where game_pk=v_game_pk) into v_existed;

  insert into mlb.teams(team_id,abbreviation,name,league_name,division_name,updated_at)
  values
    ((p_payload#>>'{awayTeam,id}')::integer,p_payload#>>'{awayTeam,abbreviation}',p_payload#>>'{awayTeam,name}',p_payload#>>'{awayTeam,leagueName}',p_payload#>>'{awayTeam,divisionName}',now()),
    ((p_payload#>>'{homeTeam,id}')::integer,p_payload#>>'{homeTeam,abbreviation}',p_payload#>>'{homeTeam,name}',p_payload#>>'{homeTeam,leagueName}',p_payload#>>'{homeTeam,divisionName}',now())
  on conflict(team_id) do update set abbreviation=excluded.abbreviation,name=excluded.name,
    league_name=coalesce(excluded.league_name,mlb.teams.league_name),
    division_name=coalesce(excluded.division_name,mlb.teams.division_name),updated_at=now();

  if nullif(p_payload#>>'{venue,id}','') is not null then
    insert into mlb.venues(venue_id,name,city,state,country,time_zone,updated_at)
    values ((p_payload#>>'{venue,id}')::integer,coalesce(p_payload#>>'{venue,name}','Unknown'),p_payload#>>'{venue,city}',p_payload#>>'{venue,state}',p_payload#>>'{venue,country}',p_payload#>>'{venue,timeZone}',now())
    on conflict(venue_id) do update set name=excluded.name,city=coalesce(excluded.city,mlb.venues.city),state=coalesce(excluded.state,mlb.venues.state),country=coalesce(excluded.country,mlb.venues.country),time_zone=coalesce(excluded.time_zone,mlb.venues.time_zone),updated_at=now();
  end if;

  insert into mlb.games(
    game_pk,official_date,season,game_date,status_abstract,status_detailed,status_code,is_final,game_type,
    away_team_id,home_team_id,venue_id,day_night,scheduled_innings,double_header,game_number,
    series_description,series_game_number,games_in_series,away_final_runs,home_final_runs,
    away_f5_runs,home_f5_runs,f5_available,weather_condition,temperature_f,wind,
    raw_schedule,raw_feed,source_updated_at,updated_at
  ) values (
    v_game_pk,(p_payload->>'officialDate')::date,(p_payload->>'season')::integer,nullif(p_payload->>'gameDate','')::timestamptz,
    p_payload#>>'{status,abstract}',p_payload#>>'{status,detailed}',p_payload#>>'{status,code}',coalesce((p_payload#>>'{status,isFinal}')::boolean,false),p_payload->>'gameType',
    (p_payload#>>'{awayTeam,id}')::integer,(p_payload#>>'{homeTeam,id}')::integer,nullif(p_payload#>>'{venue,id}','')::integer,
    p_payload->>'dayNight',nullif(p_payload->>'scheduledInnings','')::integer,p_payload->>'doubleHeader',nullif(p_payload->>'gameNumber','')::integer,
    p_payload->>'seriesDescription',nullif(p_payload->>'seriesGameNumber','')::integer,nullif(p_payload->>'gamesInSeries','')::integer,
    nullif(p_payload#>>'{finalScore,away}','')::integer,nullif(p_payload#>>'{finalScore,home}','')::integer,
    nullif(p_payload#>>'{firstFive,away}','')::integer,nullif(p_payload#>>'{firstFive,home}','')::integer,coalesce((p_payload#>>'{firstFive,available}')::boolean,false),
    p_payload#>>'{weather,condition}',nullif(p_payload#>>'{weather,tempF}','')::numeric,p_payload#>>'{weather,wind}',
    p_payload->'rawSchedule',p_payload->'rawFeed',nullif(p_payload->>'sourceUpdatedAt','')::timestamptz,now()
  ) on conflict(game_pk) do update set
    official_date=excluded.official_date,season=excluded.season,game_date=excluded.game_date,
    status_abstract=excluded.status_abstract,status_detailed=excluded.status_detailed,status_code=excluded.status_code,is_final=excluded.is_final,
    game_type=excluded.game_type,away_team_id=excluded.away_team_id,home_team_id=excluded.home_team_id,venue_id=excluded.venue_id,
    day_night=excluded.day_night,scheduled_innings=excluded.scheduled_innings,double_header=excluded.double_header,game_number=excluded.game_number,
    series_description=excluded.series_description,series_game_number=excluded.series_game_number,games_in_series=excluded.games_in_series,
    away_final_runs=excluded.away_final_runs,home_final_runs=excluded.home_final_runs,away_f5_runs=excluded.away_f5_runs,home_f5_runs=excluded.home_f5_runs,
    f5_available=excluded.f5_available,weather_condition=excluded.weather_condition,temperature_f=excluded.temperature_f,wind=excluded.wind,
    raw_schedule=excluded.raw_schedule,raw_feed=excluded.raw_feed,source_updated_at=excluded.source_updated_at,updated_at=now();

  delete from mlb.game_innings where game_pk=v_game_pk;
  insert into mlb.game_innings(game_pk,inning_number,ordinal,away_runs,home_runs)
  select v_game_pk,(x->>'number')::integer,x->>'ordinal',nullif(x->>'awayRuns','')::integer,nullif(x->>'homeRuns','')::integer
  from jsonb_array_elements(coalesce(p_payload->'innings','[]'::jsonb)) x;

  insert into mlb.pitchers(pitcher_id,full_name,pitch_hand_code,pitch_hand_description,updated_at)
  select (x->>'id')::integer,x->>'fullName',x->>'pitchHandCode',x->>'pitchHandDescription',now()
  from jsonb_array_elements(coalesce(p_payload->'pitchers','[]'::jsonb)) x
  where nullif(x->>'id','') is not null
  on conflict(pitcher_id) do update set full_name=excluded.full_name,pitch_hand_code=coalesce(excluded.pitch_hand_code,mlb.pitchers.pitch_hand_code),pitch_hand_description=coalesce(excluded.pitch_hand_description,mlb.pitchers.pitch_hand_description),updated_at=now();

  delete from mlb.game_pitchers where game_pk=v_game_pk;
  insert into mlb.game_pitchers(game_pk,team_side,pitcher_id,role,source)
  select v_game_pk,x->>'side',(x->>'id')::integer,x->>'role',x->>'source'
  from jsonb_array_elements(coalesce(p_payload->'pitchers','[]'::jsonb)) x
  where nullif(x->>'id','') is not null;

  return case when v_existed then 'updated' else 'inserted' end;
end;
$$;

create or replace function public.sports_edge_mlb_finish_import(
  p_import_run_id uuid,
  p_status text,
  p_discovered integer,
  p_inserted integer,
  p_updated integer,
  p_failed integer,
  p_message text default null,
  p_audit jsonb default '{}'::jsonb
) returns void
language plpgsql security definer set search_path = public, ops
as $$
begin
 update ops.mlb_import_runs set finished_at=now(),status=p_status,discovered_games=p_discovered,
 inserted_games=p_inserted,updated_games=p_updated,failed_games=p_failed,message=p_message,audit=p_audit
 where import_run_id=p_import_run_id;
end;
$$;

create or replace function public.sports_edge_mlb_log_error(
  p_import_run_id uuid,p_game_pk bigint,p_stage text,p_error_message text,p_details jsonb default null
) returns void
language sql security definer set search_path = public, ops
as $$ insert into ops.mlb_import_errors(import_run_id,game_pk,stage,error_message,details) values(p_import_run_id,p_game_pk,p_stage,p_error_message,p_details); $$;

create or replace function public.sports_edge_mlb_status()
returns jsonb
language sql security definer set search_path = public, mlb, ops
as $$
select jsonb_build_object(
 'games',(select count(*) from mlb.games),
 'finalGames',(select count(*) from mlb.games where is_final),
 'f5Available',(select count(*) from mlb.games where f5_available),
 'innings',(select count(*) from mlb.game_innings),
 'pitchers',(select count(*) from mlb.pitchers),
 'duplicateGamePks',(select count(*) from (select game_pk from mlb.games group by game_pk having count(*)>1) d),
 'latestImport',(select to_jsonb(r) from (select * from ops.mlb_import_runs order by started_at desc limit 1) r)
); $$;

revoke all on function public.sports_edge_mlb_start_import(date,date,boolean) from public, anon, authenticated;
revoke all on function public.sports_edge_mlb_upsert_game(jsonb) from public, anon, authenticated;
revoke all on function public.sports_edge_mlb_finish_import(uuid,text,integer,integer,integer,integer,text,jsonb) from public, anon, authenticated;
revoke all on function public.sports_edge_mlb_log_error(uuid,bigint,text,text,jsonb) from public, anon, authenticated;
revoke all on function public.sports_edge_mlb_status() from public, anon, authenticated;
grant execute on function public.sports_edge_mlb_start_import(date,date,boolean) to service_role;
grant execute on function public.sports_edge_mlb_upsert_game(jsonb) to service_role;
grant execute on function public.sports_edge_mlb_finish_import(uuid,text,integer,integer,integer,integer,text,jsonb) to service_role;
grant execute on function public.sports_edge_mlb_log_error(uuid,bigint,text,text,jsonb) to service_role;
grant execute on function public.sports_edge_mlb_status() to service_role;

commit;
