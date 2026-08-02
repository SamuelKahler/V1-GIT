(function(){
  'use strict';

  const VERSION='14.0.0';
  const LOCKED_BASELINE_END='2026-07-22';
  const number=value=>{
    if(value===null||value===undefined||value==='') return 0;
    const parsed=Number(String(value).replace(/[^0-9.+-]/g,''));
    return Number.isFinite(parsed)?parsed:0;
  };
  const isoDate=value=>{
    const raw=String(value||'').trim();
    let match=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if(match) return `${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
    match=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if(match){
      const year=match[3].length===2?`20${match[3]}`:match[3];
      return `${year}-${match[1].padStart(2,'0')}-${match[2].padStart(2,'0')}`;
    }
    return null;
  };
  const normalize=value=>String(value||'').toUpperCase().replace(/[^A-Z0-9.+-]/g,'');
  const outcome=row=>String(row?.outcome||row?.result||'').toLowerCase();

  function legacyRows(){
    try{
      const rows=typeof f5PerformanceBets!=='undefined'?f5PerformanceBets:window.f5PerformanceBets;
      return Array.isArray(rows)?rows.slice():[];
    }catch{return Array.isArray(window.f5PerformanceBets)?window.f5PerformanceBets.slice():[];}
  }

  function canonicalRows(){
    return Array.isArray(window.SportsEdgeDatabase?.f5Bets)?window.SportsEdgeDatabase.f5Bets.slice():[];
  }

  function rowKey(row){
    return [isoDate(row.isoDate||row.date)||String(row.date||''),normalize(row.team||row.teamName),normalize(row.bet||row.pick),normalize(row.odds)].join('|');
  }

  function stableRows(){
    const baseline=legacyRows();
    const seen=new Set(baseline.map(rowKey));
    const additions=canonicalRows()
      .filter(row=>{
        const date=isoDate(row.isoDate||row.date);
        return date&&date>LOCKED_BASELINE_END&&row.hasExplicitUnits===true&&['win','loss','push'].includes(outcome(row));
      })
      .filter(row=>{
        const key=rowKey(row);
        if(seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    return [...baseline,...additions].sort((a,b)=>String(isoDate(b.isoDate||b.date)||'').localeCompare(String(isoDate(a.isoDate||a.date)||'')));
  }

  function stats(rows=stableRows()){
    const decisions=rows.filter(row=>['win','loss'].includes(outcome(row)));
    const wins=decisions.filter(row=>outcome(row)==='win').length;
    const losses=decisions.length-wins;
    const pushes=rows.filter(row=>outcome(row)==='push').length;
    const risk=rows.reduce((sum,row)=>sum+Math.abs(number(row.units)||1),0);
    const profit=rows.reduce((sum,row)=>sum+number(row.result),0);
    return{
      total:rows.length,
      wins,
      losses,
      pushes,
      winRate:decisions.length?Number((wins/decisions.length*100).toFixed(1)):0,
      profit:Number(profit.toFixed(2)),
      roi:risk?Number((profit/risk*100).toFixed(1)):0,
      risk:Number(risk.toFixed(2)),
      baselineRows:legacyRows().length,
      appendedOfficialRows:rows.length-legacyRows().length
    };
  }

  function audit(){
    const baseline=legacyRows();
    const canonical=canonicalRows();
    const rows=stableRows();
    return{
      version:VERSION,
      policy:'AUTHORITATIVE_F5_SHEET_PLUS_EXPLICIT_UNIT_OFFICIAL_GRADES',
      baselineEnd:LOCKED_BASELINE_END,
      baselineRows:baseline.length,
      canonicalF5Rows:canonical.length,
      finalRows:rows.length,
      appendedOfficialRows:rows.length-baseline.length,
      stats:stats(rows)
    };
  }

  function refresh(){
    window.SportsEdgeStableF5Bets=stableRows();
    window.SportsEdgeCanonicalF5Bets=window.SportsEdgeStableF5Bets;
    if(typeof renderF5PerformanceLab==='function') renderF5PerformanceLab();
    if(typeof renderPerformanceLab==='function') renderPerformanceLab();
    return audit();
  }

  window.SportsEdgePerformance=Object.freeze({version:VERSION,allF5:stableRows,stats,refresh,audit});
  window.addEventListener('sportsedge:database-updated',refresh);
  window.addEventListener('sportsedge:recent-grades-applied',refresh);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,0),{once:true});
  else setTimeout(refresh,0);
})();
