create extension if not exists pgcrypto;
create table if not exists public.pick_observations (
  id uuid primary key default gen_random_uuid(),
  pick_id text not null unique,
  game_pk bigint,
  pick_date date,
  selected_team text,
  opponent text,
  market text not null,
  period text not null,
  line numeric,
  odds integer,
  result text not null check (result in ('WIN','LOSS','PUSH','VOID','PENDING','UNVERIFIED')),
  grade_reason text,
  resolution_confidence integer not null default 0 check (resolution_confidence between 0 and 100),
  environment jsonb,
  source_record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pick_observations_game_pk_idx on public.pick_observations(game_pk);
create index if not exists pick_observations_environment_idx on public.pick_observations using gin(environment);
create index if not exists pick_observations_result_idx on public.pick_observations(result);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists pick_observations_updated_at on public.pick_observations;
create trigger pick_observations_updated_at before update on public.pick_observations for each row execute function public.set_updated_at();
alter table public.pick_observations enable row level security;
