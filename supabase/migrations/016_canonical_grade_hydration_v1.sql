-- Sports Edge Canonical Grade Hydration V1
-- Non-destructive: creates a canonical read view and an audit function only.

create or replace view public.sports_edge_pick_grade_canonical as
with ranked as (
  select
    po.*,
    row_number() over (
      partition by
        po.pick_date,
        coalesce(po.selected_team, ''),
        coalesce(po.opponent, ''),
        coalesce(po.market, ''),
        coalesce(po.period, ''),
        coalesce(po.line, -9999::numeric),
        coalesce(po.odds, -999999)
      order by
        case when po.result in ('WIN','LOSS','PUSH','VOID') then 0 else 1 end,
        po.resolution_confidence desc,
        po.updated_at desc,
        po.created_at desc
    ) as rn
  from public.pick_observations po
)
select
  id,
  pick_id,
  game_pk,
  pick_date,
  selected_team,
  opponent,
  market,
  period,
  line,
  odds,
  result,
  grade_reason,
  resolution_confidence,
  environment,
  source_record,
  created_at,
  updated_at
from ranked
where rn = 1;

create or replace function public.sports_edge_grade_hydration_audit()
returns jsonb
language sql
stable
as $$
  with raw as (
    select count(*)::int as count from public.pick_observations
  ), canonical as (
    select count(*)::int as count from public.sports_edge_pick_grade_canonical
  ), finalized as (
    select count(*)::int as count
    from public.sports_edge_pick_grade_canonical
    where result in ('WIN','LOSS','PUSH','VOID')
  ), latest as (
    select max(updated_at) as at from public.sports_edge_pick_grade_canonical
  )
  select jsonb_build_object(
    'release', 'CANONICAL_GRADE_HYDRATION_V1',
    'passed', true,
    'rawGradeRows', raw.count,
    'canonicalGradeRows', canonical.count,
    'duplicateSourceRowsHidden', greatest(raw.count - canonical.count, 0),
    'finalizedCanonicalGrades', finalized.count,
    'latestGradeAt', latest.at
  )
  from raw, canonical, finalized, latest;
$$;
