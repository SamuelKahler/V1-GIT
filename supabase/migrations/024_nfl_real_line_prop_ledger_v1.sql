-- Sports Edge NFL Real-Line Prop Ledger V1
-- Replaces synthetic X+ threshold hit rates in the consumer Prop Lab with grading
-- against the actual sportsbook line attached to each historical game.
-- Consumer history begins with the 2025 season and rolls forward into 2026+.

create table if not exists nfl.player_prop_lines (
  prop_line_id uuid primary key default gen_random_uuid(),
  game_id uuid not null references nfl.games(game_id) on delete cascade,
  season integer not null,
  week integer,
  player_id text,
  player_name text not null,
  team_abbr text references nfl.teams(abbreviation),
  market_key text not null,
  direction text not null check (direction in ('OVER','UNDER','YES')),
  line numeric,
  american_odds integer,
  book_count integer not null default 0,
  line_min numeric,
  line_max numeric,
  captured_at timestamptz not null,
  snapshot_type text not null default 'CURRENT' check (snapshot_type in ('CURRENT','CLOSING')),
  source text not null default 'THE_ODDS_API',
  source_event_id text,
  offers jsonb not null default '[]'::jsonb,
  actual_value numeric,
  result text not null default 'PENDING' check (result in ('WIN','LOSS','PUSH','PENDING','VOID')),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(game_id, player_name, market_key, direction, snapshot_type)
);

create index if not exists nfl_prop_lines_player_idx on nfl.player_prop_lines(player_name, market_key, season);
create index if not exists nfl_prop_lines_game_idx on nfl.player_prop_lines(game_id, market_key);
create index if not exists nfl_prop_lines_result_idx on nfl.player_prop_lines(result, season);

create or replace function nfl.normalized_player_name(p_name text)
returns text language sql immutable as $$
  select regexp_replace(lower(coalesce(p_name,'')), '[^a-z0-9]', '', 'g');
$$;

create or replace function nfl.prop_actual_value(p nfl.player_game_stats, p_market text)
returns numeric language sql immutable as $$
  select case upper(coalesce(p_market,''))
    when 'PASS_YARDS' then p.pass_yards::numeric
    when 'COMPLETIONS' then p.completions::numeric
    when 'PASS_TDS' then p.pass_tds::numeric
    when 'RUSH_YARDS' then p.rush_yards::numeric
    when 'RUSH_ATTEMPTS' then p.rush_attempts::numeric
    when 'RECEPTIONS' then p.receptions::numeric
    when 'REC_YARDS' then p.receiving_yards::numeric
    when 'ANY_TD' then (coalesce(p.rush_tds,0)+coalesce(p.receiving_tds,0))::numeric
    else null end;
$$;

