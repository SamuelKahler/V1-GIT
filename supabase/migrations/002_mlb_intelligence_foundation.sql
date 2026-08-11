-- SPORTS EDGE MLB INTELLIGENCE DATABASE
-- Release 1 foundation aligned with lib/mlb/importer.js and lib/mlb/transform.js

begin;

create extension if not exists pgcrypto;

create schema if not exists mlb;
create schema if not exists ops;
create schema if not exists trends;
create schema if not exists performance;

create table if not exists ops.import_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'MLB_STATS_API',
  start_date date not null,
  end_date date not null,
  dry_run boolean not null default false,
  status text not null default 'RUNNING' check (status in ('RUNNING','SUCCESS','PARTIAL','FAILED')),
  games_discovered integer not null default 0 check (games_discovered >= 0),
  games_inserted integer not null default 0 check (games_inserted >= 0),
  games_updated integer not null default 0 check (games_updated >= 0),
  games_failed integer not null default 0 check (games_failed >= 0),
  message text,
  audit jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists ops.import_errors (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid references ops.import_runs(id) on delete cascade,
  game_pk bigint,
  stage text not null,
  error_message text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists mlb.teams (
  id uuid primary key default gen_random_uuid(),
  team_id integer not null unique,
  abbreviation text,
  name text not null,
  league_name text,
  division_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.venues (
  id uuid primary key default gen_random_uuid(),
  venue_id integer not null unique,
  name text not null,
  city text,
  state text,
  country text,
  time_zone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.pitchers (
  id uuid primary key default gen_random_uuid(),
  player_id integer not null unique,
  full_name text not null,
  pitch_hand_code text,
  pitch_hand_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.games (
  id uuid primary key default gen_random_uuid(),
  game_pk bigint not null unique,
  official_date date not null,
  season integer not null check (season between 1800 and 2200),
  game_datetime timestamptz,
  game_type text,
  status_abstract text,
  status_detailed text,
  status_code text,
  is_final boolean not null default false,
  away_team_id uuid not null references mlb.teams(id),
  home_team_id uuid not null references mlb.teams(id),
  venue_id uuid references mlb.venues(id),
  day_night text,
  scheduled_innings integer,
  double_header text,
  game_number integer,
  series_description text,
  series_game_number integer,
  games_in_series integer,
  away_score integer check (away_score is null or away_score >= 0),
  home_score integer check (home_score is null or home_score >= 0),
  f5_available boolean not null default false,
  f5_away_score integer check (f5_away_score is null or f5_away_score >= 0),
  f5_home_score integer check (f5_home_score is null or f5_home_score >= 0),
  source_updated_at text,
  raw_schedule jsonb,
  raw_feed jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (away_team_id <> home_team_id),
  check (
    (f5_available = false and f5_away_score is null and f5_home_score is null)
    or
    (f5_available = true and f5_away_score is not null and f5_home_score is not null)
  )
);

create table if not exists mlb.game_innings (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references mlb.games(id) on delete cascade,
  inning_number integer not null check (inning_number > 0),
  ordinal text,
  away_runs integer check (away_runs is null or away_runs >= 0),
  home_runs integer check (home_runs is null or home_runs >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (game_id, inning_number)
);

create table if not exists mlb.game_pitchers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references mlb.games(id) on delete cascade,
  pitcher_id uuid not null references mlb.pitchers(id),
  team_side text not null check (team_side in ('away','home')),
  role text not null,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (game_id, pitcher_id, team_side, role)
);

create table if not exists mlb.weather (
  game_id uuid primary key references mlb.games(id) on delete cascade,
  condition text,
  temperature_f integer,
  wind text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists mlb.odds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references mlb.games(id) on delete cascade,
  provider text not null,
  sportsbook text not null,
  market text not null,
  period text not null default 'FULL_GAME',
  captured_at timestamptz not null,
  is_closing boolean not null default false,
  home_price integer,
  away_price integer,
  home_line numeric,
  away_line numeric,
  total numeric,
  over_price integer,
  under_price integer,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (game_id, provider, sportsbook, market, period, captured_at)
);

create table if not exists mlb.environments (
  game_id uuid primary key references mlb.games(id) on delete cascade,
  division_game boolean,
  interleague_game boolean,
  home_rest_days integer,
  away_rest_days integer,
  home_previous_result text,
  away_previous_result text,
  home_previous_runs_scored integer,
  away_previous_runs_scored integer,
  home_previous_runs_allowed integer,
  away_previous_runs_allowed integer,
  home_pitcher_hand text,
  away_pitcher_hand text,
  home_favorite boolean,
  away_favorite boolean,
  home_underdog boolean,
  away_underdog boolean,
  home_moneyline integer,
  away_moneyline integer,
  odds_bucket text,
  total_value numeric,
  total_bucket text,
  data_complete boolean not null default false,
  calculated_at timestamptz not null default now()
);

create index if not exists idx_mlb_games_official_date on mlb.games(official_date);
create index if not exists idx_mlb_games_season on mlb.games(season);
create index if not exists idx_mlb_games_away_team on mlb.games(away_team_id, official_date);
create index if not exists idx_mlb_games_home_team on mlb.games(home_team_id, official_date);
create index if not exists idx_mlb_games_final on mlb.games(is_final, official_date);
create index if not exists idx_mlb_game_innings_game on mlb.game_innings(game_id);
create index if not exists idx_mlb_game_pitchers_game on mlb.game_pitchers(game_id);
create index if not exists idx_mlb_odds_game on mlb.odds(game_id, captured_at);
create index if not exists idx_ops_import_runs_started on ops.import_runs(started_at desc);
create index if not exists idx_ops_import_errors_run on ops.import_errors(import_run_id, created_at);

create or replace function public.sports_edge_mlb_start_import(
  p_start_date date,
  p_end_date date,
  p_dry_run boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare
  v_id uuid;
begin
  if p_start_date is null or p_end_date is null or p_start_date > p_end_date then
    raise exception 'Invalid import date range.';
  end if;

  insert into ops.import_runs (start_date, end_date, dry_run, status)
  values (p_start_date, p_end_date, coalesce(p_dry_run, false), 'RUNNING')
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.sports_edge_mlb_finish_import(
  p_import_run_id uuid,
  p_status text,
  p_discovered integer default 0,
  p_inserted integer default 0,
  p_updated integer default 0,
  p_failed integer default 0,
  p_message text default null,
  p_audit jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
begin
  if upper(p_status) not in ('SUCCESS','PARTIAL','FAILED') then
    raise exception 'Invalid final import status: %', p_status;
  end if;

  update ops.import_runs
  set status = upper(p_status),
      games_discovered = greatest(coalesce(p_discovered, 0), 0),
      games_inserted = greatest(coalesce(p_inserted, 0), 0),
      games_updated = greatest(coalesce(p_updated, 0), 0),
      games_failed = greatest(coalesce(p_failed, 0), 0),
      message = p_message,
      audit = coalesce(p_audit, '{}'::jsonb),
      completed_at = now()
  where id = p_import_run_id;

  if not found then
    raise exception 'Import run % was not found.', p_import_run_id;
  end if;

  return jsonb_build_object('id', p_import_run_id, 'status', upper(p_status));
end;
$$;

create or replace function public.sports_edge_mlb_log_error(
  p_import_run_id uuid,
  p_game_pk bigint,
  p_stage text,
  p_error_message text,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare
  v_id uuid;
begin
  insert into ops.import_errors (
    import_run_id, game_pk, stage, error_message, details
  ) values (
    p_import_run_id, p_game_pk, coalesce(nullif(p_stage, ''), 'UNKNOWN'),
    coalesce(nullif(p_error_message, ''), 'Unknown import error'),
    coalesce(p_details, '{}'::jsonb)
  ) returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.sports_edge_mlb_upsert_game(p_payload jsonb)
returns text
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare
  v_game_pk bigint;
  v_game_id uuid;
  v_away_team_id uuid;
  v_home_team_id uuid;
  v_venue_id uuid;
  v_pitcher_id uuid;
  v_existing boolean;
  v_item jsonb;
begin
  if p_payload is null then
    raise exception 'p_payload is required.';
  end if;

  v_game_pk := nullif(p_payload->>'gamePk', '')::bigint;
  if v_game_pk is null or v_game_pk <= 0 then
    raise exception 'Payload is missing a valid gamePk.';
  end if;

  if nullif(p_payload#>>'{awayTeam,id}', '') is null
     or nullif(p_payload#>>'{homeTeam,id}', '') is null then
    raise exception 'Payload is missing team IDs for gamePk %.', v_game_pk;
  end if;

  insert into mlb.teams (team_id, abbreviation, name, league_name, division_name)
  values (
    (p_payload#>>'{awayTeam,id}')::integer,
    nullif(p_payload#>>'{awayTeam,abbreviation}', ''),
    coalesce(nullif(p_payload#>>'{awayTeam,name}', ''), 'Unknown Away Team'),
    nullif(p_payload#>>'{awayTeam,leagueName}', ''),
    nullif(p_payload#>>'{awayTeam,divisionName}', '')
  )
  on conflict (team_id) do update set
    abbreviation = coalesce(excluded.abbreviation, mlb.teams.abbreviation),
    name = excluded.name,
    league_name = coalesce(excluded.league_name, mlb.teams.league_name),
    division_name = coalesce(excluded.division_name, mlb.teams.division_name),
    updated_at = now()
  returning id into v_away_team_id;

  insert into mlb.teams (team_id, abbreviation, name, league_name, division_name)
  values (
    (p_payload#>>'{homeTeam,id}')::integer,
    nullif(p_payload#>>'{homeTeam,abbreviation}', ''),
    coalesce(nullif(p_payload#>>'{homeTeam,name}', ''), 'Unknown Home Team'),
    nullif(p_payload#>>'{homeTeam,leagueName}', ''),
    nullif(p_payload#>>'{homeTeam,divisionName}', '')
  )
  on conflict (team_id) do update set
    abbreviation = coalesce(excluded.abbreviation, mlb.teams.abbreviation),
    name = excluded.name,
    league_name = coalesce(excluded.league_name, mlb.teams.league_name),
    division_name = coalesce(excluded.division_name, mlb.teams.division_name),
    updated_at = now()
  returning id into v_home_team_id;

  if nullif(p_payload#>>'{venue,id}', '') is not null then
    insert into mlb.venues (venue_id, name, city, state, country, time_zone)
    values (
      (p_payload#>>'{venue,id}')::integer,
      coalesce(nullif(p_payload#>>'{venue,name}', ''), 'Unknown Venue'),
      nullif(p_payload#>>'{venue,city}', ''),
      nullif(p_payload#>>'{venue,state}', ''),
      nullif(p_payload#>>'{venue,country}', ''),
      nullif(p_payload#>>'{venue,timeZone}', '')
    )
    on conflict (venue_id) do update set
      name = excluded.name,
      city = coalesce(excluded.city, mlb.venues.city),
      state = coalesce(excluded.state, mlb.venues.state),
      country = coalesce(excluded.country, mlb.venues.country),
      time_zone = coalesce(excluded.time_zone, mlb.venues.time_zone),
      updated_at = now()
    returning id into v_venue_id;
  end if;

  select exists(select 1 from mlb.games where game_pk = v_game_pk) into v_existing;

  insert into mlb.games (
    game_pk, official_date, season, game_datetime, game_type,
    status_abstract, status_detailed, status_code, is_final,
    away_team_id, home_team_id, venue_id, day_night,
    scheduled_innings, double_header, game_number,
    series_description, series_game_number, games_in_series,
    away_score, home_score, f5_available, f5_away_score, f5_home_score,
    source_updated_at, raw_schedule, raw_feed
  ) values (
    v_game_pk,
    (p_payload->>'officialDate')::date,
    (p_payload->>'season')::integer,
    nullif(p_payload->>'gameDate', '')::timestamptz,
    nullif(p_payload->>'gameType', ''),
    nullif(p_payload#>>'{status,abstract}', ''),
    nullif(p_payload#>>'{status,detailed}', ''),
    nullif(p_payload#>>'{status,code}', ''),
    coalesce((p_payload#>>'{status,isFinal}')::boolean, false),
    v_away_team_id,
    v_home_team_id,
    v_venue_id,
    nullif(p_payload->>'dayNight', ''),
    nullif(p_payload->>'scheduledInnings', '')::integer,
    nullif(p_payload->>'doubleHeader', ''),
    nullif(p_payload->>'gameNumber', '')::integer,
    nullif(p_payload->>'seriesDescription', ''),
    nullif(p_payload->>'seriesGameNumber', '')::integer,
    nullif(p_payload->>'gamesInSeries', '')::integer,
    nullif(p_payload#>>'{finalScore,away}', '')::integer,
    nullif(p_payload#>>'{finalScore,home}', '')::integer,
    coalesce((p_payload#>>'{firstFive,available}')::boolean, false),
    nullif(p_payload#>>'{firstFive,away}', '')::integer,
    nullif(p_payload#>>'{firstFive,home}', '')::integer,
    nullif(p_payload->>'sourceUpdatedAt', ''),
    p_payload->'rawSchedule',
    p_payload->'rawFeed'
  )
  on conflict (game_pk) do update set
    official_date = excluded.official_date,
    season = excluded.season,
    game_datetime = excluded.game_datetime,
    game_type = excluded.game_type,
    status_abstract = excluded.status_abstract,
    status_detailed = excluded.status_detailed,
    status_code = excluded.status_code,
    is_final = excluded.is_final,
    away_team_id = excluded.away_team_id,
    home_team_id = excluded.home_team_id,
    venue_id = excluded.venue_id,
    day_night = excluded.day_night,
    scheduled_innings = excluded.scheduled_innings,
    double_header = excluded.double_header,
    game_number = excluded.game_number,
    series_description = excluded.series_description,
    series_game_number = excluded.series_game_number,
    games_in_series = excluded.games_in_series,
    away_score = excluded.away_score,
    home_score = excluded.home_score,
    f5_available = excluded.f5_available,
    f5_away_score = excluded.f5_away_score,
    f5_home_score = excluded.f5_home_score,
    source_updated_at = excluded.source_updated_at,
    raw_schedule = excluded.raw_schedule,
    raw_feed = excluded.raw_feed,
    updated_at = now()
  returning id into v_game_id;

  delete from mlb.game_innings where game_id = v_game_id;
  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'innings', '[]'::jsonb))
  loop
    if nullif(v_item->>'number', '') is not null then
      insert into mlb.game_innings (
        game_id, inning_number, ordinal, away_runs, home_runs
      ) values (
        v_game_id,
        (v_item->>'number')::integer,
        nullif(v_item->>'ordinal', ''),
        nullif(v_item->>'awayRuns', '')::integer,
        nullif(v_item->>'homeRuns', '')::integer
      )
      on conflict (game_id, inning_number) do update set
        ordinal = excluded.ordinal,
        away_runs = excluded.away_runs,
        home_runs = excluded.home_runs,
        updated_at = now();
    end if;
  end loop;

  for v_item in select value from jsonb_array_elements(coalesce(p_payload->'pitchers', '[]'::jsonb))
  loop
    if nullif(v_item->>'id', '') is not null then
      insert into mlb.pitchers (
        player_id, full_name, pitch_hand_code, pitch_hand_description
      ) values (
        (v_item->>'id')::integer,
        coalesce(nullif(v_item->>'fullName', ''), 'Unknown Pitcher'),
        nullif(v_item->>'pitchHandCode', ''),
        nullif(v_item->>'pitchHandDescription', '')
      )
      on conflict (player_id) do update set
        full_name = excluded.full_name,
        pitch_hand_code = coalesce(excluded.pitch_hand_code, mlb.pitchers.pitch_hand_code),
        pitch_hand_description = coalesce(excluded.pitch_hand_description, mlb.pitchers.pitch_hand_description),
        updated_at = now()
      returning id into v_pitcher_id;

      insert into mlb.game_pitchers (
        game_id, pitcher_id, team_side, role, source
      ) values (
        v_game_id,
        v_pitcher_id,
        v_item->>'side',
        v_item->>'role',
        nullif(v_item->>'source', '')
      )
      on conflict (game_id, pitcher_id, team_side, role) do update set
        source = excluded.source,
        updated_at = now();
    end if;
  end loop;

  insert into mlb.weather (game_id, condition, temperature_f, wind)
  values (
    v_game_id,
    nullif(p_payload#>>'{weather,condition}', ''),
    nullif(p_payload#>>'{weather,tempF}', '')::integer,
    nullif(p_payload#>>'{weather,wind}', '')
  )
  on conflict (game_id) do update set
    condition = excluded.condition,
    temperature_f = excluded.temperature_f,
    wind = excluded.wind,
    updated_at = now();

  return case when v_existing then 'updated' else 'inserted' end;
end;
$$;

create or replace function public.sports_edge_mlb_status()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
  select jsonb_build_object(
    'games', (select count(*) from mlb.games),
    'finalGames', (select count(*) from mlb.games where is_final),
    'innings', (select count(*) from mlb.game_innings),
    'teams', (select count(*) from mlb.teams),
    'venues', (select count(*) from mlb.venues),
    'pitchers', (select count(*) from mlb.pitchers),
    'gamePitchers', (select count(*) from mlb.game_pitchers),
    'weatherRows', (select count(*) from mlb.weather),
    'oddsRows', (select count(*) from mlb.odds),
    'duplicateGamePks', (
      select count(*) from (
        select game_pk from mlb.games group by game_pk having count(*) > 1
      ) duplicates
    ),
    'gamesMissingTeams', (
      select count(*) from mlb.games where away_team_id is null or home_team_id is null
    ),
    'finalGamesMissingScores', (
      select count(*) from mlb.games
      where is_final and (away_score is null or home_score is null)
    ),
    'f5Games', (select count(*) from mlb.games where f5_available),
    'lastImport', (
      select to_jsonb(r) from (
        select id, source, start_date, end_date, dry_run, status,
               games_discovered, games_inserted, games_updated, games_failed,
               message, started_at, completed_at
        from ops.import_runs
        order by started_at desc
        limit 1
      ) r
    )
  );
$$;

revoke all on schema mlb from public;
revoke all on schema ops from public;
revoke all on all tables in schema mlb from public;
revoke all on all tables in schema ops from public;

revoke all on function public.sports_edge_mlb_start_import(date,date,boolean) from public;
revoke all on function public.sports_edge_mlb_finish_import(uuid,text,integer,integer,integer,integer,text,jsonb) from public;
revoke all on function public.sports_edge_mlb_log_error(uuid,bigint,text,text,jsonb) from public;
revoke all on function public.sports_edge_mlb_upsert_game(jsonb) from public;
revoke all on function public.sports_edge_mlb_status() from public;

grant execute on function public.sports_edge_mlb_start_import(date,date,boolean) to service_role;
grant execute on function public.sports_edge_mlb_finish_import(uuid,text,integer,integer,integer,integer,text,jsonb) to service_role;
grant execute on function public.sports_edge_mlb_log_error(uuid,bigint,text,text,jsonb) to service_role;
grant execute on function public.sports_edge_mlb_upsert_game(jsonb) to service_role;
grant execute on function public.sports_edge_mlb_status() to service_role;

grant usage on schema mlb, ops to service_role;
grant all privileges on all tables in schema mlb, ops to service_role;
grant all privileges on all sequences in schema mlb, ops to service_role;

commit;
