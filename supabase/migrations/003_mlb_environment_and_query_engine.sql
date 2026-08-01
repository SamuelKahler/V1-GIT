-- SPORTS EDGE MLB INTELLIGENCE DATABASE
-- Release 2A: verified environment rebuild + game-log query engine
-- Safe to run after migration 002. Idempotent by design.

begin;

alter table mlb.environments add column if not exists home_odds_bucket text;
alter table mlb.environments add column if not exists away_odds_bucket text;
alter table mlb.environments add column if not exists home_rest_advantage boolean;
alter table mlb.environments add column if not exists away_rest_advantage boolean;
alter table mlb.environments add column if not exists series_game_number integer;
alter table mlb.environments add column if not exists games_in_series integer;
alter table mlb.environments add column if not exists day_night text;
alter table mlb.environments add column if not exists verified_fields integer not null default 0;
alter table mlb.environments add column if not exists possible_fields integer not null default 0;
alter table mlb.environments add column if not exists completeness_percent numeric(5,2);

create index if not exists idx_mlb_environments_division on mlb.environments(division_game);
create index if not exists idx_mlb_environments_favorites on mlb.environments(home_favorite, away_favorite);
create index if not exists idx_mlb_environments_series on mlb.environments(series_game_number);
create index if not exists idx_mlb_environments_day_night on mlb.environments(day_night);
create index if not exists idx_mlb_environments_home_bucket on mlb.environments(home_odds_bucket);
create index if not exists idx_mlb_environments_away_bucket on mlb.environments(away_odds_bucket);

create or replace function public.sports_edge_american_implied_probability(p_price integer)
returns numeric
language sql
immutable
as $$
  select case
    when p_price is null or p_price = 0 then null
    when p_price < 0 then abs(p_price)::numeric / (abs(p_price) + 100)
    else 100::numeric / (p_price + 100)
  end;
$$;

create or replace function public.sports_edge_moneyline_profit(p_price integer, p_result text)
returns numeric
language sql
immutable
as $$
  select case
    when upper(coalesce(p_result,'')) = 'PUSH' then 0
    when upper(coalesce(p_result,'')) = 'LOSS' then -1
    when upper(coalesce(p_result,'')) <> 'WIN' or p_price is null or p_price = 0 then null
    when p_price > 0 then p_price::numeric / 100
    else 100::numeric / abs(p_price)
  end;
$$;

create or replace function public.sports_edge_odds_bucket(p_price integer)
returns text
language sql
immutable
as $$
  select case
    when p_price is null then null
    when p_price <= -250 then '-250 or shorter'
    when p_price <= -200 then '-249 to -200'
    when p_price <= -150 then '-199 to -150'
    when p_price <= -121 then '-149 to -121'
    when p_price <= -105 then '-120 to -105'
    when p_price <= 104 then '-104 to +104'
    when p_price <= 120 then '+105 to +120'
    when p_price <= 149 then '+121 to +149'
    when p_price <= 199 then '+150 to +199'
    when p_price <= 249 then '+200 to +249'
    else '+250 or longer'
  end;
$$;

create or replace function public.sports_edge_total_bucket(p_total numeric)
returns text
language sql
immutable
as $$
  select case
    when p_total is null then null
    when p_total < 7 then 'Under 7'
    when p_total < 8 then '7 to 7.5'
    when p_total < 9 then '8 to 8.5'
    when p_total < 10 then '9 to 9.5'
    when p_total < 11 then '10 to 10.5'
    else '11 or higher'
  end;
$$;

create or replace function public.sports_edge_mlb_rebuild_environments(
  p_start_date date,
  p_end_date date
)
returns jsonb
language plpgsql
security definer
set search_path = public, mlb, ops
as $$
declare
  v_count integer := 0;
