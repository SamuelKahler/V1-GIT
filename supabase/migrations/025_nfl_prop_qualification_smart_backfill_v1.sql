create table if not exists nfl.player_roster_seasons (
  season integer not null,
  player_id text,
  player_name text not null,
  normalized_player_name text generated always as (lower(regexp_replace(player_name,'[^a-zA-Z0-9]','','g'))) stored,
  team_abbr text not null,
  position text,
  status text,
  headshot_url text,
  source_payload jsonb,
  updated_at timestamptz not null default now(),
  primary key (season, normalized_player_name, team_abbr)
);
create index if not exists nfl_roster_player_idx on nfl.player_roster_seasons(season,normalized_player_name);

create or replace function public.sports_edge_nfl_import_roster_batch(p_rows jsonb)
returns jsonb language plpgsql security definer set search_path=public,nfl as $$
declare r jsonb; v_count integer:=0;
begin
  if p_rows is null or jsonb_typeof(p_rows)<>'array' then raise exception 'p_rows must be a JSON array'; end if;
  for r in select value from jsonb_array_elements(p_rows) loop
    insert into nfl.player_roster_seasons(season,player_id,player_name,team_abbr,position,status,headshot_url,source_payload,updated_at)
    values((r->>'season')::integer,nullif(r->>'playerId',''),r->>'playerName',upper(r->>'teamAbbr'),nullif(upper(r->>'position'),''),nullif(upper(r->>'status'),''),nullif(r->>'headshotUrl',''),r->'sourcePayload',now())
    on conflict (season,normalized_player_name,team_abbr) do update set player_id=coalesce(excluded.player_id,nfl.player_roster_seasons.player_id),position=excluded.position,status=excluded.status,headshot_url=coalesce(excluded.headshot_url,nfl.player_roster_seasons.headshot_url),source_payload=excluded.source_payload,updated_at=now();
    v_count:=v_count+1;
  end loop;
  return jsonb_build_object('imported',v_count,'checkedAt',now());
end $$;

