create extension if not exists pgcrypto;

create table if not exists public.sports_edge_picks (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  pick_date date not null,
  raw_line text not null,
  raw_pick text not null,
  odds integer,
  units numeric,
  has_explicit_units boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING','LIVE','WIN','LOSS','PUSH','VOID')),
  notes text,
  source text not null default 'ADMIN_PICK_ENTRY',
  batch_id uuid not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sports_edge_picks_pick_date_idx on public.sports_edge_picks(pick_date desc);
create index if not exists sports_edge_picks_batch_idx on public.sports_edge_picks(batch_id);
create index if not exists sports_edge_picks_status_idx on public.sports_edge_picks(status);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists sports_edge_picks_updated_at on public.sports_edge_picks;
create trigger sports_edge_picks_updated_at
before update on public.sports_edge_picks
for each row execute function public.set_updated_at();

alter table public.sports_edge_picks enable row level security;

create or replace function public.sports_edge_pick_entry_audit()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'passed', true,
    'release', 'ADMIN_PICK_ENTRY_V1',
    'storedPicks', count(*)::integer,
    'latestPickDate', max(pick_date),
    'publishedBatches', count(distinct batch_id)::integer,
    'explicitUnitPicks', count(*) filter (where has_explicit_units)::integer,
    'livePicks', count(*) filter (where status = 'LIVE')::integer,
    'finalizedPicks', count(*) filter (where status in ('WIN','LOSS','PUSH','VOID'))::integer
  )
  from public.sports_edge_picks;
$$;

create or replace function public.sports_edge_publish_picks(
  p_dates date[],
  p_rows jsonb,
  p_batch_id uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  if p_dates is null or cardinality(p_dates) = 0 then
    raise exception 'At least one pick date is required.';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    raise exception 'p_rows must be a JSON array.';
  end if;

  delete from public.pick_observations
  where pick_id in (
    select 'SRC-DAILYIMPORTPICKS-' || regexp_replace(canonical_key, '^ADMIN-', '')
    from public.sports_edge_picks
    where pick_date = any(p_dates)
  );

  delete from public.sports_edge_picks where pick_date = any(p_dates);

  insert into public.sports_edge_picks (
    canonical_key, pick_date, raw_line, raw_pick, odds, units,
    has_explicit_units, status, notes, source, batch_id, published_at
  )
  select
    row_data->>'canonical_key',
    (row_data->>'pick_date')::date,
    row_data->>'raw_line',
    row_data->>'raw_pick',
    nullif(row_data->>'odds','')::integer,
    nullif(row_data->>'units','')::numeric,
    coalesce((row_data->>'has_explicit_units')::boolean, false),
    coalesce(nullif(row_data->>'status',''), 'PENDING'),
    row_data->>'notes',
    coalesce(nullif(row_data->>'source',''), 'ADMIN_PICK_ENTRY'),
    p_batch_id,
    coalesce(nullif(row_data->>'published_at','')::timestamptz, now())
  from jsonb_array_elements(p_rows) as row_data;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.sports_edge_publish_picks(date[], jsonb, uuid) from public;
revoke all on function public.sports_edge_publish_picks(date[], jsonb, uuid) from anon;
revoke all on function public.sports_edge_publish_picks(date[], jsonb, uuid) from authenticated;
grant execute on function public.sports_edge_publish_picks(date[], jsonb, uuid) to service_role;
