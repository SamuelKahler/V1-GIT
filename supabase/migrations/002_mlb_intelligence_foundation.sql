-- ============================================================
-- SPORTS EDGE MLB INTELLIGENCE DATABASE
-- RELEASE 1A
-- Foundation Migration
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ============================================================
-- SCHEMAS
-- ============================================================

create schema if not exists mlb;
create schema if not exists ops;
create schema if not exists trends;
create schema if not exists performance;

-- ============================================================
-- IMPORT RUNS
-- ============================================================

create table if not exists ops.import_runs (

    id uuid primary key default gen_random_uuid(),

    started_at timestamptz not null default now(),

    completed_at timestamptz,

    source text not null,

    start_date date not null,

    end_date date not null,

    status text not null,

    games_discovered integer default 0,

    games_inserted integer default 0,

    games_updated integer default 0,

    games_failed integer default 0,

    notes text
);

-- ============================================================
-- IMPORT ERRORS
-- ============================================================

create table if not exists ops.import_errors (

    id uuid primary key default gen_random_uuid(),

    import_run_id uuid references ops.import_runs(id),

    game_pk integer,

    endpoint text,

    error_message text,

    payload jsonb,

    created_at timestamptz default now()
);

-- ============================================================
-- TEAMS
-- ============================================================

create table if not exists mlb.teams (

    id uuid primary key default gen_random_uuid(),

    team_id integer unique not null,

    abbreviation text not null,

    city text,

    nickname text,

    full_name text,

    league text,

    division text,

    active boolean default true
);

-- ============================================================
-- VENUES
-- ============================================================

create table if not exists mlb.venues (

    id uuid primary key default gen_random_uuid(),

    venue_id integer unique,

    name text,

    city text,

    state text,

    roof_type text,

    surface text,

    elevation integer
);

-- ============================================================
-- PITCHERS
-- ============================================================

create table if not exists mlb.pitchers (

    id uuid primary key default gen_random_uuid(),

    player_id integer unique,

    full_name text,

    bats text,

    throws text,

    active boolean default true
);

-- ============================================================
-- GAMES
-- ============================================================

create table if not exists mlb.games (

    id uuid primary key default gen_random_uuid(),

    game_pk integer unique not null,

    season integer not null,

    game_date date not null,

    official_datetime timestamptz,

    status text,

    game_type text,

    doubleheader text,

    day_night text,

    venue_id uuid references mlb.venues(id),

    home_team uuid references mlb.teams(id),

    away_team uuid references mlb.teams(id),

    home_score integer,

    away_score integer,

    f5_home_score integer,

    f5_away_score integer,

    innings integer,

    attendance integer,

    duration_minutes integer,

    series_game_number integer,

    series_length integer,

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);

-- ============================================================
-- GAME PITCHERS
-- ============================================================

create table if not exists mlb.game_pitchers (

    id uuid primary key default gen_random_uuid(),

    game_id uuid references mlb.games(id) on delete cascade,

    pitcher_id uuid references mlb.pitchers(id),

    role text,

    team_side text,

    decision text
);

-- ============================================================
-- INNING SCORES
-- ============================================================

create table if not exists mlb.game_innings (

    id uuid primary key default gen_random_uuid(),

    game_id uuid references mlb.games(id) on delete cascade,

    inning integer not null,

    away_runs integer,

    home_runs integer,

    unique(game_id, inning)
);

-- ============================================================
-- WEATHER
-- ============================================================

create table if not exists mlb.weather (

    id uuid primary key default gen_random_uuid(),

    game_id uuid unique references mlb.games(id) on delete cascade,

    condition text,

    temperature integer,

    wind text,

    wind_speed integer
);

-- ============================================================
-- ODDS
-- ============================================================

create table if not exists mlb.odds (

    id uuid primary key default gen_random_uuid(),

    game_id uuid references mlb.games(id) on delete cascade,

    sportsbook text,

    captured_at timestamptz,

    home_ml numeric,

    away_ml numeric,

    runline numeric,

    total numeric,

    closing boolean default false
);

-- ============================================================
-- VERIFIED ENVIRONMENTS
-- ============================================================

create table if not exists mlb.environments (

    game_id uuid primary key references mlb.games(id) on delete cascade,

    home_favorite boolean,

    away_favorite boolean,

    home_underdog boolean,

    away_underdog boolean,

    division_game boolean,

    interleague_game boolean,

    after_home_win boolean,

    after_home_loss boolean,

    after_away_win boolean,

    after_away_loss boolean,

    home_rest_days integer,

    away_rest_days integer,

    home_pitcher_hand text,

    away_pitcher_hand text,

    odds_bucket text,

    total_bucket text,

    weather_bucket text
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_games_date
on mlb.games(game_date);

create index if not exists idx_games_season
on mlb.games(season);

create index if not exists idx_games_home
on mlb.games(home_team);

create index if not exists idx_games_away
on mlb.games(away_team);

create index if not exists idx_pitchers
on mlb.game_pitchers(game_id);

create index if not exists idx_odds
on mlb.odds(game_id);

create index if not exists idx_env
on mlb.environments(division_game);

commit;
