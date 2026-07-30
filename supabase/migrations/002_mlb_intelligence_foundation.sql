-- SPORTS EDGE MLB INTELLIGENCE DATABASE V2
-- Phase 2A: official MLB game database foundation
-- Safe boundary: does not modify public.pick_observations or any UI tables.

begin;

create schema if not exists mlb;
create schema if not exists ops;
create schema if not exists trends;
create schema if not exists performance;

create table if not exists mlb.teams (
  mlb_team_id integer primary key,
  abbreviation text,
  name text not null,
  league_name text,
  division_name text,
  updated_at timestamptz not null default now()
);

create table if not exists mlb.venues (
  mlb_venue_id integer primary key,
  name text not null,
  city text,
  state text,
  country text,
  timezone text,
  updated_at timestamptz not null default now()
);

create table if not exists mlb.games (
  game_pk bigint primary key,
  official_date date not null,
  season integer not null,
  game_type text,
  status_code text,
  status_abstract text,
  status_detailed text,
  is_final boolean not null default false,
  home_team_id integer not null references mlb.teams(mlb_team_id),
  away_team_id integer not null references mlb.teams(mlb_team_id),
  venue_id integer references mlb.venues(mlb_venue_id),
  game_number integer,
  double_header text,
  series_description text,
  series_game_number integer,
  games_in_series integer,
  day_night text,
  scheduled_innings integer,
  home_final_runs integer,
  away_final_runs integer,
  home_f5_runs integer,
  away_f5_runs integer,
  f5_complete boolean not null default false,
  weather_condition text,
  temperature_f integer,
  wind text,
  raw_schedule jsonb,
  raw_feed_metadata jsonb,
  source_updated_at timestamptz,
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mlb_games_different_teams check (home_team_id <> away_team_id),
  constraint mlb_games_valid_season check (season between 1876 and 2200)
);

create index if not exists mlb_games_official_date_idx on mlb.games(official_date);
create index if not exists mlb_games_season_idx on mlb.games(season);
create index if not exists mlb_games_home_team_idx on mlb.games(home_team_id, official_date);
create index if not exists mlb_games_away_team_idx on mlb.games(away_team_id, official_date);
create index if not exists mlb_games_final_idx on mlb.games(is_final, official_date);

create table if not exists mlb.game_innings (
  game_pk bigint not null references mlb.games(game_pk) on delete cascade,
  inning_number integer not null,
  ordinal text,
  home_runs integer,
  away_runs integer,
  home_hits integer,
  away_hits integer,
  home_errors integer,
  away_errors integer,
  primary key (game_pk, inning_number),
  constraint mlb_game_innings_positive check (inning_number > 0)
);

create table if not exists mlb.game_pitchers (
  game_pk bigint not null references mlb.games(game_pk) on delete cascade,
  side text not null check (side in ('home','away')),
  role text not null check (role in ('probable','starter','winning','losing','saving')),
  person_id bigint,
  full_name text,
  pitch_hand text,
  confirmed boolean not null default false,
  source text not null default 'MLB_STATS_API',
  primary key (game_pk, side, role)
);

create table if not exists ops.mlb_import_runs (
  import_run_id uuid primary key default gen_random_uuid(),
  requested_start_date date not null,
  requested_end_date date not null,
  status text not null default 'RUNNING' check (status in ('RUNNING','COMPLETED','COMPLETED_WITH_ERRORS','FAILED')),
  source text not null default 'MLB_STATS_API',
  requested_by text,
  games_discovered integer not null default 0,
  games_imported integer not null default 0,
  games_updated integer not null default 0,
  games_failed integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  summary jsonb not null default '{}'::jsonb
);

create index if not exists mlb_import_runs_started_idx on ops.mlb_import_runs(started_at desc);

