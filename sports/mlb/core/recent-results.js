(function(){
  'use strict';
  const MIN_DATE='2026-07-26';
  const CACHE_KEY='sports-edge-recent-grades-v8';
  const clean=v=>String(v??'').toUpperCase().replace(/[^A-Z0-9.+-]/g,'');
  const iso=v=>{
    const d=new Date(v); if(Number.isFinite(d.getTime())) return d.toISOString().slice(0,10);
    const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m?`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`:'';
  };
  const number=v=>{ const n=Number(String(v??'').replace(/[^0-9.+-]/g,'')); return Number.isFinite(n)?n:null; };
  const americanProfit=(odds,units,result)=>{
    const o=number(odds),u=number(units)||1;
    if(result==='LOSS') return -u;
    if(result!=='WIN'||o===null) return 0;
    return o>0 ? u*(o/100) : u*(100/Math.abs(o));
  };
  function rowKey(row){ return row.pickId || `${row.date}|${clean(row.sourceRecord?.rawPick||row.sourceRecord?.pick||'')}|${row.gamePk||''}`; }
  function apply(data){
    const incoming=(data?.rows||[]).filter(r=>String(r.date||'')>=MIN_DATE);
    const previous=Array.isArray(window.SportsEdgeRecentGrades)?window.SportsEdgeRecentGrades:[];
    const merged=new Map(previous.map(r=>[rowKey(r),r]));
    incoming.forEach(r=>merged.set(rowKey(r),r));
    const rows=[...merged.values()].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    window.SportsEdgeRecentGrades=rows;
    try{ localStorage.setItem(CACHE_KEY,JSON.stringify({generatedAt:data.generatedAt||new Date().toISOString(),rows})); }catch{}

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
        if(pd===date && (pk===key || (key.length>5&&pk.includes(key)) || (pk.length>5&&key.includes(pk)))){
          p.status=r.result; p.result=r.result; p.gamePk=r.gamePk; p.opponent=p.opponent||r.opponent;
          p.gradeReason=r.gradeReason; p.resolutionConfidence=r.resolutionConfidence; p.environment=r.environment;
        }
      });
    });

    window.SportsEdgeRecentF5Results=rows.filter(r=>r.period==='FIRST_FIVE'&&['WIN','LOSS','PUSH'].includes(r.result)).map((r,i)=>{
      const src=r.sourceRecord||{};
      const units=number(src.units)||number(r.units)||1;
      const odds=number(r.odds);
      return {
        id:`graded-f5-${r.pickId||i}`,
        pickId:r.pickId||null,
        gamePk:r.gamePk||null,
        team:r.selectedTeam,
        teamName:r.selectedTeam,
        bet:src.rawPick||src.pick||`${r.selectedTeam} F5`,
        date:String(r.date).replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$2/$3/$1'),
        isoDate:r.date,
        odds:odds===null?'-':(odds>0?`+${odds}`:`${odds}`),
        result:americanProfit(odds,units,r.result),
        outcome:r.result.toLowerCase(),
        score:null,
        units,
        gradeReason:r.gradeReason,
        resolutionConfidence:r.resolutionConfidence,
        source:'official-grading-pipeline'
      };
    });
    window.dispatchEvent(new CustomEvent('sportsedge:recent-grades-applied',{detail:{rows:rows.length,f5:window.SportsEdgeRecentF5Results.length}}));
    return rows;
  }
  async function sync(){
    if(!window.SportsEdgePipeline) throw new Error('SportsEdgePipeline unavailable');
    const data=await window.SportsEdgePipeline.recentSync(MIN_DATE,true);
    apply(data);
    return {generatedAt:data.generatedAt,total:data.total,counts:data.counts,recent:window.SportsEdgeRecentGrades.length,f5:window.SportsEdgeRecentF5Results.length,persistence:data.persistence};
  }
  async function syncAll(){
    if(!window.SportsEdgePipeline) throw new Error('SportsEdgePipeline unavailable');
    const data=await window.SportsEdgePipeline.syncAll(true);
    apply(data);
    return {generatedAt:data.generatedAt,total:data.total,counts:data.counts,recent:window.SportsEdgeRecentGrades.length,f5:window.SportsEdgeRecentF5Results.length,persistence:data.persistence,diagnostics:data.diagnostics};
  }
  async function preview(){
    if(!window.SportsEdgePipeline) throw new Error('SportsEdgePipeline unavailable');
    const data=await window.SportsEdgePipeline.recentSync(MIN_DATE,false);
    apply(data); return data;
  }
  function cached(){ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'null');}catch{return null;} }
  const prior=cached(); if(prior?.rows) apply({rows:prior.rows,generatedAt:prior.generatedAt});
  window.SportsEdgeRecent=Object.freeze({version:'8.0.0',sync,syncAll,preview,cached,apply,grades:()=>window.SportsEdgeRecentGrades||[],f5:()=>window.SportsEdgeRecentF5Results||[],unresolved:()=> (window.SportsEdgeRecentGrades||[]).filter(row=>['UNVERIFIED','PENDING'].includes(row.result))});
  const start=()=>setTimeout(()=>sync().catch(async e=>{
    console.warn('[Sports Edge V8] persistent sync failed; trying preview:',e.message);
    try{ await preview(); }catch(err){ console.warn('[Sports Edge V8] automatic grading deferred:',err.message); }
  }),1800);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