begin
  if p_start_date is null or p_end_date is null or p_start_date > p_end_date then
    raise exception 'Invalid environment date range.';
  end if;

  if (p_end_date - p_start_date) > 366 then
    raise exception 'Environment rebuild range cannot exceed 367 inclusive days.';
  end if;

  with target_games as (
    select g.*,
           ht.league_name as home_league,
           ht.division_name as home_division,
           at.league_name as away_league,
           at.division_name as away_division
    from mlb.games g
    join mlb.teams ht on ht.id = g.home_team_id
    join mlb.teams at on at.id = g.away_team_id
    where g.official_date between p_start_date and p_end_date
  ), enriched as (
    select tg.*,
      hp.previous_date as home_previous_date,
      hp.team_score as home_previous_runs_scored,
      hp.opponent_score as home_previous_runs_allowed,
      hp.result as home_previous_result,
      ap.previous_date as away_previous_date,
      ap.team_score as away_previous_runs_scored,
      ap.opponent_score as away_previous_runs_allowed,
      ap.result as away_previous_result,
      home_sp.pitch_hand_code as home_pitcher_hand,
      away_sp.pitch_hand_code as away_pitcher_hand,
      market.home_price,
      market.away_price,
      market.total
    from target_games tg
    left join lateral (
      select prior.official_date as previous_date,
             case when prior.home_team_id = tg.home_team_id then prior.home_score else prior.away_score end as team_score,
             case when prior.home_team_id = tg.home_team_id then prior.away_score else prior.home_score end as opponent_score,
             case
               when (case when prior.home_team_id = tg.home_team_id then prior.home_score else prior.away_score end) >
                    (case when prior.home_team_id = tg.home_team_id then prior.away_score else prior.home_score end) then 'WIN'
               when (case when prior.home_team_id = tg.home_team_id then prior.home_score else prior.away_score end) <
                    (case when prior.home_team_id = tg.home_team_id then prior.away_score else prior.home_score end) then 'LOSS'
               else 'PUSH'
             end as result
      from mlb.games prior
      where prior.is_final = true
        and prior.official_date < tg.official_date
        and (prior.home_team_id = tg.home_team_id or prior.away_team_id = tg.home_team_id)
      order by prior.official_date desc, prior.game_datetime desc nulls last, prior.game_pk desc
      limit 1
    ) hp on true
    left join lateral (
      select prior.official_date as previous_date,
             case when prior.home_team_id = tg.away_team_id then prior.home_score else prior.away_score end as team_score,
             case when prior.home_team_id = tg.away_team_id then prior.away_score else prior.home_score end as opponent_score,
             case
               when (case when prior.home_team_id = tg.away_team_id then prior.home_score else prior.away_score end) >
                    (case when prior.home_team_id = tg.away_team_id then prior.away_score else prior.home_score end) then 'WIN'
               when (case when prior.home_team_id = tg.away_team_id then prior.away_score else prior.home_score end) <
                    (case when prior.home_team_id = tg.away_team_id then prior.home_score else prior.away_score end) then 'LOSS'
               else 'PUSH'
             end as result
      from mlb.games prior
      where prior.is_final = true
        and prior.official_date < tg.official_date
        and (prior.home_team_id = tg.away_team_id or prior.away_team_id = tg.away_team_id)
      order by prior.official_date desc, prior.game_datetime desc nulls last, prior.game_pk desc
      limit 1
    ) ap on true
    left join lateral (
      select p.pitch_hand_code
      from mlb.game_pitchers gp
      join mlb.pitchers p on p.id = gp.pitcher_id
      where gp.game_id = tg.id and gp.team_side = 'home'
      order by case gp.role when 'confirmed_starter' then 1 when 'probable_starter' then 2 else 3 end
      limit 1
    ) home_sp on true
    left join lateral (
      select p.pitch_hand_code
      from mlb.game_pitchers gp
      join mlb.pitchers p on p.id = gp.pitcher_id
      where gp.game_id = tg.id and gp.team_side = 'away'
      order by case gp.role when 'confirmed_starter' then 1 when 'probable_starter' then 2 else 3 end
      limit 1
    ) away_sp on true
    left join lateral (
      select o.home_price, o.away_price, o.total
      from mlb.odds o
      where o.game_id = tg.id
        and upper(o.market) in ('H2H','MONEYLINE','ML')
        and upper(o.period) = 'FULL_GAME'
      order by o.is_closing desc, o.captured_at desc
      limit 1
    ) market on true
  )
  insert into mlb.environments (
    game_id, division_game, interleague_game,
    home_rest_days, away_rest_days, home_rest_advantage, away_rest_advantage,
    home_previous_result, away_previous_result,
    home_previous_runs_scored, away_previous_runs_scored,
    home_previous_runs_allowed, away_previous_runs_allowed,
    home_pitcher_hand, away_pitcher_hand,
    home_favorite, away_favorite, home_underdog, away_underdog,
    home_moneyline, away_moneyline, odds_bucket, home_odds_bucket, away_odds_bucket,
    total_value, total_bucket, series_game_number, games_in_series, day_night,
    verified_fields, possible_fields, completeness_percent, data_complete, calculated_at
  )
  select
    e.id,
    case when e.home_division is null or e.away_division is null then null else e.home_division = e.away_division end,
    case when e.home_league is null or e.away_league is null then null else e.home_league <> e.away_league end,
    case when e.home_previous_date is null then null else greatest((e.official_date - e.home_previous_date) - 1, 0) end,
    case when e.away_previous_date is null then null else greatest((e.official_date - e.away_previous_date) - 1, 0) end,
    case when e.home_previous_date is null or e.away_previous_date is null then null else (e.official_date-e.home_previous_date) > (e.official_date-e.away_previous_date) end,
    case when e.home_previous_date is null or e.away_previous_date is null then null else (e.official_date-e.away_previous_date) > (e.official_date-e.home_previous_date) end,
    e.home_previous_result, e.away_previous_result,
    e.home_previous_runs_scored, e.away_previous_runs_scored,
    e.home_previous_runs_allowed, e.away_previous_runs_allowed,
    e.home_pitcher_hand, e.away_pitcher_hand,
    case when e.home_price is null or e.away_price is null then null else public.sports_edge_american_implied_probability(e.home_price) > public.sports_edge_american_implied_probability(e.away_price) end,
    case when e.home_price is null or e.away_price is null then null else public.sports_edge_american_implied_probability(e.away_price) > public.sports_edge_american_implied_probability(e.home_price) end,
    case when e.home_price is null or e.away_price is null then null else public.sports_edge_american_implied_probability(e.home_price) < public.sports_edge_american_implied_probability(e.away_price) end,
    case when e.home_price is null or e.away_price is null then null else public.sports_edge_american_implied_probability(e.away_price) < public.sports_edge_american_implied_probability(e.home_price) end,
    e.home_price, e.away_price, null,
    public.sports_edge_odds_bucket(e.home_price), public.sports_edge_odds_bucket(e.away_price),
    e.total, public.sports_edge_total_bucket(e.total), e.series_game_number, e.games_in_series, e.day_night,
    num_nonnulls(e.home_division, e.away_division, e.home_previous_date, e.away_previous_date,
      e.home_previous_result, e.away_previous_result, e.home_previous_runs_scored, e.away_previous_runs_scored,
      e.home_previous_runs_allowed, e.away_previous_runs_allowed, e.home_pitcher_hand, e.away_pitcher_hand,
      e.home_price, e.away_price, e.total, e.series_game_number, e.games_in_series, e.day_night),
    18,
    round((num_nonnulls(e.home_division, e.away_division, e.home_previous_date, e.away_previous_date,
      e.home_previous_result, e.away_previous_result, e.home_previous_runs_scored, e.away_previous_runs_scored,
      e.home_previous_runs_allowed, e.away_previous_runs_allowed, e.home_pitcher_hand, e.away_pitcher_hand,
      e.home_price, e.away_price, e.total, e.series_game_number, e.games_in_series, e.day_night)::numeric / 18) * 100, 2),
    num_nonnulls(e.home_division, e.away_division, e.home_previous_date, e.away_previous_date,
      e.home_previous_result, e.away_previous_result, e.home_previous_runs_scored, e.away_previous_runs_scored,
      e.home_previous_runs_allowed, e.away_previous_runs_allowed, e.home_pitcher_hand, e.away_pitcher_hand,
      e.home_price, e.away_price, e.total, e.series_game_number, e.games_in_series, e.day_night) = 18,
    now()
  from enriched e
  on conflict (game_id) do update set
    division_game=excluded.division_game, interleague_game=excluded.interleague_game,
    home_rest_days=excluded.home_rest_days, away_rest_days=excluded.away_rest_days,
    home_rest_advantage=excluded.home_rest_advantage, away_rest_advantage=excluded.away_rest_advantage,
    home_previous_result=excluded.home_previous_result, away_previous_result=excluded.away_previous_result,
    home_previous_runs_scored=excluded.home_previous_runs_scored, away_previous_runs_scored=excluded.away_previous_runs_scored,
    home_previous_runs_allowed=excluded.home_previous_runs_allowed, away_previous_runs_allowed=excluded.away_previous_runs_allowed,
    home_pitcher_hand=excluded.home_pitcher_hand, away_pitcher_hand=excluded.away_pitcher_hand,
    home_favorite=excluded.home_favorite, away_favorite=excluded.away_favorite,
    home_underdog=excluded.home_underdog, away_underdog=excluded.away_underdog,
    home_moneyline=excluded.home_moneyline, away_moneyline=excluded.away_moneyline,
    home_odds_bucket=excluded.home_odds_bucket, away_odds_bucket=excluded.away_odds_bucket,
    total_value=excluded.total_value, total_bucket=excluded.total_bucket,
    series_game_number=excluded.series_game_number, games_in_series=excluded.games_in_series,
    day_night=excluded.day_night, verified_fields=excluded.verified_fields,
    possible_fields=excluded.possible_fields, completeness_percent=excluded.completeness_percent,
    data_complete=excluded.data_complete, calculated_at=now();

  get diagnostics v_count = row_count;
  return jsonb_build_object('startDate',p_start_date,'endDate',p_end_date,'gamesProcessed',v_count);
