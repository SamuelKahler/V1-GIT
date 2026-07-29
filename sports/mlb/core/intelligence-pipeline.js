(function(){
  'use strict';
  const CACHE_KEY='sports-edge-intelligence-sync-v10';
  const BATCH_SIZE=40;
  const CONCURRENCY=3;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function payload(options={}){
    if(!window.SportsEdgeDatabase) return [];
    return window.SportsEdgeDatabase.payload(options).filter(row=>row.date);
  }
  function chunks(rows,size=BATCH_SIZE){ const out=[]; for(let i=0;i<rows.length;i+=size) out.push(rows.slice(i,i+size)); return out; }
  async function post(rows,persist,attempt=1){
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),45000);
    try{
      const response=await fetch(`/api/intelligence-sync${persist?'?persist=1':''}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({picks:rows}),signal:controller.signal,cache:'no-store'});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.message||data.error||`HTTP ${response.status}`);
      return data;
    }catch(error){ if(attempt<3){await sleep(500*attempt);return post(rows,persist,attempt+1);} throw error; }
    finally{clearTimeout(timer);}
  }
  async function workers(items,limit,fn){
    const results=new Array(items.length); let cursor=0;
    async function worker(){ while(cursor<items.length){ const i=cursor++; results[i]=await fn(items[i],i); } }
    await Promise.all(Array.from({length:Math.min(limit,items.length)},worker)); return results;
  }
  function failureRows(batch,error){ return batch.map(row=>({pickId:row.id,date:row.date,selectedTeam:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,line:row.line,odds:row.odds,result:row.authoritativeResult&&row.result?row.result:'UNVERIFIED',gradeReason:`API_BATCH_FAILED: ${error.message}`,metadataStatus:'RETRY_REQUIRED',gamePk:row.gamePk||null,environment:null,sourceRecord:row})); }
  function combine(parts,request){
    const rows=parts.flatMap(p=>p.rows||[]); const counts={}; rows.forEach(r=>counts[r.result]=(counts[r.result]||0)+1);
    return {version:'10.0.0',generatedAt:new Date().toISOString(),total:rows.length,counts,unresolved:rows.filter(r=>r.result==='UNVERIFIED').length,pending:rows.filter(r=>r.result==='PENDING').length,rows,request,persistence:{enabled:parts.some(p=>p.persistence?.enabled),inserted:parts.reduce((n,p)=>n+Number(p.persistence?.inserted||0),0),reasons:[...new Set(parts.map(p=>p.persistence?.reason).filter(Boolean))]},diagnostics:{batches:parts.length,failedBatches:parts.filter(p=>p.failed).length,source:'Official MLB Stats API',paidCreditsRequired:false}};
  }
  async function run(persist=true,options={}){
    const rows=payload(options); if(!rows.length) throw new Error('No dated picks were found in the canonical database.');
    const batches=chunks(rows); let completed=0;
    window.dispatchEvent(new CustomEvent('sportsedge:sync-progress',{detail:{completed,total:batches.length,rows:rows.length}}));
    const parts=await workers(batches,CONCURRENCY,async batch=>{
      let part;
      try{part=await post(batch,persist);}catch(error){part={failed:true,rows:failureRows(batch,error),persistence:{enabled:false,inserted:0,reason:'API_BATCH_FAILED'}};}
      completed++; window.dispatchEvent(new CustomEvent('sportsedge:sync-progress',{detail:{completed,total:batches.length,rows:rows.length}})); return part;
    });
    const data=combine(parts,{persist:Boolean(persist),from:options.from||null,to:options.to||null});
    window.SportsEdgeDatabase.applyGrades(data.rows);
    try{localStorage.setItem(CACHE_KEY,JSON.stringify(data));}catch{}
    window.dispatchEvent(new CustomEvent('sportsedge:intelligence-synced',{detail:data})); return data;
  }
  function cached(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;}}
  function health(){ const a=window.SportsEdgeDatabase?.audit()||{}; const c=cached(); return {status:a.needsGrade===0?'HEALTHY':'REVIEW_REQUIRED',...a,lastSync:c?.generatedAt||null,lastSyncDiagnostics:c?.diagnostics||null,persistence:c?.persistence||null}; }
  function exportReport(){const data={database:window.SportsEdgeDatabase?.audit(),sync:cached(),unresolved:(window.SportsEdgeDatabase?.observations||[]).filter(o=>!['WIN','LOSS','PUSH','VOID'].includes(o.result))}; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`sports-edge-audit-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
  window.SportsEdgePipeline=Object.freeze({version:'10.0.0',payload,preview:(options={})=>run(false,options),sync:(options={})=>run(true,options),recentSync:(from,persist=true)=>run(Boolean(persist),{from}),syncAll:(persist=true)=>run(Boolean(persist),{}),cached,health,exportReport});
})();
