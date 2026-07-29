(function(){
  'use strict';
  const MIN_DATE='2026-07-26';
  const CACHE_KEY='sports-edge-recent-grades-v6';
  const clean=v=>String(v??'').toUpperCase().replace(/[^A-Z0-9.+-]/g,'');
  const iso=v=>{
    const d=new Date(v); if(Number.isFinite(d.getTime())) return d.toISOString().slice(0,10);
    const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m?`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`:'';
  };
  const americanProfit=(odds,units,result)=>{
    const o=Number(odds),u=Number(units)||1;
    if(result==='LOSS') return -u;
    if(result!=='WIN'||!Number.isFinite(o)) return 0;
    return o>0 ? u*(o/100) : u*(100/Math.abs(o));
  };
  function apply(data){
    const rows=(data?.rows||[]).filter(r=>String(r.date||'')>=MIN_DATE);
    window.SportsEdgeRecentGrades=rows;
    try{ localStorage.setItem(CACHE_KEY,JSON.stringify({generatedAt:data.generatedAt,rows})); }catch{}
    const all=[];
    if(typeof trackedPickResults!=='undefined'&&Array.isArray(trackedPickResults)) all.push(...trackedPickResults);
    if(window.SportsEdgeCore?.uiPicks) all.push(...window.SportsEdgeCore.uiPicks);
    rows.forEach(r=>{
      const raw=r.sourceRecord?.rawPick||r.sourceRecord?.pick||'';
      const key=clean(raw);
      const date=String(r.date||'');
      all.forEach(p=>{
        const pd=iso(p.date||p.normalizedDate||p.slate);
        const pk=clean(p.rawPick||p.pick||p.selection||'');
        if(pd===date && (pk===key || pk.includes(key) || key.includes(pk))){
          p.status=r.result; p.result=r.result; p.gamePk=r.gamePk; p.opponent=p.opponent||r.opponent;
          p.gradeReason=r.gradeReason; p.resolutionConfidence=r.resolutionConfidence; p.environment=r.environment;
        }
      });
    });
    window.SportsEdgeRecentF5Results=rows.filter(r=>r.period==='FIRST_FIVE'&&['WIN','LOSS','PUSH'].includes(r.result)).map((r,i)=>{
      const src=r.sourceRecord||{}; const units=Number(String(src.units||'1').replace(/[^0-9.]/g,''))||1;
      const odds=Number(r.odds); const profit=americanProfit(odds,units,r.result);
      return {id:`v6-f5-${r.pickId||i}`,team:r.selectedTeam,teamName:r.selectedTeam,bet:src.rawPick||src.pick||`${r.selectedTeam} F5`,date:String(r.date).replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$2/$3/$1'),odds:Number.isFinite(odds)?(odds>0?`+${odds}`:`${odds}`):'-',result:profit,outcome:r.result.toLowerCase(),score:null,units};
    });
    window.dispatchEvent(new CustomEvent('sportsedge:recent-grades-applied',{detail:{rows:rows.length,f5:window.SportsEdgeRecentF5Results.length}}));
    setTimeout(()=>{ try{ if(typeof renderPicks==='function') renderPicks(); if(typeof renderF5Overall==='function') renderF5Overall(); if(typeof renderF5PerformanceLab==='function') renderF5PerformanceLab(); if(typeof renderPerformanceLab==='function') renderPerformanceLab(); }catch(e){console.warn('[V6] refresh failed',e);} },50);
    return rows;
  }
  async function sync(){
    if(!window.SportsEdgePipeline) throw new Error('SportsEdgePipeline unavailable');
    const data=await window.SportsEdgePipeline.sync();
    apply(data);
    return {generatedAt:data.generatedAt,total:data.total,counts:data.counts,recent:window.SportsEdgeRecentGrades.length,f5:window.SportsEdgeRecentF5Results.length,persistence:data.persistence};
  }
  function cached(){ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;} }
  const prior=cached(); if(prior?.rows) apply({rows:prior.rows,generatedAt:prior.generatedAt});
  window.SportsEdgeRecent=Object.freeze({version:'6.0.0',sync,cached,apply,grades:()=>window.SportsEdgeRecentGrades||[],f5:()=>window.SportsEdgeRecentF5Results||[]});
  const start=()=>setTimeout(()=>sync().catch(e=>console.warn('[Sports Edge V6] automatic grading deferred:',e.message)),500);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
