(function(){
  'use strict';
  const LAST_FULL_SYNC='sports-edge-last-full-sync-v10';
  function rebuild(){
    const db=window.SportsEdgeDatabase; if(!db) return [];
    window.SportsEdgeRecentGrades=db.observations.filter(o=>o.result||['PENDING','UNVERIFIED'].includes(o.status)).map(o=>({pickId:o.sourceId,date:o.date,selectedTeam:o.selectedTeam,opponent:o.opponent,market:o.market,period:o.period,line:o.line,odds:o.odds,gamePk:o.gamePk,result:o.result||o.status,gradeReason:o.gradeReason,metadataStatus:o.metadataStatus,environment:o.environment,sourceRecord:o}));
    window.SportsEdgeRecentF5Results=db.f5Bets.slice();
    window.dispatchEvent(new CustomEvent('sportsedge:recent-grades-applied',{detail:{rows:window.SportsEdgeRecentGrades.length,f5:window.SportsEdgeRecentF5Results.length}}));
    return window.SportsEdgeRecentGrades;
  }
  async function sync(){const from=new Date(Date.now()-14*86400000).toISOString().slice(0,10);const data=await window.SportsEdgePipeline.recentSync(from,true);rebuild();return {...data,database:window.SportsEdgeDatabase.audit()};}
  async function syncAll(){const data=await window.SportsEdgePipeline.syncAll(true);rebuild();try{localStorage.setItem(LAST_FULL_SYNC,new Date().toISOString().slice(0,10));}catch{}return {...data,database:window.SportsEdgeDatabase.audit()};}
  async function preview(){const data=await window.SportsEdgePipeline.syncAll(false);rebuild();return data;}
  function unresolved(){return (window.SportsEdgeDatabase?.observations||[]).filter(o=>!['WIN','LOSS','PUSH','VOID'].includes(o.result));}
  rebuild();
  window.addEventListener('sportsedge:database-updated',rebuild);
  window.SportsEdgeRecent=Object.freeze({version:'10.0.0',sync,syncAll,preview,apply:rows=>{window.SportsEdgeDatabase.applyGrades(rows);return rebuild();},grades:()=>window.SportsEdgeRecentGrades||[],f5:()=>window.SportsEdgeRecentF5Results||[],unresolved});
  const start=()=>setTimeout(async()=>{try{await sync();const today=new Date().toISOString().slice(0,10);if(localStorage.getItem(LAST_FULL_SYNC)!==today) await syncAll();}catch(error){console.warn('[Sports Edge V10] automatic grading deferred:',error.message);}},1200);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