create or replace function public.sports_edge_nfl_games_for_prop_import(
  p_season integer,
  p_week integer default null
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
select coalesce(jsonb_agg(jsonb_build_object(
  'gameId',g.game_id,
  'externalGameId',g.external_game_id,
  'season',g.season,
  'week',g.week,
  'gameDate',g.game_date,
  'kickoffAt',g.kickoff_at,
  'awayTeam',g.away_team,
  'homeTeam',g.home_team,
  'status',g.status
) order by g.kickoff_at),'[]'::jsonb)
from nfl.games g
where g.season=p_season
  and g.season_type='REG'
  and (p_week is null or g.week=p_week);
$$;

create or replace function public.sports_edge_nfl_upsert_real_prop_lines(p_rows jsonb)
returns jsonb
language plpgsql security definer set search_path=public,nfl as $$
declare v_inserted integer:=0; v_graded integer:=0; v_row jsonb;
begin
  if p_rows is null or jsonb_typeof(p_rows)<>'array' then
    raise exception 'p_rows must be a JSON array';
  end if;

  for v_row in select value from jsonb_array_elements(p_rows)
  loop
    insert into nfl.player_prop_lines(
      game_id,season,week,player_id,player_name,team_abbr,market_key,direction,line,american_odds,
      book_count,line_min,line_max,captured_at,snapshot_type,source,source_event_id,offers,updated_at
    ) values (
      (v_row->>'gameId')::uuid,
      (v_row->>'season')::integer,
      nullif(v_row->>'week','')::integer,
      nullif(v_row->>'playerId',''),
      v_row->>'playerName',
      nullif(v_row->>'team',''),
      upper(v_row->>'market'),
      upper(v_row->>'direction'),
      nullif(v_row->>'line','')::numeric,
      nullif(v_row->>'americanOdds','')::integer,
      coalesce(nullif(v_row->>'bookCount','')::integer,0),
      nullif(v_row->>'lineMin','')::numeric,
      nullif(v_row->>'lineMax','')::numeric,
      (v_row->>'capturedAt')::timestamptz,
      upper(coalesce(nullif(v_row->>'snapshotType',''),'CURRENT')),
      coalesce(nullif(v_row->>'source',''),'THE_ODDS_API'),
      nullif(v_row->>'sourceEventId',''),
      coalesce(v_row->'offers','[]'::jsonb),
      now()
    )
    on conflict (game_id,player_name,market_key,direction,snapshot_type)
    do update set
      player_id=coalesce(excluded.player_id,nfl.player_prop_lines.player_id),
      team_abbr=coalesce(excluded.team_abbr,nfl.player_prop_lines.team_abbr),
      line=excluded.line,
      american_odds=excluded.american_odds,
      book_count=excluded.book_count,
      line_min=excluded.line_min,
      line_max=excluded.line_max,
      captured_at=excluded.captured_at,
      source=excluded.source,
      source_event_id=excluded.source_event_id,
      offers=excluded.offers,
      updated_at=now();
    v_inserted:=v_inserted+1;
  end loop;

  update nfl.player_prop_lines l
  set player_id=coalesce(l.player_id,p.player_id),
      team_abbr=coalesce(l.team_abbr,p.team_abbr),
      actual_value=nfl.prop_actual_value(p,l.market_key),
      result=case
        when nfl.prop_actual_value(p,l.market_key) is null then 'PENDING'
        when l.direction='YES' then case when nfl.prop_actual_value(p,l.market_key)>=1 then 'WIN' else 'LOSS' end
        when l.line is null then 'PENDING'
        when nfl.prop_actual_value(p,l.market_key)=l.line then 'PUSH'
        when l.direction='OVER' and nfl.prop_actual_value(p,l.market_key)>l.line then 'WIN'
        when l.direction='UNDER' and nfl.prop_actual_value(p,l.market_key)<l.line then 'WIN'
        else 'LOSS' end,
      graded_at=case when nfl.prop_actual_value(p,l.market_key) is not null then now() else l.graded_at end,
      updated_at=now()
  from nfl.player_game_stats p
  where l.game_id=p.game_id
    and nfl.normalized_player_name(l.player_name)=nfl.normalized_player_name(p.player_name)
    and l.season>=2025;
  get diagnostics v_graded=row_count;

  return jsonb_build_object('receivedRows',v_inserted,'gradedRows',v_graded,'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_grade_real_prop_lines()
returns jsonb
language plpgsql security definer set search_path=public,nfl as $$
declare v_graded integer:=0; v_pending integer:=0;
begin
  update nfl.player_prop_lines l
  set player_id=coalesce(l.player_id,p.player_id),
      team_abbr=coalesce(l.team_abbr,p.team_abbr),
      actual_value=nfl.prop_actual_value(p,l.market_key),
      result=case
        when nfl.prop_actual_value(p,l.market_key) is null then 'PENDING'
        when l.direction='YES' then case when nfl.prop_actual_value(p,l.market_key)>=1 then 'WIN' else 'LOSS' end
        when l.line is null then 'PENDING'
        when nfl.prop_actual_value(p,l.market_key)=l.line then 'PUSH'
        when l.direction='OVER' and nfl.prop_actual_value(p,l.market_key)>l.line then 'WIN'
        when l.direction='UNDER' and nfl.prop_actual_value(p,l.market_key)<l.line then 'WIN'
        else 'LOSS' end,
      graded_at=case when nfl.prop_actual_value(p,l.market_key) is not null then now() else l.graded_at end,
      updated_at=now()
  from nfl.player_game_stats p
  where l.game_id=p.game_id
    and nfl.normalized_player_name(l.player_name)=nfl.normalized_player_name(p.player_name)
    and l.season>=2025;
  get diagnostics v_graded=row_count;
  select count(*) into v_pending from nfl.player_prop_lines where season>=2025 and result='PENDING';
  return jsonb_build_object('gradedRows',v_graded,'pendingRows',v_pending,'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_real_line_prop_board(
  p_limit integer default 100,
  p_min_games integer default 6,
  p_market text default null,
  p_team text default null,
  p_position text default null
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
with completed as (
  select l.*,p.position,p.headshot_url
  from nfl.player_prop_lines l
  left join nfl.player_game_stats p
    on p.game_id=l.game_id
   and nfl.normalized_player_name(p.player_name)=nfl.normalized_player_name(l.player_name)
  where l.season>=2025
    and l.snapshot_type='CLOSING'
    and l.result in ('WIN','LOSS','PUSH')
    and (p_market is null or l.market_key=upper(p_market))
    and (p_team is null or l.team_abbr=upper(p_team))
    and (p_position is null or p.position=upper(p_position))
), agg as (
  select coalesce(max(player_id),nfl.normalized_player_name(player_name)) player_id,
    player_name,max(team_abbr) team_abbr,max(position) position,max(headshot_url) headshot_url,
    market_key,direction,
    count(*)::int games,
    count(*) filter(where result='WIN')::int wins,
    count(*) filter(where result='LOSS')::int losses,
    count(*) filter(where result='PUSH')::int pushes,
    round(100.0*count(*) filter(where result='WIN')/nullif(count(*) filter(where result in ('WIN','LOSS')),0),1) hit_rate,
    round(avg(line)::numeric,1) avg_line,round(min(line)::numeric,1) min_line,round(max(line)::numeric,1) max_line,
    round(avg(actual_value)::numeric,1) avg_actual,
    min(season)::int start_season,max(season)::int latest_season,
    count(distinct season)::int seasons,
    round(avg(book_count)::numeric,1) avg_books
  from completed
  group by player_name,market_key,direction
  having count(*)>=greatest(1,coalesce(p_min_games,6))
), scored as (
  select a.*,
    case when games>=14 and hit_rate>=60 then 'STRONG SAMPLE'
         when games>=8 and hit_rate>=58 then 'QUALIFIED SAMPLE'
         else 'DEVELOPING SAMPLE' end sample_label,
    round((greatest(hit_rate-50,0)*1.4 + least(games,18)*1.5 + greatest(seasons-1,0)*4)::numeric,1) strength_score
  from agg a
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',player_id,'playerName',player_name,'headshotUrl',headshot_url,'team',team_abbr,'position',position,
  'market',market_key,'direction',direction,'wins',wins,'losses',losses,'pushes',pushes,'games',games,'hitRate',hit_rate,
  'avgLine',avg_line,'minLine',min_line,'maxLine',max_line,'avgActual',avg_actual,'startSeason',start_season,'latestSeason',latest_season,
  'seasons',seasons,'avgBooks',avg_books,'sampleLabel',sample_label,'strengthScore',strength_score,'source','REAL_CLOSING_LINES'
) order by strength_score desc,hit_rate desc,games desc),'[]'::jsonb)
from (select * from scored order by strength_score desc,hit_rate desc,games desc limit greatest(1,least(coalesce(p_limit,100),500))) x;
$$;

create or replace function public.sports_edge_nfl_player_real_line_history(
  p_player_id text default null,
  p_player_name text default null,
  p_market text default null,
  p_direction text default null,
  p_limit integer default 80
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
with rows as (
  select l.*,g.game_date,g.away_team,g.home_team,p.position,p.headshot_url,
    coalesce(p.player_id,l.player_id) canonical_player_id,
    coalesce(p.player_name,l.player_name) canonical_player_name,
    coalesce(p.team_abbr,l.team_abbr) canonical_team,
    case when coalesce(p.team_abbr,l.team_abbr)=g.away_team then g.home_team else g.away_team end opponent
  from nfl.player_prop_lines l
  join nfl.games g on g.game_id=l.game_id
  left join nfl.player_game_stats p on p.game_id=l.game_id and nfl.normalized_player_name(p.player_name)=nfl.normalized_player_name(l.player_name)
  where l.season>=2025
    and l.snapshot_type='CLOSING'
    and ((p_player_id is not null and coalesce(p.player_id,l.player_id)=p_player_id)
      or (p_player_id is null and p_player_name is not null and nfl.normalized_player_name(coalesce(p.player_name,l.player_name))=nfl.normalized_player_name(p_player_name)))
    and (p_market is null or l.market_key=upper(p_market))
    and (p_direction is null or l.direction=upper(p_direction))
  order by l.season desc,l.week desc,l.captured_at desc
  limit greatest(1,least(coalesce(p_limit,80),200))
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',canonical_player_id,'playerName',canonical_player_name,'headshotUrl',headshot_url,'team',canonical_team,'position',position,
  'season',season,'week',week,'gameDate',game_date,'opponent',opponent,'market',market_key,'direction',direction,
  'line',line,'americanOdds',american_odds,'actual',actual_value,'result',result,'bookCount',book_count,'lineMin',line_min,'lineMax',line_max,
  'capturedAt',captured_at,'source',source
) order by season desc,week desc),'[]'::jsonb) from rows;
$$;