create table if not exists ops.mlb_import_errors (
  import_error_id bigint generated always as identity primary key,
  import_run_id uuid references ops.mlb_import_runs(import_run_id) on delete cascade,
  game_pk bigint,
  official_date date,
  stage text not null,
  error_code text,
  error_message text not null,
  retryable boolean not null default true,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists mlb_import_errors_run_idx on ops.mlb_import_errors(import_run_id);
create index if not exists mlb_import_errors_game_idx on ops.mlb_import_errors(game_pk);

-- Public RPC boundary lets server-side Vercel functions write to private schemas
-- without exposing the mlb or ops schemas through the Supabase Data API.
create or replace function public.mlb_start_import_run(
  p_start_date date,
  p_end_date date,
  p_requested_by text default 'SPORTS_EDGE_API'
) returns uuid
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare v_id uuid;
begin
  if p_start_date is null or p_end_date is null or p_end_date < p_start_date then
    raise exception 'INVALID_DATE_RANGE';
  end if;
  insert into ops.mlb_import_runs(requested_start_date, requested_end_date, requested_by)
  values (p_start_date, p_end_date, p_requested_by)
  returning import_run_id into v_id;
  return v_id;
end;
$$;

create or replace function public.mlb_upsert_game_bundle(p_bundle jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare
  v_game jsonb := p_bundle->'game';
  v_home jsonb := p_bundle->'home_team';
  v_away jsonb := p_bundle->'away_team';
  v_venue jsonb := p_bundle->'venue';
  v_inning jsonb;
  v_pitcher jsonb;
  v_existed boolean;
begin
  if coalesce((v_game->>'game_pk')::bigint, 0) = 0 then
    raise exception 'GAME_PK_REQUIRED';
  end if;

  select exists(select 1 from mlb.games where game_pk = (v_game->>'game_pk')::bigint) into v_existed;

  insert into mlb.teams(mlb_team_id, abbreviation, name, league_name, division_name, updated_at)
  values ((v_home->>'id')::integer, v_home->>'abbreviation', v_home->>'name', v_home->>'league_name', v_home->>'division_name', now())
  on conflict (mlb_team_id) do update set
    abbreviation = excluded.abbreviation,
    name = excluded.name,
    league_name = excluded.league_name,
    division_name = excluded.division_name,
    updated_at = now();

  insert into mlb.teams(mlb_team_id, abbreviation, name, league_name, division_name, updated_at)
  values ((v_away->>'id')::integer, v_away->>'abbreviation', v_away->>'name', v_away->>'league_name', v_away->>'division_name', now())
  on conflict (mlb_team_id) do update set
    abbreviation = excluded.abbreviation,
    name = excluded.name,
    league_name = excluded.league_name,
    division_name = excluded.division_name,
    updated_at = now();

  if nullif(v_venue->>'id','') is not null then
    insert into mlb.venues(mlb_venue_id, name, city, state, country, timezone, updated_at)
    values ((v_venue->>'id')::integer, coalesce(v_venue->>'name','Unknown'), v_venue->>'city', v_venue->>'state', v_venue->>'country', v_venue->>'timezone', now())
    on conflict (mlb_venue_id) do update set
      name = excluded.name, city = excluded.city, state = excluded.state,
      country = excluded.country, timezone = excluded.timezone, updated_at = now();
  end if;

  insert into mlb.games(
    game_pk, official_date, season, game_type, status_code, status_abstract,
    status_detailed, is_final, home_team_id, away_team_id, venue_id,
    game_number, double_header, series_description, series_game_number,
    games_in_series, day_night, scheduled_innings, home_final_runs,
    away_final_runs, home_f5_runs, away_f5_runs, f5_complete,
    weather_condition, temperature_f, wind, raw_schedule,
    raw_feed_metadata, source_updated_at, imported_at, updated_at
  ) values (
    (v_game->>'game_pk')::bigint, (v_game->>'official_date')::date,
    (v_game->>'season')::integer, v_game->>'game_type', v_game->>'status_code',
    v_game->>'status_abstract', v_game->>'status_detailed',
    coalesce((v_game->>'is_final')::boolean,false), (v_home->>'id')::integer,
    (v_away->>'id')::integer, nullif(v_venue->>'id','')::integer,
    nullif(v_game->>'game_number','')::integer, v_game->>'double_header',
    v_game->>'series_description', nullif(v_game->>'series_game_number','')::integer,
    nullif(v_game->>'games_in_series','')::integer, v_game->>'day_night',
    nullif(v_game->>'scheduled_innings','')::integer,
    nullif(v_game->>'home_final_runs','')::integer,
    nullif(v_game->>'away_final_runs','')::integer,
    nullif(v_game->>'home_f5_runs','')::integer,
    nullif(v_game->>'away_f5_runs','')::integer,
    coalesce((v_game->>'f5_complete')::boolean,false),
    v_game->>'weather_condition', nullif(v_game->>'temperature_f','')::integer,
    v_game->>'wind', p_bundle->'raw_schedule', p_bundle->'raw_feed_metadata',
    nullif(v_game->>'source_updated_at','')::timestamptz, now(), now()
  ) on conflict (game_pk) do update set
    official_date=excluded.official_date, season=excluded.season, game_type=excluded.game_type,
    status_code=excluded.status_code, status_abstract=excluded.status_abstract,
    status_detailed=excluded.status_detailed, is_final=excluded.is_final,
    home_team_id=excluded.home_team_id, away_team_id=excluded.away_team_id,
    venue_id=excluded.venue_id, game_number=excluded.game_number,
    double_header=excluded.double_header, series_description=excluded.series_description,
    series_game_number=excluded.series_game_number, games_in_series=excluded.games_in_series,
    day_night=excluded.day_night, scheduled_innings=excluded.scheduled_innings,
    home_final_runs=excluded.home_final_runs, away_final_runs=excluded.away_final_runs,
    home_f5_runs=excluded.home_f5_runs, away_f5_runs=excluded.away_f5_runs,
    f5_complete=excluded.f5_complete, weather_condition=excluded.weather_condition,
    temperature_f=excluded.temperature_f, wind=excluded.wind,
    raw_schedule=excluded.raw_schedule, raw_feed_metadata=excluded.raw_feed_metadata,
    source_updated_at=excluded.source_updated_at, updated_at=now();

  delete from mlb.game_innings where game_pk = (v_game->>'game_pk')::bigint;
  for v_inning in select value from jsonb_array_elements(coalesce(p_bundle->'innings','[]'::jsonb)) loop
    insert into mlb.game_innings(game_pk, inning_number, ordinal, home_runs, away_runs, home_hits, away_hits, home_errors, away_errors)
    values ((v_game->>'game_pk')::bigint, (v_inning->>'inning_number')::integer,
      v_inning->>'ordinal', nullif(v_inning->>'home_runs','')::integer,
      nullif(v_inning->>'away_runs','')::integer, nullif(v_inning->>'home_hits','')::integer,
      nullif(v_inning->>'away_hits','')::integer, nullif(v_inning->>'home_errors','')::integer,
      nullif(v_inning->>'away_errors','')::integer);
  end loop;

  delete from mlb.game_pitchers where game_pk = (v_game->>'game_pk')::bigint;
  for v_pitcher in select value from jsonb_array_elements(coalesce(p_bundle->'pitchers','[]'::jsonb)) loop
    insert into mlb.game_pitchers(game_pk, side, role, person_id, full_name, pitch_hand, confirmed, source)
    values ((v_game->>'game_pk')::bigint, v_pitcher->>'side', v_pitcher->>'role',
      nullif(v_pitcher->>'person_id','')::bigint, v_pitcher->>'full_name',
      v_pitcher->>'pitch_hand', coalesce((v_pitcher->>'confirmed')::boolean,false), 'MLB_STATS_API');
  end loop;

  return jsonb_build_object('game_pk',(v_game->>'game_pk')::bigint,'operation',case when v_existed then 'UPDATED' else 'INSERTED' end);
end;
$$;

create or replace function public.mlb_log_import_error(
  p_import_run_id uuid, p_game_pk bigint, p_official_date date, p_stage text,
  p_error_code text, p_error_message text, p_retryable boolean default true,
  p_context jsonb default '{}'::jsonb
) returns bigint
language plpgsql
security definer
set search_path = public, ops
as $$
declare v_id bigint;
begin
  insert into ops.mlb_import_errors(import_run_id, game_pk, official_date, stage, error_code, error_message, retryable, context)
  values (p_import_run_id, p_game_pk, p_official_date, p_stage, p_error_code, p_error_message, p_retryable, coalesce(p_context,'{}'::jsonb))
  returning import_error_id into v_id;
  return v_id;
end;
$$;

create or replace function public.mlb_finish_import_run(
  p_import_run_id uuid, p_status text, p_games_discovered integer,
  p_games_imported integer, p_games_updated integer, p_games_failed integer,
  p_summary jsonb default '{}'::jsonb
) returns boolean
language plpgsql
security definer
set search_path = public, ops
as $$
begin
  update ops.mlb_import_runs set
    status=p_status, games_discovered=coalesce(p_games_discovered,0),
    games_imported=coalesce(p_games_imported,0), games_updated=coalesce(p_games_updated,0),
    games_failed=coalesce(p_games_failed,0), completed_at=now(), summary=coalesce(p_summary,'{}'::jsonb)
  where import_run_id=p_import_run_id;
  return found;
end;
$$;

create or replace function public.mlb_import_audit(p_limit integer default 20)
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
select jsonb_build_object(
  'database', jsonb_build_object(
    'games', (select count(*) from mlb.games),
    'final_games', (select count(*) from mlb.games where is_final),
    'innings', (select count(*) from mlb.game_innings),
    'pitchers', (select count(*) from mlb.game_pitchers),
    'earliest_game', (select min(official_date) from mlb.games),
    'latest_game', (select max(official_date) from mlb.games),
    'duplicate_game_pks', 0
  ),
  'recent_runs', coalesce((select jsonb_agg(to_jsonb(r)) from (
    select * from ops.mlb_import_runs order by started_at desc limit greatest(1,least(coalesce(p_limit,20),100))
  ) r),'[]'::jsonb),
  'unresolved_errors', coalesce((select jsonb_agg(to_jsonb(e)) from (
    select * from ops.mlb_import_errors where retryable order by created_at desc limit 100
  ) e),'[]'::jsonb)
);
$$;

revoke all on function public.mlb_start_import_run(date,date,text) from public, anon, authenticated;
revoke all on function public.mlb_upsert_game_bundle(jsonb) from public, anon, authenticated;
revoke all on function public.mlb_log_import_error(uuid,bigint,date,text,text,text,boolean,jsonb) from public, anon, authenticated;
revoke all on function public.mlb_finish_import_run(uuid,text,integer,integer,integer,integer,jsonb) from public, anon, authenticated;
revoke all on function public.mlb_import_audit(integer) from public, anon, authenticated;
grant execute on function public.mlb_start_import_run(date,date,text) to service_role;
grant execute on function public.mlb_upsert_game_bundle(jsonb) to service_role;
grant execute on function public.mlb_log_import_error(uuid,bigint,date,text,text,text,boolean,jsonb) to service_role;
grant execute on function public.mlb_finish_import_run(uuid,text,integer,integer,integer,integer,jsonb) to service_role;
grant execute on function public.mlb_import_audit(integer) to service_role;

commit;
