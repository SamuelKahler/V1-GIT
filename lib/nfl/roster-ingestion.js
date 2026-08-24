import { callRpc } from '../mlb/supabase.js';
import { parseCsv } from './historical-ingestion.js';

const TEAM_ALIASES = Object.freeze({ LA:'LAR', WAS:'WSH', JAC:'JAX', OAK:'LV', SD:'LAC', STL:'LAR' });
function normalizeTeam(value){ const key=String(value||'').trim().toUpperCase(); return TEAM_ALIASES[key]||key||null; }
function sourceUrl(season){ return `https://github.com/nflverse/nflverse-data/releases/download/rosters/roster_${season}.csv`; }
function normalizeRow(row, season){
  const playerId=String(row.gsis_id||row.esb_id||row.pfr_id||row.sleeper_id||'').trim();
  const playerName=String(row.full_name||[row.first_name,row.last_name].filter(Boolean).join(' ')||'').trim();
  const team=normalizeTeam(row.team);
  if(!playerName||!team) return null;
  return { season:Number(season), playerId:playerId||null, playerName, teamAbbr:team, position:String(row.position||row.depth_chart_position||'').trim().toUpperCase()||null, status:String(row.status||row.status_description_abbr||'').trim().toUpperCase()||null, headshotUrl:String(row.headshot_url||'').trim()||null, sourcePayload:row };
}
export async function importNflRosterSeason({season=2026,dryRun=false}={}){
  const target=Number(season); if(!Number.isInteger(target)||target<2025||target>2100) throw new Error('Roster season must be 2025 or later.');
  const url=sourceUrl(target); const response=await fetch(url,{headers:{Accept:'text/csv,text/plain;q=0.9,*/*;q=0.8','User-Agent':'Sports-Edge-NFL-Roster-Ingestion/1.0'}});
  if(!response.ok) throw new Error(`NFL roster source ${target} returned HTTP ${response.status}.`);
  const rows=parseCsv(await response.text()).map(r=>normalizeRow(r,target)).filter(Boolean);
  if(dryRun) return {season:target,source:url,rows:rows.length,dryRun:true};
  let imported=0;
  for(let i=0;i<rows.length;i+=400){ const batch=rows.slice(i,i+400); const result=await callRpc('sports_edge_nfl_import_roster_batch',{p_rows:batch},{timeoutMs:45000}); imported+=Number(result?.imported||0); }
  const audit=await callRpc('sports_edge_nfl_prop_qualification_audit',{});
  return {season:target,source:url,rows:rows.length,imported,dryRun:false,audit};
}
