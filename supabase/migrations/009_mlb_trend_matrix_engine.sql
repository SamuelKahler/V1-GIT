-- Sports Edge MLB Trend Matrix Engine
-- Builds current-season trends from the MLB backbone using:
--   9 team situations x applicable environment tags x the wager's exact market/period.
-- Safe to run after migration 008. No legacy spreadsheet rows are read.

begin;

create or replace function public.sports_edge_mlb_trend_matrix(p_criteria jsonb default '{}'::jsonb)
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
with params as (
  select
    nullif(p_criteria->>'gamePk','')::bigint as game_pk,
    upper(nullif(p_criteria->>'teamAbbreviation','')) as team_abbreviation,
    upper(coalesce(nullif(p_criteria->>'period',''),'FULL_GAME')) as period,
    upper(coalesce(nullif(p_criteria->>'market',''),'MONEYLINE')) as market,
    nullif(p_criteria->>'f5Line','')::numeric as f5_line,
    nullif(p_criteria->>'totalLine','')::numeric as total_line,
    upper(nullif(p_criteria->>'totalDirection','')) as total_direction,
    nullif(p_criteria->>'dateFrom','')::date as date_from,
    nullif(p_criteria->>'dateTo','')::date as date_to,
    greatest(coalesce(nullif(p_criteria->>'minimumSample','')::integer,3),1) as minimum_sample
), perspectives_base as (
  select
    g.id as game_id, g.game_pk, g.official_date, g.game_datetime,
    'AWAY'::text as role,
    at.id as team_db_id, at.abbreviation as team_abbreviation,
    ht.id as opponent_db_id, ht.abbreviation as opponent_abbreviation,
    g.away_score as team_score, g.home_score as opponent_score,
    g.f5_away_score as team_f5_score, g.f5_home_score as opponent_f5_score,
    g.f5_available,
    case when g.away_score > g.home_score then 'WIN' when g.away_score < g.home_score then 'LOSS' else 'PUSH' end as full_game_result,
    e.away_favorite as favorite, e.away_underdog as underdog,
    e.division_game, e.series_game_number, e.games_in_series,
    e.away_rest_days as rest_days,
    e.away_previous_result as previous_result,
    e.away_previous_runs_scored as previous_runs_scored,
    e.away_previous_runs_allowed as previous_runs_allowed
  from mlb.games g
  join mlb.teams at on at.id=g.away_team_id
  join mlb.teams ht on ht.id=g.home_team_id
  left join mlb.environments e on e.game_id=g.id
  where g.is_final
  union all
  select
    g.id, g.game_pk, g.official_date, g.game_datetime,
    'HOME'::text,
    ht.id, ht.abbreviation,
    at.id, at.abbreviation,
    g.home_score, g.away_score,
    g.f5_home_score, g.f5_away_score,
    g.f5_available,
    case when g.home_score > g.away_score then 'WIN' when g.home_score < g.away_score then 'LOSS' else 'PUSH' end,
    e.home_favorite, e.home_underdog,
    e.division_game, e.series_game_number, e.games_in_series,
    e.home_rest_days,
    e.home_previous_result,
    e.home_previous_runs_scored,
    e.home_previous_runs_allowed
  from mlb.games g
  join mlb.teams at on at.id=g.away_team_id
  join mlb.teams ht on ht.id=g.home_team_id
  left join mlb.environments e on e.game_id=g.id
  where g.is_final
), perspectives as (
  select b.*,
    lag(full_game_result,1) over w as prior_series_result_1,
    lag(full_game_result,2) over w as prior_series_result_2,
    lag(full_game_result,3) over w as prior_series_result_3,
    lag(series_game_number,1) over w as prior_series_number_1,
    lag(series_game_number,2) over w as prior_series_number_2,
    lag(series_game_number,3) over w as prior_series_number_3,
    lag(official_date,1) over w as prior_series_date_1,
    lag(official_date,2) over w as prior_series_date_2,
    lag(official_date,3) over w as prior_series_date_3
  from perspectives_base b
  window w as (partition by team_db_id, opponent_db_id order by official_date, game_datetime nulls last, game_pk)
), tagged as (
  select p.*,
    case
      when series_game_number=2 and games_in_series=2
        and prior_series_number_1=1 and official_date-prior_series_date_1<=3
        and prior_series_result_1='WIN' then true
      when series_game_number=3 and games_in_series=3
        and prior_series_number_1=2 and prior_series_number_2=1
        and official_date-prior_series_date_2<=5
        and prior_series_result_1='WIN' and prior_series_result_2='WIN' then true
      when series_game_number=4 and games_in_series=4
        and prior_series_number_1=3 and prior_series_number_2=2 and prior_series_number_3=1
        and official_date-prior_series_date_3<=6
        and prior_series_result_1='WIN' and prior_series_result_2='WIN' and prior_series_result_3='WIN' then true
      else false end as sweep_opportunity,
    case
      when series_game_number=2 and games_in_series=2
        and prior_series_number_1=1 and official_date-prior_series_date_1<=3
        and prior_series_result_1='LOSS' then true
      when series_game_number=3 and games_in_series=3
        and prior_series_number_1=2 and prior_series_number_2=1
        and official_date-prior_series_date_2<=5
        and prior_series_result_1='LOSS' and prior_series_result_2='LOSS' then true
      when series_game_number=4 and games_in_series=4
        and prior_series_number_1=3 and prior_series_number_2=2 and prior_series_number_3=1
        and official_date-prior_series_date_3<=6
        and prior_series_result_1='LOSS' and prior_series_result_2='LOSS' and prior_series_result_3='LOSS' then true
      else false end as avoid_sweep
  from perspectives p
), current_context as (
  select
    g.id as game_id,g.game_pk,g.official_date,g.game_datetime,
    case when upper(t.abbreviation)=upper(x.team_abbreviation) and g.home_team_id=t.id then 'HOME' else 'AWAY' end as role,
    t.id as team_db_id,t.abbreviation as team_abbreviation,
    o.id as opponent_db_id,o.abbreviation as opponent_abbreviation,
    null::integer as team_score,null::integer as opponent_score,
    null::integer as team_f5_score,null::integer as opponent_f5_score,
    false as f5_available,null::text as full_game_result,
    case when g.home_team_id=t.id then e.home_favorite else e.away_favorite end as favorite,
    case when g.home_team_id=t.id then e.home_underdog else e.away_underdog end as underdog,
    e.division_game,e.series_game_number,e.games_in_series,
    case when g.home_team_id=t.id then e.home_rest_days else e.away_rest_days end as rest_days,
    case when g.home_team_id=t.id then e.home_previous_result else e.away_previous_result end as previous_result,
    case when g.home_team_id=t.id then e.home_previous_runs_scored else e.away_previous_runs_scored end as previous_runs_scored,
    case when g.home_team_id=t.id then e.home_previous_runs_allowed else e.away_previous_runs_allowed end as previous_runs_allowed,
    null::text as prior_series_result_1,null::text as prior_series_result_2,null::text as prior_series_result_3,
    null::integer as prior_series_number_1,null::integer as prior_series_number_2,null::integer as prior_series_number_3,
    null::date as prior_series_date_1,null::date as prior_series_date_2,null::date as prior_series_date_3,
    coalesce(nullif(p_criteria->>'sweep','')::boolean,false) as sweep_opportunity,
    coalesce(nullif(p_criteria->>'avoidSweep','')::boolean,false) as avoid_sweep
  from params x
  join mlb.games g on g.game_pk=x.game_pk
  join mlb.teams t on upper(t.abbreviation)=upper(x.team_abbreviation)
    and (t.id=g.home_team_id or t.id=g.away_team_id)
  join mlb.teams o on o.id=case when t.id=g.home_team_id then g.away_team_id else g.home_team_id end
  left join mlb.environments e on e.game_id=g.id
  limit 1
), fallback_context as (
  select
    null::uuid as game_id,
    x.game_pk,
    coalesce(x.date_to,current_date) as official_date,
    null::timestamptz as game_datetime,
    upper(nullif(p_criteria->>'role','')) as role,
    null::uuid as team_db_id,
    x.team_abbreviation,
    null::uuid as opponent_db_id,
    upper(nullif(p_criteria->>'opponentAbbreviation','')) as opponent_abbreviation,
    null::integer as team_score, null::integer as opponent_score,
    null::integer as team_f5_score, null::integer as opponent_f5_score,
    false as f5_available, null::text as full_game_result,
    nullif(p_criteria->>'favorite','')::boolean as favorite,
    nullif(p_criteria->>'underdog','')::boolean as underdog,
    nullif(p_criteria->>'divisionGame','')::boolean as division_game,
    nullif(p_criteria->>'seriesGameNumber','')::integer as series_game_number,
    nullif(p_criteria->>'gamesInSeries','')::integer as games_in_series,
    nullif(p_criteria->>'restDays','')::integer as rest_days,
    upper(nullif(p_criteria->>'previousResult','')) as previous_result,
    nullif(p_criteria->>'previousRunsScored','')::integer as previous_runs_scored,
    nullif(p_criteria->>'previousRunsAllowed','')::integer as previous_runs_allowed,
    null::text as prior_series_result_1, null::text as prior_series_result_2, null::text as prior_series_result_3,
    null::integer as prior_series_number_1, null::integer as prior_series_number_2, null::integer as prior_series_number_3,
    null::date as prior_series_date_1, null::date as prior_series_date_2, null::date as prior_series_date_3,
    coalesce(nullif(p_criteria->>'sweep','')::boolean,false) as sweep_opportunity,
    coalesce(nullif(p_criteria->>'avoidSweep','')::boolean,false) as avoid_sweep
  from params x
), ctx as (
  select * from current_context
  union all
  select * from fallback_context where not exists (select 1 from current_context)
  limit 1
), applicable_categories as (
  select v.category
  from ctx c
  cross join lateral (values
    ('1-DAY REST'::text, c.rest_days=1),
    ('AFTER A LOSS', upper(c.previous_result)='LOSS'),
    ('AFTER A WIN', upper(c.previous_result)='WIN'),
    ('AWAY', c.role='AWAY'),
    ('AWAY FAVORITE', c.role='AWAY' and c.favorite=true),
    ('AWAY UNDERDOG', c.role='AWAY' and c.underdog=true),
    ('DIVISION', c.division_game=true),
    ('HOME FAVORITE', c.role='HOME' and c.favorite=true),
    ('HOME UNDERDOG', c.role='HOME' and c.underdog=true)
  ) v(category,applies)
  where v.applies
), applicable_environments as (
  select v.environment
  from ctx c cross join params x
  cross join lateral (values
    ('PREV_ALLOWED 0'::text, c.previous_runs_allowed=0),
    ('PREV_ALLOWED 10+', coalesce(c.previous_runs_allowed,0)>=10),
    ('PREV_SCRD 0', c.previous_runs_scored=0),
    ('PREV_SCRD 10+', coalesce(c.previous_runs_scored,0)>=10),
    ('10+', coalesce(c.previous_runs_scored,0)+coalesce(c.previous_runs_allowed,0)>=10),
    ('SWEEP', c.sweep_opportunity=true),
    ('AtS', c.avoid_sweep=true),
    ('ML', x.period='FULL_GAME' and x.market in ('ML','MONEYLINE')),
    ('OVER', x.total_direction='OVER'),
    ('UNDER', x.total_direction='UNDER')
  ) v(environment,applies)
  where v.applies
), historical_categories as (
  select t.game_pk,t.official_date,t.team_abbreviation,t.opponent_abbreviation,t.role,
         t.team_score,t.opponent_score,t.team_f5_score,t.opponent_f5_score,t.f5_available,
         t.full_game_result,t.favorite,t.underdog,t.division_game,t.rest_days,t.previous_result,
         t.previous_runs_scored,t.previous_runs_allowed,t.sweep_opportunity,t.avoid_sweep,
         v.category
  from tagged t
  cross join lateral (values
    ('1-DAY REST'::text, t.rest_days=1),
    ('AFTER A LOSS', upper(t.previous_result)='LOSS'),
    ('AFTER A WIN', upper(t.previous_result)='WIN'),
    ('AWAY', t.role='AWAY'),
    ('AWAY FAVORITE', t.role='AWAY' and t.favorite=true),
    ('AWAY UNDERDOG', t.role='AWAY' and t.underdog=true),
    ('DIVISION', t.division_game=true),
    ('HOME FAVORITE', t.role='HOME' and t.favorite=true),
    ('HOME UNDERDOG', t.role='HOME' and t.underdog=true)
  ) v(category,applies)
  where v.applies
), historical_matrix as (
  select h.*, e.environment,
    case
      when e.environment='PREV_ALLOWED 0' then h.previous_runs_allowed=0
      when e.environment='PREV_ALLOWED 10+' then coalesce(h.previous_runs_allowed,0)>=10
      when e.environment='PREV_SCRD 0' then h.previous_runs_scored=0
      when e.environment='PREV_SCRD 10+' then coalesce(h.previous_runs_scored,0)>=10
      when e.environment='10+' then coalesce(h.previous_runs_scored,0)+coalesce(h.previous_runs_allowed,0)>=10
      when e.environment='SWEEP' then h.sweep_opportunity
      when e.environment='AtS' then h.avoid_sweep
      when e.environment in ('ML','OVER','UNDER') then true
      else false end as environment_applies
  from historical_categories h cross join applicable_environments e
), graded as (
  select m.*, x.period,x.market,x.f5_line,x.total_line,x.total_direction,
    case
      when x.period='F5' and m.f5_available and x.f5_line is not null then
        case when m.team_f5_score+x.f5_line>m.opponent_f5_score then 'WIN'
             when m.team_f5_score+x.f5_line<m.opponent_f5_score then 'LOSS' else 'PUSH' end
      when x.period='FULL_GAME' and x.market in ('ML','MONEYLINE') then m.full_game_result
      when x.period='FULL_GAME' and x.market in ('TOTAL','TOTALS') and x.total_line is not null and x.total_direction='OVER' then
        case when m.team_score+m.opponent_score>x.total_line then 'WIN'
             when m.team_score+m.opponent_score<x.total_line then 'LOSS' else 'PUSH' end
      when x.period='FULL_GAME' and x.market in ('TOTAL','TOTALS') and x.total_line is not null and x.total_direction='UNDER' then
        case when m.team_score+m.opponent_score<x.total_line then 'WIN'
             when m.team_score+m.opponent_score>x.total_line then 'LOSS' else 'PUSH' end
      else null end as wager_result
  from historical_matrix m cross join params x
  where m.environment_applies
    and (x.date_from is null or m.official_date>=x.date_from)
    and (x.date_to is null or m.official_date<=x.date_to)
    and upper(m.team_abbreviation)=x.team_abbreviation
    and m.category in (select category from applicable_categories)
), summaries as (
  select category,environment,
    count(*) filter(where wager_result='WIN')::integer as wins,
    count(*) filter(where wager_result='LOSS')::integer as losses,
    count(*) filter(where wager_result='PUSH')::integer as pushes,
    count(*) filter(where wager_result is not null)::integer as sample_size,
    round(100*count(*) filter(where wager_result='WIN')::numeric/nullif(count(*) filter(where wager_result in ('WIN','LOSS')),0),1) as hit_rate
  from graded
  group by category,environment
), rows as (
  select s.*,
    jsonb_build_array(
      jsonb_build_object('key','category','label',s.category),
      jsonb_build_object('key','environment','label',s.environment)
    ) as matching_conditions
  from summaries s cross join params x
  where s.sample_size>=x.minimum_sample
)
select jsonb_build_object(
  'release','MLB_TREND_MATRIX_V1',
  'teamAbbreviation',(select team_abbreviation from ctx),
  'opponentAbbreviation',(select opponent_abbreviation from ctx),
  'applicableCategories',coalesce((select jsonb_agg(category order by category) from applicable_categories),'[]'::jsonb),
  'applicableEnvironments',coalesce((select jsonb_agg(environment order by environment) from applicable_environments),'[]'::jsonb),
  'trends',coalesce((select jsonb_agg(to_jsonb(rows) order by hit_rate desc nulls last,sample_size desc,category,environment) from rows),'[]'::jsonb),
  'generatedAt',now()
);
$$;

