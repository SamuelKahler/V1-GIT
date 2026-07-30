Yesterday 7:49 PM
V1-GIT-main (6).zip
Zip Archive
PROJECT: SPORTS EDGE MLB INTELLIGENCE DATABASE V2

We are building a sports betting intelligence app called Sports Edge.

The customer-facing app already has:

- Today’s Picks
- F5 Performance
- Overall Performance
- Series Board
- Trend Database
- Matched Trend Evidence
- MLB, NFL and CFB navigation
- A white, orange and blue design
- Existing tabs and layouts that must be preserved

IMPORTANT ARCHITECTURAL DECISION

Sports Edge picks and MLB historical game evidence must now be completely separate systems.

SYSTEM 1 — SPORTS EDGE PERFORMANCE DATABASE

Purpose:
Track only Sports Edge recommendations and performance.

Contains:

- Pick ID
- Date
- Bet
- Market
- Period
- Odds
- Units
- Result
- Profit/loss
- CLV
- F5 performance
- Series performance
- Overall performance

Sports Edge picks must NOT be used as historical game-log evidence for future picks.

They are only used to show Sports Edge’s own record and performance.

SYSTEM 2 — MLB INTELLIGENCE DATABASE

Purpose:
Provide complete historical evidence from every MLB game.

This database must eventually contain every MLB game for the selected seasons, not only games where Sports Edge issued a pick.

For every MLB game, store as much of the following as available:

- Official MLB gamePk
- Date
- Season
- Home team
- Away team
- Final score
- First-five score
- Inning-by-inning score
- Starting pitchers
- Pitcher handedness
- Venue
- Day/night
- Division status
- Series game number
- Series length
- Team rest
- Previous game result
- Previous runs scored
- Previous runs allowed
- Weather
- Temperature
- Wind
- Moneyline
- Run line
- Total
- Closing odds
- Favorite/underdog
- Home/away role
- Odds bucket
- Bullpen usage if available

Every game must receive a permanent unique ID.

ENVIRONMENT ENGINE

The system must create verified environment fields from official game data.

Examples:

- Team was home
- Team was away
- Team was favorite
- Team was underdog
- Home favorite
- Away underdog
- Division game
- Game 1, 2, 3 or 4 of series
- After a win
- After a loss
- Scored 5+ previous game
- Allowed 3 or fewer previous game
- Rest advantage
- Starting-pitcher handedness
- Odds bucket
- Total bucket
- Day/night
- Weather conditions

Environment values must never be randomly assigned or inferred without data.

If a field is unavailable, store it as missing.

Do not claim an environment match unless both the current game and historical game contain the same verified value.

TREND DATABASE

A trend is not the same as a game log.

Game Log Evidence:

- Calculated from individually stored MLB games
- Shows record
- Hit rate
- ROI if odds are available
- Sample size
- Supporting games
- Exact matching conditions

Stored Trend Evidence:

- A documented trend from an imported trend source
- Must be labeled separately
- Must not pretend to be calculated from the game database
- Must display its source and documented sample when available

MATCHED TREND EVIDENCE

For each current pick, show a clear evidence report.

Percentages must be the most prominent numbers.

The report should be organized like:

1. Best Qualified Hit Rate
2. Verified Game Logs
3. Stored Trend Database
4. Strongest Reasons
5. Contradicting Evidence
6. Supporting Historical Games
7. Exact Environment Match Details

Example:

MIL ML

VERIFIED GAME LOGS

68.4%

Milwaukee Moneyline as Home Favorite

Record: 26-12
Sample: 38 games
ROI: +11.7%

Why this applies:

- Same team: MIL
- Same market: MONEYLINE
- Same period: FULL GAME
- Same role: HOME
- Same favorite status: FAVORITE
- Same odds bucket: -105 to -120

Supporting games should be expandable.

Do not include vague filler such as:

“Note:”
“Trend backed”
“Relevant information”

Show exactly what the data is and why it applies.

CURRENT ARCHITECTURE

The current app has a canonical Sports Edge pick database and grading pipeline.

Current browser objects may include:

- SportsEdgeDatabase
- SportsEdgeRecent
- SportsEdgePipeline
- SportsEdgePerformance
- SportsEdgeIntelligence

