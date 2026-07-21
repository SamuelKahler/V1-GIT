(function(){
  const props = Array.isArray(window.NFL_PROPS) ? window.NFL_PROPS : [];
  const systems = Array.isArray(window.NFL_SYSTEMS) ? window.NFL_SYSTEMS : [];
  const games = Array.isArray(window.NFL_GAMES) ? window.NFL_GAMES : [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const pct = (a,b) => b ? `${(a/b*100).toFixed(1)}%` : '—';
  const group = (rows,key) => rows.reduce((out,row)=>{const value=row[key]||'OTHER';(out[value] ||= []).push(row);return out;},{});
  const graded = props.filter(p=>['HIT','MISS'].includes(p.result));
  const hits = graded.filter(p=>p.result==='HIT').length;
  const styleGroups = group(graded,'style');
  const environmentGroups = group(graded,'environment');
  const systemGroups = group(systems,'previousWeekResults');
  let propFilters = {search:'', style:'ALL', environment:'ALL', result:'ALL'};
  let systemFilters = {situation:'ALL', outcome:'ALL', week:'ALL'};

  function topGroups(groups, limit=6){
    return Object.entries(groups).map(([name,rows])=>({name, rows, hits:rows.filter(r=>r.result==='HIT').length})).sort((a,b)=>b.rows.length-a.rows.length).slice(0,limit);
  }
  function consumerSummary(){
    if(!games.length) return 'No current-week NFL card has been entered yet. The historical database is active, so consumers can research which prop styles and game environments have performed best without mistaking old results for a current recommendation.';
    const game=games[0];
    return `${game.mainReason || 'The matchup and historical evidence point in the same direction.'} The biggest risk is ${(game.biggestRisk || 'late injury, weather, or line movement').toLowerCase()}. Overall, ${game.bestBet || 'the listed play'} is the clearest opportunity currently supported by the database.`;
  }
  function renderOverview(){
    const topStyle = topGroups(styleGroups,1)[0];
    const topEnv = Object.entries(environmentGroups).map(([name,rows])=>({name,rows,hits:rows.filter(r=>r.result==='HIT').length,rate:rows.filter(r=>r.result==='HIT').length/rows.length})).filter(x=>x.rows.length>=5).sort((a,b)=>b.rate-a.rate)[0];
    const current = games.length ? games.map(g=>`<article class="nfl-opportunity-card"><div><span class="tag">Current Opportunity</span><h3>${esc(g.awayTeam)} @ ${esc(g.homeTeam)}</h3><strong>${esc(g.bestBet)}</strong></div><p>${esc(g.mainReason)}</p></article>`).join('') : `<article class="nfl-empty-current"><span class="tag gray">No Current Slate</span><h3>Historical research is ready; current picks are intentionally blank.</h3><p>Add verified weekly games to <code>sports/nfl/data/nfl-games.js</code>. The app will never present placeholder picks as real opportunities.</p></article>`;
    document.querySelector('#nflOverview').innerHTML = `
      <section class="nfl-summary-strip">
        <article><strong>${props.length}</strong><small>Historical Props</small></article>
        <article><strong>${systems.length}</strong><small>System Rows</small></article>
        <article><strong>${hits}-${graded.length-hits}</strong><small>Prop Record</small></article>
        <article><strong>${pct(hits,graded.length)}</strong><small>Hit Rate</small></article>
      </section>
      <section class="nfl-consumer-card"><div><p class="eyebrow">Consumer Summary</p><h2>What does the evidence say?</h2></div><p>${esc(consumerSummary())}</p></section>
      <section class="nfl-two-column"><div><div class="section-head compact-head"><div><p class="eyebrow">Opportunity Board</p><h2>Current NFL Card</h2></div></div>${current}</div>
      <div><div class="section-head compact-head"><div><p class="eyebrow">Database Pulse</p><h2>Strongest Historical Signals</h2></div></div>
      <div class="nfl-signal-list">
        <article><span>Most tracked prop style</span><strong>${esc(topStyle?.name || '—')}</strong><small>${topStyle?.rows.length || 0} graded plays • ${pct(topStyle?.hits || 0,topStyle?.rows.length || 0)}</small></article>
        <article><span>Best qualified environment</span><strong>${esc(topEnv?.name || '—')}</strong><small>${topEnv?.rows.length || 0} graded plays • ${pct(topEnv?.hits || 0,topEnv?.rows.length || 0)}</small></article>
        <article><span>Largest system family</span><strong>${esc(Object.entries(systemGroups).sort((a,b)=>b[1].length-a[1].length)[0]?.[0] || '—')}</strong><small>${Object.entries(systemGroups).sort((a,b)=>b[1].length-a[1].length)[0]?.[1].length || 0} historical rows</small></article>
      </div></div></section>`;
  }
  function renderProps(){
    const styles=['ALL',...Object.keys(styleGroups).sort()];
    const envs=['ALL',...Object.keys(environmentGroups).sort()];
    const rows=props.filter(p=>(propFilters.style==='ALL'||p.style===propFilters.style)&&(propFilters.environment==='ALL'||p.environment===propFilters.environment)&&(propFilters.result==='ALL'||p.result===propFilters.result)&&(!propFilters.search||`${p.player} ${p.team} ${p.opponent} ${p.bet}`.toLowerCase().includes(propFilters.search.toLowerCase())));
    document.querySelector('#nflPropLab').innerHTML=`<div class="section-head"><div><p class="eyebrow">Player Intelligence</p><h2>NFL Prop Lab</h2><p>Filter the historical prop database without mixing it into MLB data.</p></div></div>
    <div class="nfl-filter-bar"><input id="nflPropSearch" placeholder="Search player, team, opponent..." value="${esc(propFilters.search)}"><select id="nflPropStyle">${styles.map(x=>`<option ${x===propFilters.style?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="nflPropEnvironment">${envs.map(x=>`<option ${x===propFilters.environment?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="nflPropResult">${['ALL','HIT','MISS'].map(x=>`<option ${x===propFilters.result?'selected':''}>${x}</option>`).join('')}</select></div>
    <p class="count">Showing ${rows.length} of ${props.length} historical props.</p><div class="nfl-table-wrap"><table><thead><tr><th>Week</th><th>Player / Bet</th><th>Matchup</th><th>Environment</th><th>Style</th><th>Result</th></tr></thead><tbody>${rows.map(p=>`<tr><td>${p.week}</td><td><strong>${esc(p.player)}</strong><small>${esc(p.bet.replace(p.player,''))}</small></td><td>${esc(p.team)} ${esc(p.opponent)}</td><td>${esc(p.environment)}</td><td>${esc(p.style)}</td><td><span class="nfl-result ${p.result.toLowerCase()}">${p.result}</span></td></tr>`).join('')}</tbody></table></div>`;
    ['nflPropSearch','nflPropStyle','nflPropEnvironment','nflPropResult'].forEach(id=>document.getElementById(id)?.addEventListener('input',e=>{const map={nflPropSearch:'search',nflPropStyle:'style',nflPropEnvironment:'environment',nflPropResult:'result'};propFilters[map[id]]=e.target.value;renderProps();}));
  }
  function renderSystems(){
    const situations=['ALL',...Object.keys(systemGroups).sort()];
    const outcomes=['ALL',...new Set(systems.map(s=>s.outcome))].sort();
    const weeks=['ALL',...new Set(systems.map(s=>String(s.week)))].sort((a,b)=>Number(a)-Number(b));
    const rows=systems.filter(s=>(systemFilters.situation==='ALL'||s.previousWeekResults===systemFilters.situation)&&(systemFilters.outcome==='ALL'||s.outcome===systemFilters.outcome)&&(systemFilters.week==='ALL'||String(s.week)===systemFilters.week));
    document.querySelector('#nflSystemLab').innerHTML=`<div class="section-head"><div><p class="eyebrow">Historical Situations</p><h2>NFL System Lab</h2><p>This table shows recorded qualifying situations. It does not claim a win rate until outcomes are added to the source data.</p></div></div><div class="nfl-filter-bar"><select id="nflSystemSituation">${situations.map(x=>`<option ${x===systemFilters.situation?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="nflSystemOutcome">${outcomes.map(x=>`<option ${x===systemFilters.outcome?'selected':''}>${esc(x)}</option>`).join('')}</select><select id="nflSystemWeek">${weeks.map(x=>`<option ${x===systemFilters.week?'selected':''}>${esc(x)}</option>`).join('')}</select></div><p class="count">Showing ${rows.length} of ${systems.length} system rows.</p><div class="nfl-system-cards">${Object.entries(group(rows,'previousWeekResults')).map(([name,items])=>`<article><span>${esc(name)}</span><strong>${items.length}</strong><small>qualifying records shown</small></article>`).join('')}</div><div class="nfl-table-wrap"><table><thead><tr><th>Week</th><th>Previous Week</th><th>Matchup</th><th>Recorded Angle</th><th>Line</th><th>Context</th></tr></thead><tbody>${rows.map(s=>`<tr><td>${s.week}</td><td>${esc(s.previousWeekResults)}</td><td>${esc(s.awayTeam)} @ ${esc(s.homeTeam)}</td><td>${esc(s.outcome)}</td><td>${esc(s.line)}</td><td>${esc(s.environment)}</td></tr>`).join('')}</tbody></table></div>`;
    ['nflSystemSituation','nflSystemOutcome','nflSystemWeek'].forEach(id=>document.getElementById(id)?.addEventListener('input',e=>{const map={nflSystemSituation:'situation',nflSystemOutcome:'outcome',nflSystemWeek:'week'};systemFilters[map[id]]=e.target.value;renderSystems();}));
  }
  function renderPerformance(){
    const styleHtml=Object.entries(styleGroups).map(([name,rows])=>{const h=rows.filter(r=>r.result==='HIT').length;return `<article><span>${esc(name)}</span><strong>${h}-${rows.length-h}</strong><small>${pct(h,rows.length)} • ${rows.length} plays</small></article>`}).sort().join('');
    const envHtml=topGroups(environmentGroups,12).map(x=>`<article><span>${esc(x.name)}</span><strong>${x.hits}-${x.rows.length-x.hits}</strong><small>${pct(x.hits,x.rows.length)} • ${x.rows.length} plays</small></article>`).join('');
    document.querySelector('#nflPerformance').innerHTML=`<div class="section-head"><div><p class="eyebrow">Transparent Results</p><h2>NFL Performance</h2><p>Historical props are graded exactly as supplied. System rows remain counts only because their result column was not included.</p></div></div><div class="nfl-performance-hero"><article><span>Overall</span><strong>${hits}-${graded.length-hits}</strong><small>${pct(hits,graded.length)} hit rate</small></article><article><span>Tracked</span><strong>${graded.length}</strong><small>graded historical props</small></article><article><span>Systems</span><strong>${systems.length}</strong><small>qualification rows, not graded bets</small></article></div><h3>By Prop Style</h3><div class="nfl-system-cards">${styleHtml}</div><h3>By Environment</h3><div class="nfl-system-cards">${envHtml}</div>`;
  }
  function renderGuide(){document.querySelector('#nflDataGuide').innerHTML=`<div class="section-head"><div><p class="eyebrow">Foolproof Updates</p><h2>Where NFL updates go</h2><p>Every NFL data type has one home. MLB files never need to be opened for an NFL update.</p></div></div><div class="nfl-guide-grid"><article><span>Historical Props</span><code>sports/nfl/data/nfl-props.js</code><p>Add completed player-prop records.</p></article><article><span>Historical Systems</span><code>sports/nfl/data/nfl-systems.js</code><p>Add qualifying game situations.</p></article><article><span>Current Weekly Card</span><code>sports/nfl/data/nfl-games.js</code><p>Add only verified current opportunities and evidence.</p></article><article><span>NFL Display Logic</span><code>sports/nfl/nfl-app.js</code><p>Controls filters, summaries, and rendering.</p></article></div>`;}
  function init(){if(!document.querySelector('#sport-nfl'))return;renderOverview();renderProps();renderSystems();renderPerformance();renderGuide();document.querySelectorAll('.nfl-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nfl-tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.nfl-view').forEach(x=>x.classList.toggle('active',x.dataset.nflPanel===btn.dataset.nflView));}));document.querySelectorAll('.nfl-scroll').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:'smooth'})));}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
