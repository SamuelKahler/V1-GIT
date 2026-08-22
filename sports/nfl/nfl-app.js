(function(){
  // NFL Intelligence Backbone → Environment + Trend Miner consumer layer.
  const bundledProps = Array.isArray(window.NFL_PROPS) ? window.NFL_PROPS : [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const num = (value, fallback=0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const fmtPct = value => Number.isFinite(Number(value)) ? `${Number(value).toFixed(1)}%` : '—';
  const fmtDate = value => { if(!value) return ''; const d=new Date(`${value}T12:00:00`); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); };
  const TEAM_COLORS = {ARI:'#97233F',ATL:'#A71930',BAL:'#241773',BUF:'#00338D',CAR:'#0085CA',CHI:'#0B162A',CIN:'#FB4F14',CLE:'#311D00',DAL:'#003594',DEN:'#FB4F14',DET:'#0076B6',GB:'#203731',HOU:'#03202F',IND:'#002C5F',JAX:'#006778',KC:'#E31837',LV:'#000000',LAC:'#0080C6',LAR:'#003594',MIA:'#008E97',MIN:'#4F2683',NE:'#002244',NO:'#D3BC8D',NYG:'#0B2265',NYJ:'#125740',PHI:'#004C54',PIT:'#FFB612',SEA:'#002244',SF:'#AA0000',TB:'#D50A0A',TEN:'#0C2340',WSH:'#5A1414'};
  let state = { trends: [], trendTeam:'ALL', trendMarket:'ALL', propSearch:'', teamSearch:'' };
  const backbone = () => window.NFL_BACKBONE || {};

  async function fetchJson(url){
    const response=await fetch(url,{headers:{Accept:'application/json'}});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(payload?.error?.message || payload?.error || `NFL request failed (${response.status})`);
    return payload;
  }
  function teamMark(team){
    const color=TEAM_COLORS[team] || '#174A75';
    return `<span class="nfl-team-mark" style="--team:${esc(color)}">${esc(team)}</span>`;
  }
  function sampleBadge(label){
    const cls=String(label||'').includes('STRONG')?'strong':String(label||'').includes('QUALIFIED')?'qualified':'small';
    return `<span class="nfl-sample ${cls}">${esc(label || 'SAMPLE')}</span>`;
  }
  function trendCard(t, compact=false){
    const team=t.team || t.team_abbr || '';
    const market=t.market || '';
    const env=t.environment || '';
    const hitRate=t.hitRate ?? t.hit_rate;
    const games=t.games || 0;
    const wins=t.wins ?? Math.round(num(hitRate)*games/100);
    const losses=t.losses ?? Math.max(0,games-wins);
    const start=t.startYear ?? t.trend_start_year;
    const label=t.sampleLabel ?? t.sample_label;
    return `<button class="nfl-trend-row${compact?' compact':''}" data-trend-team="${esc(team)}" data-trend-market="${esc(market)}" data-trend-env="${esc(env)}" data-trend-start="${esc(start || 2023)}">
      <div class="nfl-trend-team">${teamMark(team)}<div><strong>${esc(team)}</strong><span>${esc(market)}</span></div></div>
      <div class="nfl-trend-title"><strong>${esc(env)}</strong><span>${wins}-${losses} · ${fmtPct(hitRate)}${start?` · Since ${start}`:''}</span></div>
      <div class="nfl-trend-rate"><b>${fmtPct(hitRate)}</b>${sampleBadge(label)}</div>
      <span class="nfl-chevron">›</span>
    </button>`;
  }
  function propProfiles(){
    const db=backbone();
    if(Array.isArray(db.hotProps) && db.hotProps.length) return db.hotProps;
    const grouped={};
    bundledProps.filter(p=>['HIT','MISS'].includes(p.result)).forEach(p=>{const key=`${p.player}|${p.style}`;(grouped[key] ||= {player_name:p.player,team_abbr:p.team,market_style:p.style,hits:0,misses:0,games:0}); grouped[key].games++; grouped[key][p.result==='HIT'?'hits':'misses']++;});
    return Object.values(grouped).map(p=>({...p,hit_rate:p.games?100*p.hits/p.games:0,sample_label:p.games>=10?'STRONG SAMPLE':p.games>=6?'QUALIFIED SAMPLE':'SMALL SAMPLE'})).sort((a,b)=>b.hit_rate-a.hit_rate||b.games-a.games);
  }
  function propCard(p){
    const player=p.player_name || p.player || 'Player';
    const market=p.market_style || p.style || 'PROP';
    const rate=p.hit_rate ?? p.hitRate;
    const games=p.games || 0;
    const hits=p.hits || 0;
    const misses=p.misses ?? Math.max(0,games-hits);
    return `<article class="nfl-prop-row">
      <div class="nfl-player-avatar">${esc(player.split(/\s+/).map(x=>x[0]).join('').slice(0,2))}</div>
      <div class="nfl-prop-player"><strong>${esc(player)}</strong><span>${esc(p.team_abbr || p.team || '')}</span></div>
      <div class="nfl-prop-market"><strong>${esc(String(market).replaceAll('_',' '))}</strong><span>${hits}-${misses} · ${games} games</span></div>
      <div class="nfl-trend-rate"><b>${fmtPct(rate)}</b>${sampleBadge(p.sample_label || p.sampleLabel)}</div>
    </article>`;
  }
  function weeklyGames(){ return Array.isArray(backbone()?.weekly?.games) ? backbone().weekly.games : []; }
  function matchupCard(g){
    const evidence=Array.isArray(g.evidence)?g.evidence:[];
    const strong=evidence.filter(e=>num(e.hitRate)>=60 && num(e.games)>=6).slice(0,3);
    return `<article class="nfl-matchup-card" data-game-id="${esc(g.gameId || '')}">
      <div class="nfl-matchup-teams"><div>${teamMark(g.awayTeam)}<strong>${esc(g.awayTeam)}</strong></div><span>@</span><div>${teamMark(g.homeTeam)}<strong>${esc(g.homeTeam)}</strong></div></div>
      <div class="nfl-matchup-meta"><strong>${esc(g.weekday || '')} ${fmtDate(g.date)}</strong><span>${esc(g.time || '')}${g.venue?` · ${esc(g.venue)}`:''}</span></div>
      <div class="nfl-matchup-tags"><span>${evidence.length} matching trends</span>${strong.length?`<span class="hot">${strong.length} strong</span>`:''}</div>
      <div class="nfl-matchup-peek">${strong.length?strong.map(e=>`<p><b>${esc(e.team)} ${esc(e.market)}</b> ${esc(e.environment)} · ${fmtPct(e.hitRate)} (${e.wins}-${e.losses})</p>`).join(''):'<p>No qualified historical trend match yet.</p>'}</div>
    </article>`;
  }
  function renderOverview(){
    const db=backbone(); const canonical=db.canonical||{}; const hot=Array.isArray(db.hotTrends)?db.hotTrends:[]; const props=propProfiles(); const weekly=weeklyGames(); const week=db.weekly?.week;
    const seasons=Array.isArray(db.seasons)?db.seasons:[];
    document.querySelector('#nflOverview').innerHTML=`
      <section class="nfl-intro-grid">
        <div class="nfl-intro-copy"><span class="nfl-kicker">NFL INTELLIGENCE</span><h1>Data. Trends. Confidence.</h1><p>Verified NFL game history, market environments and player profiles—organized around what matters this week.</p></div>
        <div class="nfl-kpis">
          <article><span class="ico">▣</span><b>${num(canonical.games).toLocaleString()}</b><small>Games Imported</small><em>${seasons.length?`${Math.min(...seasons)}–${Math.max(...seasons)}`:'Historical'}</em></article>
          <article><span class="ico orange">✓</span><b>${canonical.teams || 32}</b><small>Teams Covered</small><em>All NFL Teams</em></article>
          <article><span class="ico green">▥</span><b>${fmtPct(db.marketCoverage)}</b><small>Market Coverage</small><em>Closing Lines</em></article>
          <article><span class="ico purple">□</span><b>${seasons.length || 0}</b><small>Seasons</small><em>${seasons.join(', ')}</em></article>
        </div>
      </section>
      <div class="nfl-ready-bar">✓ NFL database is current and ready for trend analysis</div>
      <section class="nfl-dashboard-grid">
        <div class="nfl-panel"><div class="nfl-panel-head"><h2>🔥 Hottest Team Trends</h2><button class="nfl-link" data-nfl-go="trends">View All Trends →</button></div><div class="nfl-list">${hot.length?hot.slice(0,5).map(t=>trendCard(t,true)).join(''):'<div class="nfl-clean-empty">Trend miner is loading canonical NFL history.</div>'}</div></div>
        <div class="nfl-panel"><div class="nfl-panel-head"><h2>🔥 Hottest Prop Profiles</h2><button class="nfl-link" data-nfl-go="props">View All Props →</button></div><div class="nfl-list">${props.length?props.slice(0,5).map(propCard).join(''):'<div class="nfl-clean-empty">Player prop profiles are loading.</div>'}</div></div>
      </section>
      <section class="nfl-panel nfl-week-panel"><div class="nfl-panel-head"><div><h2>Week ${week || '—'} Matchups</h2><p>Games with the most matching verified intelligence.</p></div><button class="nfl-link" data-nfl-go="week">View Full Slate →</button></div><div class="nfl-matchup-grid">${weekly.length?weekly.slice(0,8).map(matchupCard).join(''):'<div class="nfl-clean-empty">No upcoming NFL slate is available in the imported schedule yet.</div>'}</div></section>`;
    bindInteractions();
  }
  async function loadTrends(){
    try{ const payload=await fetchJson('/api/nfl?action=minedTrends&limit=300&minGames=6'); state.trends=payload.trends||[]; }catch(e){ console.warn(e); state.trends=Array.isArray(backbone()?.hotTrends)?backbone().hotTrends:[]; }
  }
  function renderTrends(){
    const target=document.querySelector('#nflTrendLab'); if(!target) return;
    const teams=['ALL',...new Set(state.trends.map(t=>t.team).filter(Boolean))].sort();
    const markets=['ALL','ATS','ML','OVER','UNDER'];
    const rows=state.trends.filter(t=>(state.trendTeam==='ALL'||t.team===state.trendTeam)&&(state.trendMarket==='ALL'||t.market===state.trendMarket));
    target.innerHTML=`<div class="nfl-page-head"><div><span class="nfl-kicker">CANONICAL TREND MINER</span><h2>Hottest Team Trends</h2><p>Every percentage below is recalculated from imported NFL games—not a hand-entered record.</p></div></div>
      <div class="nfl-toolbar"><select id="nflTrendTeam">${teams.map(x=>`<option ${x===state.trendTeam?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="nflTrendMarket">${markets.map(x=>`<option ${x===state.trendMarket?'selected':''}>${esc(x)}</option>`).join('')}</select><span>${rows.length} verified trends</span></div>
      <div class="nfl-trend-table">${rows.length?rows.map(t=>trendCard(t)).join(''):'<div class="nfl-clean-empty">No trends match these filters.</div>'}</div>`;
    document.querySelector('#nflTrendTeam')?.addEventListener('change',e=>{state.trendTeam=e.target.value;renderTrends();});
    document.querySelector('#nflTrendMarket')?.addEventListener('change',e=>{state.trendMarket=e.target.value;renderTrends();});
    bindInteractions();
  }
  function renderProps(){
    const target=document.querySelector('#nflPropLab'); if(!target) return;
    const rows=propProfiles().filter(p=>!state.propSearch||`${p.player_name||p.player} ${p.team_abbr||p.team} ${p.market_style||p.style}`.toLowerCase().includes(state.propSearch.toLowerCase()));
    target.innerHTML=`<div class="nfl-page-head"><div><span class="nfl-kicker">PLAYER INTELLIGENCE</span><h2>Hot Prop Profiles</h2><p>Historical player performance first. Current sportsbook lines will be attached in the next prop-data layer.</p></div></div><div class="nfl-toolbar"><input id="nflPropSearch" placeholder="Search player, team or market" value="${esc(state.propSearch)}"><span>${rows.length} profiles</span></div><div class="nfl-prop-grid">${rows.map(propCard).join('')}</div>`;
    document.querySelector('#nflPropSearch')?.addEventListener('input',e=>{state.propSearch=e.target.value;renderProps();});
  }
  function renderTeams(){
    const target=document.querySelector('#nflTeams'); if(!target) return;
    const trends=state.trends;
    const teamMap={}; trends.forEach(t=>{(teamMap[t.team] ||= []).push(t);});
    const teams=Object.keys(TEAM_COLORS).filter(t=>!state.teamSearch||t.includes(state.teamSearch.toUpperCase())).sort();
    target.innerHTML=`<div class="nfl-page-head"><div><span class="nfl-kicker">TEAM DATABASE</span><h2>Explore Every Team</h2><p>Open a team to see its strongest verified ATS, moneyline and total environments.</p></div></div><div class="nfl-toolbar"><input id="nflTeamSearch" placeholder="Search team abbreviation" value="${esc(state.teamSearch)}"><span>${teams.length} teams</span></div><div class="nfl-team-grid">${teams.map(team=>{const best=(teamMap[team]||[]).slice().sort((a,b)=>num(b.strengthScore)-num(a.strengthScore))[0];return `<button class="nfl-team-card" data-team-open="${team}">${teamMark(team)}<strong>${team}</strong><span>${(teamMap[team]||[]).length} verified trends</span>${best?`<small>Best: ${esc(best.environment)} · ${fmtPct(best.hitRate)}</small>`:'<small>No qualified trend sample yet</small>'}</button>`}).join('')}</div>`;
    document.querySelector('#nflTeamSearch')?.addEventListener('input',e=>{state.teamSearch=e.target.value;renderTeams();});
    document.querySelectorAll('[data-team-open]').forEach(btn=>btn.addEventListener('click',()=>{state.trendTeam=btn.dataset.teamOpen;switchView('trends');renderTrends();}));
  }
  function renderModelLab(){
    const target=document.querySelector('#nflModelLab'); if(!target) return;
    target.innerHTML=`<section class="nfl-model-shell"><span class="nfl-kicker">NFL MODEL LAB</span><h2>Build Your Football Model</h2><p>The underdog moneyline engine will live here, separated from historical trend evidence so customer-adjusted model runs never contaminate verified records.</p><div class="nfl-model-coming"><b>Foundation connected</b><span>Canonical games, market history and environment intelligence are ready for the model-runtime phase.</span></div></section>`;
  }
  function renderWeek(){
    const target=document.querySelector('#nflWeek'); if(!target) return;
    const w=backbone()?.weekly||{}; const rows=Array.isArray(w.games)?w.games:[];
    target.innerHTML=`<div class="nfl-page-head"><div><span class="nfl-kicker">THIS WEEK</span><h2>${w.season || ''} Week ${w.week || '—'}</h2><p>Each matchup shows the verified historical environments that actually apply to today's game.</p></div></div><div class="nfl-matchup-grid full">${rows.length?rows.map(matchupCard).join(''):'<div class="nfl-clean-empty">No upcoming NFL games are available in the imported schedule.</div>'}</div>`;
  }
  async function openTrendHistory(button){
    const team=button.dataset.trendTeam, market=button.dataset.trendMarket, env=button.dataset.trendEnv, start=button.dataset.trendStart;
    let modal=document.querySelector('#nflTrendModal'); if(!modal){modal=document.createElement('div');modal.id='nflTrendModal';modal.className='nfl-modal';document.body.appendChild(modal);}
    modal.innerHTML=`<div class="nfl-modal-card"><button class="nfl-modal-close">×</button><span class="nfl-kicker">VERIFIED GAME LOG</span><h2>${esc(team)} ${esc(market)} — ${esc(env)}</h2><div class="nfl-modal-loading">Loading underlying games…</div></div>`; modal.classList.add('open'); modal.querySelector('.nfl-modal-close').onclick=()=>modal.classList.remove('open');
    try{
      const q=new URLSearchParams({action:'trendHistory',team,market,environment:env,startYear:start||'2023',limit:'150'});
      const payload=await fetchJson(`/api/nfl?${q}`); const rows=payload.history||[];
      const wins=rows.filter(r=>r.hit).length;
      modal.querySelector('.nfl-modal-loading').outerHTML=`<div class="nfl-history-summary"><b>${fmtPct(rows.length?100*wins/rows.length:0)}</b><span>${wins}-${rows.length-wins} · ${rows.length} games · Since ${esc(start)}</span></div><div class="nfl-history-list">${rows.map(r=>`<article><div><strong>${fmtDate(r.date)} · ${esc(r.team)} ${r.location==='HOME'?'vs':'@'} ${esc(r.opponent)}</strong><span>Week ${r.week} · ${esc(r.venue||'')}</span></div><div><b class="${r.hit?'win':'loss'}">${r.hit?'HIT':'MISS'}</b><span>Spread ${r.spread??'—'} · ML ${r.moneyline??'—'} · Total ${r.total??'—'}</span></div></article>`).join('')}</div>`;
    }catch(e){ modal.querySelector('.nfl-modal-loading').textContent=e.message; }
  }
  function switchView(view){
    document.querySelectorAll('.nfl-tab').forEach(x=>x.classList.toggle('active',x.dataset.nflView===view));
    document.querySelectorAll('.nfl-view').forEach(x=>x.classList.toggle('active',x.dataset.nflPanel===view));
  }
  function bindInteractions(){
    document.querySelectorAll('[data-nfl-go]').forEach(btn=>btn.onclick=()=>{switchView(btn.dataset.nflGo); if(btn.dataset.nflGo==='trends')renderTrends(); if(btn.dataset.nflGo==='props')renderProps(); if(btn.dataset.nflGo==='week')renderWeek();});
    document.querySelectorAll('[data-trend-team]').forEach(btn=>btn.onclick=()=>openTrendHistory(btn));
  }
  async function init(){
    if(!document.querySelector('#sport-nfl')) return;
    renderOverview(); renderProps(); renderTeams(); renderModelLab(); renderWeek();
    await loadTrends(); renderTrends(); renderTeams();
    window.addEventListener('sports-edge:nfl-backbone-ready',async()=>{renderOverview();renderWeek();await loadTrends();renderTrends();renderTeams();});
    document.querySelectorAll('.nfl-tab').forEach(btn=>btn.addEventListener('click',()=>{switchView(btn.dataset.nflView); if(btn.dataset.nflView==='trends')renderTrends(); if(btn.dataset.nflView==='props')renderProps(); if(btn.dataset.nflView==='teams')renderTeams(); if(btn.dataset.nflView==='week')renderWeek();}));
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
