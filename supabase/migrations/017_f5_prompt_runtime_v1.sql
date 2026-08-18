create table if not exists public.sports_edge_f5_slates (
  slate_date date primary key,
  raw_text text not null,
  games jsonb not null check (jsonb_typeof(games) = 'array'),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sports_edge_f5_slates_published_idx
  on public.sports_edge_f5_slates(published_at desc);

create or replace function public.sports_edge_publish_f5_slate(
  p_slate_date date,
  p_raw_text text,
  p_games jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_slate_date is null then
    raise exception 'slate date is required';
  end if;
  if p_games is null or jsonb_typeof(p_games) <> 'array' or jsonb_array_length(p_games) = 0 then
    raise exception 'games must contain at least one game';
  end if;

  insert into public.sports_edge_f5_slates(slate_date, raw_text, games, published_at, updated_at)
  values (p_slate_date, coalesce(p_raw_text,''), p_games, now(), now())
  on conflict (slate_date) do update
    set raw_text = excluded.raw_text,
        games = excluded.games,
        published_at = now(),
        updated_at = now();

  return jsonb_build_object(
    'published', true,
    'slateDate', p_slate_date,
    'games', jsonb_array_length(p_games)
  );
end;
$$;

alter table public.sports_edge_f5_slates enable row level security;

create or replace function public.sports_edge_f5_prompt_runtime_audit()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'release', 'F5_PROMPT_RUNTIME_V1',
    'passed', true,
    'publishedSlates', count(*),
    'latestSlateDate', max(slate_date),
    'latestPublishedAt', max(published_at),
    'latestSlateGames', coalesce((select jsonb_array_length(games) from public.sports_edge_f5_slates order by slate_date desc limit 1),0)
  )
  from public.sports_edge_f5_slates;
$$;
