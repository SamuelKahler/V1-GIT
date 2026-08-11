-- Sports Edge MLB Customer Experience Rewrite V1
-- Adds verified same-opponent filtering to the existing game-log query.
-- Safe to run after migration 004.

create or replace function public.sports_edge_mlb_query_game_logs(p_criteria jsonb default '{}'::jsonb)
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
with parameters as (
  select
    nullif(p_criteria->>'teamAbbreviation','') as team_abbreviation,
    nullif(p_criteria->>'opponentAbbreviation','') as opponent_abbreviation,
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
    and (x.opponent_abbreviation is null or upper(p.opponent_abbreviation) = upper(x.opponent_abbreviation))
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

revoke all on function public.sports_edge_mlb_query_game_logs(jsonb) from public;
grant execute on function public.sports_edge_mlb_query_game_logs(jsonb) to service_role;