end;
$$;

create or replace function public.sports_edge_mlb_query_game_logs(p_criteria jsonb default '{}'::jsonb)
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
with parameters as (
  select
    nullif(p_criteria->>'teamAbbreviation','') as team_abbreviation,
    nullif(p_criteria->>'teamId','')::integer as team_id,
    upper(nullif(p_criteria->>'role','')) as role,
    nullif(p_criteria->>'favorite','')::boolean as favorite,
    nullif(p_criteria->>'underdog','')::boolean as underdog,
    nullif(p_criteria->>'divisionGame','')::boolean as division_game,
    nullif(p_criteria->>'interleagueGame','')::boolean as interleague_game,
    nullif(p_criteria->>'seriesGameNumber','')::integer as series_game_number,
    lower(nullif(p_criteria->>'dayNight','')) as day_night,
    upper(nullif(p_criteria->>'pitcherHand','')) as pitcher_hand,
    upper(nullif(p_criteria->>'opponentPitcherHand','')) as opponent_pitcher_hand,
    upper(nullif(p_criteria->>'previousResult','')) as previous_result,
    nullif(p_criteria->>'previousRunsScoredMin','')::integer as previous_runs_scored_min,
    nullif(p_criteria->>'previousRunsScoredMax','')::integer as previous_runs_scored_max,
    nullif(p_criteria->>'previousRunsAllowedMin','')::integer as previous_runs_allowed_min,
    nullif(p_criteria->>'previousRunsAllowedMax','')::integer as previous_runs_allowed_max,
    nullif(p_criteria->>'restDaysMin','')::integer as rest_days_min,
    nullif(p_criteria->>'restDaysMax','')::integer as rest_days_max,
    nullif(p_criteria->>'restAdvantage','')::boolean as rest_advantage,
    nullif(p_criteria->>'oddsBucket','') as odds_bucket,
    nullif(p_criteria->>'totalBucket','') as total_bucket,
    nullif(p_criteria->>'minimumCompleteness','')::numeric as minimum_completeness,
    nullif(p_criteria->>'dateFrom','')::date as date_from,
    nullif(p_criteria->>'dateTo','')::date as date_to,
    least(greatest(coalesce(nullif(p_criteria->>'limit','')::integer,100),1),500) as result_limit
), perspectives as (
  select
    g.id as game_id, g.game_pk, g.official_date, g.game_datetime, g.is_final,
    'AWAY'::text as role,
    at.team_id, at.abbreviation as team_abbreviation, at.name as team_name,
    ht.team_id as opponent_team_id, ht.abbreviation as opponent_abbreviation, ht.name as opponent_name,
    g.away_score as team_score, g.home_score as opponent_score,
    g.f5_away_score as team_f5_score, g.f5_home_score as opponent_f5_score, g.f5_available,
    case when g.away_score > g.home_score then 'WIN' when g.away_score < g.home_score then 'LOSS' else 'PUSH' end as full_game_result,
    case when not g.f5_available then null when g.f5_away_score > g.f5_home_score then 'WIN' when g.f5_away_score < g.f5_home_score then 'LOSS' else 'PUSH' end as f5_result,
    e.away_moneyline as moneyline, e.away_odds_bucket as odds_bucket,
    e.away_favorite as favorite, e.away_underdog as underdog,
    e.division_game, e.interleague_game, e.series_game_number, e.games_in_series, e.day_night,
    e.away_rest_days as rest_days, e.away_rest_advantage as rest_advantage,
    e.away_previous_result as previous_result,
    e.away_previous_runs_scored as previous_runs_scored,
    e.away_previous_runs_allowed as previous_runs_allowed,
    e.away_pitcher_hand as pitcher_hand, e.home_pitcher_hand as opponent_pitcher_hand,
    e.total_value, e.total_bucket, e.completeness_percent
  from mlb.games g
  join mlb.teams at on at.id = g.away_team_id
  join mlb.teams ht on ht.id = g.home_team_id
  left join mlb.environments e on e.game_id = g.id
  where g.is_final
  union all
  select
    g.id, g.game_pk, g.official_date, g.game_datetime, g.is_final,
    'HOME'::text,
    ht.team_id, ht.abbreviation, ht.name,
    at.team_id, at.abbreviation, at.name,
    g.home_score, g.away_score,
    g.f5_home_score, g.f5_away_score, g.f5_available,
    case when g.home_score > g.away_score then 'WIN' when g.home_score < g.away_score then 'LOSS' else 'PUSH' end,
    case when not g.f5_available then null when g.f5_home_score > g.f5_away_score then 'WIN' when g.f5_home_score < g.f5_away_score then 'LOSS' else 'PUSH' end,
    e.home_moneyline, e.home_odds_bucket,
    e.home_favorite, e.home_underdog,
    e.division_game, e.interleague_game, e.series_game_number, e.games_in_series, e.day_night,
    e.home_rest_days, e.home_rest_advantage,
    e.home_previous_result,
    e.home_previous_runs_scored,
    e.home_previous_runs_allowed,
    e.home_pitcher_hand, e.away_pitcher_hand,
    e.total_value, e.total_bucket, e.completeness_percent
  from mlb.games g
  join mlb.teams at on at.id = g.away_team_id
  join mlb.teams ht on ht.id = g.home_team_id
  left join mlb.environments e on e.game_id = g.id
  where g.is_final
), filtered as (
  select p.*,
         public.sports_edge_moneyline_profit(p.moneyline,p.full_game_result) as profit_units
  from perspectives p cross join parameters x
  where (x.team_id is null or p.team_id = x.team_id)
    and (x.team_abbreviation is null or upper(p.team_abbreviation) = upper(x.team_abbreviation))
    and (x.role is null or p.role = x.role)
    and (x.favorite is null or p.favorite = x.favorite)
    and (x.underdog is null or p.underdog = x.underdog)
    and (x.division_game is null or p.division_game = x.division_game)
    and (x.interleague_game is null or p.interleague_game = x.interleague_game)
    and (x.series_game_number is null or p.series_game_number = x.series_game_number)
    and (x.day_night is null or lower(p.day_night) = x.day_night)
    and (x.pitcher_hand is null or upper(p.pitcher_hand) = x.pitcher_hand)
    and (x.opponent_pitcher_hand is null or upper(p.opponent_pitcher_hand) = x.opponent_pitcher_hand)
    and (x.previous_result is null or upper(p.previous_result) = x.previous_result)
    and (x.previous_runs_scored_min is null or p.previous_runs_scored >= x.previous_runs_scored_min)
    and (x.previous_runs_scored_max is null or p.previous_runs_scored <= x.previous_runs_scored_max)
    and (x.previous_runs_allowed_min is null or p.previous_runs_allowed >= x.previous_runs_allowed_min)
    and (x.previous_runs_allowed_max is null or p.previous_runs_allowed <= x.previous_runs_allowed_max)
    and (x.rest_days_min is null or p.rest_days >= x.rest_days_min)
    and (x.rest_days_max is null or p.rest_days <= x.rest_days_max)
    and (x.rest_advantage is null or p.rest_advantage = x.rest_advantage)
    and (x.odds_bucket is null or p.odds_bucket = x.odds_bucket)
    and (x.total_bucket is null or p.total_bucket = x.total_bucket)
    and (x.minimum_completeness is null or p.completeness_percent >= x.minimum_completeness)
    and (x.date_from is null or p.official_date >= x.date_from)
    and (x.date_to is null or p.official_date <= x.date_to)
), limited_games as (
  select f.* from filtered f cross join parameters x
  order by f.official_date desc, f.game_pk desc
  limit (select result_limit from parameters)
), summary as (
  select
    count(*)::integer as sample_size,
    count(*) filter (where full_game_result='WIN')::integer as wins,
    count(*) filter (where full_game_result='LOSS')::integer as losses,
    count(*) filter (where full_game_result='PUSH')::integer as pushes,
    count(*) filter (where f5_result='WIN')::integer as f5_wins,
    count(*) filter (where f5_result='LOSS')::integer as f5_losses,
    count(*) filter (where f5_result='PUSH')::integer as f5_pushes,
    round(100 * count(*) filter (where full_game_result='WIN')::numeric / nullif(count(*) filter (where full_game_result in ('WIN','LOSS')),0),2) as hit_rate,
    count(profit_units)::integer as roi_sample,
    round(sum(profit_units),3) as profit_units,
    round(100 * sum(profit_units) / nullif(count(profit_units),0),2) as roi_percent,
    round(avg(completeness_percent),2) as average_completeness
  from filtered
)
select jsonb_build_object(
  'criteria', coalesce(p_criteria,'{}'::jsonb),
  'summary', (select to_jsonb(summary) from summary),
  'supportingGames', coalesce((select jsonb_agg(to_jsonb(limited_games) order by official_date desc,game_pk desc) from limited_games),'[]'::jsonb),
  'generatedAt', now()
);
$$;

