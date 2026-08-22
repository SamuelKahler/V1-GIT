-- Sports Edge NFL Intelligence Backbone V1
-- Creates an isolated NFL schema. Does not modify MLB tables.

create extension if not exists pgcrypto;
create schema if not exists nfl;

create table if not exists nfl.teams (
  team_id uuid primary key default gen_random_uuid(),
  abbreviation text not null unique,
  team_name text not null,
  conference text,
  division text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nfl.games (
  game_id uuid primary key default gen_random_uuid(),
  external_game_id text unique,
  season integer not null,
  week integer,
  season_type text not null default 'REG',
  game_date date,
  kickoff_at timestamptz,
  away_team text not null references nfl.teams(abbreviation),
  home_team text not null references nfl.teams(abbreviation),
  venue text,
  status text not null default 'SCHEDULED',
  away_q1 integer, away_q2 integer, away_q3 integer, away_q4 integer, away_ot integer,
  home_q1 integer, home_q2 integer, home_q3 integer, home_q4 integer, home_ot integer,
  away_halftime integer, home_halftime integer,
  away_final integer, home_final integer,
  source text,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (away_team <> home_team)
);
create index if not exists nfl_games_season_week_idx on nfl.games(season, week);
create index if not exists nfl_games_date_idx on nfl.games(game_date);
create index if not exists nfl_games_teams_idx on nfl.games(away_team, home_team);

create table if not exists nfl.team_game_facts (
  game_id uuid not null references nfl.games(game_id) on delete cascade,
  team_abbr text not null references nfl.teams(abbreviation),
  opponent_abbr text not null references nfl.teams(abbreviation),
  is_home boolean not null,
  is_favorite boolean,
  is_underdog boolean,
  division_game boolean,
  conference_game boolean,
  primetime boolean,
  international_game boolean,
  rest_days integer,
  opponent_rest_days integer,
  rest_advantage boolean,
  rest_disadvantage boolean,
  previous_result text,
  previous_ats_result text,
  previous_total_result text,
  opening_moneyline integer,
  closing_moneyline integer,
  opening_spread numeric,
  closing_spread numeric,
  opening_total numeric,
  closing_total numeric,
  moneyline_result text,
  ats_result text,
  total_result text,
  environment_tags text[] not null default '{}',
  data_complete boolean not null default false,
  calculated_at timestamptz not null default now(),
  primary key(game_id, team_abbr)
);
create index if not exists nfl_team_game_facts_team_idx on nfl.team_game_facts(team_abbr);
create index if not exists nfl_team_game_facts_env_idx on nfl.team_game_facts using gin(environment_tags);

create table if not exists nfl.market_history (
  market_id uuid primary key default gen_random_uuid(),
  game_id uuid references nfl.games(game_id) on delete cascade,
  captured_at timestamptz not null,
  sportsbook text,
  market_type text not null,
  side text,
  line numeric,
  american_odds integer,
  is_opening boolean not null default false,
  is_closing boolean not null default false,
  source text,
  created_at timestamptz not null default now()
);
create index if not exists nfl_market_history_game_idx on nfl.market_history(game_id, market_type, captured_at);

create table if not exists nfl.player_game_stats (
  player_game_id uuid primary key default gen_random_uuid(),
  game_id uuid not null references nfl.games(game_id) on delete cascade,
  player_id text,
  player_name text not null,
  team_abbr text not null references nfl.teams(abbreviation),
  position text,
  snaps integer,
  pass_attempts integer,
  completions integer,
  pass_yards integer,
  pass_tds integer,
  interceptions integer,
  rush_attempts integer,
  rush_yards integer,
  rush_tds integer,
  targets integer,
  receptions integer,
  receiving_yards integer,
  receiving_tds integer,
  source text,
  source_payload jsonb,
  created_at timestamptz not null default now(),
  unique(game_id, player_name, team_abbr)
);
create index if not exists nfl_player_game_stats_player_idx on nfl.player_game_stats(player_name, team_abbr);

create table if not exists nfl.continuity_eras (
  era_id uuid primary key default gen_random_uuid(),
  team_abbr text not null references nfl.teams(abbreviation),
  era_key text not null unique,
  start_date date not null,
  end_date date,
  head_coach text,
  quarterback text,
  offensive_system text,
  coach_continuity boolean,
  qb_continuity boolean,
  core_offense_continuity text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists nfl_continuity_team_idx on nfl.continuity_eras(team_abbr, start_date);

-- Reference/seed tables preserve the owner's historical research while canonical game data is built.
create table if not exists nfl.reference_win_trends (
  reference_trend_id bigserial primary key,
  team_abbr text not null,
  market text not null,
  environment text not null,
  last_updated text,
  hit_rate numeric not null,
  games integer not null,
  trend_start_year integer,
  source_label text not null default 'PROJECT_OWNER_SEED',
  created_at timestamptz not null default now(),
  unique(team_abbr, market, environment, trend_start_year, games, hit_rate)
);

create table if not exists nfl.reference_system_rows (
  source_id text primary key,
  season integer,
  week integer,
  previous_week_results text,
  away_team text,
  home_team text,
  recorded_outcome text,
  line_text text,
  context_text text,
  source_label text not null default 'PROJECT_OWNER_SEED',
  created_at timestamptz not null default now()
);

create table if not exists nfl.reference_prop_observations (
  source_id text primary key,
  season integer,
  week text,
  player_name text not null,
  team_abbr text,
  opponent_text text,
  bet_text text not null,
  result text check (result in ('HIT','MISS','PUSH','VOID') or result is null),
  environment text,
  market_style text,
  source_label text not null default 'PROJECT_OWNER_SEED',
  created_at timestamptz not null default now()
);
create index if not exists nfl_ref_props_player_idx on nfl.reference_prop_observations(player_name, market_style);
create index if not exists nfl_ref_props_env_idx on nfl.reference_prop_observations(environment);

create table if not exists nfl.data_quality_issues (
  issue_id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id text,
  severity text not null default 'REVIEW',
  issue_code text not null,
  issue_text text not null,
  source_payload jsonb,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

insert into nfl.teams(abbreviation,team_name,conference,division) values
('ARI','Arizona Cardinals','NFC','West'),('ATL','Atlanta Falcons','NFC','South'),('BAL','Baltimore Ravens','AFC','North'),('BUF','Buffalo Bills','AFC','East'),('CAR','Carolina Panthers','NFC','South'),('CHI','Chicago Bears','NFC','North'),('CIN','Cincinnati Bengals','AFC','North'),('CLE','Cleveland Browns','AFC','North'),('DAL','Dallas Cowboys','NFC','East'),('DEN','Denver Broncos','AFC','West'),('DET','Detroit Lions','NFC','North'),('GB','Green Bay Packers','NFC','North'),('HOU','Houston Texans','AFC','South'),('IND','Indianapolis Colts','AFC','South'),('JAX','Jacksonville Jaguars','AFC','South'),('KC','Kansas City Chiefs','AFC','West'),('LV','Las Vegas Raiders','AFC','West'),('LAC','Los Angeles Chargers','AFC','West'),('LAR','Los Angeles Rams','NFC','West'),('MIA','Miami Dolphins','AFC','East'),('MIN','Minnesota Vikings','NFC','North'),('NE','New England Patriots','AFC','East'),('NO','New Orleans Saints','NFC','South'),('NYG','New York Giants','NFC','East'),('NYJ','New York Jets','AFC','East'),('PHI','Philadelphia Eagles','NFC','East'),('PIT','Pittsburgh Steelers','AFC','North'),('SEA','Seattle Seahawks','NFC','West'),('SF','San Francisco 49ers','NFC','West'),('TB','Tampa Bay Buccaneers','NFC','South'),('TEN','Tennessee Titans','AFC','South'),('WSH','Washington Commanders','NFC','East')
on conflict (abbreviation) do update set team_name=excluded.team_name,conference=excluded.conference,division=excluded.division,active=true;

create or replace function nfl.reference_trend_strength(p_hit_rate numeric, p_games integer, p_start_year integer)
returns numeric language sql immutable as $$
  select round(
    greatest(0, least(100,
      ((coalesce(p_hit_rate,50)-50) * 1.25)
      + least(coalesce(p_games,0),40) * 0.9
      + case when coalesce(p_games,0) >= 12 then 10 when coalesce(p_games,0) >= 8 then 5 else 0 end
      + case when coalesce(p_start_year, extract(year from current_date)::int) <= extract(year from current_date)::int - 2 then 4 else 0 end
    )), 1
  );
$$;

create or replace function public.sports_edge_nfl_reference_trends(p_limit integer default 12)
returns jsonb language sql stable security definer set search_path = public,nfl as $$
  select coalesce(jsonb_agg(to_jsonb(t) order by t.strength_score desc, t.games desc, t.hit_rate desc),'[]'::jsonb)
  from (
    select team_abbr, market, environment, hit_rate, games, trend_start_year,
           nfl.reference_trend_strength(hit_rate,games,trend_start_year) as strength_score,
           case when games >= 12 then 'STRONG SAMPLE' when games >= 8 then 'QUALIFIED SAMPLE' else 'SMALL SAMPLE' end as sample_label,
           source_label
    from nfl.reference_win_trends
    order by strength_score desc, games desc, hit_rate desc
    limit greatest(1, least(coalesce(p_limit,12),50))
  ) t;
$$;

create or replace function public.sports_edge_nfl_prop_profiles(p_limit integer default 12)
returns jsonb language sql stable security definer set search_path = public,nfl as $$
  select coalesce(jsonb_agg(to_jsonb(p) order by p.hit_rate desc, p.games desc),'[]'::jsonb)
  from (
    select player_name, team_abbr, market_style,
           count(*) filter (where result in ('HIT','MISS'))::int as games,
           count(*) filter (where result='HIT')::int as hits,
           count(*) filter (where result='MISS')::int as misses,
           round(100.0 * count(*) filter (where result='HIT') / nullif(count(*) filter (where result in ('HIT','MISS')),0),1) as hit_rate,
           case when count(*) filter (where result in ('HIT','MISS')) >= 10 then 'STRONG SAMPLE' when count(*) filter (where result in ('HIT','MISS')) >= 6 then 'QUALIFIED SAMPLE' else 'SMALL SAMPLE' end as sample_label
    from nfl.reference_prop_observations
    group by player_name, team_abbr, market_style
    having count(*) filter (where result in ('HIT','MISS')) >= 3
    order by hit_rate desc, games desc
    limit greatest(1, least(coalesce(p_limit,12),50))
  ) p;
$$;

create or replace function public.sports_edge_nfl_reference_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public,nfl as $$
declare
  payload jsonb;
begin
  select jsonb_build_object(
    'release','NFL_INTELLIGENCE_BACKBONE_V1',
    'canonical',jsonb_build_object(
      'teams',(select count(*) from nfl.teams where active),
      'games',(select count(*) from nfl.games),
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
    'checkedAt',now()
  ) into payload;
  return payload;
end;
$$;

create or replace function public.sports_edge_nfl_backbone_audit()
returns jsonb language plpgsql stable security definer set search_path = public,nfl as $$
declare
  teams_count integer;
  ref_trends integer;
  ref_systems integer;
  ref_props integer;
begin
  select count(*) into teams_count from nfl.teams where active;
  select count(*) into ref_trends from nfl.reference_win_trends;
  select count(*) into ref_systems from nfl.reference_system_rows;
  select count(*) into ref_props from nfl.reference_prop_observations;
  return jsonb_build_object(
    'release','NFL_INTELLIGENCE_BACKBONE_V1',
    'passed',(teams_count=32 and ref_trends>0 and ref_systems>0 and ref_props>0),
    'teams',teams_count,
    'canonicalGames',(select count(*) from nfl.games),
    'canonicalTeamGameFacts',(select count(*) from nfl.team_game_facts),
    'canonicalPlayerGameStats',(select count(*) from nfl.player_game_stats),
    'referenceWinTrends',ref_trends,
    'referenceSystemRows',ref_systems,
    'referencePropObservations',ref_props,
    'unresolvedQualityIssues',(select count(*) from nfl.data_quality_issues where not resolved),
    'checkedAt',now()
  );
end;
$$;

grant usage on schema nfl to service_role;
grant select,insert,update,delete on all tables in schema nfl to service_role;
grant usage,select on all sequences in schema nfl to service_role;
grant execute on function public.sports_edge_nfl_reference_trends(integer) to anon, authenticated, service_role;
grant execute on function public.sports_edge_nfl_prop_profiles(integer) to anon, authenticated, service_role;
grant execute on function public.sports_edge_nfl_reference_dashboard() to anon, authenticated, service_role;
grant execute on function public.sports_edge_nfl_backbone_audit() to service_role;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','ATS','AFTER A WIN','6/17/2026',66.7,12,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','ATS','AFTER A LOSS','6/17/2026',66.7,6,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','ATS','HOME FAVORITE','6/17/2026',66.7,6,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','OVER','AWAY UNDERDOG','6/17/2026',71.4,8,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','UNDER','HOME FAVORITE','6/17/2026',83.3,6,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('CHI','UNDER','VS. CONFERENCE','6/17/2026',61.5,14,2025,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ATS','AWAY FAVORITE','7/20/2026',80,10,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ATS','AWAY FAVORITE','7/20/2026',81.3,16,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ATS','VS. CONFERENCE','7/20/2026',56,25,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ATS','VS. CONFERENCE','7/20/2026',60,40,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','AFTER A LOSS','7/20/2026',80,10,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','AFTER A LOSS','7/20/2026',86.7,15,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','REST DISADVANTAGE','7/20/2026',100,4,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','REST DISADVANTAGE','7/20/2026',75,8,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','VS. CONFERENCE','7/20/2026',68,25,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','VS. CONFERENCE','7/20/2026',67.5,40,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','VS. DIVISION','7/20/2026',66.7,12,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','ML','VS. DIVISION','7/20/2026',66.7,18,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','AFTER A WIN','7/20/2026',60.9,23,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','AFTER A WIN','7/20/2026',64.9,37,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','HOME FAVORITE','7/20/2026',66.7,18,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','HOME FAVORITE','7/20/2026',67.9,28,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','VS. CONFERENCE','7/20/2026',56,25,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('DET','OVER','VS. CONFERENCE','7/20/2026',60,40,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('GB','ATS','HOME FAVORITE','6/19/2026',57.1,14,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('GB','OVER','AFTER A WIN','6/17/2026',57.9,20,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('GB','OVER','AWAY FAVORITE','6/17/2026',63.6,11,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('GB','OVER','REST DISADVANTAGE','6/17/2026',66.7,6,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('GB','UNDER','AFTER A LOSS','6/17/2026',61.5,13,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('LAC','OVER','REST ADVANTAGE','6/19/2026',83.3,6,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('LAC','UNDER','AFTER A WIN','6/19/2026',61.9,22,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('LAC','UNDER','AWAY UNDERDOG','6/19/2026',100,6,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('LAC','UNDER','REST DISADVANTAGE','6/19/2026',87.5,8,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','AFTER A WIN','6/17/2026',67.9,28,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','AFTER A WIN','6/17/2026',64.9,39,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','AFTER A WIN','6/17/2026',64.1,55,2022,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','REST DISADVANTAGE','6/17/2026',71.4,7,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','VS. CONFERENCE','6/17/2026',60.7,28,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ATS','VS. DIVISION','6/17/2026',61.5,13,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','ML','AWAY UNDERDOG','6/17/2026',71.4,7,2022,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','AFTER A LOSS','6/17/2026',66.7,9,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','AFTER A LOSS','6/17/2026',73.3,15,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','AFTER A LOSS','6/17/2026',77.8,18,2022,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','HOME FAVORITE','6/17/2026',68,20,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','AWAY UNDERDOG','6/17/2026',71.4,7,2022,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','REST ADVANTAGE','6/17/2026',81.8,11,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','REST ADVANTAGE','6/17/2026',81.8,12,2023,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('PHI','UNDER','REST ADVANTAGE','6/17/2026',75,16,2022,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('TB','OVER','AFTER A WIN','6/19/2026',64.7,17,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('TB','OVER','HOME FAVORITE','6/19/2026',61.5,13,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('TB','OVER','HOME UNDERDOG','6/19/2026',75,5,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('TB','OVER','VS. CONFERENCE','6/19/2026',56,25,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_win_trends(team_abbr,market,environment,last_updated,hit_rate,games,trend_start_year,source_label) values ('TB','OVER','VS. DIVISION','6/19/2026',66.7,12,2024,'PROJECT_OWNER_SEED') on conflict do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-1',2024,2,'OVER vs. OVER','NO','DAL','OVER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-2',2024,2,'OVER vs. OVER','NO','DAL','AWAY UNDERDOG ML','*225','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-3',2024,2,'NO COVER vs. NO COVER','NYJ','TEN','AWAY SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-4',2024,2,'NO COVER vs. NO COVER','LAR','ARI','HOME SPREAD','-1.5','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-5',2024,2,'NO COVER vs. NO COVER','LAR','ARI','OVER','49','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-6',2024,2,'NO COVER vs. NO COVER','NYG','WSH','UNDER','44','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-7',2024,2,'NO COVER vs. NO COVER','NYG','WSH','HOME SPREAD','-1.5','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-8',2024,2,'COVER vs. COVER','SF','MIN','UNDER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-9',2024,2,'COVER vs. COVER','SF','MIN','HOME UNDERDOG ML','*225','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-10',2024,2,'COVER vs. COVER','CHI','HOU','UNDER','45.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-11',2024,3,'OVER vs. OVER','BAL','DAL','OVER','49','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-12',2024,3,'OVER vs. OVER','BAL','DAL','AWAY SPREAD','-1','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-13',2024,3,'UNDER vs. UNDER','DEN','TB','AWAY UNDERDOG ML','*240','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-14',2024,3,'UNDER vs. UNDER','DEN','TB','UNDER','39.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-15',2024,3,'UNDER vs. UNDER','HOU','MIN','UNDER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-16',2024,3,'UNDER vs. UNDER','HOU','MIN','HOME UNDERDOG ML','*130','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-17',2024,3,'UNDER vs. UNDER','LAC','PIT','UNDER','35.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-18',2024,3,'UNDER vs. UNDER','LAC','PIT','HOME SPREAD','-2','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-19',2024,3,'UNDER vs. UNDER','NYG','CLE','UNDER','38.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-20',2024,3,'UNDER vs. UNDER','NYG','CLE','AWAY UNDERDOG ML','-6.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-21',2024,3,'UNDER vs. UNDER','CHI','IND','UNDER','42.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-22',2024,3,'UNDER vs. UNDER','CHI','IND','HOME SPREAD','-1.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-23',2024,3,'UNDER vs. UNDER','JAX','BUF','OVER','46','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-24',2024,3,'UNDER vs. UNDER','JAX','BUF','HOME SPREAD','-5.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-25',2024,3,'NO COVER vs. NO COVER','BAL','DAL','OVER','49','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-26',2024,3,'OVER vs. OVER','BAL','DAL','AWAY SPREAD','-1','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-27',2024,3,'COVER vs. COVER','LAC','PIT','UNDER','35.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-28',2024,3,'COVER vs. COVER','LAC','PIT','HOME SPREAD','-2','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-29',2024,3,'COVER vs. COVER','WSH','CIN','OVER','48.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-30',2024,3,'COVER vs. COVER','WSH','CIN','AWAY UNDERDOG ML','*275','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-31',2024,4,'OVER vs. OVER','CIN','CAR','OVER','47','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-32',2024,4,'OVER vs. OVER','CIN','CAR','AWAY SPREAD','-4','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-33',2024,4,'OVER vs. OVER','BUF','BAL','UNDER','46.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-34',2024,4,'OVER vs. OVER','BUF','BAL','HOME SPREAD','-2.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-35',2024,4,'UNDER vs. UNDER','DEN','NYJ','UNDER','39.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-36',2024,4,'UNDER vs. UNDER','DEN','NYJ','AWAY UNDERDOG ML','*250','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-37',2024,4,'UNDER vs. UNDER','PHI','TB','OVER','44','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-38',2024,4,'UNDER vs. UNDER','PHI','TB','HOME UNDERDOG ML','*120','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-39',2024,4,'UNDER vs. UNDER','NO','ATL','OVER','42.5','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-40',2024,4,'UNDER vs. UNDER','PIT','IND','OVER','40','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-41',2024,4,'UNDER vs. UNDER','PIT','IND','HOME UNDERDOG ML','*100','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-42',2024,4,'UNDER vs. UNDER','KC','LAC','UNDER','40','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-43',2024,4,'UNDER vs. UNDER','SEA','DET','OVER','46.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-44',2024,4,'UNDER vs. UNDER','SEA','DET','HOME SPREAD','-3.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-45',2024,4,'NO COVER vs. NO COVER','NO','ATL','OVER','42.5','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-46',2024,4,'NO COVER vs. NO COVER','JAX','HOU','UNDER','45.5','DIVISION','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-47',2024,4,'NO COVER vs. NO COVER','NE','SF','OVER','40.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-48',2024,4,'NO COVER vs. NO COVER','NE','SF','HOME SPREAD','-10.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-49',2024,4,'NO COVER vs. NO COVER','CLE','LV','UNDER','37','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-50',2024,4,'NO COVER vs. NO COVER','CLE','LV','HOME SPREAD','-2','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-51',2024,4,'COVER vs. COVER','MIN','GB','OVER','43.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-52',2024,4,'COVER vs. COVER','MIN','GB','AWAY UNDERDOG ML','*125','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-53',2024,4,'COVER vs. COVER','PIT','IND','OVER','40','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-54',2024,4,'COVER vs. COVER','PIT','IND','HOME UNDERDOG ML','*100','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-55',2024,4,'COVER vs. COVER','BUF','BAL','UNDER','46.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-56',2024,4,'COVER vs. COVER','BUF','BAL','HOME SPREAD','-2.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-57',2024,4,'COVER vs. COVER','SEA','DET','OVER','46.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-58',2024,4,'COVER vs. COVER','SEA','DET','HOME SPREAD','-3.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-59',2024,5,'OVER vs. OVER','TB','ATL','HOME SPREAD','-1.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-60',2024,5,'OVER vs. OVER','TB','ATL','OVER','44','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-61',2024,5,'OVER vs. OVER','MIA','NE','AWAY UNDERDOG ML','*100','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-62',2024,5,'OVER vs. OVER','MIA','NE','UNDER','36.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-63',2024,5,'OVER vs. OVER','CAR','CHI','HOME SPREAD','-4.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-64',2024,5,'OVER vs. OVER','CAR','CHI','OVER','-4.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-65',2024,5,'OVER vs. OVER','ARI','SF','AWAY UNDERDOG ML','*235','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-66',2024,5,'OVER vs. OVER','ARI','SF','UNDER','49.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-67',2024,5,'OVER vs. OVER','GB','LAR','AWAY SPREAD','-3','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-68',2024,5,'OVER vs. OVER','GB','LAR','UNDER','48.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-69',2024,5,'UNDER vs. UNDER','BUF','HOU','HOME UNDERDOG ML','*105','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-70',2024,5,'UNDER vs. UNDER','BUF','HOU','UNDER','47.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-71',2024,5,'UNDER vs. UNDER','LV','DEN','HOME SPREAD','-3','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-72',2024,5,'UNDER vs. UNDER','LV','DEN','OVER','36','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-73',2024,5,'NO COVER vs. NO COVER','MIA','NE','AWAY UNDERDOG ML','*100','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-74',2024,5,'NO COVER vs. NO COVER','MIA','NE','UNDER','36.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-75',2024,5,'NO COVER vs. NO COVER','BUF','HOU','HOME UNDERDOG ML','*105','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-76',2024,5,'NO COVER vs. NO COVER','BUF','HOU','UNDER','47.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-77',2024,5,'NO COVER vs. NO COVER','GB','LAR','AWAY SPREAD','-3','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-78',2024,5,'NO COVER vs. NO COVER','GB','LAR','UNDER','48.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-79',2024,5,'NO COVER vs. NO COVER','DAL','PIT','AWAY UNDERDOG ML','*110','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-80',2024,5,'COVER vs. COVER','IND','JAX','OVER','46','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-81',2024,5,'COVER vs. COVER','BAL','CIN','OVER','49.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-82',2024,5,'COVER vs. COVER','LV','DEN','HOME SPREAD','-3','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-83',2024,5,'COVER vs. COVER','LV','DEN','OVER','36','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-84',2024,6,'OVER vs. OVER','JAX','CHI','OVER','44.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-85',2024,6,'OVER vs. OVER','JAX','CHI','AWAY UNDERDOG ML','*105','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-86',2024,6,'OVER vs. OVER','WSH','BAL','OVER','51','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-87',2024,6,'OVER vs. OVER','WSH','BAL','HOME SPREAD','-6.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-88',2024,6,'OVER vs. OVER','ATL','CAR','OVER','46.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-89',2024,6,'OVER vs. OVER','ATL','CAR','AWAY SPREAD','-6','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-90',2024,6,'OVER vs. OVER','CIN','NYG','AWAY SPREAD','-3.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-91',2024,6,'OVER vs. OVER','CIN','NYG','UNDER','48','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-92',2024,6,'UNDER vs. UNDER','HOU','NE','AWAY SPREAD','-6.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-93',2024,6,'UNDER vs. UNDER','HOU','NE','OVER','37.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-94',2024,6,'UNDER vs. UNDER','BUF','NYJ','OVER','41','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-95',2024,6,'UNDER vs. UNDER','BUF','NYJ','AWAY SPREAD','-2.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-96',2024,6,'NO COVER vs. NO COVER','SF','SEA','OVER','49.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-97',2024,6,'NO COVER vs. NO COVER','SF','SEA','AWAY SPREAD','-3.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-98',2024,6,'NO COVER vs. NO COVER','TB','NO','AWAY SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-99',2024,6,'NO COVER vs. NO COVER','TB','NO','OVER','41','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-100',2024,6,'NO COVER vs. NO COVER','PIT','LV','AWAY SPREAD','-3','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-101',2024,6,'NO COVER vs. NO COVER','PIT','LV','OVER','37','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-102',2024,6,'NO COVER vs. NO COVER','BUF','NYJ','OVER','41','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-103',2024,6,'NO COVER vs. NO COVER','BUF','NYJ','AWAY SPREAD','-2.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-104',2024,6,'COVER vs. COVER','WSH','BAL','OVER','51','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-105',2024,6,'COVER vs. COVER','WSH','BAL','HOME SPREAD','-6.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-106',2024,6,'COVER vs. COVER','ARI','GB','HOME SPREAD','-5.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-107',2024,6,'COVER vs. COVER','ARI','GB','UNDER','47.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-108',2024,7,'OVER vs. OVER','SEA','ATL','AWAY UNDERDOG ML','*110','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-109',2024,7,'OVER vs. OVER','SEA','ATL','OVER','51','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-110',2024,7,'OVER vs. OVER','NE','JAX','HOME SPREAD','-5.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-111',2024,7,'OVER vs. OVER','NE','JAX','OVER','42.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-112',2024,7,'OVER vs. OVER','CAR','WSH','HOME SPREAD','-7.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-113',2024,7,'OVER vs. OVER','CAR','WSH','OVER','51','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-114',2024,7,'OVER vs. OVER','NYJ','PIT','HOME UNDERDOG ML','*105','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-115',2024,7,'OVER vs. OVER','NYJ','PIT','OVER','38.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-116',2024,7,'OVER vs. OVER','BAL','TB','OVER','49.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-117',2024,7,'OVER vs. OVER','BAL','TB','AWAY UNDERDOG ML','*120','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-118',2024,7,'UNDER vs. UNDER','PHI','NYG','AWAY SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-119',2024,7,'UNDER vs. UNDER','PHI','NYG','UNDER','42.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-120',2024,7,'UNDER vs. UNDER','CIN','CLE','AWAY SPREAD','-6','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-121',2024,7,'UNDER vs. UNDER','CIN','CLE','UNDER','41.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-122',2024,7,'NO COVER vs. NO COVER','NE','JAX','HOME SPREAD','-5.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-123',2024,7,'NO COVER vs. NO COVER','NE','JAX','OVER','42.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-124',2024,7,'COVER vs. COVER','HOU','GB','UNDER','47.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-125',2024,8,'OVER vs. OVER','NYJ','NE','HOME UNDERDOG ML','*250','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-126',2024,8,'OVER vs. OVER','NYJ','NE','OVER','41.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-127',2024,8,'OVER vs. OVER','TEN','DET','HOME SPREAD','-10.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-128',2024,8,'UNDER vs. UNDER','ARI','MIA','AWAY UNDERDOG ML','*135','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-129',2024,8,'UNDER vs. UNDER','ARI','MIA','OVER','46.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-130',2024,8,'UNDER vs. UNDER','PHI','CIN','AWAY UNDERDOG ML','*120','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-131',2024,8,'UNDER vs. UNDER','PHI','CIN','OVER','48','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-132',2024,8,'UNDER vs. UNDER','KC','LV','OVER','41.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-133',2024,8,'NO COVER vs. NO COVER','MIN','LAR','AWAY UNDERDOG ML','*120','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-134',2024,8,'NO COVER vs. NO COVER','MIN','LAR','OVER','48','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-135',2024,8,'NO COVER vs. NO COVER','NYJ','NE','HOME UNDERDOG ML','*250','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-136',2024,8,'NO COVER vs. NO COVER','NYJ','NE','OVER','41.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-137',2024,8,'NO COVER vs. NO COVER','ATL','TB','AWAY SPREAD','-2.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-138',2024,8,'NO COVER vs. NO COVER','ATL','TB','OVER','46','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-139',2024,8,'COVER vs. COVER','IND','HOU','UNDER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-140',2024,8,'COVER vs. COVER','PHI','CIN','AWAY UNDERDOG ML','*120','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-141',2024,8,'COVER vs. COVER','PHI','CIN','OVER','48','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-142',2024,8,'COVER vs. COVER','BUF','SEA','AWAY SPREAD','-3','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-143',2024,8,'COVER vs. COVER','BUF','SEA','UNDER','47','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-144',2024,8,'COVER vs. COVER','KC','LV','OVER','41.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-145',2024,9,'OVER vs. OVER','DEN','BAL','OVER','46','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-146',2024,9,'OVER vs. OVER','DEN','BAL','HOME SPREAD','-9','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-147',2024,9,'OVER vs. OVER','LV','CIN','HOME SPREAD','-7','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-148',2024,9,'OVER vs. OVER','LV','CIN','OVER','46.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-149',2024,9,'OVER vs. OVER','NE','TEN','HOME SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-150',2024,9,'OVER vs. OVER','NE','TEN','UNDER','37.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-151',2024,9,'OVER vs. OVER','DAL','ATL','HOME SPREAD','-2.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-152',2024,9,'OVER vs. OVER','DAL','ATL','OVER','51.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-153',2024,9,'OVER vs. OVER','JAX','PHI','OVER','45.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-154',2024,9,'OVER vs. OVER','DET','GB','AWAY SPREAD','-3.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-155',2024,9,'OVER vs. OVER','DET','GB','UNDER','48','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-156',2024,9,'OVER vs. OVER','TB','KC','OVER','45.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-157',2024,9,'NO COVER vs. NO COVER','HOU','NYJ','HOME SPREAD','-2','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-158',2024,9,'NO COVER vs. NO COVER','HOU','NYJ','UNDER','42.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-159',2024,9,'NO COVER vs. NO COVER','NO','CAR','HOME UNDERDOG ML','*245','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-160',2024,9,'NO COVER vs. NO COVER','NO','CAR','OVER','43','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-161',2024,9,'NO COVER vs. NO COVER','TB','KC','OVER','45.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-162',2024,9,'COVER vs. COVER','LAC','CLE','AWAY SPREAD','-1`','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-163',2024,9,'COVER vs. COVER','LAC','CLE','UNDER','43.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-164',2024,9,'COVER vs. COVER','JAX','PHI','OVER','45.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-165',2024,10,'OVER vs. OVER','CIN','BAL','OVER','52.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-166',2024,10,'OVER vs. OVER','NYG','CAR','UNDER','41.5','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-167',2024,10,'OVER vs. OVER','NYG','CAR','HOME UNDERDOG ML','*190','PRIMETIME (INTERNATIONAL)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-168',2024,10,'OVER vs. OVER','DEN','KC','UNDER','42','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-169',2024,10,'UNDER vs. UNDER','NE','CHI','AWAY UNDERDOG ML','*190','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-170',2024,10,'UNDER vs. UNDER','NE','CHI','UNDER','38.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-171',2024,10,'UNDER vs. UNDER','TEN','LAC','HOME SPREAD','-7.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-172',2024,10,'UNDER vs. UNDER','TEN','LAC','OVER','38','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-173',2024,10,'UNDER vs. UNDER','DET','HOU','UNDER','48.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-174',2024,10,'NO COVER vs. NO COVER','DEN','KC','UNDER','42','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-175',2024,10,'NO COVER vs. NO COVER','PHI','DAL','AWAY SPREAD','-7','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-176',2024,10,'NO COVER vs. NO COVER','PHI','DAL','UNDER','42','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-177',2024,10,'COVER vs. COVER','MIN','JAX','AWAY SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-178',2024,10,'COVER vs. COVER','MIN','JAX','UNDER','47','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-179',2024,10,'COVER vs. COVER','CIN','BAL','OVER','52.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-180',2024,10,'COVER vs. COVER','MIA','LAR','AWAY UNDERDOG ML','*110','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-181',2024,11,'OVER vs. OVER','BAL','PIT','HOME UNDERDOG ML','*110','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-182',2024,11,'UNDER vs. UNDER','CLE','NO','OVER','44.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-183',2024,11,'UNDER vs. UNDER','CLE','NO','HOME UNDERDOG ML','*105','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-184',2024,11,'UNDER vs. UNDER','GB','CHI','UNDER','40','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-185',2024,11,'UNDER vs. UNDER','LAR','NE','AWAY SPREAD','-4.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-186',2024,11,'UNDER vs. UNDER','LAR','NE','OVER','43.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-187',2024,11,'UNDER vs. UNDER','ATL','DEN','HOME SPREAD','-2.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-188',2024,11,'UNDER vs. UNDER','ATL','DEN','UNDER','44','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-189',2024,11,'UNDER vs. UNDER','HOU','DAL','AWAY SPREAD','-7.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-190',2024,11,'NO COVER vs. NO COVER','MIN','TEN','AWAY SPREAD','-6','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-191',2024,11,'NO COVER vs. NO COVER','MIN','TEN','UNDER','39.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-192',2024,11,'NO COVER vs. NO COVER','JAX','DET','HOME SPREAD','-14','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-193',2024,11,'NO COVER vs. NO COVER','JAX','DET','OVER','46.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-194',2024,11,'NO COVER vs. NO COVER','GB','CHI','UNDER','40','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-195',2024,11,'NO COVER vs. NO COVER','IND','NYJ','AWAY UNDERDOG ML','*135','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-196',2024,11,'NO COVER vs. NO COVER','IND','NYJ','UNDER','43.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-197',2024,12,'OVER vs. OVER','NE','MIA','HOME SPREAD','-7','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-198',2024,12,'OVER vs. OVER','NE','MIA','OVER','46','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-199',2024,12,'OVER vs. OVER','DET','IND','AWAY SPREAD','-7.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-200',2024,12,'OVER vs. OVER','DET','IND','UNDER','50.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-201',2024,12,'UNDER vs. UNDER','MIN','CHI','OVER','39.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-202',2024,12,'UNDER vs. UNDER','SF','GB','HOME SPREAD','-2','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-203',2024,12,'UNDER vs. UNDER','SF','GB','OVER','47.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-204',2024,12,'NO COVER vs. NO COVER','DAL','WSH','AWAY UNDERDOG ML','*275','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-205',2024,12,'NO COVER vs. NO COVER','SF','GB','HOME SPREAD','-2','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-206',2024,12,'NO COVER vs. NO COVER','SF','GB','OVER','47.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-207',2024,12,'COVER vs. COVER','MIN','CHI','OVER','39.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-208',2024,12,'COVER vs. COVER','DET','IND','AWAY SPREAD','-7.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-209',2024,12,'COVER vs. COVER','DET','IND','UNDER','50.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-210',2024,12,'COVER vs. COVER','PHI','LAR','AWAY SPREAD','-3','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-211',2024,12,'COVER vs. COVER','PHI','LAR','OVER','49','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-212',2024,13,'OVER vs. OVER','TEN','WSH','OVER','44.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-213',2024,13,'OVER vs. OVER','TEN','WSH','HOME SPREAD','-6','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-214',2024,13,'OVER vs. OVER','PHI','BAL','AWAY UNDERDOG ML','*115','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-215',2024,13,'OVER vs. OVER','PHI','BAL','UNDER','51','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-216',2024,13,'NO COVER vs. NO COVER','ARI','MIN','UNDER','45','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-217',2024,13,'NO COVER vs. NO COVER','IND','NE','OVER','42.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-218',2024,13,'COVER vs. COVER','TB','CAR','OVER','46.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-219',2024,13,'COVER vs. COVER','PHI','BAL','AWAY UNDERDOG ML','*115','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-220',2024,13,'COVER vs. COVER','PHI','BAL','UNDER','51','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-221',2024,14,'OVER vs. OVER','CLE','PIT','HOME SPREAD','-6','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-222',2024,14,'OVER vs. OVER','CLE','PIT','UNDER','42.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-223',2024,14,'OVER vs. OVER','CIN','DAL','AWAY SPREAD','-5.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-224',2024,14,'OVER vs. OVER','CIN','DAL','UNDER','49.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-225',2024,14,'UNDER vs. UNDER','ATL','MIN','HOME SPREAD','-5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-226',2024,14,'UNDER vs. UNDER','ATL','MIN','OVER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-227',2024,14,'UNDER vs. UNDER','GB','DET','OVER','51.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-228',2024,14,'UNDER vs. UNDER','CHI','SF','HOME SPREAD','-4','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-229',2024,14,'UNDER vs. UNDER','CHI','SF','OVER','44','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-230',2024,14,'UNDER vs. UNDER','BUF','LAR','HOME UNDERDOG ML','*135','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-231',2024,14,'UNDER vs. UNDER','BUF','LAR','OVER','49','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-232',2024,14,'UNDER vs. UNDER','LAC','KC','UNDER','42.5','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-233',2024,14,'NO COVER vs. NO COVER','ATL','MIN','HOME SPREAD','-5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-234',2024,14,'NO COVER vs. NO COVER','ATL','MIN','OVER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-235',2024,14,'NO COVER vs. NO COVER','NYJ','MIA','OVER','45','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-236',2024,14,'COVER vs. COVER','CAR','PHI','UNDER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-237',2024,14,'COVER vs. COVER','SEA','ARI','AWAY UNDERDOG ML','*110','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-238',2024,14,'COVER vs. COVER','SEA','ARI','OVER','45.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-239',2024,15,'OVER vs. OVER','CHI','MIN','HOME SPREAD','-7','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-240',2024,15,'OVER vs. OVER','CHI','MIN','UNDER','43.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-241',2024,15,'OVER vs. OVER','LAR','SF','AWAY UNDERDOG ML','*120','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-242',2024,15,'OVER vs. OVER','LAR','SF','UNDER','49.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-243',2024,15,'OVER vs. OVER','BUF','DET','AWAY UNDERDOG ML','*115','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-244',2024,15,'OVER vs. OVER','BUF','DET','OVER','54.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-245',2024,15,'OVER vs. OVER','GB','SEA','AWAY SPREAD','-2','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-246',2024,15,'OVER vs. OVER','GB','SEA','UNDER','46','PRIMETIME (SNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-247',2024,15,'UNDER vs. UNDER','DAL','CAR','AWAY UNDERDOG ML','*120','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-248',2024,15,'UNDER vs. UNDER','DAL','CAR','OVER','43','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-249',2024,15,'UNDER vs. UNDER','PIT','PHI','HOME SPREAD','-5.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-250',2024,15,'UNDER vs. UNDER','PIT','PHI','UNDER','42.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-251',2024,15,'UNDER vs. UNDER','TB','LAC','AWAY UNDERDOG ML','*120','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-252',2024,15,'UNDER vs. UNDER','TB','LAC','OVER','45.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-253',2024,15,'NO COVER vs. NO COVER','ATL','LV','AWAY SPREAD','-4.5','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-254',2024,15,'NO COVER vs. NO COVER','ATL','LV','UNDER','44','PRIMETIME (MNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-255',2024,15,'COVER vs. COVER','LAR','SF','AWAY UNDERDOG ML','*120','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-256',2024,15,'COVER vs. COVER','LAR','SF','UNDER','49.5','PRIMETIME (TNF)','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-257',2024,15,'COVER vs. COVER','TB','LAC','AWAY UNDERDOG ML','*120','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-258',2024,15,'COVER vs. COVER','TB','LAC','OVER','45.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-259',2024,16,'OVER vs. OVER','ARI','CAR','HOME UNDERDOG ML','*135','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-260',2024,16,'OVER vs. OVER','ARI','CAR','OVER','47','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-261',2024,16,'OVER vs. OVER','NE','BUF','UNDER','46.5','1:25 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-262',2024,16,'UNDER vs. UNDER','MIN','SEA','OVER','42.5','1:05 PM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-263',2024,16,'UNDER vs. UNDER','HOU','KC','HOME SPREAD','-3','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-264',2024,16,'UNDER vs. UNDER','HOU','KC','OVER','41.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-265',2024,16,'UNDER vs. UNDER','PHI','WSH','OVER','45.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-266',2024,16,'UNDER vs. UNDER','PHI','WSH','HOME UNDERDOG ML','*130','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-267',2024,16,'NO COVER vs. NO COVER','TEN','IND','HOME SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-268',2024,16,'NO COVER vs. NO COVER','TEN','IND','OVER','42.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-269',2024,16,'COVER vs. COVER','HOU','KC','HOME SPREAD','-3','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-270',2024,16,'COVER vs. COVER','HOU','KC','OVER','41.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-271',2024,16,'COVER vs. COVER','LAR','NYJ','AWAY SPREAD','-3.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_system_rows(source_id,season,week,previous_week_results,away_team,home_team,recorded_outcome,line_text,context_text,source_label) values ('system-272',2024,16,'COVER vs. COVER','LAR','NYJ','UNDER','46.5','10:00 AM','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-1',2024,'2','Tua Tagovailoa','MIA','vs. BUF','Tua Tagovailoa OVER 266.5','MISS','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-2',2024,'2','Tua Tagovailoa','MIA','vs. BUF','Tua Tagovailoa OVER 20.5','MISS','PRIMETIME','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-3',2024,'2','Josh Allen','BUF','@ MIA','Josh Allen ANYT TD (-125)','MISS','PRIMETIME','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-4',2024,'3','Gardner Minshew','LV','vs. CAR','Gardner Minshew OVER 220.5','MISS','NEW TEAM','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-5',2024,'3','Brock Bowers','LV','vs. CAR','Brock Bowers OVER 3.5','MISS','HOME FAVORITE','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-6',2024,'3','Brock Bowers','LV','vs. CAR','Brock Bowers OVER 3.5','MISS','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-7',2024,'3','Davante Adams','LV','vs. CAR','Davante Adams OVER 64','MISS','NEW TEAM','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-8',2024,'3','Nico Collins','HOU','@ MIN','Nico Collins OVER 73.5','HIT','AWAY FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-9',2024,'3','Travis Etienne','JAX','@ BUF','Travis Etienne OVER 20.5','MISS','NEW TEAM','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-10',2024,'3','Josh Allen','BUF','vs. JAX','Josh Allen OVER 232.5','HIT','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-11',2024,'3','Joe Burrow','CIN','vs. WSH','Joe Burrow OVER 1.5 (-160)','HIT','PRIMETIME','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-12',2024,'4','Jordan Love','GB','vs. MIN','Jordan Love OVER 22.5','HIT','DIVISION','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-13',2024,'4','Josh Jacobs','GB','vs. MIN','Josh Jacobs UNDER 59.5','HIT','DIVISION','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-14',2024,'4','Garrett Wilson','NYJ','vs. DEN','Garrett Wilson OVER 4.5','HIT','HOME FAVORITE','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-15',2024,'4','Baker Mayfield','TB','vs. PHI','Baker Mayfield OVER 232.5','HIT','HOME UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-16',2024,'4','Caleb Williams','CHI','vs. LAR','Caleb Williams OVER 220.5','MISS','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-17',2024,'4','Bijan Robinson','ATL','vs. NO','Bijan Robinson UNDER 73','HIT','DIVISION','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-18',2024,'4','C.J. Stroud','HOU','vs. JAX','C.J. Stroud OVER 266.5','HIT','DIVISION','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-19',2024,'4','Kyler Murray','ARI','vs. WSH','Kyler Murray OVER 35','MISS','HOME FAVORITE','RUSH YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-20',2024,'4','Marvin Harrison Jr.','ARI','vs. WSH','Marvin Harrison Jr. OVER 73','MISS','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-21',2024,'5','Chris Godwin','TB','@ ATL','Chris Godwin OVER 68.5','MISS','DIVISION','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-22',2024,'5','Bijan Robinson','TB','@ ATL','Bijan Robinson OVER 3.5','MISS','DIVISION','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-23',2024,'5','Baker Mayfield','TB','@ ATL','Baker Mayfield OVER 22.5','MISS','DIVISION','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-24',2024,'5','Aaron Jones','MIN','vs. NYJ','Aaron Jones OVER 64.5','MISS','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-25',2024,'5','Justin Jefferson','MIN','vs. NYJ','Justin Jefferson OVER 5.5','HIT','HOME FAVORITE','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-26',2024,'5','Caleb Williams','CHI','vs. CAR','Caleb Williams OVER 1.5 (+135)','HIT','HOME FAVORITE','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-27',2024,'5','DJ Moore','CHI','vs. CAR','DJ Moore OVER 4.5','HIT','NEW TEAM','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-28',2024,'5','Tee Higgins','CIN','vs. BAL','Tee Higgins OVER 52.5','HIT','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-29',2024,'5','Tee Higgins','CIN','vs. BAL','Tee Higgins OVER 4.5','HIT','AWAY UNDERDOG','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-30',2024,'5','Deshaun Watson','CLE','@ WSH','Deshaun Watson OVER 1.5 (+165)','MISS','AWAY UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-31',2024,'5','Alvin Kamara','NO','@ KC','Alvin Kamara OVER 34.5','HIT','AWAY UNDERDOG','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-32',2024,'5','Travis Kelce','KC','vs. NO','Travis Kelce OVER 5.5','HIT','PRIMETIME','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-33',2024,'6','DJ Moore','CHI','vs. JAX','DJ Moore OVER 65','MISS','NEW TEAM','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-34',2024,'6','DJ Moore','CHI','vs. JAX','DJ Moore OVER 5.5','MISS','NEW TEAM','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-35',2024,'6','Lamar Jackson','BAL','vs. WSH','Lamar Jackson OVER 55','MISS','HOME FAVORITE','RUSH YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-36',2024,'6','Derrick Henry','BAL','vs. WSH','Derrick Henry OVER 88.5','HIT','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-37',2024,'6','Alvin Kamara','NO','vs. TB','Alvin Kamara OVER 32','MISS','DIVISION','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-38',2024,'7','Baker Mayfield','TB','vs. BAL','Baker Mayfield OVER 14.5','HIT','HOME UNDERDOG','RUSH YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-39',2024,'7','Baker Mayfield','TB','vs. BAL','Baker Mayfield OVER 1.5 (-134)','HIT','HOME UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-40',2024,'7','Mike Evans','TB','vs. BAL','Mike Evans OVER 57.5','MISS','HOME UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-41',2024,'7','Justice Hill','BAL','@ TB','Justice Hill OVER 18.5','HIT','AWAY FAVORITE','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-42',2024,'8','Aaron Jones','MIN','@ LAR','Aaron Jones OVER 24.5','HIT','PRIMETIME','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-43',2024,'8','Jalen Nailor','MIN','@ LAR','Jalen Nailor ANYT TD *385','MISS','PRIMETIME','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-44',2024,'8','CJ Stroud','HOU','vs. IND','CJ Stroud OVER 1.5 *100','MISS','DIVISION','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-45',2024,'8','Aaron Rodgers','NYJ','@ NE','Aaron Rodgers OVER 22.5','MISS','DIVISION','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-46',2024,'8','Calvin Ridley','TEN','@ DET','Calvin Ridley OVER 45.5','HIT','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-47',2024,'8','Joe Mixon','HOU','vs. IND','Joe Mixon OVER 76.5','HIT','DIVISION','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-48',2024,'9','Joe Burrow','CIN','vs. LV','Joe Burrow OVER 1.5 (-155)','HIT','HOME FAVORITE','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-49',2024,'9','Chase Brown','CIN','vs. LV','Chase Brown OVER 57.5','HIT','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-50',2024,'9','Breece Hall','NYJ','vs. HOU','Breece Hall OVER 30.5','MISS','PRIMETIME','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-51',2024,'9','Joe Mixon','HOU','@ NYJ','Joe Mixon OVER 24.5','MISS','PRIMETIME','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-52',2024,'9','Brock Bowers','LV','@ CIN','Brock Bowers OVER 66.5','MISS','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-53',2024,'9','Bijan Robinson','ATL','vs. DAL','Bijan Robinson OVER 24','HIT','HOME FAVORITE','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-54',2024,'10','Chase Brown','CIN','@ BAL','Chase Brown UNDER 24','MISS','PRIMETIME','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-55',2024,'10','Ja''Marr Chase','CIN','@ BAL','Ja''Marr Chase ANYT TD (-125)','HIT','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-56',2024,'10','Malik Nabers','NYG','@ CAR','Malik Nabers OVER 72.5','MISS','AWAY FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-57',2024,'10','Baker Mayfield','TB','vs. SF','Baker Mayfield OVER 13.5','MISS','HOME UNDERDOG','RUSH YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-58',2024,'10','T.J. Hockenson','MIN','@ JAX','T.J. Hockenson OVER 3.5','HIT','AWAY FAVORITE','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-59',2024,'10','T.J. Hockenson','MIN','@ JAX','T.J. Hockenson OVER 36','HIT','AWAY FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-60',2024,'11','Cedric Tillman','CLE','@ NO','Cedric Tillman OVER 56.5','MISS','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-61',2024,'11','Drake London','ATL','@ DEN','Drake London ANYT TD (+165)','MISS','AWAY UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-62',2024,'11','Kirk Cousins','ATL','@ DEN','Kirk Cousins OVER 1.5 (+105)','MISS','AWAY UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-63',2024,'11','Kyren Williams','LAR','@ NE','Kyren Williams OVER 85.5','HIT','AWAY FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-64',2024,'11','Justin Herbert','LAC','vs. CIN','Justin Herbert OVER 245.5','HIT','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-65',2024,'11','Josh Allen','BUF','vs. CIN','Josh Allen OVER 1.5 (+100)','MISS','HOME FAVORITE','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-66',2024,'12','Kyler Murray','ARI','@ SEA','Kyler Murray OVER 20.5','HIT','NEW TEAM','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-67',2024,'14','Drake London','ATL','@ MIN','Drake London ANYTD (+160)','MISS','AWAY UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-68',2024,'14','Jared Goff','DET','vs. GB','Jared Goff OVER 1.5 TDs (-109)','HIT','HOME FAVORITE','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-69',2024,'15','Tank Dell','HOU','vs. MIA','Tank Dell OVER 43.5','MISS','HOME FAVORITE','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-70',2024,'15','Tua Tagovailoa','MIA','vs. HOU','Tua Tagovailoa OVER 1.5 TDs (-125)','MISS','AWAY UNDERDOG','TDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-71',2024,'15','Jahmyr Gibbs','DET','vs. BUF','Jahmyr Gibbs OVER 67.5 yards','MISS','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-72',2024,'15','Khalil Shakir','BUF','@ DET','Khalil Shakir OVER 5.5','HIT','PRIMETIME','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-73',2024,'16','Justin Herbert','LAC','vs. DEN','Justin Herbert OVER 229.5','HIT','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-74',2024,'16','Troy Franklin','DEN','@ LAC','Troy Franklin OVER 18.5','HIT','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-75',2024,'16','Kyler Murray','ARI','@ CAR','Kyler Murray OVER 20.5','MISS','AWAY FAVORITE','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-76',2024,'16','Chuba Hubbard','CAR','vs. ARI','Chuba Hubbard OVER 3.5','HIT','HOME UNDERDOG','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-77',2024,'16','Brock Purdy','SF','@ MIA','Brock Purdy OVER 244.5','HIT','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-78',2024,'17','Patrick Mahomes','KC','@ PIT','Patrick Mahomes OVER 25.5','HIT','PRIMETIME','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-79',2024,'17','Hollywood Brown','KC','@ PIT','Hollywood Brown OVER 43.5','HIT','PRIMETIME','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-80',2024,'17','Hollywood Brown','KC','@ PIT','Hollywood Brown OVER 3.5','HIT','PRIMETIME','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-81',2024,'17','Geno Smith','SEA','@ CHI','Geno Smith OVER 22.5','MISS','PRIMETIME','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-82',2024,'17','Zach Charbonnet','SEA','@ CHI','Zach Charbonnet OVER 23.5','MISS','PRIMETIME','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-83',2024,'17','Caleb Williams','CHI','vs. SEA','Caleb Williams OVER 21.5','MISS','PRIMETIME','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-84',2024,'17','Joe Burrow','CIN','vs. DEN','Joe Burrow OVER 25.5','HIT','HOME FAVORITE','COMPLETIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-85',2024,'17','Marvin Mims','DEN','@ CIN','Marvin Mims OVER 25.5','HIT','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-86',2024,'17','Kyler Murray','ARI','@ LAR','Kyler Murray OVER 227.5','HIT','AWAY UNDERDOG','YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-87',2024,'17','James Cook','BUF','vs. NYJ','James Cook OVER 11.5','MISS','HOME FAVORITE','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-88',2024,'17','Breece Hall','NYJ','@ BUF','Breece Hall OVER 24.5','MISS','AWAY UNDERDOG','RECEIVING YARDS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;
insert into nfl.reference_prop_observations(source_id,season,week,player_name,team_abbr,opponent_text,bet_text,result,environment,market_style,source_label) values ('nfl-prop-89',2024,'17','Brock Bowers','LV','@ NO','Brock Bowers OVER 6.5','HIT','AWAY FAVORITE','RECEPTIONS','PROJECT_OWNER_SEED') on conflict (source_id) do nothing;

-- Flag known ambiguous seed rows rather than silently correcting them.
insert into nfl.data_quality_issues(source_type,source_id,severity,issue_code,issue_text,source_payload)
select 'PROP', source_id, 'REVIEW', 'AMBIGUOUS_LOW_YARD_LINE',
       'YARDS market has a line below 10. Verify whether this row was intended to be receptions or another market.',
       jsonb_build_object('player',player_name,'bet',bet_text,'marketStyle',market_style)
from nfl.reference_prop_observations
where upper(market_style)='YARDS'
  and bet_text ~* 'OVER [0-9](\\.5)?($| )'
  and not exists (
    select 1 from nfl.data_quality_issues q where q.source_type='PROP' and q.source_id=nfl.reference_prop_observations.source_id and q.issue_code='AMBIGUOUS_LOW_YARD_LINE'
  );
