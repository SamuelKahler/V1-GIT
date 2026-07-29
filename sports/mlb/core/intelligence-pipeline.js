(function(){
  'use strict';
  const CACHE_KEY='sports-edge-intelligence-v7';
  const iso=value=>{
    if(!value) return '';
    const d=new Date(value);
    if(Number.isFinite(d.getTime())) return d.toISOString().slice(0,10);
    const m=String(value).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return m?`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`:'';
  };
  function picks(){ return window.SportsEdgeCore && Array.isArray(window.SportsEdgeCore.picks) ? window.SportsEdgeCore.picks : []; }
  function payload(options={}){
    const from=options.from||'';
    const to=options.to||'';
    return picks().map(row=>({
      id:row.id || row.coreId || row.preservationId,
      date:iso(row.date || row.normalizedDate || row.slate),
      rawPick:row.rawPick || row.pick || row.selection,
      selectedTeam:row.selectedTeam,
      opponent:row.opponent,
      market:row.market,
      period:row.period,
      line:row.line,
      odds:row.odds,
      units:row.units,
      status:row.status || row.result,
      gamePk:row.gamePk,
      sourceRecords:row.sourceRecords
    })).filter(row=>row.date && (!from || row.date>=from) && (!to || row.date<=to));
  }
  async function run(persist,options={}){
    const rows=payload(options);
    if(!rows.length) throw new Error('No ledger picks matched the requested date range.');
    const response=await fetch(`/api/intelligence-sync${persist?'?persist=1':''}`,{
      method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({picks:rows})
    });
    let data;
    try{ data=await response.json(); }catch{ throw new Error(`Intelligence sync returned invalid JSON (${response.status}).`); }
    if(!response.ok) throw new Error(data.message || data.error || 'Intelligence sync failed');
    const cache={...data,request:{from:options.from||null,to:options.to||null,persist:Boolean(persist)}};
    localStorage.setItem(CACHE_KEY,JSON.stringify(cache));
    window.dispatchEvent(new CustomEvent('sportsedge:intelligence-synced',{detail:cache}));
    return cache;
  }
  function cached(){ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;} }
  function health(){
    const data=cached(); if(!data) return {status:'NOT_RUN',message:'Run SportsEdgePipeline.recentSync() or preview().'};
    const usable=(data.counts?.WIN||0)+(data.counts?.LOSS||0)+(data.counts?.PUSH||0)+(data.counts?.VOID||0);
    return {status:data.unresolved===0?'HEALTHY':'REVIEW_REQUIRED',total:data.total,graded:usable,unresolved:data.unresolved,coverage:data.total?Number((usable/data.total*100).toFixed(1)):0,counts:data.counts,persistence:data.persistence,request:data.request,generatedAt:data.generatedAt};
  }
  function exportReport(){
    const data=cached(); if(!data) throw new Error('No cached sync exists. Run recentSync() or preview() first.');
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`sports-edge-resolution-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href);
  }
  const api={
    version:'7.0.0',
    preview:(options={})=>run(false,options),
    sync:(options={})=>run(true,options),
    recentSync:(from='2026-07-26',persist=true)=>run(Boolean(persist),{from}),
    cached,health,exportReport,payload
  };
  window.SportsEdgePipeline=Object.freeze(api);
  console.info('[Sports Edge Pipeline] V7 ready. Recent grading is date-filtered to avoid serverless timeouts.');
})();
