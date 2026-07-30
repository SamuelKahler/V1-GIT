import { callRpc } from './supabase.js';
import { transformGame } from './transform.js';

const SCHEDULE='https://statsapi.mlb.com/api/v1/schedule';
const FEED='https://statsapi.mlb.com/api/v1.1/game';
const ISO=/^\d{4}-\d{2}-\d{2}$/;

function validateRange(startDate,endDate) {
  if (!ISO.test(startDate || '') || !ISO.test(endDate || '')) { const e=new Error('startDate and endDate must use YYYY-MM-DD.'); e.statusCode=400; throw e; }
  const start=new Date(`${startDate}T00:00:00Z`); const end=new Date(`${endDate}T00:00:00Z`);
  if (start>end) { const e=new Error('startDate cannot be after endDate.'); e.statusCode=400; throw e; }
  const days=Math.round((end-start)/86400000)+1;
  if (days>7) { const e=new Error('Phase 2A imports are limited to 7 days per request.'); e.statusCode=400; throw e; }
}

async function fetchJson(url, attempts=3) {
  let last;
  for (let n=1;n<=attempts;n+=1) {
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetch(url,{headers:{Accept:'application/json','User-Agent':'Sports-Edge-MLB-Importer/2A'},signal:controller.signal});
      if (!response.ok) throw new Error(`MLB request failed (${response.status})`);
      return await response.json();
    } catch (error) { last=error; if(n<attempts) await new Promise(r=>setTimeout(r,500*n)); }
    finally { clearTimeout(timer); }
  }
  throw last;
}

async function eachWithLimit(items,limit,worker) {
  let cursor=0; const results=[];
  async function run(){ while(cursor<items.length){ const index=cursor++; results[index]=await worker(items[index],index); } }
  await Promise.all(Array.from({length:Math.min(limit,items.length || 1)},run));
  return results;
}

export async function importDateRange({startDate,endDate,dryRun=false}) {
  validateRange(startDate,endDate);
  const runId = dryRun ? null : await callRpc('sports_edge_mlb_start_import',{p_start_date:startDate,p_end_date:endDate,p_dry_run:false});
  const counters={discovered:0,inserted:0,updated:0,failed:0,dryRun:0};
  const errors=[];
  try {
    const url=`${SCHEDULE}?sportId=1&startDate=${startDate}&endDate=${endDate}&hydrate=team,venue,probablePitcher,linescore`;
    const schedule=await fetchJson(url);
    const games=(schedule?.dates || []).flatMap(day=>day.games || []);
    counters.discovered=games.length;
    await eachWithLimit(games,3,async game=>{
      try {
        const feed=await fetchJson(`${FEED}/${game.gamePk}/feed/live`);
        const payload=transformGame(game,feed);
        if (dryRun) { counters.dryRun += 1; return; }
        const result=await callRpc('sports_edge_mlb_upsert_game',{p_payload:payload});
        if (result==='inserted') counters.inserted += 1; else counters.updated += 1;
      } catch(error) {
        counters.failed += 1;
        const item={gamePk:game?.gamePk || null,message:error.message}; errors.push(item);
        if(runId) await callRpc('sports_edge_mlb_log_error',{p_import_run_id:runId,p_game_pk:game?.gamePk || null,p_stage:'GAME_IMPORT',p_error_message:error.message,p_details:item});
      }
    });
    if(runId) await callRpc('sports_edge_mlb_finish_import',{p_import_run_id:runId,p_status:counters.failed ? 'PARTIAL':'SUCCESS',p_discovered:counters.discovered,p_inserted:counters.inserted,p_updated:counters.updated,p_failed:counters.failed,p_message:null,p_audit:{errors}});
    return {runId,startDate,endDate,dryRun,counters,errors};
  } catch(error) {
    if(runId) await callRpc('sports_edge_mlb_finish_import',{p_import_run_id:runId,p_status:'FAILED',p_discovered:counters.discovered,p_inserted:counters.inserted,p_updated:counters.updated,p_failed:counters.failed,p_message:error.message,p_audit:{errors}}).catch(()=>{});
    throw error;
  }
}