Do not assume every existing file is correct.

Always audit the latest uploaded repository before modifying it.

DO NOT:

- Replace the current design
- Remove current tabs
- Mix Sports Edge picks into MLB game-log evidence
- Add duplicate data sources
- Create another disconnected grading system
- Use random environment assignments
- Count duplicate representations of the same game
- Present imported trends as verified game-log calculations

DEVELOPMENT METHOD

Work in small verified releases.

Do not attempt the entire platform in one update.

Each release must include:

- Exact files changed
- Exact files added
- Exact installation instructions
- Changelog
- Validation steps
- Rollback instructions
- Audit output

PHASED ROADMAP

PHASE 1 — DATA SOURCE AUDIT

Goal:
Determine what official and commercial data sources are needed.

Tasks:

- Audit current repository
- Identify current MLB data sources
- Identify which fields the MLB Stats API provides
- Identify which fields require an odds provider
- Define the game schema
- Define data licensing and storage requirements

No UI changes.

PHASE 2 — MLB GAME DATABASE FOUNDATION

Goal:
Store every MLB game for one test date range.

Tasks:

- Create MLB games table
- Import official schedule and game feeds
- Store final and F5 scores
- Store teams, pitchers, venue and series information
- Prevent duplicate gamePk records
- Produce import audit

Test with a small date range first.

PHASE 3 — FULL SEASON BACKFILL

Goal:
Import every game from the current MLB season.

Tasks:

- Batch by date
- Retry failures
- Log unresolved games
- Create data-quality dashboard
- Verify expected game counts

PHASE 4 — ENVIRONMENT ENGINE

Goal:
Generate verified pregame environment fields for every game.

Tasks:

- Home/away
- Favorite/underdog when odds exist
- Division
- Series number
- Previous game result
- Previous scoring
- Rest
- Pitcher handedness
- Day/night
- Weather if available
- Odds buckets

PHASE 5 — GAME-LOG TREND ENGINE

Goal:
Calculate trends from every MLB game.

Tasks:

- Team moneyline history
- Home/away splits
- Favorite/underdog splits
- F5 results
- Totals
- Odds buckets
- Opponent
- Pitcher
- Rest
- Series position
- Combined environments

PHASE 6 — MATCHED EVIDENCE UI

Goal:
Connect current picks to verified MLB historical evidence.

Keep Verified Game Logs separate from Stored Trend Database.

PHASE 7 — AUTOMATION

Goal:
Automatically import and process completed MLB games every day.

FIRST TASK

Do not build everything immediately.

Start by asking me to upload the exact current deployed repository ZIP.

Then perform a repository and data-source audit.

The first deliverable should be:

SPORTS EDGE MLB INTELLIGENCE DATABASE — PHASE 1 TECHNICAL PLAN

It must define:

- Exact data schema
- Data-source mapping
- Which fields come from MLB Stats API
- Which fields require another provider
- Database tables
- Relationships
- Import workflow
- Deduplication rules
- Validation rules
- Phase 2 implementation files
- What information or accounts are needed from me

Do not modify the UI in Phase 1.
On step 1 was i not supposed to commit to main branch? On step 2 this is what i see in environments. I am at a loss. help me step by step.
this is what i see
V1-GIT-phase-2-mlb-database.zip
Zip Archive
V1-GIT-main (7).zip
Zip Archive
V1-GIT-main (8).zip
Zip Archive
The code pathway is wrong, Let me send you the zip again s you knw the format i have currently. However do not change this process, when i send this zip i want to resume and keep this current code process we are doing, i just want to make sure you know and give me the right place to put it.
This what happened after i changed package json

Excellent. I immediately see the problem.

This isn't just a syntax error—your entire scripts section got overwritten. That means my previous instruction was wrong for your repository. Good catch.

Replace your entire package.json with this for now:

{
  "name": "sports-edge",
  "version": "11.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check": "node --check lib/mlb/supabase.js && node --check lib/mlb/transform.js && node --check lib/mlb/stats-api-client.js && node --check lib/mlb/importer.js",
    "validate:phase2a": "node scripts/validate-phase2a.mjs"
  }
}
BUT...

I think we just uncovered a much bigger problem.

Your package.json is only 9 lines long.

A normal Vite/Vercel application should look more like:

