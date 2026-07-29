(function(){
  'use strict';
  const clean=v=>String(v??'').toUpperCase().replace(/[^A-Z0-9.+-]/g,'');
  const num=v=>{const n=Number(String(v??'').replace(/[^0-9.+-]/g,''));return Number.isFinite(n)?n:null;};
  const iso=v=>{const d=new Date(v);return Number.isFinite(d.getTime())?d.toISOString().slice(0,10):String(v||'');};
  function key(row){
    if(row.pickId) return `pick:${row.pickId}`;
    if(row.gamePk && row.team) return `game:${row.gamePk}|${row.team}|${clean(row.bet)}`;
    return `row:${iso(row.isoDate||row.date)}|${row.team||''}|${clean(row.bet)}|${row.odds||''}`;
  }
  function normalize(row){
    const outcome=String(row.outcome||row.resultStatus||'').toLowerCase();
    const result=Number(row.result||0);
    const units=num(row.units)||1;
    return {...row,units,result,outcome:outcome|| (result>0?'win':result<0?'loss':'push'),score:num(row.score)};
  }
  function baseRows(){
    const rows=[];
    if(Array.isArray(window.f5PerformanceBets)) rows.push(...window.f5PerformanceBets);
    else { try{ if(typeof f5PerformanceBets!=='undefined'&&Array.isArray(f5PerformanceBets)) rows.push(...f5PerformanceBets); }catch{} }
    return rows;
  }
  function allF5(){
    const map=new Map();
    baseRows().map(normalize).forEach(r=>map.set(key(r),r));
    (window.SportsEdgeRecentF5Results||[]).map(normalize).forEach(r=>map.set(key(r),r));
    return [...map.values()].sort((a,b)=>String(b.isoDate||iso(b.date)).localeCompare(String(a.isoDate||iso(a.date))));
  }
  function stats(rows=allF5()){
    const decisions=rows.filter(r=>['win','loss'].includes(r.outcome));
    const wins=decisions.filter(r=>r.outcome==='win').length;
    const losses=decisions.filter(r=>r.outcome==='loss').length;
    const pushes=rows.filter(r=>r.outcome==='push').length;
    const risk=decisions.reduce((s,r)=>s+(num(r.units)||1),0);
    const profit=rows.reduce((s,r)=>s+(Number(r.result)||0),0);
    const scores=rows.map(r=>num(r.score)).filter(v=>v!==null);
    return {total:rows.length,wins,losses,pushes,risk,profit,winRate:decisions.length?wins/decisions.length*100:0,roi:risk?profit/risk*100:0,avgScore:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0};
  }
  function install(){
    const provider=()=>allF5();
    window.f5AllBets=provider;
    try{ f5AllBets=provider; }catch{}
    window.SportsEdgePerformance=Object.freeze({version:'7.0.0',allF5,stats,refresh});
  }
  function refresh(){
    install();
    try{
      if(typeof renderF5PerformanceLab==='function') renderF5PerformanceLab();
      if(typeof renderPerformanceLab==='function') renderPerformanceLab();
      if(typeof renderOfficialPerformanceSnapshot==='function') renderOfficialPerformanceSnapshot();
    }catch(error){ console.warn('[Sports Edge Performance] refresh failed',error); }
    return {f5Rows:allF5().length,f5Stats:stats()};
  }
  install();
  window.addEventListener('sportsedge:recent-grades-applied',()=>setTimeout(refresh,0));
  window.addEventListener('sportsedge:intelligence-synced',()=>setTimeout(refresh,0));
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,50),{once:true}); else setTimeout(refresh,50);
  console.info('[Sports Edge Performance] V7 installed. F5 is generated from permanent history plus official grades.');
})();
