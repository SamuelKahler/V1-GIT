(function(){
  'use strict';

  const CACHE_KEY = 'sports-edge-intelligence-v8';
  const REQUEST_TIMEOUT_MS = 25000;
  const RETRIES = 2;

  const iso = value => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date.toISOString().slice(0, 10);
    const match = String(value).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return match ? `${match[3]}-${match[1].padStart(2,'0')}-${match[2].padStart(2,'0')}` : '';
  };

  function ledgerPicks(){
    return window.SportsEdgeCore && Array.isArray(window.SportsEdgeCore.picks)
      ? window.SportsEdgeCore.picks
      : [];
  }

  function payload(options = {}){
    const from = options.from || '';
    const to = options.to || '';
    return ledgerPicks().map(row => ({
      id: row.id || row.coreId || row.preservationId,
      date: iso(row.date || row.normalizedDate || row.slate),
      rawPick: row.rawPick || row.pick || row.selection,
      selectedTeam: row.selectedTeam,
      opponent: row.opponent,
      market: row.market,
      period: row.period,
      line: row.line,
      odds: row.odds,
      units: row.units,
      status: row.status || row.result,
      gamePk: row.gamePk,
      sourceRecords: row.sourceRecords
    })).filter(row => row.date && (!from || row.date >= from) && (!to || row.date <= to));
  }

  function groupByDate(rows){
    const groups = new Map();
    rows.forEach(row => {
      if (!groups.has(row.date)) groups.set(row.date, []);
      groups.get(row.date).push(row);
    });
    return [...groups.entries()].sort((a,b) => a[0].localeCompare(b[0]));
  }

  async function postRows(rows, persist){
    let lastError;
    for (let attempt = 1; attempt <= RETRIES + 1; attempt += 1){
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(`/api/intelligence-sync${persist ? '?persist=1' : ''}`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          cache: 'no-store',
          signal: controller.signal,
          body: JSON.stringify({ picks:rows })
        });
        let data;
        try { data = await response.json(); }
        catch { throw new Error(`Grading API returned invalid JSON (${response.status}).`); }
        if (!response.ok) throw new Error(data.message || data.error || `Grading API failed (${response.status}).`);
        return data;
      } catch (error) {
        lastError = error;
        if (attempt <= RETRIES) await new Promise(resolve => setTimeout(resolve, attempt * 500));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError || new Error('Grading request failed.');
  }

  function combine(parts, request){
    const rows = parts.flatMap(part => part.rows || []);
    const counts = rows.reduce((out,row) => {
      out[row.result] = (out[row.result] || 0) + 1;
      return out;
    }, {});
    const persistence = {
      enabled: parts.some(part => part.persistence?.enabled),
      inserted: parts.reduce((sum,part) => sum + Number(part.persistence?.inserted || 0), 0),
      reasons: [...new Set(parts.map(part => part.persistence?.reason).filter(Boolean))]
    };
    return {
      version:'8.0.0',
      generatedAt:new Date().toISOString(),
      total:rows.length,
      counts,
      unresolved:rows.filter(row => row.result === 'UNVERIFIED').length,
      pending:rows.filter(row => row.result === 'PENDING').length,
      persistence,
      diagnostics:{
        batches:parts.length,
        dates:parts.map(part => part.batchDate).filter(Boolean),
        paidCreditsRequired:false,
        source:'Official MLB Stats API'
      },
      request,
      rows
    };
  }

  async function run(persist, options = {}){
    const rows = payload(options);
    if (!rows.length) throw new Error('No ledger picks matched the requested date range.');

    const groups = groupByDate(rows);
    const parts = [];
    for (const [date, dateRows] of groups){
      try {
        const result = await postRows(dateRows, persist);
        parts.push({ ...result, batchDate:date });
      } catch (error) {
        parts.push({
          batchDate:date,
          rows:dateRows.map(row => ({
            pickId:row.id,
            date:row.date,
            selectedTeam:row.selectedTeam || null,
            opponent:row.opponent || null,
            market:row.market,
            period:row.period,
            line:row.line,
            odds:row.odds,
            gamePk:null,
            result:'UNVERIFIED',
            gradeReason:`API_BATCH_FAILED: ${error.message}`,
            resolutionConfidence:0,
            environment:null,
            sourceRecord:row
          })),
          persistence:{ enabled:false, inserted:0, reason:'API_BATCH_FAILED' }
        });
      }
    }

    const cache = combine(parts, {
      from:options.from || null,
      to:options.to || null,
      persist:Boolean(persist)
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    window.dispatchEvent(new CustomEvent('sportsedge:intelligence-synced', { detail:cache }));
    return cache;
  }

  function cached(){
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); }
    catch { return null; }
  }

  function health(){
    const data = cached();
    if (!data) return { status:'NOT_RUN', message:'Run SportsEdgePipeline.recentSync() or syncAll().' };
    const graded = (data.counts?.WIN || 0) + (data.counts?.LOSS || 0) + (data.counts?.PUSH || 0) + (data.counts?.VOID || 0);
    return {
      status:data.unresolved === 0 ? 'HEALTHY' : 'REVIEW_REQUIRED',
      total:data.total,
      graded,
      pending:data.pending || 0,
      unresolved:data.unresolved,
      coverage:data.total ? Number((graded / data.total * 100).toFixed(1)) : 0,
      counts:data.counts,
      persistence:data.persistence,
      diagnostics:data.diagnostics,
      request:data.request,
      generatedAt:data.generatedAt
    };
  }

  function exportReport(){
    const data = cached();
    if (!data) throw new Error('No cached sync exists. Run recentSync() or syncAll() first.');
    const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `sports-edge-resolution-${new Date().toISOString().slice(0,10)}.json`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  const api = {
    version:'8.0.0',
    preview:(options={}) => run(false, options),
    sync:(options={}) => run(true, options),
    recentSync:(from='2026-07-26', persist=true) => run(Boolean(persist), { from }),
    syncAll:(persist=true) => run(Boolean(persist), {}),
    cached,
    health,
    exportReport,
    payload
  };

  window.SportsEdgePipeline = Object.freeze(api);
  console.info('[Sports Edge Pipeline] V8 ready. Grading is batched by date with retries and partial-failure preservation.');
})();
