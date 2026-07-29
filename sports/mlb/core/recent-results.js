(function(){
  'use strict';
  const LAST_FULL_SYNC='sports-edge-last-full-sync-v11';
  function rebuild(){const db=window.SportsEdgeDatabase;if(!db)return[];window.SportsEdgeRecentGrades=db.observations.map(row=>({pickId:row.sourceId,date:row.date,selectedTeam:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,line:row.line,odds:row.odds,gamePk:row.gamePk,result:row.result||row.status,gradeReason:row.gradeReason,metadataStatus:row.metadataStatus,environment:row.environment,sourceRecord:row}));window.SportsEdgeRecentF5Results=db.f5Bets.slice();window.dispatchEvent(new CustomEvent('sportsedge:recent-grades-applied',{detail:{rows:window.SportsEdgeRecentGrades.length,f5:window.SportsEdgeRecentF5Results.length}}));return window.SportsEdgeRecentGrades;}
  async function sync(){const from=new Date(Date.now()-21*86400000).toISOString().slice(0,10);const data=await window.SportsEdgePipeline.recentSync(from,true);rebuild();return{...data,database:window.SportsEdgeDatabase.audit()};}
  async function syncAll(){const data=await window.SportsEdgePipeline.syncAll(true);rebuild();try{localStorage.setItem(LAST_FULL_SYNC,new Date().toISOString().slice(0,10));}catch{}return{...data,database:window.SportsEdgeDatabase.audit()};}
  async function syncUnresolved(){const unresolved=(window.SportsEdgeDatabase?.observations||[]).filter(row=>!['WIN','LOSS','PUSH','VOID'].includes(row.result));if(!unresolved.length)return{total:0,message:'Every canonical record is already graded.'};const dates=unresolved.map(row=>row.date).filter(Boolean).sort();return window.SportsEdgePipeline.sync({from:dates[0],to:dates[dates.length-1]});}
  async function preview(){const data=await window.SportsEdgePipeline.syncAll(false);rebuild();return data;}
  function unresolved(){return(window.SportsEdgeDatabase?.observations||[]).filter(row=>!['WIN','LOSS','PUSH','VOID'].includes(row.result));}
  function audit(){const rows=unresolved();const reasons={};rows.forEach(row=>{const reason=row.gradeReason||row.metadataStatus||row.status||'UNKNOWN';reasons[reason]=(reasons[reason]||0)+1;});return{database:window.SportsEdgeDatabase?.audit(),pipeline:window.SportsEdgePipeline?.health(),unresolved:rows.length,reasons};}
  rebuild();window.addEventListener('sportsedge:database-updated',rebuild);
  window.SportsEdgeRecent=Object.freeze({version:'11.0.0',sync,syncAll,syncUnresolved,preview,apply:rows=>{window.SportsEdgeDatabase.applyGrades(rows);return rebuild();},grades:()=>window.SportsEdgeRecentGrades||[],f5:()=>window.SportsEdgeRecentF5Results||[],unresolved,audit});
  const start=()=>setTimeout(async()=>{try{const today=new Date().toISOString().slice(0,10);if(localStorage.getItem(LAST_FULL_SYNC)!==today)await syncAll();else await sync();}catch(error){console.warn('[Sports Edge V11] automatic grading deferred:',error.message);}},1200);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