{
  "scripts": {
    "dev": "...",
    "build": "...",
    "preview": "...",
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}

That tells me your package.json is not the original one from the repository.

I do NOT want you to continue coding yet.

I want to fix this once so we never fight these issues again.

Here's what I want instead

Upload only your original package.json from before we started editing.

Or if you've already committed this change, go to GitHub:

Open package.json.
Click History.
Open the version before today's edits.
Copy and paste that entire file here.

Don't edit it first.

Why I'm stopping here

I don't want to accidentally remove:

your build script,
your Vercel configuration,
your dependencies,
your development tools.

If we keep building on a broken package.json, every deployment will fail even if the MLB code is perfect.

From this point forward, I'm changing how we do this.

I am never again going to ask you to replace an entire existing file unless I've seen that exact file from your repository first.

We'll modify the real files you have, not generic versions. That will make the rest of Release 1 much smoother and keep your app deployable after every step.

package json hasnt changed in a while, can you just create a perfectly functioning one now

Yes. I checked the actual uploaded repository, and your original package.json is intentionally minimal because this is a static Vercel app with serverless API files. It does not need Vite dependencies or a build script.

Replace your entire package.json with this exact version:

{
  "name": "sports-edge",
  "version": "11.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "check": "node --check api/live-data.js && node --check api/grade-picks.js && node --check api/odds.js && node --check api/intelligence-sync.js && node --check sports/mlb/core/sports-edge-database.js && node --check sports/mlb/core/master-ledger.js && node --check sports/mlb/core/intelligence-engine.js && node --check sports/mlb/core/intelligence-pipeline.js && node --check sports/mlb/core/recent-results.js && node --check sports/mlb/core/performance-engine.js && node --check sports/mlb/mlb-app.js && node --check sports/mlb/mlb-data.js && node --check sports/nfl/nfl-app.js && node --check api/mlb/import.js && node --check api/mlb/status.js && node --check api/mlb/audit.js && node --check lib/mlb/auth.js && node --check lib/mlb/http.js && node --check lib/mlb/supabase.js && node --check lib/mlb/transform.js && node --check lib/mlb/stats-api-client.js && node --check lib/mlb/importer.js",
    "validate:phase2a": "node scripts/validate-phase2a.mjs"
  }
}

The only change from your valid repository version is this addition:

node --check lib/mlb/stats-api-client.js
Then commit it

Use this commit message:

Fix package.json and validate MLB Stats API client

Vercel should rebuild automatically.

What should happen

The previous JSON parsing error should disappear.

If another build error appears, it will now identify the actual JavaScript file and line causing it, rather than failing on package.json.

Do not add:

dependencies
devDependencies
a build script
Vite
React
npm packages

Your repository does not currently require those.

done, next step
Next step: replace the SQL migration

The current migration does not contain the RPC functions your importer now calls. Replace this file:

supabase/migrations/002_mlb_intelligence_foundation.sql

with the corrected version below:

002_mlb_intelligence_foundation.sql

This version now matches:

lib/mlb/importer.js
lib/mlb/transform.js
api/mlb/status.js
api/mlb/audit.js

It includes the required database functions:

sports_edge_mlb_start_import
sports_edge_mlb_finish_import
sports_edge_mlb_log_error
sports_edge_mlb_upsert_game
sports_edge_mlb_status

It also adds:

permanent gamePk uniqueness;
idempotent game upserts;
teams, venues, pitchers, innings, weather, and raw MLB payloads;
import-run and import-error auditing;
first-five validation;
service-role-only access;
database status and duplicate checks.
Exactly what to do
Download the SQL file above.
Open your repository.
Go to:
supabase/migrations/
Delete the contents of:
002_mlb_intelligence_foundation.sql
Paste in the downloaded file’s contents.
Save it.
Commit with:
Align MLB migration with importer RPC functions

Do not run it in Supabase yet.

Once that commit finishes, reply:

MIGRATION REPLACED

Then the next step is validating and correcting lib/mlb/stats-api-client.js against the actual MLB response structure.

Library
/
DWAN &SAM APP
/
002_mlb_intelligence_foundation.sql
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

Library
/
DWAN &SAM APP
/
002_mlb_intelligence_foundation.sql
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