create or replace function public.sports_edge_nfl_qualified_real_line_prop_board(
  p_limit integer default 100,
  p_min_games integer default 10,
  p_min_hit_rate numeric default 60,
  p_market text default null,
  p_team text default null,
  p_position text default null
) returns jsonb
language sql stable security definer set search_path=public,nfl as $$
with completed as (
  select l.*,p.position,p.headshot_url
  from nfl.player_prop_lines l
  left join nfl.player_game_stats p on p.game_id=l.game_id and nfl.normalized_player_name(p.player_name)=nfl.normalized_player_name(l.player_name)
  where l.season=2025 and l.snapshot_type='CLOSING' and l.result in ('WIN','LOSS','PUSH')
    and (p_market is null or l.market_key=upper(p_market))
    and (p_team is null or l.team_abbr=upper(p_team))
    and (p_position is null or p.position=upper(p_position))
), agg as (
  select coalesce(max(player_id),nfl.normalized_player_name(player_name)) player_id,player_name,max(team_abbr) historical_team,max(position) position,max(headshot_url) headshot_url,
    market_key,direction,count(*)::int games,count(*) filter(where result='WIN')::int wins,count(*) filter(where result='LOSS')::int losses,count(*) filter(where result='PUSH')::int pushes,
    round(100.0*count(*) filter(where result='WIN')/nullif(count(*) filter(where result in ('WIN','LOSS')),0),1) hit_rate,
    round(avg(line)::numeric,1) avg_line,round(min(line)::numeric,1) min_line,round(max(line)::numeric,1) max_line,round(avg(actual_value)::numeric,1) avg_actual,round(avg(book_count)::numeric,1) avg_books
  from completed group by player_name,market_key,direction
), continuity as (
  select a.*,coalesce(r.team_abbr,a.historical_team) current_team,
    case when r.team_abbr is null then 'UNKNOWN' when r.team_abbr=a.historical_team then 'SAME TEAM' else 'NEW TEAM' end continuity_status
  from agg a
  left join lateral (
    select rr.team_abbr from nfl.player_roster_seasons rr
    where rr.season=2026 and rr.normalized_player_name=nfl.normalized_player_name(a.player_name)
    order by case when rr.status in ('ACT','ACTIVE') then 0 else 1 end,rr.updated_at desc limit 1
  ) r on true
), qualified as (
  select c.*,
    case when games>=14 and hit_rate>=70 then 'ELITE PROFILE' when games>=12 and hit_rate>=65 then 'STRONG PROFILE' when games>=greatest(10,p_min_games) and hit_rate>=greatest(60,p_min_hit_rate) then 'QUALIFIED PROFILE' else 'DEVELOPING' end sample_label,
    round((greatest(hit_rate-50,0)*1.5 + least(games,17)*1.6 + case continuity_status when 'SAME TEAM' then 8 when 'NEW TEAM' then -8 else 0 end)::numeric,1) relevance_score
  from continuity c
  where games>=greatest(1,p_min_games) and hit_rate>=p_min_hit_rate
)
select coalesce(jsonb_agg(jsonb_build_object(
  'playerId',player_id,'playerName',player_name,'headshotUrl',headshot_url,'team',current_team,'historicalTeam',historical_team,'position',position,
  'market',market_key,'direction',direction,'wins',wins,'losses',losses,'pushes',pushes,'games',games,'hitRate',hit_rate,
  'avgLine',avg_line,'minLine',min_line,'maxLine',max_line,'avgActual',avg_actual,'avgBooks',avg_books,'sampleLabel',sample_label,
  'continuityStatus',continuity_status,'continuityNote',case when continuity_status='NEW TEAM' then '2025 record is retained, but 2026 team/system context changed.' when continuity_status='SAME TEAM' then 'Same-team continuity into 2026.' else '2026 roster continuity not yet verified.' end,
  'relevanceScore',relevance_score,'source','REAL_CLOSING_LINES_2025'
) order by relevance_score desc,hit_rate desc,games desc),'[]'::jsonb)
from (select * from qualified order by relevance_score desc,hit_rate desc,games desc limit greatest(1,least(coalesce(p_limit,100),500))) q;
$$;

create or replace function public.sports_edge_nfl_prop_qualification_audit()
returns jsonb language plpgsql stable security definer set search_path=public,nfl as $$
declare v_roster integer; v_profiles integer; v_new integer; v_tiny integer;
begin
  select count(*) into v_roster from nfl.player_roster_seasons where season=2026;
  select jsonb_array_length(public.sports_edge_nfl_qualified_real_line_prop_board(500,10,60,null,null,null)) into v_profiles;
  select count(*) into v_new from (
    select distinct l.player_name from nfl.player_prop_lines l join nfl.player_roster_seasons r on r.season=2026 and r.normalized_player_name=nfl.normalized_player_name(l.player_name)
    where l.season=2025 and l.team_abbr is not null and r.team_abbr<>l.team_abbr
  ) x;
  select count(*) into v_tiny from jsonb_array_elements(public.sports_edge_nfl_qualified_real_line_prop_board(500,10,60,null,null,null)) j where (j->>'games')::integer<10;
  return jsonb_build_object('release','NFL_PROP_QUALIFICATION_SMART_BACKFILL_V1','passed',(v_tiny=0),'currentRosterRows',v_roster,'qualifiedProfiles',v_profiles,'newTeamPlayersDetected',v_new,'featuredProfilesBelow10Games',v_tiny,'minimumFeaturedGames',10,'minimumFeaturedHitRate',60,'historicalProfileSeason',2025,'checkedAt',now());
end $$;

grant execute on function public.sports_edge_nfl_import_roster_batch(jsonb) to service_role;
grant execute on function public.sports_edge_nfl_qualified_real_line_prop_board(integer,integer,numeric,text,text,text) to anon,authenticated,service_role;
grant execute on function public.sports_edge_nfl_prop_qualification_audit() to service_role;
