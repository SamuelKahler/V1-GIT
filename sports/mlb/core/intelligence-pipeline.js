(function(){
  'use strict';
  const CACHE_KEY='sports-edge-intelligence-v5';
  function picks(){ return window.SportsEdgeCore && Array.isArray(window.SportsEdgeCore.picks) ? window.SportsEdgeCore.picks : []; }
  function payload(){ return picks().map(row=>({ id:row.id || row.coreId || row.preservationId, date:row.date || row.normalizedDate, rawPick:row.rawPick || row.pick || row.selection, selectedTeam:row.selectedTeam, opponent:row.opponent, market:row.market, period:row.period, line:row.line, odds:row.odds, gamePk:row.gamePk, sourceRecords:row.sourceRecords })); }
  async function run(persist){
    const response=await fetch(`/api/intelligence-sync${persist?'?persist=1':''}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({picks:payload()})});
    const data=await response.json();
    if(!response.ok) throw new Error(data.message || data.error || 'Intelligence sync failed');
    localStorage.setItem(CACHE_KEY,JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('sportsedge:intelligence-synced',{detail:data}));
    return data;
  }
  function cached(){ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;} }
  function health(){
    const data=cached(); if(!data) return {status:'NOT_RUN',message:'Run SportsEdgePipeline.preview() in the browser console.'};
    const usable=(data.counts?.WIN||0)+(data.counts?.LOSS||0)+(data.counts?.PUSH||0);
    return {status:data.unresolved===0?'HEALTHY':'REVIEW_REQUIRED',total:data.total,graded:usable,unresolved:data.unresolved,coverage:data.total?Number((usable/data.total*100).toFixed(1)):0,counts:data.counts,persistence:data.persistence,generatedAt:data.generatedAt};
  }
  function exportReport(){ const data=cached(); if(!data) throw new Error('No cached sync exists. Run preview() first.'); const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`sports-edge-resolution-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href); }
  window.SportsEdgePipeline=Object.freeze({version:'5.0.0',preview:()=>run(false),sync:()=>run(true),cached,health,exportReport,payload});
  console.info('[Sports Edge Pipeline] V5 ready. Run SportsEdgePipeline.preview() to resolve and grade all ledger records.');
})();
