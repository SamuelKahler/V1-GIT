import { callRpc } from '../mlb/supabase.js';
import { parseCsv } from './historical-ingestion.js';

const DEFAULT_PLAYER_SEASONS = [2023, 2024, 2025];
const BATCH_SIZE = 225;
const TEAM_ALIASES = Object.freeze({ LA:'LAR', WAS:'WSH', JAC:'JAX', OAK:'LV', SD:'LAC', STL:'LAR' });

function normalizeTeam(value){ const key=String(value||'').trim().toUpperCase(); return TEAM_ALIASES[key]||key||null; }
function numberOrNull(value){ if(value===undefined||value===null||value==='') return null; const n=Number(value); return Number.isFinite(n)?n:null; }
function integerOrNull(value){ const n=numberOrNull(value); return n===null?null:Math.trunc(n); }
function normalizeSeasons(input){
  const values=Array.isArray(input)?input:String(input||'').split(',');
  const seasons=[...new Set(values.map(Number).filter(v=>Number.isInteger(v)&&v>=1999&&v<=2100))].sort();
  return seasons.length?seasons:[...DEFAULT_PLAYER_SEASONS];
}
function sourceUrl(season){ return `https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_${season}.csv`; }
function normalizeRow(row){
  const season=integerOrNull(row.season), week=integerOrNull(row.week), playerId=String(row.player_id||'').trim();
  const team=normalizeTeam(row.team), opponent=normalizeTeam(row.opponent_team);
  const gameId=String(row.game_id||'').trim();
  if(!season||!week||!playerId||!team||!gameId) return null;
  return {
    externalGameId:gameId, season, week, seasonType:String(row.season_type||'REG').trim().toUpperCase(),
    playerId, playerName:String(row.player_display_name||row.player_name||'').trim()||playerId,
    shortName:String(row.player_name||'').trim()||null, headshotUrl:String(row.headshot_url||'').trim()||null,
    teamAbbr:team, opponentAbbr:opponent, position:String(row.position||'').trim().toUpperCase()||null,
    positionGroup:String(row.position_group||'').trim().toUpperCase()||null,
    completions:integerOrNull(row.completions), passAttempts:integerOrNull(row.attempts), passYards:integerOrNull(row.passing_yards), passTds:integerOrNull(row.passing_tds), interceptions:integerOrNull(row.passing_interceptions),
    rushAttempts:integerOrNull(row.carries ?? row.rushing_attempts), rushYards:integerOrNull(row.rushing_yards), rushTds:integerOrNull(row.rushing_tds),
    targets:integerOrNull(row.targets), receptions:integerOrNull(row.receptions), receivingYards:integerOrNull(row.receiving_yards), receivingTds:integerOrNull(row.receiving_tds),
    receivingAirYards:integerOrNull(row.receiving_air_yards), receivingYac:integerOrNull(row.receiving_yards_after_catch),
    targetShare:numberOrNull(row.target_share), airYardsShare:numberOrNull(row.air_yards_share), wopr:numberOrNull(row.wopr),
    fantasyPointsPpr:numberOrNull(row.fantasy_points_ppr), sourcePayload:row
  };
}
async function fetchSeason(season){
  const url=sourceUrl(season); const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch(url,{signal:controller.signal,headers:{Accept:'text/csv,text/plain;q=0.9,*/*;q=0.8','User-Agent':'Sports-Edge-NFL-Player-Ingestion/1.0'}});
    if(response.status===404) return {season,url,rows:[],missing:true};
    if(!response.ok) throw new Error(`NFL player source ${season} returned HTTP ${response.status}.`);
    const rows=parseCsv(await response.text()).map(normalizeRow).filter(Boolean);
    return {season,url,rows,missing:false};
  } finally { clearTimeout(timeout); }
}
export async function importNflPlayerStats({seasons,dryRun=false}={}){
  const selected=normalizeSeasons(seasons); const sources=[]; const rows=[];
  for(const season of selected){ const result=await fetchSeason(season); sources.push({season,url:result.url,rows:result.rows.length,missing:result.missing}); rows.push(...result.rows); }
  const summary={seasons:selected,sources,matchedRows:rows.length,batches:0,imported:0,dryRun:Boolean(dryRun)};
  if(dryRun) return summary;
  for(let i=0;i<rows.length;i+=BATCH_SIZE){ const batch=rows.slice(i,i+BATCH_SIZE); const result=await callRpc('sports_edge_nfl_import_player_stats_batch',{p_rows:batch},{timeoutMs:45000}); summary.batches+=1; summary.imported+=Number(result?.imported||0); }
  summary.audit=await callRpc('sports_edge_nfl_player_intelligence_audit',{});
  return summary;
}
export { DEFAULT_PLAYER_SEASONS, sourceUrl };