revoke all on function public.sports_edge_mlb_trend_matrix(jsonb) from public;
grant execute on function public.sports_edge_mlb_trend_matrix(jsonb) to service_role;

create or replace function public.sports_edge_mlb_trend_matrix_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb, ops
as $$
select jsonb_build_object(
  'release','MLB_TREND_MATRIX_V1',
  'passed',
    (select count(*) from mlb.games where is_final) > 0
    and (select count(*) from mlb.environments) > 0
    and (select count(*) from mlb.games where is_final and f5_available) > 0,
  'finalGames',(select count(*)::integer from mlb.games where is_final),
  'environments',(select count(*)::integer from mlb.environments),
  'f5Games',(select count(*)::integer from mlb.games where is_final and f5_available),
  'trendCategories',jsonb_build_array('1-DAY REST','AFTER A LOSS','AFTER A WIN','AWAY','AWAY FAVORITE','AWAY UNDERDOG','DIVISION','HOME FAVORITE','HOME UNDERDOG'),
  'environmentTags',jsonb_build_array('PREV_ALLOWED 0','PREV_ALLOWED 10+','PREV_SCRD 0','PREV_SCRD 10+','10+','SWEEP','AtS','ML','OVER','UNDER')
);
$$;

revoke all on function public.sports_edge_mlb_trend_matrix_audit() from public;
grant execute on function public.sports_edge_mlb_trend_matrix_audit() to service_role;

commit;