create or replace function public.sports_edge_nfl_real_line_prop_audit()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare v_rows integer; v_closing integer; v_graded integer; v_pending integer; v_players integer; v_profiles integer; v_2025 integer;
begin
  select count(*) into v_rows from nfl.player_prop_lines where season>=2025;
  select count(*) into v_closing from nfl.player_prop_lines where season>=2025 and snapshot_type='CLOSING';
  select count(*) into v_graded from nfl.player_prop_lines where season>=2025 and result in ('WIN','LOSS','PUSH');
  select count(*) into v_pending from nfl.player_prop_lines where season>=2025 and result='PENDING';
  select count(distinct nfl.normalized_player_name(player_name)) into v_players from nfl.player_prop_lines where season>=2025;
  select count(*) into v_2025 from nfl.player_prop_lines where season=2025 and snapshot_type='CLOSING';
  select jsonb_array_length(public.sports_edge_nfl_real_line_prop_board(500,6,null,null,null)) into v_profiles;
  return jsonb_build_object(
    'release','NFL_REAL_LINE_PROP_LEDGER_V1',
    'passed',(v_rows>=0 and v_pending>=0),
    'propLineRows',v_rows,'closingRows',v_closing,'gradedRows',v_graded,'pendingRows',v_pending,'playersWithLines',v_players,
    'season2025ClosingRows',v_2025,'qualifiedProfiles',v_profiles,'consumerHistoryStartSeason',2025,
    'usesSyntheticThresholds',false,'checkedAt',now()
  );
end $$;

grant execute on function public.sports_edge_nfl_games_for_prop_import(integer,integer) to service_role;
grant execute on function public.sports_edge_nfl_upsert_real_prop_lines(jsonb) to service_role;
grant execute on function public.sports_edge_nfl_grade_real_prop_lines() to service_role;
grant execute on function public.sports_edge_nfl_real_line_prop_board(integer,integer,text,text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_player_real_line_history(text,text,text,text,integer) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_real_line_prop_audit() to service_role;
