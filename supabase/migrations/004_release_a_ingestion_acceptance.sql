-- Sports Edge MLB Intelligence - Release A acceptance hardening
-- Run after migrations 002 and 003. Safe to run more than once.

begin;

alter table mlb.game_innings add column if not exists away_hits integer check (away_hits is null or away_hits >= 0);
alter table mlb.game_innings add column if not exists home_hits integer check (home_hits is null or home_hits >= 0);
alter table mlb.game_innings add column if not exists away_errors integer check (away_errors is null or away_errors >= 0);
alter table mlb.game_innings add column if not exists home_errors integer check (home_errors is null or home_errors >= 0);
alter table mlb.weather add column if not exists wind_speed_mph numeric;
alter table mlb.weather add column if not exists source text;

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
        game_id, inning_number, ordinal, away_runs, home_runs, away_hits, home_hits, away_errors, home_errors
      ) values (
        v_game_id,
        (v_item->>'number')::integer,
        nullif(v_item->>'ordinal', ''),
        nullif(v_item->>'awayRuns', '')::integer,
        nullif(v_item->>'homeRuns', '')::integer,
        nullif(v_item->>'awayHits', '')::integer,
        nullif(v_item->>'homeHits', '')::integer,
        nullif(v_item->>'awayErrors', '')::integer,
        nullif(v_item->>'homeErrors', '')::integer
      )
      on conflict (game_id, inning_number) do update set
        ordinal = excluded.ordinal,
        away_runs = excluded.away_runs,
        home_runs = excluded.home_runs,
        away_hits = excluded.away_hits,
        home_hits = excluded.home_hits,
        away_errors = excluded.away_errors,
        home_errors = excluded.home_errors,
        updated_at = now();
    end if;
  end loop;

  delete from mlb.game_pitchers where game_id = v_game_id;

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

  insert into mlb.weather (game_id, condition, temperature_f, wind, wind_speed_mph, source)
  values (
    v_game_id,
    nullif(p_payload#>>'{weather,condition}', ''),
    nullif(p_payload#>>'{weather,temperatureF}', '')::integer,
    nullif(p_payload#>>'{weather,wind}', ''),
    nullif(p_payload#>>'{weather,windSpeedMph}', '')::numeric,
    nullif(p_payload#>>'{weather,source}', '')
  )
  on conflict (game_id) do update set
    condition = excluded.condition,
    temperature_f = excluded.temperature_f,
    wind = excluded.wind,
    wind_speed_mph = excluded.wind_speed_mph,
    source = excluded.source,
    updated_at = now();

  return case when v_existing then 'updated' else 'inserted' end;
end;
$$;


create or replace function public.sports_edge_mlb_release_a_audit(
  p_start_date date,
  p_end_date date
)
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
with selected_games as (
  select * from mlb.games
  where official_date between p_start_date and p_end_date
), game_quality as (
  select
    g.id, g.game_pk, g.official_date, g.is_final,
    g.away_score, g.home_score, g.f5_available, g.f5_away_score, g.f5_home_score,
    exists(select 1 from mlb.game_innings i where i.game_id=g.id) as has_innings,
    (select count(*) from mlb.game_innings i where i.game_id=g.id and i.inning_number between 1 and 5 and i.away_runs is not null and i.home_runs is not null)::integer as verified_first_five_innings,
    exists(select 1 from mlb.game_pitchers gp where gp.game_id=g.id and gp.role in ('confirmed_starter','probable_starter')) as has_starter
  from selected_games g
), duplicate_count as (
  select count(*)::integer value from (
    select game_pk from mlb.games group by game_pk having count(*) > 1
  ) d
), range_errors as (
  select count(*)::integer value
  from ops.import_errors e
  left join ops.import_runs r on r.id=e.import_run_id
  where r.start_date <= p_end_date and r.end_date >= p_start_date
), latest_runs as (
  select coalesce(jsonb_agg(to_jsonb(x) order by x.started_at desc), '[]'::jsonb) value
  from (
    select id,status,start_date,end_date,games_discovered,games_inserted,games_updated,games_failed,message,started_at,completed_at
    from ops.import_runs
    where start_date <= p_end_date and end_date >= p_start_date
    order by started_at desc
    limit 5
  ) x
)
select jsonb_build_object(
  'startDate', p_start_date,
  'endDate', p_end_date,
  'games', (select count(*) from game_quality),
  'finalGames', (select count(*) from game_quality where is_final),
  'gamesWithFinalScores', (select count(*) from game_quality where away_score is not null and home_score is not null),
  'gamesWithF5', (select count(*) from game_quality where f5_available and f5_away_score is not null and f5_home_score is not null),
  'fiveInningGames', (select count(*) from game_quality where verified_first_five_innings = 5),
  'fiveInningGamesMissingF5', (select count(*) from game_quality where verified_first_five_innings = 5 and not (f5_available and f5_away_score is not null and f5_home_score is not null)),
  'gamesWithInnings', (select count(*) from game_quality where has_innings),
  'gamesWithStarters', (select count(*) from game_quality where has_starter),
  'duplicateGamePks', (select value from duplicate_count),
  'importErrorsForRange', (select value from range_errors),
  'latestRuns', (select value from latest_runs),
  'gameChecks', coalesce((select jsonb_agg(jsonb_build_object(
    'gamePk',game_pk,'date',official_date,'final',is_final,
    'finalScoreComplete',(away_score is not null and home_score is not null),
    'f5Complete',(f5_available and f5_away_score is not null and f5_home_score is not null),
    'verifiedFirstFiveInnings',verified_first_five_innings,
    'inningsStored',has_innings,'starterStored',has_starter
  ) order by official_date,game_pk) from game_quality), '[]'::jsonb)
);
$$;

revoke all on function public.sports_edge_mlb_release_a_audit(date,date) from public;
grant execute on function public.sports_edge_mlb_release_a_audit(date,date) to service_role;

commit;