create or replace function public.sports_edge_mlb_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
  select jsonb_build_object(
    'games', (select count(*) from mlb.games),
    'finalGames', (select count(*) from mlb.games where is_final),
    'duplicateGamePks', (select count(*) from (select game_pk from mlb.games group by game_pk having count(*) > 1) d),
    'missingTeams', (select count(*) from mlb.games where home_team_id is null or away_team_id is null),
    'missingVenues', (select count(*) from mlb.games where venue_id is null),
    'finalGamesMissingScores', (select count(*) from mlb.games where is_final and (home_score is null or away_score is null)),
    'finalGamesMissingF5', (select count(*) from mlb.games where is_final and not f5_available),
    'gamesWithInnings', (select count(distinct game_id) from mlb.game_innings),
    'gamesWithStarters', (select count(distinct game_id) from mlb.game_pitchers where role in ('confirmed_starter','probable_starter')),
    'environmentRows', (select count(*) from mlb.environments),
    'gamesMissingEnvironment', (select count(*) from mlb.games g left join mlb.environments e on e.game_id=g.id where e.game_id is null),
    'averageEnvironmentCompleteness', (select coalesce(round(avg(completeness_percent),2),0) from mlb.environments),
    'gamesWithOdds', (select count(distinct game_id) from mlb.odds),
    'failedImportErrors', (select count(*) from ops.import_errors),
    'latestImportRuns', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select id,status,start_date,end_date,games_discovered,games_inserted,games_updated,games_failed,started_at,completed_at from ops.import_runs order by started_at desc limit 10) x)
  );
$$;

revoke all on function public.sports_edge_mlb_rebuild_environments(date,date) from public;
revoke all on function public.sports_edge_mlb_query_game_logs(jsonb) from public;
revoke all on function public.sports_edge_mlb_audit() from public;
grant execute on function public.sports_edge_mlb_rebuild_environments(date,date) to service_role;
grant execute on function public.sports_edge_mlb_query_game_logs(jsonb) to service_role;
grant execute on function public.sports_edge_mlb_audit() to service_role;

commit;
