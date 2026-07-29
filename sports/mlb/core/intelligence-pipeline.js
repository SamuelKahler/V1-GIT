(function(){
  'use strict';
  const CACHE_KEY='sports-edge-intelligence-sync-v11';
  const MAX_PICKS_PER_REQUEST=90;
  const CONCURRENCY=4;
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function payload(options={}){
    if(!window.SportsEdgeDatabase) return [];
    return window.SportsEdgeDatabase.payload(options).filter(row=>row.date);
  }
  function groupByDate(rows){
    const groups=new Map();
    rows.forEach(row=>{if(!groups.has(row.date)) groups.set(row.date,[]);groups.get(row.date).push(row);});
    const batches=[];
    [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([date,dateRows])=>{
      for(let i=0;i<dateRows.length;i+=MAX_PICKS_PER_REQUEST)batches.push({date,rows:dateRows.slice(i,i+MAX_PICKS_PER_REQUEST)});
    });
    return batches;
  }
  async function post(rows,persist,attempt=1){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),55000);
    try{
      const response=await fetch(`/api/intelligence-sync${persist?'?persist=1':''}`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({picks:rows}),signal:controller.signal,cache:'no-store'
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.message||data.error||`HTTP ${response.status}`);
      return data;
    }catch(error){
      if(attempt<3){await sleep(700*attempt);return post(rows,persist,attempt+1);}
      throw error;
    }finally{clearTimeout(timer);}
  }
  async function workers(items,limit,fn){
    const results=new Array(items.length);let cursor=0;
    async function worker(){while(cursor<items.length){const index=cursor++;results[index]=await fn(items[index],index);}}
    await Promise.all(Array.from({length:Math.min(limit,items.length||1)},worker));
    return results;
  }
  function failureRows(batch,error){
    return batch.rows.map(row=>({pickId:row.id,date:row.date,selectedTeam:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,line:row.line,odds:row.odds,result:row.authoritativeResult&&row.result?row.result:'UNVERIFIED',gradeReason:`API_BATCH_FAILED: ${error.message}`,metadataStatus:'RETRY_REQUIRED',gamePk:row.gamePk||null,environment:null,sourceRecord:row}));
  }
  function combine(parts,request){
    const rows=parts.flatMap(part=>part.rows||[]);const counts={};const reasons={};
    rows.forEach(row=>{counts[row.result]=(counts[row.result]||0)+1;const reason=row.gradeReason||'NO_REASON';reasons[reason]=(reasons[reason]||0)+1;});
    return {version:'11.0.0',generatedAt:new Date().toISOString(),total:rows.length,counts,reasons,unresolved:rows.filter(row=>row.result==='UNVERIFIED').length,pending:rows.filter(row=>row.result==='PENDING').length,rows,request,persistence:{enabled:parts.some(part=>part.persistence?.enabled),inserted:parts.reduce((sum,part)=>sum+Number(part.persistence?.inserted||0),0),reasons:[...new Set(parts.map(part=>part.persistence?.reason).filter(Boolean))]},diagnostics:{batches:parts.length,dates:[...new Set(parts.map(part=>part.batchDate).filter(Boolean))].length,failedBatches:parts.filter(part=>part.failed).length,source:'Official MLB Stats API',paidCreditsRequired:false}};
  }
  async function run(persist=true,options={}){
    const rows=payload(options);if(!rows.length)throw new Error('No dated picks were found in the canonical database.');
    const batches=groupByDate(rows);let completed=0;
    window.dispatchEvent(new CustomEvent('sportsedge:sync-progress',{detail:{completed,total:batches.length,rows:rows.length}}));
    const parts=await workers(batches,CONCURRENCY,async batch=>{
      let part;
      try{part=await post(batch.rows,persist);part.batchDate=batch.date;}
      catch(error){part={failed:true,batchDate:batch.date,rows:failureRows(batch,error),persistence:{enabled:false,inserted:0,reason:'API_BATCH_FAILED'}};}
      completed++;window.dispatchEvent(new CustomEvent('sportsedge:sync-progress',{detail:{completed,total:batches.length,rows:rows.length,date:batch.date}}));return part;
    });
    const data=combine(parts,{persist:Boolean(persist),from:options.from||null,to:options.to||null});
    window.SportsEdgeDatabase.applyGrades(data.rows);
    try{localStorage.setItem(CACHE_KEY,JSON.stringify({...data,rows:undefined}));}catch{}
    window.dispatchEvent(new CustomEvent('sportsedge:intelligence-synced',{detail:data}));return data;
  }
  function cached(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;}}
  function health(){const audit=window.SportsEdgeDatabase?.audit()||{};const cache=cached();return{status:audit.needsGrade===0?'HEALTHY':'REVIEW_REQUIRED',...audit,lastSync:cache?.generatedAt||null,lastSyncDiagnostics:cache?.diagnostics||null,lastSyncReasons:cache?.reasons||null,persistence:cache?.persistence||null};}
  function exportReport(){const data={database:window.SportsEdgeDatabase?.audit(),sync:cached(),unresolved:(window.SportsEdgeDatabase?.observations||[]).filter(row=>!['WIN','LOSS','PUSH','VOID'].includes(row.result))};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const anchor=document.createElement('a');anchor.href=URL.createObjectURL(blob);anchor.download=`sports-edge-audit-${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(anchor.href);}
  window.SportsEdgePipeline=Object.freeze({version:'11.0.0',payload,preview:(options={})=>run(false,options),sync:(options={})=>run(true,options),recentSync:(from,persist=true)=>run(Boolean(persist),{from}),syncAll:(persist=true)=>run(Boolean(persist),{}),cached,health,exportReport});
})();
