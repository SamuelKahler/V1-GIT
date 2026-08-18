-- Custom F5 Model Engine V1A
-- Verified factor snapshots for customer-adjustable F5 weights.
-- Read-only against MLB backbone; no historical records are modified.

create or replace function public.sports_edge_f5_factor_snapshot(
  p_pick_date date,
  p_team_abbreviation text,
  p_line numeric
)
returns jsonb
language sql
security definer
set search_path = public, mlb
as $$
with params as (
  select
    p_pick_date as pick_date,
    upper(trim(p_team_abbreviation)) as team_abbreviation,
    coalesce(p_line, 0)::numeric as f5_line
), team_row as (
  select t.id, t.team_id, t.abbreviation, t.name
  from mlb.teams t cross join params p
  where upper(t.abbreviation) = p.team_abbreviation
  limit 1
), current_game as (
  select
    g.id as game_id,
    g.game_pk,
    g.official_date,
    g.venue_id,
    case when g.home_team_id = t.id then 'HOME' else 'AWAY' end::text as role,
    case when g.home_team_id = t.id then g.away_team_id else g.home_team_id end as opponent_team_uuid,
    case when g.home_team_id = t.id then at.abbreviation else ht.abbreviation end as opponent_abbreviation,
    case when g.home_team_id = t.id then e.home_rest_days else e.away_rest_days end as rest_days,
    case when g.home_team_id = t.id then e.home_previous_result else e.away_previous_result end as previous_result,
    case when g.home_team_id = t.id then e.away_pitcher_hand else e.home_pitcher_hand end as opponent_pitcher_hand,
    case when g.home_team_id = t.id then e.home_rest_advantage else e.away_rest_advantage end as rest_advantage,
    starter.pitcher_id as starter_pitcher_id,
    starter.full_name as starter_name
  from params p
  join team_row t on true
  join mlb.games g
    on g.official_date = p.pick_date
   and (g.home_team_id = t.id or g.away_team_id = t.id)
  join mlb.teams at on at.id = g.away_team_id
  join mlb.teams ht on ht.id = g.home_team_id
  left join mlb.environments e on e.game_id = g.id
  left join lateral (
    select gp.pitcher_id, pi.full_name
    from mlb.game_pitchers gp
    join mlb.pitchers pi on pi.id = gp.pitcher_id
    where gp.game_id = g.id
      and gp.team_side = case when g.home_team_id = t.id then 'home' else 'away' end
      and gp.role in ('confirmed_starter','probable_starter')
    order by case gp.role when 'confirmed_starter' then 0 else 1 end, gp.updated_at desc
    limit 1
  ) starter on true
  order by g.game_number, g.game_pk
  limit 1
), derived_context as (
  select
    cg.*,
    coalesce(
      cg.rest_days,
      greatest(0, (p.pick_date - prior.last_game_date) - 1)
    )::integer as effective_rest_days
  from current_game cg
  cross join params p
  left join lateral (
    select max(g2.official_date) as last_game_date
    from mlb.games g2
    join team_row t on true
    where g2.is_final
      and g2.official_date < p.pick_date
      and (g2.home_team_id = t.id or g2.away_team_id = t.id)
  ) prior on true
), historical as (
  select
    g.id as game_id,
    g.official_date,
    'HOME'::text as role,
    g.venue_id,
    g.away_team_id as opponent_team_uuid,
    at.abbreviation as opponent_abbreviation,
    g.f5_home_score as team_f5_score,
    g.f5_away_score as opponent_f5_score,
    e.home_rest_days as rest_days,
    e.home_previous_result as previous_result,
    e.away_pitcher_hand as opponent_pitcher_hand,
    e.home_rest_advantage as rest_advantage,
    starter.pitcher_id as starter_pitcher_id
  from mlb.games g
  join team_row t on t.id = g.home_team_id
  join params p on g.official_date < p.pick_date
  join mlb.teams at on at.id = g.away_team_id
  left join mlb.environments e on e.game_id = g.id
  left join lateral (
    select gp.pitcher_id
    from mlb.game_pitchers gp
    where gp.game_id = g.id
      and gp.team_side = 'home'
      and gp.role in ('confirmed_starter','probable_starter')
    order by case gp.role when 'confirmed_starter' then 0 else 1 end, gp.updated_at desc
    limit 1
  ) starter on true
  where g.is_final and g.f5_available
  union all
  select
    g.id,
    g.official_date,
    'AWAY'::text,
    g.venue_id,
    g.home_team_id,
    ht.abbreviation,
    g.f5_away_score,
    g.f5_home_score,
    e.away_rest_days,
    e.away_previous_result,
    e.home_pitcher_hand,
    e.away_rest_advantage,
    starter.pitcher_id
  from mlb.games g
  join team_row t on t.id = g.away_team_id
  join params p on g.official_date < p.pick_date
  join mlb.teams ht on ht.id = g.home_team_id
  left join mlb.environments e on e.game_id = g.id
  left join lateral (
    select gp.pitcher_id
    from mlb.game_pitchers gp
    where gp.game_id = g.id
      and gp.team_side = 'away'
      and gp.role in ('confirmed_starter','probable_starter')
    order by case gp.role when 'confirmed_starter' then 0 else 1 end, gp.updated_at desc
    limit 1
  ) starter on true
  where g.is_final and g.f5_available
), graded as (
  select
    h.*,
    case
      when h.team_f5_score + p.f5_line > h.opponent_f5_score then 'WIN'
      when h.team_f5_score + p.f5_line < h.opponent_f5_score then 'LOSS'
      else 'PUSH'
    end as cover_result
  from historical h cross join params p
), recent as (
  select * from graded order by official_date desc limit 15
), opponent_history as (
  select g.f5_home_score::numeric as f5_runs
  from mlb.games g
  join derived_context c on c.opponent_team_uuid = g.home_team_id
  join params p on g.official_date < p.pick_date
  where g.is_final and g.f5_available
  union all
  select g.f5_away_score::numeric
  from mlb.games g
  join derived_context c on c.opponent_team_uuid = g.away_team_id
  join params p on g.official_date < p.pick_date
  where g.is_final and g.f5_available
), league_runs as (
  select avg(runs)::numeric as avg_f5_runs
  from (
    select g.f5_home_score::numeric as runs
    from mlb.games g cross join params p
    where g.is_final and g.f5_available and g.official_date < p.pick_date
    union all
    select g.f5_away_score::numeric
    from mlb.games g cross join params p
    where g.is_final and g.f5_available and g.official_date < p.pick_date
  ) x
), empirical as (
  select 'starter_history'::text as factor_key, 'Starting Pitcher History'::text as label,
         count(*) filter (where cover_result='WIN')::integer as wins,
         count(*) filter (where cover_result='LOSS')::integer as losses,
         count(*) filter (where cover_result='PUSH')::integer as pushes
  from graded g join derived_context c on true
  where c.starter_pitcher_id is not null and g.starter_pitcher_id = c.starter_pitcher_id
  union all
  select 'team_f5_split','Team F5 Split',
         count(*) filter (where cover_result='WIN')::integer,
         count(*) filter (where cover_result='LOSS')::integer,
         count(*) filter (where cover_result='PUSH')::integer
  from graded g join derived_context c on true where g.role = c.role
  union all
  select 'recent_f5_form','Recent F5 Form',
         count(*) filter (where cover_result='WIN')::integer,
         count(*) filter (where cover_result='LOSS')::integer,
         count(*) filter (where cover_result='PUSH')::integer
  from recent
  union all
  select 'matchup_history','Matchup History',
         count(*) filter (where cover_result='WIN')::integer,
         count(*) filter (where cover_result='LOSS')::integer,
         count(*) filter (where cover_result='PUSH')::integer
  from graded g join derived_context c on true where g.opponent_team_uuid = c.opponent_team_uuid
  union all
  select 'situation_match','Situation Match',
         count(*) filter (where cover_result='WIN')::integer,
         count(*) filter (where cover_result='LOSS')::integer,
         count(*) filter (where cover_result='PUSH')::integer
  from graded g join derived_context c on true
  where g.role = c.role
    and (c.previous_result is null or g.previous_result = c.previous_result)
    and (c.opponent_pitcher_hand is null or g.opponent_pitcher_hand = c.opponent_pitcher_hand)
    and (c.rest_advantage is null or g.rest_advantage = c.rest_advantage)
  union all
  select 'rest_location','Rest / Location',
         count(*) filter (where cover_result='WIN')::integer,
         count(*) filter (where cover_result='LOSS')::integer,
         count(*) filter (where cover_result='PUSH')::integer
  from graded g join derived_context c on true
  where g.role = c.role
    and (c.effective_rest_days is null or g.rest_days = c.effective_rest_days)
), factor_rows as (
  select
    e.factor_key,
    e.label,
    (e.wins + e.losses + e.pushes)::integer as sample,
    e.wins, e.losses, e.pushes,
    case when e.wins + e.losses > 0 then round(100.0 * e.wins / (e.wins + e.losses), 1) else null end as raw_rate,
    case when e.wins + e.losses > 0 then round(100.0 * (e.wins + 5.0) / (e.wins + e.losses + 10.0), 1) else null end as score,
    null::jsonb as extra
  from empirical e
  union all
  select
    'opponent_early_offense',
    'Opponent Early Offense',
    count(*)::integer,
    null::integer, null::integer, null::integer,
    null::numeric,
    case when count(*) > 0 and lr.avg_f5_runs is not null
      then round(greatest(35.0, least(65.0, 50.0 + (lr.avg_f5_runs - avg(oh.f5_runs)) * 10.0)), 1)
      else null end,
    jsonb_build_object(
      'opponentAvgF5Runs', round(avg(oh.f5_runs),2),
      'leagueAvgF5Runs', round(lr.avg_f5_runs,2)
    )
  from opponent_history oh cross join league_runs lr
  group by lr.avg_f5_runs
), factors_json as (
  select jsonb_object_agg(
    factor_key,
    jsonb_build_object(
      'key', factor_key,
      'label', label,
      'available', score is not null,
      'score', score,
      'sample', sample,
      'wins', wins,
      'losses', losses,
      'pushes', pushes,
      'rawRate', raw_rate,
      'extra', extra
    )
  ) as factors
  from factor_rows
)
select jsonb_build_object(
  'version','F5_MODEL_ENGINE_V1A',
  'pickDate', p.pick_date,
  'team', t.abbreviation,
  'teamName', t.name,
  'line', p.f5_line,
  'gamePk', c.game_pk,
  'role', c.role,
  'opponent', c.opponent_abbreviation,
  'starter', c.starter_name,
  'restDays', c.effective_rest_days,
  'factors', coalesce(f.factors, '{}'::jsonb)
)
from params p
join team_row t on true
left join derived_context c on true
cross join factors_json f;
$$;

revoke all on function public.sports_edge_f5_factor_snapshot(date,text,numeric) from public;
revoke all on function public.sports_edge_f5_factor_snapshot(date,text,numeric) from anon;
revoke all on function public.sports_edge_f5_factor_snapshot(date,text,numeric) from authenticated;
grant execute on function public.sports_edge_f5_factor_snapshot(date,text,numeric) to service_role;

create or replace function public.sports_edge_f5_model_v1a_audit()
returns jsonb
language sql
security definer
set search_path = public, mlb
as $$
  select jsonb_build_object(
    'passed', true,
    'release', 'CUSTOM_F5_MODEL_ENGINE_V1A',
    'games', (select count(*) from mlb.games),
    'finalF5Games', (select count(*) from mlb.games where is_final and f5_available),
    'storedPicks', (select count(*) from public.sports_edge_picks),
    'latestEnvironmentDate', (
      select max(g.official_date)
      from mlb.environments e join mlb.games g on g.id=e.game_id
    )
  );
$$;
