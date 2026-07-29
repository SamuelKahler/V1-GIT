(function(){
  'use strict';
  const num=v=>{const n=Number(String(v??'').replace(/[^0-9.+-]/g,''));return Number.isFinite(n)?n:0;};
  function allF5(){return (window.SportsEdgeDatabase?.f5Bets||[]).slice().sort((a,b)=>String(b.isoDate||b.date).localeCompare(String(a.isoDate||a.date)));}
  function stats(rows=allF5()){const decisions=rows.filter(r=>['win','loss'].includes(String(r.outcome).toLowerCase()));const wins=decisions.filter(r=>String(r.outcome).toLowerCase()==='win').length;const losses=decisions.length-wins;const risk=rows.reduce((s,r)=>s+Math.abs(num(r.units)||1),0);const profit=rows.reduce((s,r)=>s+num(r.result),0);return{total:rows.length,wins,losses,pushes:rows.filter(r=>String(r.outcome).toLowerCase()==='push').length,winRate:decisions.length?Number((wins/decisions.length*100).toFixed(1)):0,profit:Number(profit.toFixed(2)),roi:risk?Number((profit/risk*100).toFixed(1)):0,risk:Number(risk.toFixed(2))};}
  function refresh(){window.SportsEdgeCanonicalF5Bets=allF5();if(typeof renderF5PerformanceLab==='function')renderF5PerformanceLab();if(typeof renderPerformanceLab==='function')renderPerformanceLab();return{f5Rows:allF5().length,f5Stats:stats(),database:window.SportsEdgeDatabase?.audit()};}
  window.SportsEdgePerformance=Object.freeze({version:'10.0.0',allF5,stats,refresh});
  window.addEventListener('sportsedge:database-updated',refresh);window.addEventListener('sportsedge:recent-grades-applied',refresh);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,0),{once:true});else setTimeout(refresh,0);
})();
