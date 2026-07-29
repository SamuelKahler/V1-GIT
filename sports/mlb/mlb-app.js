// Sports Edge Core V2: Today's Picks now reads the reconciled master ledger view.
// The original data remains preserved in mlb-data.js and SportsEdgeCore.preserved.
const coreDailyPicks = (window.SportsEdgeCore && Array.isArray(window.SportsEdgeCore.uiPicks) && window.SportsEdgeCore.uiPicks.length)
  ? window.SportsEdgeCore.uiPicks
  : ((typeof trackedPickResults !== 'undefined' && Array.isArray(trackedPickResults)) ? trackedPickResults : []);

// V43 stability helper: all missing/blank unit values default to 1U.
function parseUnits(value) {
  if (value === null || value === undefined || value === '') return 1;
  if (typeof value === 'number') return value;

  const cleaned = String(value)
    .replace('U', '')
    .replace('u', '')
    .replace(',', '')
    .trim();

  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 1;
}

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
function uniq(arr){return [...new Set(arr.filter(Boolean))].sort();}
function slugStatus(s){return String(s).replace(/\s+/g,'-').replace(/[^A-Z-]/g,'');}
function pct(v){const n=parseFloat(String(v).replace('%',''));return Number.isFinite(n)?n:null;}
/* Legacy showPage implementation removed during clean sweep. */
 
$$('.nav,.jump').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));

const SPORT_OPTIONS = ['MLB'];
const BET_CATEGORY_OPTIONS = ['Win Trend','Win Trend Hit Rate','Prop','Game Log Trend'];
const WIN_TREND_STYLES = ['PREV_SCORED 10+','PREV_SCORED 0','PREV_ALLOWED 10+','PREV_ALLOWED 0','SWEEP','AVOID SWEEP','FOR SWEEP','OVER','UNDER'];
const ML_ENVIRONMENTS = ['AFTER A WIN','1-DAY REST','AWAY UNDERDOG','DIVISION','NO REST'];
const PROP_ENVIRONMENTS = ['AWAY FAVORITE','AWAY','AWAY UNDERDOG','DIVISION','HOME','HOME FAVORITE','HOME UNDERDOG','NO REST'];
const GAME_LOG_STYLES = ['PREV_SCORED 10+','PREV_SCORED 0','PREV_ALLOWED 10+','PREV_ALLOWED 0','SWEEP','AVOID SWEEP','FOR SWEEP','OVER','UNDER','10+'];
const GAME_LOG_ENVIRONMENTS = ['AWAY UNDERDOG','AWAY FAVORITE','HOME UNDERDOG','HOME FAVORITE'];
const TEAM_NAME_TO_ABBR = {
  'Arizona Diamondbacks':'ARI','Athletics':'A\'s','Oakland Athletics':'A\'s','Baltimore Orioles':'BAL','Boston Red Sox':'BOS','Chicago Cubs':'CHC','Chicago White Sox':'CWS','Cincinnati Reds':'CIN','Cleveland Guardians':'CLE','Colorado Rockies':'COL','Detroit Tigers':'DET','Houston Astros':'HOU','Kansas City Royals':'KC','Los Angeles Angels':'LAA','Los Angeles Dodgers':'LAD','Miami Marlins':'MIA','Milwaukee Brewers':'MIL','Minnesota Twins':'MIN','New York Mets':'NYM','New York Yankees':'NYY','Philadelphia Phillies':'PHI','Pittsburgh Pirates':'PIT','San Diego Padres':'SD','San Francisco Giants':'SF','Seattle Mariners':'SEA','St. Louis Cardinals':'STL','Tampa Bay Rays':'TB','Texas Rangers':'TEX','Toronto Blue Jays':'TOR','Washington Nationals':'WSH'
};
const ABBR_TO_TEAM_NAME = Object.fromEntries(Object.entries(TEAM_NAME_TO_ABBR).map(([name,abbr]) => [abbr,name]));

const TEAM_SEARCH_ALIASES = Object.entries(TEAM_NAME_TO_ABBR).reduce((acc,[name,abbr])=>{
  acc[name.toLowerCase()] = abbr;
  acc[abbr.toLowerCase()] = abbr;
  return acc;
},{});
function teamFromSearch(value){
  const q = String(value||'').trim().toLowerCase();
  if(!q) return '';
  if(TEAM_SEARCH_ALIASES[q]) return TEAM_SEARCH_ALIASES[q];
  const found = Object.entries(TEAM_NAME_TO_ABBR).find(([name,abbr]) => name.toLowerCase().includes(q) || abbr.toLowerCase().includes(q));
  return found ? found[1] : teamAbbr(value);
}
let liveState = { games: [], odds: [] };


// V50 API integration state: the frontend now reads verified grades from /api/grade-picks
// and live MLB/odds data from the Vercel API routes. The API key stays server-side in Vercel.
let apiGradeState = {
  loading: false,
  loaded: false,
  error: '',
  summary: null,
  dateBatches: [],
  resultByKey: {}
};

function normalizePickKeyText(value){
  return String(value || '')
    .replace(/[’]/g, "'")
    .replace(/_/g, ' ')
    .replace(/\*/g, '')
    .replace(/\bNOW\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}
function apiGradeKey(date, rawPick){ return `${date}::${normalizePickKeyText(rawPick)}`; }
function apiResultForPick(p){
  if(!apiGradeState.loaded) return null;
  const d = dateKey(parseSlateDate(p?.slate || ''));
  const candidates = [cleanPickTitle(p), p?.pick, String(p?.pick || '').replace(/\s+[-–—]\s+.+$/,'')];
  for(const candidate of candidates){
    const hit = apiGradeState.resultByKey[apiGradeKey(d, candidate)];
    if(hit) return hit;
  }
  return null;
}
function apiStatusForPick(p){
  const hit = apiResultForPick(p);
  const st = String(hit?.grading?.status || '').toUpperCase();
  return ['WIN','LOSS','PUSH','NO_ACTION'].includes(st) ? st : null;
}
function apiVerificationNoteForPick(p){
  const hit = apiResultForPick(p);
  if(!hit) return '';
  const st = String(hit?.grading?.status || '').toUpperCase();
  const reason = hit?.grading?.reason || '';
  const source = hit?.grading?.game ? 'Verified by Official MLB Stats API.' : 'Checked by Sports Edge API.';
  return `${source} ${st ? st + ': ' : ''}${reason}`.trim();
}
function apiGradeSummaryHtml(){
  if(apiGradeState.loading) return '<div class="api-grade-banner loading"><strong>API Grading:</strong> Checking verified MLB results...</div>';
  if(apiGradeState.error) return `<div class="api-grade-banner warning"><strong>API Grading:</strong> ${apiGradeState.error}</div>`;
  if(!apiGradeState.loaded || !apiGradeState.summary) return '<div class="api-grade-banner muted"><strong>API Grading:</strong> Not loaded yet.</div>';
  const s = apiGradeState.summary;
  return `<div class="api-grade-banner success"><strong>API Verified July Record:</strong> ${s.record || `${s.WIN || 0}-${s.LOSS || 0}`} ${s.PUSH ? `-${s.PUSH}` : ''} • <b>${s.winRate || 'N/A'}</b> win rate • ${s.total || 0} plays checked • Official MLB Stats API</div>`;
}
async function fetchVerifiedGrades(){
  if(apiGradeState.loading) return;
  apiGradeState.loading = true;
  apiGradeState.error = '';
  try{
    const res = await fetch('/api/grade-picks?month=2026-07', { cache: 'no-store' });
    if(!res.ok) throw new Error(`grade-picks returned ${res.status}`);
    const data = await res.json();
    if(!data.ok) throw new Error(data.error || 'grade-picks returned ok:false');
    const lookup = {};
    (data.dateBatches || []).forEach(batch => {
      (batch.results || []).forEach(result => {
        lookup[apiGradeKey(batch.date || result.date, result.rawPick)] = result;
      });
    });
    apiGradeState = {
      loading: false,
      loaded: true,
      error: '',
      summary: data.summary || null,
      dateBatches: data.dateBatches || [],
      resultByKey: lookup
    };
    renderPicks();
    renderHomeDailyDashboard();
    renderPerformanceLab();
  }catch(err){
    apiGradeState.loading = false;
    apiGradeState.loaded = false;
    apiGradeState.error = err.message || 'Could not load verified grades.';
    renderPicks();
  }
}

function normalizeTeamName(name){return String(name||'').trim();}
function teamAbbr(nameOrAbbr){
  const v = normalizeTeamName(nameOrAbbr);
  if(!v) return '-';
  if(TEAM_NAME_TO_ABBR[v]) return TEAM_NAME_TO_ABBR[v];
  if(ABBR_TO_TEAM_NAME[v]) return v;
  return v.toUpperCase().replace(/[^A-Z]/g,'').slice(0,3) || v;
}
function normalizeStyleKey(style){
  const raw = String(style||'').trim();
  const upper = raw.toUpperCase();
  if(upper === 'ATS' || raw === 'AtS') return 'AVOID SWEEP';
  if(upper === 'PREV_SCRD 10+' || upper === 'PREV_SCORED 10+') return 'PREV_SCORED 10+';
  if(upper === 'PREV_SCRD 0' || upper === 'PREV_SCORED 0') return 'PREV_SCORED 0';
  if(upper === 'SWEEP') return 'SWEEP';
  if(upper === 'PROP') return 'PROP';
  if(upper === 'ML') return 'ML';
  if(upper === 'SPRD') return 'SPRD';
  return upper || '-';
}
function trendDisplayStyle(style){return normalizeStyleKey(style);}
function populateSelect(id, values, {preserve=false}={}){
  const sel=$(id);
  if(!sel) return;
  const current = preserve ? sel.value : 'all';
  const first = sel.querySelector('option')?.outerHTML || '<option value="all">All</option>';
  sel.innerHTML = first;
  const existingValues = new Set([...sel.options].map(o=>o.value));
  values.filter(v=>!existingValues.has(v)).forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;sel.appendChild(o);});
  if([...sel.options].some(o=>o.value===current)) sel.value=current;
}
function todaysTeamAbbrs(){
  const teams = [];
  liveState.games.forEach(g=>{
    teams.push(teamAbbr(g.away_team_abbr || g.awayTeamAbbr || g.away_team || g.awayTeam));
    teams.push(teamAbbr(g.home_team_abbr || g.homeTeamAbbr || g.home_team || g.homeTeam));
  });
  return uniq(teams.filter(t=>t && t !== '-'));
}
function activeTrendRows(){
  const sport = $('#sportFilter')?.value || 'MLB';
  if(sport !== 'MLB') return [];
  const todaysTeams = todaysTeamAbbrs();
  const rows = todaysTeams.length ? trendRows.filter(r=>todaysTeams.includes(r.team)) : trendRows;
  return rows.map(r=>({...r, style: trendDisplayStyle(r.style), situation:String(r.situation||'-').trim().toUpperCase()}));
}
function hasHitRateEvidence(row){
  return pct(row.hitRate) !== null;
}
function rowCategory(row){
  const style = normalizeStyleKey(row.style);
  if(style === 'PROP') return 'Prop';
  if(!hasHitRateEvidence(row)) return 'Game Log Trend';
  if(style === 'ML') return 'Win Trend Hit Rate';
  return 'Win Trend';
}

function gameLogEnvironment(row){
  const env = String(row.situation || '').trim().toUpperCase();
  return GAME_LOG_ENVIRONMENTS.includes(env) ? env : '';
}
function styleTagList(row){
  const tags = [];
  const style = normalizeStyleKey(row.style);
  if(style && style !== '-') tags.push(style);
  const notes = String(row.notes || '').toUpperCase();
  if(notes.includes('DIVISION') || String(row.situation||'').toUpperCase()==='DIVISION') tags.push('DIVISION');
  if(notes.includes('10+') && !tags.includes('10+')) tags.push('10+');
  return uniq(tags).map(t=>`<span class="mini-tag">${t}</span>`).join(' ');
}
function gameLogStyleSummary(row){
  const tags = styleTagList(row);
  return tags || '<span class="mini-tag muted-tag">AUTO-TAG PENDING</span>';
}
function evidenceStatus(row){
  if(rowCategory(row) === 'Game Log Trend') {
    if(row.gameLogOutcome && row.gameLogOutcome !== 'UNDEFINED') return 'Outcome-backed game log';
    return 'Needs result / hit rate';
  }
  if(rowCategory(row) === 'Prop') return 'Prop log';
  return 'Hit-rate backed';
}
function gameLogRecord(row){
  const wins = Array.isArray(row.winEvidence) ? row.winEvidence.length : (String(row.supportingGames||'').trim() && row.supportingGames !== '-' ? String(row.supportingGames).split(';').filter(Boolean).length : 0);
  const losses = Array.isArray(row.lossEvidence) ? row.lossEvidence.length : (String(row.additionalExamples||'').trim() && row.additionalExamples !== '-' ? String(row.additionalExamples).split(';').filter(Boolean).length : 0);
  return { wins, losses, total: wins + losses };
}
function gameLogOutcomeLabel(row){
  const outcome = String(row.gameLogOutcome || '').toUpperCase();
  if(outcome === 'WIN') return '<span class="tag">✅ WIN</span>';
  if(outcome === 'LOSS') return '<span class="tag loss-tag">✕ LOSS</span>';
  if(outcome === 'MIXED') { const r=gameLogRecord(row); return `<span class="tag blue">${r.wins}-${r.losses} HISTORY</span>`; }
  return '<span class="tag gray">UNDEFINED</span>';
}
function parseTrendDate(value){
  const raw = String(value || '').trim();
  if(!raw || raw === '-') return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}
function formatTrendDate(value){
  const d = parseTrendDate(value);
  if(!d) return '<span class="status-UNGRADED">Date needed</span>';
  return d.toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'});
}
function trendDateSortValue(row){
  const d = parseTrendDate(row.date);
  return d ? d.getTime() : 0;
}
function trendHitRateCell(row){
  const cat = rowCategory(row);
  if(cat === 'Game Log Trend') {
    const rec = gameLogRecord(row);
    const rate = rec.total ? ((rec.wins / rec.total) * 100).toFixed(1) + '%' : 'Needs Data';
    return `${gameLogOutcomeLabel(row)}<br><small>${rec.total ? rec.wins + '-' + rec.losses + ' calculated from evidence' : evidenceStatus(row)}</small><br><small>${rate}</small>`;
  }
  if(cat === 'Prop') return `${row.hitRate}<br><small>${evidenceStatus(row)}</small>`;
  return `${row.hitRate}<br><small>${row.duration || '-'}</small><br><small>${evidenceStatus(row)}</small>`;
}
function gameForTeam(team){
  return liveState.games.find(game => [teamAbbr(game.away_team_abbr || game.away_team), teamAbbr(game.home_team_abbr || game.home_team)].includes(team));
}
function moneylinePricesForGame(g){
  const o = findOddsForGame(g);
  if(!o) return {away:null, home:null};
  const books=Array.isArray(o.odds_json)?o.odds_json:[];
  const preferred = books.find(b=>['draftkings','fanduel','betmgm'].includes(b.key)) || books[0];
  const h2h=preferred?.markets?.find(m=>m.key==='h2h');
  const awayName = o.away_team;
  const homeName = o.home_team;
  const away=h2h?.outcomes?.find(x=>x.name===awayName || teamAbbr(x.name)===teamAbbr(awayName));
  const home=h2h?.outcomes?.find(x=>x.name===homeName || teamAbbr(x.name)===teamAbbr(homeName));
  return {away: away?.price ?? null, home: home?.price ?? null};
}
function americanImpliedProbability(price){
  const n = Number(price);
  if(!Number.isFinite(n) || n === 0) return null;
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
}
function favoriteSideForGame(g){
  const prices = moneylinePricesForGame(g);
  const awayProb = americanImpliedProbability(prices.away);
  const homeProb = americanImpliedProbability(prices.home);
  if(awayProb == null || homeProb == null) return null;
  if(Math.abs(awayProb - homeProb) < 0.0001) return 'pickem';
  return awayProb > homeProb ? 'away' : 'home';
}
function teamGameContext(team, g=gameForTeam(team)){
  if(!g || !team) return {base:'No live game', full:'No live game', role:'unknown', favoriteStatus:'unknown'};
  const away = teamAbbr(g.away_team_abbr || g.away_team);
  const home = teamAbbr(g.home_team_abbr || g.home_team);
  const role = team === away ? 'away' : team === home ? 'home' : 'unknown';
  const favSide = favoriteSideForGame(g);
  const base = role === 'away' ? 'AWAY' : role === 'home' ? 'HOME' : 'UNKNOWN';
  let favoriteStatus = 'No ML';
  if(favSide === 'pickem') favoriteStatus = 'Pickem';
  else if((role === 'away' && favSide === 'away') || (role === 'home' && favSide === 'home')) favoriteStatus = 'Favorite';
  else if((role === 'away' && favSide === 'home') || (role === 'home' && favSide === 'away')) favoriteStatus = 'Underdog';
  const full = favoriteStatus === 'Favorite' || favoriteStatus === 'Underdog' ? `${base} ${favoriteStatus.toUpperCase()}` : base;
  return {base, full, role, favoriteStatus};
}
function detectedPropEnvironments(team){
  const envs = new Set();
  const g = gameForTeam(team);
  if(!g) return [];
  const ctx = teamGameContext(team, g);
  if(ctx.base === 'AWAY' || ctx.base === 'HOME') envs.add(ctx.base);
  if(ctx.full.includes('FAVORITE') || ctx.full.includes('UNDERDOG')) envs.add(ctx.full);
  // DIVISION and NO REST require schedule-history / division metadata. Keep them available as trend environments,
  // but do not auto-claim them unless they are explicitly in the stored row.
  return [...envs];
}
function updatePropEnvironmentNote(){
  const el = $('#propDetectedEnvironment');
  if(!el) return;
  const raw = $('#propTeamSearch')?.value || '';
  const team = teamFromSearch(raw);
  if(!raw.trim()) { el.textContent = 'Type a team and the app will infer HOME/AWAY and favorite/underdog from today’s slate when live odds are available.'; return; }
  const envs = detectedPropEnvironments(team);
  const matchup = liveMatchupForTeam(team).replace(/<[^>]+>/g,' ');
  el.textContent = envs.length ? `${team} detected: ${envs.join(', ')}. ${matchup}` : `${team}: no live slate environment detected yet. Showing stored prop rows for that team until live data loads.`;
}

function selectedGameLogStyles(){
  const checked = $$('#gameLogStyleChecks input[type="checkbox"]:checked').map(x=>x.value);
  return checked;
}
function renderGameLogStyleChecks(rows){
  const box = $('#gameLogStyleChecks');
  if(!box) return;
  const existing = new Set(selectedGameLogStyles());
  const values = GAME_LOG_STYLES.filter(v=>rows.some(r=>rowCategory(r)==='Game Log Trend' && normalizeStyleKey(r.style)===v));
  box.innerHTML = values.map(v=>`<label class="check-pill"><input type="checkbox" value="${v}" ${existing.has(v)?'checked':''}/> <span>${v}</span></label>`).join('') || '<small class="subtle">No matching game-log styles for today yet.</small>';
  $$('#gameLogStyleChecks input').forEach(input=>input.addEventListener('change',renderTrends));
}
function opponentLocationDescription(row){
  const opp = String(row.opponent||'').trim();
  if(opp && opp !== '-'){
    if(/^@/.test(opp)) return `<strong>Away</strong><br><small>${opp}</small>`;
    if(/^vs\.?/i.test(opp)) return `<strong>Home</strong><br><small>${opp}</small>`;
    return `<strong>Opponent</strong><br><small>${opp}</small>`;
  }
  const g = gameForTeam(row.team);
  if(!g) return '<small>Opponent/date matchup needed</small>';
  const away = teamAbbr(g.away_team_abbr || g.away_team);
  const home = teamAbbr(g.home_team_abbr || g.home_team);
  if(row.team === away) return `<strong>Away</strong><br><small>@ ${home}</small>`;
  if(row.team === home) return `<strong>Home</strong><br><small>vs. ${away}</small>`;
  return '<small>Opponent/date matchup needed</small>';
}
function scenarioHistoryRows(row, scopedRows){
  const rowStyle = normalizeStyleKey(row.style);
  const rowCat = rowCategory(row);
  const match = (x) => {
    if(x.team !== row.team) return false;
    if(normalizeStyleKey(x.style) !== rowStyle) return false;
    // For environment-based categories, keep history to the exact environment.
    if(['Win Trend Hit Rate','Prop'].includes(rowCat)) return String(x.situation||'').toUpperCase() === String(row.situation||'').toUpperCase();
    return true;
  };
  const allRows = activeTrendRows().filter(match).sort((a,b)=>trendDateSortValue(b)-trendDateSortValue(a));
  const current = scopedRows.filter(match).length;
  return { allRows, current };
}
function historyOutcomeTag(x){
  const cat = rowCategory(x);
  if(cat === 'Game Log Trend') return gameLogOutcomeLabel(x);
  if(hasHitRateEvidence(x)) return `<span class="tag">Hit Rate ${x.hitRate}</span>`;
  return '<span class="tag gray">Ungraded</span>';
}
function resultEvidenceCell(row, scopedRows=[]){
  const support = String(row.supportingGames||'').trim();
  const examples = String(row.additionalExamples||'').trim();
  const { allRows, current } = scenarioHistoryRows(row, scopedRows);
  let supportLine;
  if(rowCategory(row)==='Game Log Trend') {
    const rec = gameLogRecord(row);
    const winList = Array.isArray(row.winEvidence) && row.winEvidence.length ? row.winEvidence.join('; ') : (support && support !== '-' ? support : '-');
    const lossList = Array.isArray(row.lossEvidence) && row.lossEvidence.length ? row.lossEvidence.join('; ') : (examples && examples !== '-' ? examples : '-');
    supportLine = `<small><b>Win/Loss Evidence</b><br>${gameLogOutcomeLabel(row)}<br>Wins: ${winList}<br>Losses: ${lossList}<br>Record: ${rec.total ? rec.wins + '-' + rec.losses : 'Needs more data'}</small>`;
  } else {
    supportLine = `<small><b>Win/Loss Evidence</b><br>Wins / Support: ${support || '-'}<br>Losses / Examples: ${examples || '-'}</small>`;
  }
  const historyList = allRows.slice(0,14).map(x=>`<li><b>${formatTrendDate(x.date)}</b> — ${opponentLocationDescription(x).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()} — ${String(x.situation||'-')} ${historyOutcomeTag(x)}</li>`).join('');
  return `${supportLine}<details class="history-dropdown"><summary>Show ${allRows.length} historical ${normalizeStyleKey(row.style)} row${allRows.length===1?'':'s'} for ${row.team}</summary><div class="history-meta"><small>${current} current-slate match${current===1?'':'es'} for this exact style/environment.</small></div><ul class="clean compact-history">${historyList || '<li>No stored history yet.</li>'}</ul></details>`;
}


function refreshTrendDropdowns(){
  const rows = activeTrendRows();
  const category = $('#betCategoryFilter')?.value || 'Win Trend';
  populateSelect('#sportFilter', SPORT_OPTIONS, {preserve:true});
  populateSelect('#betCategoryFilter', BET_CATEGORY_OPTIONS, {preserve:true});
  populateSelect('#winStyleFilter', WIN_TREND_STYLES.filter(v=>rows.some(r=>rowCategory(r)==='Win Trend' && normalizeStyleKey(r.style)===v)), {preserve:true});
  populateSelect('#mlEnvironmentFilter', ML_ENVIRONMENTS.filter(v=>rows.some(r=>rowCategory(r)==='Win Trend Hit Rate' && r.situation===v)), {preserve:true});
  populateSelect('#propEnvironmentFilter', PROP_ENVIRONMENTS.filter(v=>rows.some(r=>rowCategory(r)==='Prop' && r.situation===v)), {preserve:true});
  populateSelect('#gameLogEnvironmentFilter', GAME_LOG_ENVIRONMENTS.filter(v=>rows.some(r=>rowCategory(r)==='Game Log Trend' && gameLogEnvironment(r)===v)), {preserve:true});
  renderGameLogStyleChecks(rows);
  const dataList = $('#propTeamSuggestions');
  if(dataList){
    const teams = todaysTeamAbbrs().length ? todaysTeamAbbrs() : uniq(rows.filter(r=>rowCategory(r)==='Prop').map(r=>r.team));
    dataList.innerHTML = teams.map(t=>`<option value="${t}">${ABBR_TO_TEAM_NAME[t] || t}</option>`).join('');
  }
  updatePropEnvironmentNote();
  $$('.category-filter-block').forEach(el=>el.classList.add('hidden'));
  if(category === 'Win Trend') $('#winTrendBlock')?.classList.remove('hidden');
  if(category === 'Win Trend Hit Rate') $('#mlTrendBlock')?.classList.remove('hidden');
  if(category === 'Prop') $('#propTrendBlock')?.classList.remove('hidden');
  if(category === 'Game Log Trend') $('#gameLogTrendBlock')?.classList.remove('hidden');
}
function initFilters(){
  refreshTrendDropdowns();
  populateSelect('#pickStatusFilter', ['ACTIVE','WIN','LOSS','PUSH','UNVERIFIED','TOP PLAY','PLAYABLE','MONITOR','FADE','DISQUALIFIED']);
  populateSelect('#pickSlateFilter', uniq(coreDailyPicks.map(p=>p.slate)));
  ['#sportFilter','#betCategoryFilter','#winStyleFilter','#mlEnvironmentFilter','#propTeamSearch','#propEnvironmentFilter','#gameLogEnvironmentFilter','#hitFilter','#trendSearch'].forEach(id=>$(id)?.addEventListener('input',renderTrends));
  ['#pickStatusFilter','#pickSlateFilter','#pickSearch'].forEach(id=>$(id)?.addEventListener('input',renderPicks));
  $('#clearFilters')?.addEventListener('click',()=>{
    ['#betCategoryFilter','#winStyleFilter','#mlEnvironmentFilter','#propEnvironmentFilter','#gameLogEnvironmentFilter','#hitFilter'].forEach(id=>{if($(id)) $(id).value='all';});
    if($('#propTeamSearch')) $('#propTeamSearch').value='';
    if($('#sportFilter')) $('#sportFilter').value='MLB';
    if($('#betCategoryFilter')) $('#betCategoryFilter').value='Win Trend';
    if($('#trendSearch')) $('#trendSearch').value='';
    renderTrends();
  });
}
function renderTrends(){
  refreshTrendDropdowns();
  const sport=$('#sportFilter')?.value || 'MLB', category=$('#betCategoryFilter')?.value || 'Win Trend', winStyle=$('#winStyleFilter')?.value || 'all', mlEnv=$('#mlEnvironmentFilter')?.value || 'all', propTeamRaw=$('#propTeamSearch')?.value || '', propTeam=teamFromSearch(propTeamRaw), propEnv=$('#propEnvironmentFilter')?.value || 'all', gameLogEnv=$('#gameLogEnvironmentFilter')?.value || 'all', min=$('#hitFilter')?.value || 'all', q=($('#trendSearch')?.value || '').toLowerCase();
  let rows=activeTrendRows().filter(r=>sport==='MLB' && rowCategory(r)===category);
  if(category==='Win Trend' && winStyle!=='all') rows=rows.filter(r=>normalizeStyleKey(r.style)===winStyle);
  if(category==='Win Trend Hit Rate') rows=rows.filter(r=>(mlEnv==='all'||r.situation===mlEnv));
  if(category==='Prop'){
    if(propTeamRaw.trim()) rows=rows.filter(r=>r.team===propTeam);
    const detectedEnvs = propTeamRaw.trim() ? detectedPropEnvironments(propTeam) : [];
    if(propEnv!=='all') rows=rows.filter(r=>r.situation===propEnv);
    else if(detectedEnvs.length) rows=rows.filter(r=>detectedEnvs.includes(r.situation));
  }
  if(category==='Game Log Trend') rows=rows.filter(r=>!['ML','SPRD'].includes(normalizeStyleKey(r.style)));
  if(category==='Game Log Trend' && gameLogEnv!=='all') rows=rows.filter(r=>gameLogEnvironment(r)===gameLogEnv);
  if(min!=='all') rows=rows.filter(r=>hasHitRateEvidence(r) && (pct(r.hitRate)||0)>=Number(min));
  if(q) rows=rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q));
  rows = rows.sort((a,b)=>trendDateSortValue(b)-trendDateSortValue(a));
  const todayNote = todaysTeamAbbrs().length ? ` for ${todaysTeamAbbrs().length} teams on today's MLB slate` : ' using all stored MLB rows until live slate loads';
  $('#trendCount').textContent=`Showing ${rows.length} ${category} records${todayNote}`;
  if($('#importSummary') && typeof importSummary !== 'undefined') $('#importSummary').textContent = `${importSummary.version}: ${importSummary.importedRows} imported rows + ${importSummary.baseRows} base rows = ${importSummary.totalRows} total. ${importSummary.note}`;
  $('#trendTable').innerHTML=`<table><thead><tr><th>Date</th><th>Team</th><th>Data Type</th><th>Environment / Auto Tags</th><th>Description<br><small>Opponent / Location</small></th><th>Hit Rate / Status</th><th>Win/Loss Evidence</th><th>Notes</th></tr></thead><tbody>${rows.map(r=>`<tr class="${rowCategory(r)==='Game Log Trend'?'game-log-row':''}"><td>${formatTrendDate(r.date)}</td><td>${r.team}<br>${liveMatchupForTeam(r.team)}</td><td><strong>${rowCategory(r)}</strong><br><small>${evidenceStatus(r)}</small></td><td>${rowCategory(r)==='Game Log Trend' ? `<b>${gameLogEnvironment(r) || r.situation || '-'}</b><br>${gameLogStyleSummary(r)}` : (category==='Win Trend Hit Rate'||category==='Prop'?r.situation:trendDisplayStyle(r.style))}</td><td>${opponentLocationDescription(r)}</td><td>${trendHitRateCell(r)}</td><td>${resultEvidenceCell(r, rows)}</td><td>${r.notes}</td></tr>`).join('')}</tbody></table>`;
}
function liveMatchupForTeam(team){
  const g = liveState.games.find(game => [teamAbbr(game.away_team_abbr || game.away_team), teamAbbr(game.home_team_abbr || game.home_team)].includes(team));
  if(!g) return '<small>No live slate match</small>';
  const away = teamAbbr(g.away_team_abbr || g.away_team);
  const home = teamAbbr(g.home_team_abbr || g.home_team);
  const awayPitcher = g.away_pitcher || g.awayPitcher || 'TBD';
  const homePitcher = g.home_pitcher || g.homePitcher || 'TBD';
  return `<small>${away} @ ${home}<br>${awayPitcher} vs ${homePitcher}</small>`;
}

function parseSlateDate(slate){
  const d = new Date(String(slate||'').replace(',', ''));
  return Number.isFinite(d.getTime()) ? d : null;
}
function dateKey(d){
  return d ? d.toISOString().slice(0,10) : '0000-00-00';
}
function latestPickDateKey(){
  const keys = coreDailyPicks.map(p=>dateKey(parseSlateDate(p.slate))).filter(k=>k!=='0000-00-00').sort();
  return keys[keys.length-1] || dateKey(new Date());
}

// V19: Truth-first auto grading layer.
// Only grades completed full-game markets where a verified final score/series result exists.
// F5 and player props require inning/prop box-score feeds and are intentionally excluded unless verified.
const VERIFIED_FINAL_RESULTS = [
  {date:'2026-06-13',away:'STL',home:'MIN',awayScore:9,homeScore:6},{date:'2026-06-13',away:'NYY',home:'TOR',awayScore:3,homeScore:1},{date:'2026-06-13',away:'SEA',home:'WSH',awayScore:3,homeScore:8},{date:'2026-06-13',away:'SD',home:'BAL',awayScore:9,homeScore:3},{date:'2026-06-13',away:'MIA',home:'PIT',awayScore:2,homeScore:3},{date:'2026-06-13',away:'TEX',home:'BOS',awayScore:3,homeScore:6},{date:'2026-06-13',away:'ATL',home:'NYM',awayScore:3,homeScore:1},{date:'2026-06-13',away:'DET',home:'CLE',awayScore:1,homeScore:3},{date:'2026-06-13',away:'CHC',home:'SF',awayScore:6,homeScore:1},{date:'2026-06-13',away:'TB',home:'LAA',awayScore:0,homeScore:8},
  {date:'2026-06-14',away:'MIA',home:'PIT',awayScore:4,homeScore:2},{date:'2026-06-14',away:'SD',home:'BAL',awayScore:5,homeScore:2},{date:'2026-06-14',away:'SEA',home:'WSH',awayScore:1,homeScore:10},{date:'2026-06-14',away:'NYY',home:'TOR',awayScore:8,homeScore:3},{date:'2026-06-14',away:'ATL',home:'NYM',awayScore:1,homeScore:8},{date:'2026-06-14',away:'PHI',home:'MIL',awayScore:0,homeScore:4},{date:'2026-06-14',away:'CHC',home:'SF',awayScore:1,homeScore:5},{date:'2026-06-14',away:'TB',home:'LAA',awayScore:8,homeScore:3},{date:'2026-06-14',away:'TEX',home:'BOS',awayScore:6,homeScore:4},
  {date:'2026-06-15',away:'MIA',home:'PHI',awayScore:0,homeScore:7},{date:'2026-06-15',away:'KC',home:'WSH',awayScore:3,homeScore:7},{date:'2026-06-15',away:'NYM',home:'CIN',awayScore:0,homeScore:12},{date:'2026-06-15',away:'SD',home:'STL',awayScore:0,homeScore:3},{date:'2026-06-15',away:'MIN',home:'TEX',awayScore:4,homeScore:2},{date:'2026-06-15',away:'PIT',home:'ATH',awayScore:2,homeScore:11},{date:'2026-06-15',away:'TB',home:'LAD',awayScore:3,homeScore:4},
  {date:'2026-06-16',away:'MIA',home:'PHI',awayScore:2,homeScore:8},{date:'2026-06-16',away:'KC',home:'WSH',awayScore:4,homeScore:6},{date:'2026-06-16',away:'CWS',home:'NYY',awayScore:2,homeScore:12},{date:'2026-06-16',away:'NYM',home:'CIN',awayScore:3,homeScore:5},{date:'2026-06-16',away:'CLE',home:'MIL',awayScore:1,homeScore:2},{date:'2026-06-16',away:'SD',home:'STL',awayScore:2,homeScore:3},{date:'2026-06-16',away:'MIN',home:'TEX',awayScore:12,homeScore:2},{date:'2026-06-16',away:'PIT',home:'ATH',awayScore:6,homeScore:5},{date:'2026-06-16',away:'TB',home:'LAD',awayScore:0,homeScore:1},{date:'2026-06-16',away:'BAL',home:'SEA',awayScore:1,homeScore:3},
  {date:'2026-06-17',away:'NYM',home:'CIN',awayScore:9,homeScore:1},{date:'2026-06-17',away:'MIA',home:'PHI',awayScore:12,homeScore:4},{date:'2026-06-17',away:'KC',home:'WSH',awayScore:6,homeScore:2},{date:'2026-06-17',away:'SF',home:'ATL',awayScore:7,homeScore:2},{date:'2026-06-17',away:'DET',home:'HOU',awayScore:2,homeScore:4},{date:'2026-06-17',away:'SD',home:'STL',awayScore:6,homeScore:1},{date:'2026-06-17',away:'TB',home:'LAD',awayScore:4,homeScore:5},{date:'2026-06-17',away:'CWS',home:'NYY',awayScore:5,homeScore:10},{date:'2026-06-17',away:'SF',home:'ATL',awayScore:7,homeScore:5},{date:'2026-06-17',away:'CLE',home:'MIL',awayScore:4,homeScore:9},{date:'2026-06-17',away:'BAL',home:'SEA',awayScore:5,homeScore:3},
  {date:'2026-06-18',away:'CLE',home:'MIL',awayScore:4,homeScore:2},{date:'2026-06-18',away:'MIN',home:'TEX',awayScore:9,homeScore:3},{date:'2026-06-18',away:'BAL',home:'SEA',awayScore:0,homeScore:3},{date:'2026-06-18',away:'NYM',home:'PHI',awayScore:6,homeScore:4},{date:'2026-06-18',away:'CWS',home:'NYY',awayScore:5,homeScore:1},{date:'2026-06-18',away:'STL',home:'KC',awayScore:6,homeScore:14},
  {date:'2026-06-19',away:'TOR',home:'CHC',awayScore:2,homeScore:16},{date:'2026-06-19',away:'CWS',home:'DET',awayScore:3,homeScore:4},{date:'2026-06-19',away:'CIN',home:'NYY',awayScore:0,homeScore:5},{date:'2026-06-19',away:'WSH',home:'TB',awayScore:2,homeScore:5},{date:'2026-06-19',away:'MIL',home:'ATL',awayScore:2,homeScore:3},{date:'2026-06-19',away:'SD',home:'TEX',awayScore:7,homeScore:9},{date:'2026-06-19',away:'CLE',home:'HOU',awayScore:3,homeScore:9},{date:'2026-06-19',away:'STL',home:'KC',awayScore:5,homeScore:6},{date:'2026-06-19',away:'PIT',home:'COL',awayScore:3,homeScore:4},{date:'2026-06-19',away:'MIN',home:'ARI',awayScore:5,homeScore:9},{date:'2026-06-19',away:'BOS',home:'SEA',awayScore:6,homeScore:2},{date:'2026-06-19',away:'BAL',home:'LAD',awayScore:5,homeScore:6},
  {date:'2026-06-20',away:'CWS',home:'DET',awayScore:1,homeScore:4},{date:'2026-06-20',away:'CIN',home:'NYY',awayScore:10,homeScore:2},{date:'2026-06-20',away:'TOR',home:'CHC',awayScore:8,homeScore:6},{date:'2026-06-20',away:'SD',home:'TEX',awayScore:6,homeScore:4},{date:'2026-06-20',away:'MIL',home:'ATL',awayScore:3,homeScore:4},{date:'2026-06-20',away:'WSH',home:'TB',awayScore:4,homeScore:3},{date:'2026-06-20',away:'MIA',home:'SF',awayScore:6,homeScore:3},{date:'2026-06-20',away:'CLE',home:'HOU',awayScore:8,homeScore:1},{date:'2026-06-20',away:'NYM',home:'PHI',awayScore:3,homeScore:15},{date:'2026-06-20',away:'BOS',home:'SEA',awayScore:5,homeScore:1},{date:'2026-06-20',away:'BAL',home:'LAD',awayScore:3,homeScore:2},
  {date:'2026-06-21',away:'MIL',home:'ATL',awayScore:9,homeScore:4},{date:'2026-06-21',away:'CIN',home:'NYY',awayScore:4,homeScore:1},{date:'2026-06-21',away:'WSH',home:'TB',awayScore:3,homeScore:4},{date:'2026-06-21',away:'CWS',home:'DET',awayScore:4,homeScore:5},{date:'2026-06-21',away:'CLE',home:'HOU',awayScore:1,homeScore:2},{date:'2026-06-21',away:'STL',home:'KC',awayScore:12,homeScore:10},{date:'2026-06-21',away:'SD',home:'TEX',awayScore:3,homeScore:4},{date:'2026-06-21',away:'MIN',home:'ARI',awayScore:4,homeScore:2},{date:'2026-06-21',away:'BOS',home:'SEA',awayScore:1,homeScore:3},{date:'2026-06-21',away:'BAL',home:'LAD',awayScore:12,homeScore:1},{date:'2026-06-21',away:'NYM',home:'PHI',awayScore:2,homeScore:6},
  {date:'2026-06-22',away:'NYY',home:'DET',awayScore:3,homeScore:5},{date:'2026-06-22',away:'TEX',home:'MIA',awayScore:4,homeScore:3},{date:'2026-06-22',away:'KC',home:'TB',awayScore:2,homeScore:1},{date:'2026-06-22',away:'PHI',home:'WSH',awayScore:1,homeScore:4},{date:'2026-06-22',away:'HOU',home:'TOR',awayScore:2,homeScore:4},{date:'2026-06-22',away:'MIL',home:'CIN',awayScore:2,homeScore:1},{date:'2026-06-22',away:'LAD',home:'MIN',awayScore:2,homeScore:1},{date:'2026-06-22',away:'CLE',home:'CWS',awayScore:5,homeScore:6},{date:'2026-06-22',away:'ARI',home:'STL',awayScore:2,homeScore:3},{date:'2026-06-22',away:'BOS',home:'COL',awayScore:2,homeScore:3},{date:'2026-06-22',away:'BAL',home:'LAA',awayScore:6,homeScore:1},{date:'2026-06-22',away:'ATL',home:'SD',awayScore:0,homeScore:1}
];
const VERIFIED_SERIES_RESULTS = [
  {start:'2026-06-19', team:'CWS', result:'LOSS', note:'Verified: DET won the Jun 19-21 series 3-0.'},
  {start:'2026-06-19', team:'SD', result:'LOSS', note:'Verified: TEX won the Jun 19-21 series 2-1.'},
  {start:'2026-06-19', team:'MIN', result:'WIN', note:'Verified: MIN won the Jun 19-21 series 2-1 at Arizona.'}
];
const VERIFIED_F5_RESULTS = [
  {date:'2026-06-22', team:'TB', result:'LOSS', note:'Verified first-five score: KC led TB 2-1 after five innings, so TB F5 -0.5 lost.'},
  {date:'2026-06-22', team:'MIL', result:'LOSS', note:'Verified first-five score: MIL-CIN was 0-0 after five innings, so MIL F5 -0.5 lost.'},
  {date:'2026-06-22', team:'CHC', result:'NO_ACTION', note:'Cubs-Mets was postponed/made up later; no action for 06/22 picks.'},
  {date:'2026-06-22', team:'NYM', result:'NO_ACTION', note:'Cubs-Mets was postponed/made up later; no action for 06/22 picks.'}
];
const VERIFIED_NO_ACTION_RESULTS = [
  {date:'2026-06-22', team:'CHC', note:'Cubs-Mets was postponed/made up later; no action for 06/22 picks.'},
  {date:'2026-06-22', team:'NYM', note:'Cubs-Mets was postponed/made up later; no action for 06/22 picks.'}
];

function finalGamesForDate(date){return VERIFIED_FINAL_RESULTS.filter(g=>g.date===date);}
function gameByTeams(date,a,b){
  const aa=teamAbbr(a), bb=teamAbbr(b);
  return finalGamesForDate(date).find(g=>[g.away,g.home].includes(aa)&&[g.away,g.home].includes(bb));
}
function gameForPickedTeam(date,team){
  const t=teamAbbr(team);
  return finalGamesForDate(date).find(g=>g.away===t||g.home===t);
}
function scoreForTeam(g,t){t=teamAbbr(t); return g.away===t ? g.awayScore : g.home===t ? g.homeScore : null;}
function opponentScoreForTeam(g,t){t=teamAbbr(t); return g.away===t ? g.homeScore : g.home===t ? g.awayScore : null;}
function cleanPickText(p){return String(p.pick||'').replace(/_/g,' ').replace(/\*/g,'').replace(/;/g,' ; ').replace(/\s+/g,' ').trim();}
function firstTeamToken(txt){
  const token = (txt.match(/^([A-Za-z'\.]+)\b/)||[])[1] || '';
  return teamFromSearch(token) || teamAbbr(token);
}
function parseTotalPick(txt){
  const m = txt.match(/^([A-Za-z'\.]+)\s*\/\s*([A-Za-z'\.]+)\s+([ou])\s*([0-9]+(?:\.[0-9])?)/i);
  if(!m) return null;
  return {a:teamFromSearch(m[1])||teamAbbr(m[1]), b:teamFromSearch(m[2])||teamAbbr(m[2]), side:m[3].toUpperCase(), line:Number(m[4])};
}
function parseMoneylinePick(txt){
  const m = txt.match(/^([A-Za-z'\.]+)\s+ml\b/i);
  if(!m) return null;
  return teamFromSearch(m[1]) || teamAbbr(m[1]);
}
function parseFullGameHalfRunPick(txt){
  if(/^f5\b/i.test(txt)) return null;
  const m = txt.match(/^([A-Za-z'\.]+)\s+([+-])\.?5\b/i);
  if(!m) return null;
  return {team:teamFromSearch(m[1])||teamAbbr(m[1]), line:m[2]==='+'?0.5:-0.5};
}
function verifiedAutoGrade(p){
  const date=dateKey(parseSlateDate(p.slate));
  const txt=cleanPickText(p);
  if(!date || date==='0000-00-00') return null;
  if(/^f5\b/i.test(txt)) {
    const m = txt.match(/^f5\s+([A-Za-z'\.]+)\s+/i);
    const team = m ? (teamFromSearch(m[1]) || teamAbbr(m[1])) : firstTeamToken(txt.replace(/^f5\s+/i,''));
    const f5 = VERIFIED_F5_RESULTS.find(x=>x.date===date && x.team===team);
    if(f5) return {status:f5.result, reason:f5.note};
    return {status:'UNVERIFIED', reason:'F5 play requires inning-by-inning first-five linescore verification.'};
  }
  const total=parseTotalPick(txt);
  if(total){
    const g=gameByTeams(date,total.a,total.b);
    if(!g) return {status:'UNVERIFIED', reason:'No verified final score found for this total.'};
    const runs=g.awayScore+g.homeScore;
    if(runs===total.line) return {status:'PUSH', reason:`Verified final ${g.away} ${g.awayScore}, ${g.home} ${g.homeScore}; total ${runs} pushed ${total.line}.`};
    const win = total.side==='O' ? runs>total.line : runs<total.line;
    return {status:win?'WIN':'LOSS', reason:`Verified final ${g.away} ${g.awayScore}, ${g.home} ${g.homeScore}; total runs ${runs} ${win?'beat':'did not beat'} ${total.side}${total.line}.`};
  }
  const ml=parseMoneylinePick(txt);
  if(ml){
    const g=gameForPickedTeam(date,ml);
    if(!g) {
      const noAction = VERIFIED_NO_ACTION_RESULTS.find(x=>x.date===date && x.team===ml);
      if(noAction) return {status:'NO_ACTION', reason:noAction.note};
      return {status:'UNVERIFIED', reason:'No verified final score found for this moneyline.'};
    }
    const scored=scoreForTeam(g,ml), allowed=opponentScoreForTeam(g,ml);
    const win=scored>allowed;
    return {status:win?'WIN':'LOSS', reason:`Verified final ${g.away} ${g.awayScore}, ${g.home} ${g.homeScore}; ${ml} ${win?'won':'lost'} the game.`};
  }
  const spread=parseFullGameHalfRunPick(txt);
  if(spread){
    const g=gameForPickedTeam(date,spread.team);
    if(!g) return {status:'UNVERIFIED', reason:'No verified final score found for this full-game ±0.5 pick.'};
    const margin=scoreForTeam(g,spread.team)-opponentScoreForTeam(g,spread.team);
    const win=margin+spread.line>0;
    return {status:win?'WIN':'LOSS', reason:`Verified final ${g.away} ${g.awayScore}, ${g.home} ${g.homeScore}; ${spread.team} margin ${margin}, line ${spread.line>0?'+0.5':'-0.5'}.`};
  }
  if(/series/i.test(txt)){
    const team=firstTeamToken(txt);
    const s=VERIFIED_SERIES_RESULTS.find(x=>x.start===date && x.team===team);
    if(s) return {status:s.result, reason:s.note};
    return {status:'UNVERIFIED', reason:'Series result is not yet in the verified series-results table.'};
  }
  return {status:'UNVERIFIED', reason:'Market type not safely auto-gradable from final score alone.'};
}
/* Legacy verifiedStatusForPick implementation removed during clean sweep. */

/* Legacy verificationNoteForPick implementation removed during clean sweep. */


function normalizedPickStatus(p){
  const verified = verifiedStatusForPick(p);
  if(verified) return verified;
  const raw = String(p.status || '').toUpperCase();
  if(['TOP PLAY','PLAYABLE','MONITOR','FADE','DISQUALIFIED'].includes(raw)) return raw;
  const key = dateKey(parseSlateDate(p.slate));
  const latest = latestPickDateKey();
  if((raw === 'LIVE' || raw === 'PENDING') && key === latest) return 'ACTIVE';
  if(raw === 'LIVE' || raw === 'PENDING') return 'UNVERIFIED';
  return raw || 'UNVERIFIED';
}
/* Legacy statusDisplayName implementation removed during clean sweep. */

/* Legacy statusDisplayIcon implementation removed during clean sweep. */

/* Legacy pickScoreDisplay implementation removed during clean sweep. */

function unitsValue(p){
  const raw = String(p.units || '').replace(/[Uu]/g,'').trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function oddsValue(p){
  const n = parseInt(String(p.odds || '').replace(/[^+\-\d]/g,''),10);
  return Number.isFinite(n) ? n : null;
}
function profitUnits(p){
  const st = normalizedPickStatus(p);
  const u = unitsValue(p);
  const o = oddsValue(p);
  if(!u) return 0;
  if(st === 'LOSS') return -u;
  if(st !== 'WIN') return 0;
  if(o === null) return u;
  return o > 0 ? u * (o / 100) : u * (100 / Math.abs(o));
}
function pickCategory(p){
  const t = `${p.pick || ''} ${p.edge || ''} ${p.rank || ''}`.toLowerCase();
  if(t.includes('series')) return 'Series';
  if(t.includes('f5')) return 'F5';
  if(t.includes('parlay') || /\bpar\b/.test(t)) return 'Parlay';
  if(t.includes('prop') || /\bk\'?s\b/.test(t) || t.includes('strikeout')) return 'Props';
  if(t.includes('spread') || /[+-]1\.5/.test(t) || /\bsprd\b/.test(t)) return 'Spread';
  if(t.includes(' over ') || t.includes(' under ') || /\bo\s*\d/.test(t) || /\bu\s*\d/.test(t)) return 'Totals';
  if(t.includes(' ml') || /\bml\b/.test(t)) return 'Moneyline';
  return 'Unclassified';
}
function pickRecord(picks){
  const wins = picks.filter(p=>normalizedPickStatus(p)==='WIN').length;
  const losses = picks.filter(p=>normalizedPickStatus(p)==='LOSS').length;
  return {wins, losses, total:wins+losses};
}
function formatUnits(n){
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}U`;
}

function explicitUnitSize(p){
  const raw = String(p.units || '').trim();
  if(!raw) return false;
  if(/default/i.test(raw)) return false;
  const n = parseFloat(raw.replace(/[Uu]/g,''));
  return Number.isFinite(n) && n > 0;
}
function isOfficialPlay(p){return explicitUnitSize(p);}
function isResearchPlay(p){return !isOfficialPlay(p);}
function latestSlateLabel(){
  const latest = latestPickDateKey();
  const found = coreDailyPicks.find(p=>dateKey(parseSlateDate(p.slate))===latest);
  return found?.slate || 'Latest Slate';
}
function latestSlatePicks(){
  const latest = latestPickDateKey();
  return coreDailyPicks.filter(p=>dateKey(parseSlateDate(p.slate))===latest);
}
function bettorCategory(p){
  const t = `${p.pick || ''} ${p.edge || ''}`.toLowerCase();
  if(t.includes('series')) return 'Series';
  if(t.includes('f5')) return 'First Five';
  if(t.includes(' under ') || /\bu\s*\d/.test(t)) return 'Under';
  if(t.includes(' over ') || /\bo\s*\d/.test(t)) return 'Over';
  if(t.includes(' ml') || /\bml\b/.test(t)) return 'Moneyline';
  const cat = pickCategory(p);
  return cat === 'Unclassified' ? 'Unclassified' : cat;
}
const BETTOR_CATEGORY_ORDER = ['First Five','Moneyline','Over','Under','Series','Totals','Spread','Props','Parlay'];
function categorySort(a,b){
  const ai = BETTOR_CATEGORY_ORDER.indexOf(a);
  const bi = BETTOR_CATEGORY_ORDER.indexOf(b);
  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
}
function isClassifiedPick(p){ return bettorCategory(p) !== 'Unclassified' && pickCategory(p) !== 'Unclassified'; }
function groupPicksByBettorCategory(picks){
  const grouped = {};
  picks.filter(isClassifiedPick).forEach(p=>{ const cat = bettorCategory(p); (grouped[cat] ||= []).push(p); });
  return Object.entries(grouped).sort((a,b)=>categorySort(a[0],b[0]));
}
function compactWhy(p){
  const why = Array.isArray(p.why) ? p.why.filter(Boolean).slice(0,3) : [];
  if(why.length) return why;
  const edge = String(p.edge||'').trim();
  if(edge) return [edge];
  return ['Tracked by Sports Edge for today’s slate.'];
}
const TEAM_NICKNAME_TO_ABBR = {
  yankees:'NYY', tigers:'DET', rays:'TB', royals:'KC', marlins:'MIA', brewers:'MIL', cubs:'CHC', mets:'NYM', guardians:'CLE', dodgers:'LAD', twins:'MIN', cardinals:'STL', astros:'HOU', bluejays:'TOR', 'blue jays':'TOR', reds:'CIN', whitesox:'CWS', 'white sox':'CWS', padres:'SD', braves:'ATL', mariners:'SEA', pirates:'PIT', phillies:'PHI', giants:'SF', athletics:"A's", angels:'LAA', orioles:'BAL', rangers:'TEX', rockies:'COL', diamondbacks:'ARI', nationals:'WSH'
};
function teamsFromPickText(text){
  const raw = String(text||'');
  const lower = raw.toLowerCase().replace(/[^a-z0-9' ]/g,' ');
  const found = new Set();
  Object.values(TEAM_NAME_TO_ABBR).forEach(abbr=>{
    const safe = String(abbr).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    if(new RegExp(`(^|[^A-Z])${safe}([^A-Z]|$)`).test(raw.toUpperCase())) found.add(abbr);
  });
  Object.entries(TEAM_NAME_TO_ABBR).forEach(([name,abbr])=>{ if(lower.includes(name.toLowerCase())) found.add(abbr); });
  Object.entries(TEAM_NICKNAME_TO_ABBR).forEach(([nick,abbr])=>{ if(lower.includes(nick)) found.add(abbr); });
  return [...found];
}

function opponentSpecificTeamsFromPick(p){
  const teams = teamsFromPickText(p.pick);
  if(teams.length >= 2) return {teams: teams.slice(0,2), opponents: Object.fromEntries(teams.slice(0,2).map(t=>[t, teams.slice(0,2).find(o=>o!==t)]))};
  return {teams, opponents: {}};
}

const PICK_MATCHUP_CONTEXT = {
  'NYY / DET U8': {away:'NYY', home:'DET', label:'NYY @ DET'},
  'NYY ML': {away:'NYY', home:'DET', label:'NYY @ DET'},
  'F5 TB -0.5': {away:'KC', home:'TB', label:'KC @ TB'},
  'KC / TB U7.5': {away:'KC', home:'TB', label:'KC @ TB'},
  'F5 MIL -0.5': {away:'MIL', home:'CIN', label:'MIL @ CIN'},
  'F5 CHC -0.5': {away:'CHC', home:'NYM', label:'CHC @ NYM'},
  'NYM ML': {away:'CHC', home:'NYM', label:'CHC @ NYM'},
  'CLE ML': {away:'CWS', home:'CLE', label:'CWS @ CLE'},
  'LAD / MIN O9.5': {away:'LAD', home:'MIN', label:'LAD @ MIN'},
  'Astros Series ML': {away:'HOU', home:'TOR', label:'HOU vs TOR series'},
  'Twins Series ML': {away:'LAD', home:'MIN', label:'LAD vs MIN series'},
  'Guardians Series ML': {away:'CWS', home:'CLE', label:'CWS vs CLE series'},
  'Reds Series ML': {away:'MIL', home:'CIN', label:'MIL vs CIN series'},
  'F5 DET +0.5': {away:'NYY', home:'DET', label:'NYY @ DET'},
  'F5 DET +.5': {away:'NYY', home:'DET', label:'NYY @ DET'},
  'MIL ML': {away:'MIL', home:'CIN', label:'MIL @ CIN'},
  'NYM ML': {away:'CHC', home:'NYM', label:'CHC @ NYM'},
  'ARI / STL U8.5': {away:'ARI', home:'STL', label:'ARI @ STL'},
  'ATL ML': {away:'ATL', home:'SD', label:'ATL @ SD'}
};
function cleanPickTitle(p){
  return String(p?.pick || '').replace(/\s+—\s+.+$/,'').trim();
}
function matchupContextForPick(p){
  if(p?.matchup){
    const label = String(p.matchup).trim();
    const parts = label.split(/\s+@\s+|\s+vs\.?\s+/i).map(x=>x.trim()).filter(Boolean);
    if(parts.length >= 2) return {away: parts[0], home: parts[1], label};
    return {away:'', home:'', label};
  }
  const key = cleanPickTitle(p);
  if(PICK_MATCHUP_CONTEXT[key]) return PICK_MATCHUP_CONTEXT[key];
  const teams = teamsFromPickText(p?.pick || '');
  if(teams.length >= 2) return {away: teams[0], home: teams[1], label: `${teams[0]} @ ${teams[1]}`};
  return null;
}
function matchupSubtitleHtml(p){
  const ctx = matchupContextForPick(p);
  if(!ctx) return '';
  return `<p class="matchup-subtitle">${ctx.label}</p>`;
}
function slateDateIso(p){
  const d = parseSlateDate(p?.slate || '');
  return d ? dateKey(d) : '';
}
function trendDateIso(value){
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : dateKey(d);
}
function propPitcherName(description){
  return String(description || '').replace(/\bO\s*/i,'').replace(/\s+\d+(?:\.5)?\s*k['’]?s?\b/i,'').trim();
}
function propRowsForOppToken(token, limit=6, environment=''){
  if(!token) return [];
  const clean = String(token).trim().toUpperCase();
  const desired = String(environment || '').trim().toUpperCase();
  return trendRows.filter(r=>{
    if(normalizeStyleKey(r.style)!=='PROP') return false;
    if(String(r.opponent||'').trim().toUpperCase()!==clean) return false;
    if(!desired) return true;
    const sit = String(r.situation || '').trim().toUpperCase();
    const base = desired.startsWith('HOME') ? 'HOME' : desired.startsWith('AWAY') ? 'AWAY' : desired;
    return sit === desired || sit === base;
  })
    .sort((a,b)=>{
      const as = String(a.situation||'').trim().toUpperCase() === desired ? 1 : 0;
      const bs = String(b.situation||'').trim().toUpperCase() === desired ? 1 : 0;
      if(as !== bs) return bs-as;
      return trendDateSortValue(b)-trendDateSortValue(a);
    })
    .slice(0,limit);
}
function targetTeamForPick(p){
  const title = cleanPickTitle(p).toUpperCase().replace('’', "'");
  const ctx = matchupContextForPick(p);
  if(!ctx) return '';
  const teams = [ctx.away, ctx.home].filter(Boolean);
  if(/\//.test(title) && !/^F5\s+/.test(title)) return '';
  const f5 = title.match(/^F5\s+([A-Z']+)/);
  if(f5){
    const raw = f5[1];
    return teams.find(t=>String(t).toUpperCase()===raw) || '';
  }
  const ml = title.match(/^([A-Z']+)\s+ML/);
  if(ml){
    const raw = ml[1];
    return teams.find(t=>String(t).toUpperCase()===raw) || '';
  }
  return '';
}

function targetIsFavorite(p){
  const title = cleanPickTitle(p).toUpperCase();
  if(/-\s*0?\.5|\s-0?\.5/.test(title)) return true;
  if(/\+\s*0?\.5|\s\+0?\.5/.test(title)) return false;
  const odds = oddsValue(p);
  if(odds !== null) return odds < 0;
  return null;
}
function currentEnvironmentForSide(p, side){
  const ctx = matchupContextForPick(p);
  if(!ctx) return '';
  const base = side === 'home' ? 'HOME' : 'AWAY';
  const target = targetTeamForPick(p);
  const fav = targetIsFavorite(p);
  if(!target || fav === null) return base;
  const sideTeam = side === 'home' ? ctx.home : ctx.away;
  const sideIsTarget = String(sideTeam).toUpperCase() === String(target).toUpperCase();
  const sideIsFav = sideIsTarget ? fav : !fav;
  return `${base} ${sideIsFav ? 'FAVORITE' : 'UNDERDOG'}`;
}
function opponentMatchesTrend(row, opponentAbbr){
  if(!opponentAbbr) return false;
  const raw = `${row.opponent || ''} ${row.notes || ''}`.toUpperCase();
  const opponentName = (ABBR_TO_TEAM_NAME[opponentAbbr] || '').toUpperCase();
  const nick = Object.entries(TEAM_NICKNAME_TO_ABBR).find(([,abbr])=>abbr===opponentAbbr)?.[0]?.toUpperCase() || '';
  const safeAbbr = String(opponentAbbr).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if(new RegExp(`(^|[^A-Z])${safeAbbr}([^A-Z]|$)`).test(raw)) return true;
  if(opponentName && raw.includes(opponentName)) return true;
  if(nick && raw.includes(nick)) return true;
  return false;
}
function strikeoutLineFromDescription(description){
  const raw = String(description || '');
  const match = raw.match(/(?:O\s*)?(\d+(?:\.5)?)\s*k['’]?s?/i);
  return match ? `K line: ${match[1]}` : 'K line not stored';
}
function propKAmount(description){
  const raw = String(description || '');
  const match = raw.match(/(?:O\s*)?(\d+(?:\.5)?)\s*k['’]?s?/i);
  return match ? `${match[1]} Ks` : '';
}

function trendEvidenceTypeForPick(p){
  const t = String(p.pick||'').toUpperCase();
  if(/\bML\b|SERIES/.test(t)) return 'ML';
  if(/\bU\s*\d|UNDER/.test(t)) return 'UNDER';
  if(/\bO\s*\d|OVER/.test(t)) return 'OVER';
  return '';
}
function explicitSituationTagsForPick(p){
  const raw = [p.edge, p.pick, ...(p.why||[])].join(' ').toUpperCase();
  const tags = [];
  ['AFTER A WIN','AFTER A LOSS','1-DAY REST','NO REST','AWAY UNDERDOG','AWAY FAVORITE','HOME UNDERDOG','HOME FAVORITE','DIVISION'].forEach(tag=>{
    if(raw.includes(tag)) tags.push(tag);
  });
  return tags;
}
function explicitGameLogTrendTagsForPick(p){
  const raw = [p.pick, p.edge, p.rank, ...(Array.isArray(p.why) ? p.why : [])].join(' ').toUpperCase();
  const tags = [];
  if(/PREVIOUSLY\s+SCORED\s+0|PREV[_\s-]*SCRD\s+0|PREV[_\s-]*SCORED\s+0/.test(raw)) tags.push('PREV_SCORED 0');
  if(/PREVIOUSLY\s+SCORED\s+10\+|PREV[_\s-]*SCRD\s+10\+|PREV[_\s-]*SCORED\s+10\+/.test(raw)) tags.push('PREV_SCORED 10+');
  if(/PREVIOUSLY\s+ALLOWED\s+0|ALLOWED\s+0|PREV[_\s-]*ALLOWED\s+0/.test(raw)) tags.push('PREV_ALLOWED 0');
  if(/PREVIOUSLY\s+ALLOWED\s+10\+|ALLOWED\s+10\+|PREV[_\s-]*ALLOWED\s+10\+/.test(raw)) tags.push('PREV_ALLOWED 10+');
  if(/\bSWEEP\b/.test(raw)) tags.push('SWEEP');
  if(/\bATS\b|\bAT S\b|\bAVOID\s+THE\s+SWEEP\b/.test(raw)) tags.push('AVOID SWEEP');
  return uniq(tags);
}
function consumerReasoningNotes(p){
  const blocked = [
    'TREND TAG PRESERVED FOR MATCHED EVIDENCE',
    'RESULT INTENTIONALLY LEFT UNVERIFIED',
    'UNLESS IT CAN BE GRADED WITH 100% CONFIDENCE'
  ];
  return (Array.isArray(p.why) ? p.why : []).filter(Boolean).filter(note=>{
    const upper = String(note).toUpperCase();
    return !blocked.some(x=>upper.includes(x));
  });
}
function trendEvidenceRecord(row){
  const wins = Array.isArray(row.winEvidence) ? row.winEvidence.length : 0;
  const losses = Array.isArray(row.lossEvidence) ? row.lossEvidence.length : 0;
  const total = wins + losses;
  const rate = total ? ((wins / total) * 100).toFixed(1) + '%' : null;
  return { wins, losses, total, rate };
}
/* Legacy trendEvidenceConfidence implementation removed during clean sweep. */

function trendEvidenceLabel(row){
  const rate = pct(row.hitRate);
  const rec = trendEvidenceRecord(row);
  const rateText = rate === null ? (rec.total ? `${rec.wins}-${rec.losses} game-log record` : 'Stored game-log match') : `${row.hitRate} hit rate`;
  const duration = row.duration && row.duration !== '-' ? ` • ${row.duration}` : '';
  const opponent = row.opponent && row.opponent !== '-' ? ` • ${row.opponent}` : '';
  const notes = row.notes && row.notes !== '-' ? ` • ${row.notes}` : '';
  return `${rateText}${duration}${opponent}${notes}`;
}
function normalizedPickResearchText(p){
  return [p.pick, p.edge, p.rank, ...(Array.isArray(p.why) ? p.why : [])].join(' ').toUpperCase();
}
function trendMarketCandidatesForPick(p){
  const title = cleanPickTitle(p).toUpperCase();
  if(/\bU\s*\d|\bUNDER\b/.test(title)) return ['UNDER'];
  if(/\bO\s*\d|\bOVER\b/.test(title)) return ['OVER'];
  if(/^F5\s+/.test(title) && /[+-]\s*0?\.5/.test(title)) return ['SPRD','ML'];
  if(/\bML\b|\bSERIES\b/.test(title)) return ['ML'];
  if(/[+-]\s*1?\.5/.test(title)) return ['SPRD'];
  return [];
}
function evidenceTeamsForPick(p){
  const found = teamsFromPickText(p.pick || '');
  const target = targetTeamForPick(p);
  const ctx = matchupContextForPick(p);
  return uniq([...found, target, ctx?.away, ctx?.home].filter(Boolean).map(x=>String(x).toUpperCase()));
}
function derivedEnvironmentTagsForPick(p){
  const tags = new Set(explicitSituationTagsForPick(p));
  const target = targetTeamForPick(p);
  const ctx = matchupContextForPick(p);
  const fav = targetIsFavorite(p);
  if(target && ctx){
    const role = String(target).toUpperCase() === String(ctx.home).toUpperCase() ? 'HOME' : 'AWAY';
    tags.add(role);
    if(fav !== null) tags.add(`${role} ${fav ? 'FAVORITE' : 'UNDERDOG'}`);
  }
  return [...tags];
}
function trendMatchScore(row, p){
  const teams = evidenceTeamsForPick(p);
  const rowTeam = String(row.team || '').toUpperCase();
  if(!teams.includes(rowTeam)) return null;

  const style = normalizeStyleKey(row.style);
  const markets = trendMarketCandidatesForPick(p);
  const explicitLogs = explicitGameLogTrendTagsForPick(p);
  const environments = derivedEnvironmentTagsForPick(p);
  const situation = String(row.situation || '').toUpperCase();
  const notes = String(row.notes || '').toUpperCase();
  const ctx = matchupContextForPick(p);
  const target = targetTeamForPick(p);
  const opponent = target && ctx ? (String(target).toUpperCase() === String(ctx.home).toUpperCase() ? ctx.away : ctx.home) : '';

  let score = 30;
  const reasons = [`Same team: ${rowTeam}`];

  if(markets.includes(style)){
    score += 25;
    reasons.push(`Same market: ${trendDisplayStyle(style)}`);
  } else if(markets.includes('SPRD') && style === 'ML'){
    score += 16;
    reasons.push('Related team-side market');
  } else if(explicitLogs.includes(style)){
    score += 25;
    reasons.push(`Exact game-log tag: ${trendDisplayStyle(style)}`);
  } else {
    return null;
  }

  if(explicitLogs.includes(style)){
    score += 20;
    reasons.push('Exact stated trend condition');
  }

  const exactEnvironment = environments.find(tag=>situation.includes(tag) || notes.includes(tag));
  if(exactEnvironment){
    score += 18;
    reasons.push(`Environment: ${exactEnvironment}`);
  } else {
    const role = environments.find(tag=>tag === 'HOME' || tag === 'AWAY' || tag.startsWith('HOME ') || tag.startsWith('AWAY '));
    if(role){
      const base = role.startsWith('HOME') ? 'HOME' : 'AWAY';
      if(situation.includes(base) || notes.includes(base)){
        score += 8;
        reasons.push(`Same ${base.toLowerCase()} role`);
      }
    }
  }

  if(opponent && opponentMatchesTrend(row, String(opponent).toUpperCase())){
    score += 12;
    reasons.push(`Same opponent: ${String(opponent).toUpperCase()}`);
  }

  const rec = trendEvidenceRecord(row);
  const rate = pct(row.hitRate);
  if(rec.total >= 10 || (rate !== null && row.duration && row.duration !== '-')) score += 4;
  else if(rec.total >= 5) score += 2;

  const tier = score >= 85 ? 'Exact Environment Match' : score >= 70 ? 'Strong Environment Match' : 'Relevant Team / Market Match';
  return {score, reasons, tier, opponent, environments, markets};
}
function trendRowQualifiesForPick(row, p){
  const match = trendMatchScore(row, p);
  return Boolean(match && match.score >= 50);
}
function computedLedgerEvidenceForPick(p, limit=8){
  const engine = window.SportsEdgeIntelligence;
  if(!engine || typeof engine.matchPick !== 'function') return [];
  return engine.matchPick(p, limit).map(e=>({
    team:e.team || targetTeamForPick(p) || 'TEAM',
    style:e.market === 'MONEYLINE' ? 'ML' : e.market === 'SPREAD' ? 'SPRD' : e.market === 'TOTAL' ? (/\bU\s*\d|UNDER/i.test(String(p.pick||'')) ? 'UNDER' : 'OVER') : e.market,
    situation:e.matchTier,
    date:e.supportingObservations[0]?.date || '-',
    opponent:e.supportingObservations[0]?.opponent || '-',
    notes:`Calculated automatically from ${e.decisions} permanently graded ledger decisions. ROI ${e.roi == null ? 'pending' : e.roi.toFixed(1)+'%'}. Confidence ${e.confidence}.`,
    hitRate:e.hitRate == null ? null : e.hitRate.toFixed(1)+'%',
    duration:`${e.decisions} decisions`,
    winEvidence:e.supportingObservations.filter(x=>x.result==='WIN').map(x=>`${x.date} • ${x.team} • ${x.market} • ${x.odds ?? 'odds n/a'}`),
    lossEvidence:e.supportingObservations.filter(x=>x.result==='LOSS').map(x=>`${x.date} • ${x.team} • ${x.market} • ${x.odds ?? 'odds n/a'}`),
    normalizedStyle:e.market,
    hitRateNumber:e.hitRate,
    matchScore:e.matchScore,
    matchReasons:e.matchReasons,
    matchTier:e.matchTier,
    evidenceId:e.evidenceId,
    computedFromLedger:true
  }));
}
function matchedTrendEvidenceForPick(p, limit=8){
  const computed = computedLedgerEvidenceForPick(p, limit);
  const rows = trendRows.map(r=>{
    const match = trendMatchScore(r, p);
    return match ? {
      ...r,
      normalizedStyle: normalizeStyleKey(r.style),
      hitRateNumber: pct(r.hitRate),
      matchScore: match.score,
      matchReasons: match.reasons,
      matchTier: match.tier,
      matchedOpponent: match.opponent
    } : null;
  }).filter(Boolean).filter(r=>r.matchScore >= 50);

  const imported = rows.sort((a,b)=>{
    if(a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
    const aSample = trendEvidenceRecord(a).total;
    const bSample = trendEvidenceRecord(b).total;
    if(aSample !== bSample) return bSample - aSample;
    const ap = a.hitRateNumber ?? -1;
    const bp = b.hitRateNumber ?? -1;
    if(ap !== bp) return bp - ap;
    return trendDateSortValue(b)-trendDateSortValue(a);
  });
  return [...computed, ...imported].sort((a,b)=>{
    if(Boolean(a.computedFromLedger)!==Boolean(b.computedFromLedger)) return a.computedFromLedger ? -1 : 1;
    if(a.matchScore !== b.matchScore) return b.matchScore-a.matchScore;
    return trendEvidenceRecord(b).total-trendEvidenceRecord(a).total;
  }).slice(0,limit);
}
function trendEvidenceTitle(row){
  return `${row.team} ${trendDisplayStyle(row.style)}${row.situation ? ' — ' + row.situation : ''}`;
}
/* Legacy trendEvidenceMetric implementation removed during clean sweep. */

function trendEvidenceWhyLine(row, p){
  const style = trendDisplayStyle(row.style);
  const situation = row.situation && row.situation !== '-' ? row.situation : 'stored environment';
  const market = trendEvidenceTypeForPick(p) || style;
  return `This pick is being checked against a stored ${row.team} ${market} / ${style} profile in the ${situation} environment.`;
}
function trendEvidenceHistoryHtml(row){
  const wins = Array.isArray(row.winEvidence) ? row.winEvidence : [];
  const losses = Array.isArray(row.lossEvidence) ? row.lossEvidence : [];
  const support = String(row.supportingGames || '').trim();
  const examples = String(row.additionalExamples || '').trim();
  const fallbackWins = wins.length ? wins : (support && support !== '-' ? support.split(';').map(x=>x.trim()).filter(Boolean) : []);
  const fallbackLosses = losses.length ? losses : (examples && examples !== '-' ? examples.split(';').map(x=>x.trim()).filter(Boolean) : []);
  const winHtml = fallbackWins.length ? fallbackWins.map(x => `<li><span>WIN / SUPPORT</span> ${x}</li>`).join('') : '<li>No stored winning examples yet.</li>';
  const lossHtml = fallbackLosses.length ? fallbackLosses.map(x => `<li><span class="loss-word">LOSS / EXAMPLE</span> ${x}</li>`).join('') : '<li>No stored losing examples yet.</li>';
  return `<details class="trend-history-dropdown"><summary>View same-environment history</summary><div class="trend-history-grid"><div><strong>Support examples</strong><ul class="clean evidence-list">${winHtml}</ul></div><div><strong>Loss / comparison examples</strong><ul class="clean evidence-list">${lossHtml}</ul></div></div></details>`;
}
/* Legacy trendEvidenceHtml implementation removed during clean sweep. */

/* Legacy trendEvidenceCardSummary implementation removed during clean sweep. */


/* Legacy slatePlayCard implementation removed during clean sweep. */


function categoryKeyForDisplay(cat){
  const c = String(cat||'').toUpperCase();
  if(c.includes('F5')) return 'First Five';
  if(c.includes('SERIES')) return 'Series';
  if(c.includes('TOT') || c.includes('OVER') || c.includes('UNDER')) return 'Totals';
  if(c.includes('ML')) return 'Moneyline';
  if(c.includes('SPRD') || c.includes('SPREAD')) return 'Spread';
  if(c.includes('PROP')) return 'Props';
  if(c.includes('PAR')) return 'Parlay';
  return cat ? 'Unclassified' : 'Unclassified';
}
function isSeriesPick(p){ return pickCategory(p) === 'Series' || /series/i.test(String(p.pick||'')); }
function displayCategoryBuckets(){ return ['First Five','Moneyline','Over','Under','Series','Totals','Props']; }
function latestNonSeriesPlays(){
  const latest = latestPickDateKey();
  return coreDailyPicks.filter(p => dateKey(parseSlateDate(p.slate)) === latest && !isSeriesPick(p) && isClassifiedPick(p));
}
function latestSeriesPlays(){
  const latest = latestPickDateKey();
  return coreDailyPicks.filter(p => dateKey(parseSlateDate(p.slate)) === latest && isSeriesPick(p));
}
function officialHistoryStats(rows){
  const total = rows.length;
  const wins = rows.filter(r=>Number(r.result)>0).length;
  const losses = rows.filter(r=>Number(r.result)<0).length;
  const pushes = rows.filter(r=>Number(r.result)===0).length;
  // Performance Lab now standardizes every tracked bet to 1 unit for cleaner app-wide records.
  const graded = wins + losses;
  const net = wins - losses;
  const risk = graded;
  return {total,wins,losses,pushes,net,risk,roi:risk ? (net/risk)*100 : 0};
}
function officialHistoryType(row){ return categoryKeyForDisplay(row.type); }
function isClassifiedOfficialRow(row){ const t = officialHistoryType(row); return t !== 'Unclassified' && t !== 'Spread' && t !== 'Parlay'; }
function renderOfficialPerformanceSnapshot(){
  const el = $('#homePerformanceSnapshot');
  if(!el || typeof officialBetHistory === 'undefined') return;
  const classifiedHistory = officialBetHistory.filter(isClassifiedOfficialRow);
  const stats = officialHistoryStats(classifiedHistory);
  const byType = groupOfficialByType(classifiedHistory).sort((a,b)=>b.stats.net-a.stats.net);
  const best = byType[0];
  el.innerHTML = `<section class="performance-snapshot model-panel"><div class="board-header"><div><p class="eyebrow">Performance Proof</p><h3>What has actually made us money?</h3><p>Built from your official betting ledger, not research-only plays.</p></div><button class="secondary jump" data-page="performance">Open Performance Lab</button></div><div class="performance-board compact-perf"><div class="perf-card"><strong>${stats.wins}-${stats.losses}</strong><small>Official Record</small></div><div class="perf-card"><strong>${formatUnits(stats.net)}</strong><small>Net Units</small></div><div class="perf-card"><strong>${stats.roi.toFixed(1)}%</strong><small>Ledger ROI</small></div><div class="perf-card"><strong>${best?best.type:'—'}</strong><small>Strongest Category</small></div></div></section>`;
  $$('.jump').forEach(b=>b.onclick=null);
  $$('.jump').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
}
function groupOfficialByType(rows){
  const map = {};
  rows.forEach(r=>{ const t=officialHistoryType(r); (map[t] ||= []).push(r); });
  return Object.entries(map).map(([type,items])=>({type,items,stats:officialHistoryStats(items)}));
}
function monthKeyFromDate(dateText){
  const d = parseSlateDate(dateText);
  return dateKey(d).slice(0,7) || 'unknown';
}
function monthLabelFromKey(key){
  if(!key || key==='unknown') return 'Unknown Month';
  const d = new Date(key+'-01T00:00:00');
  return d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
}
function currentPerformanceExposure(){
  const rows = (typeof trackedPickResults !== 'undefined' && Array.isArray(trackedPickResults) ? trackedPickResults : [])
    .filter(r=>{
      const st=normalizedPickStatus(r);
      return st==='LIVE' || st==='PENDING' || st==='UNVERIFIED' || st==='UNGRADED';
    });
  const unitRows = rows.filter(r=>explicitUnitSize(r));
  const units = unitRows.reduce((sum,r)=>sum+(parseFloat(String(r.units||'').replace(/[^0-9.]/g,''))||0),0);
  return {rows, units};
}
function renderPerformanceLab(){
  if(typeof officialBetHistory === 'undefined') return;
  const visibleHistory = officialBetHistory.filter(isClassifiedOfficialRow);
  const typeSel = $('#officialTypeFilter');
  if(typeSel && typeSel.options.length <= 1){
    groupOfficialByType(visibleHistory).map(x=>x.type).sort().forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; typeSel.appendChild(o); });
  }
  const q = ($('#officialBetSearch')?.value || '').toLowerCase();
  const type = typeSel?.value || 'all';
  let rows = visibleHistory.filter(r => (type==='all' || officialHistoryType(r)===type));
  if(q) rows = rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
  const stats = officialHistoryStats(rows);
  const exposure = currentPerformanceExposure();
  const summary = $('#officialPerformanceSummary');
  if(summary) summary.innerHTML = `<div><strong>${stats.wins}-${stats.losses}${stats.pushes?'-'+stats.pushes:''}</strong><small>Graded Record</small></div><div><strong>${stats.total}</strong><small>Graded Bets</small></div><div><strong>${formatUnits(stats.net)}</strong><small>Flat 1U Net</small></div><div><strong>${stats.roi.toFixed(1)}%</strong><small>Flat 1U ROI</small></div><div><strong>${exposure.rows.length}</strong><small>Open / Live Picks</small></div><div><strong>${exposure.units.toFixed(2)}U</strong><small>Open Units Listed</small></div>`;
  const board = $('#officialCategoryBoard');
  if(board){
    const preferred = ['First Five','Moneyline','Over','Under','Series','Totals','Props'];
    const groupedMap = Object.fromEntries(groupOfficialByType(visibleHistory).map(g=>[g.type,g]));
    board.innerHTML = `<div class="performance-columns">${preferred.filter(t=>groupedMap[t]).map(typeName=>{
      const g = groupedMap[typeName];
      return `<section class="performance-column"><div class="pick-column-head"><h3>${typeName === 'First Five' ? 'F5' : typeName === 'Moneyline' ? 'ML' : typeName}</h3><span>${g.stats.wins}-${g.stats.losses}</span></div><div class="perf-mini"><strong>${formatUnits(g.stats.net)}</strong><small>${g.stats.roi.toFixed(1)}% ROI • 1U flat</small></div></section>`;
    }).join('')}</div>`;
  }
  const log = $('#officialBetLog');
  if(log){
    const monthGroups = {};
    rows.forEach(r=>{ const k=monthKeyFromDate(r.date); (monthGroups[k] ||= []).push(r); });
    const monthHtml = Object.entries(monthGroups).sort((a,b)=>b[0].localeCompare(a[0])).map(([m,items])=>{
      const mStats = officialHistoryStats(items);
      const sorted = items.slice().sort((a,b)=>dateKey(parseSlateDate(b.date)).localeCompare(dateKey(parseSlateDate(a.date))));
      return `<details class="month-performance" open><summary><strong>${monthLabelFromKey(m)}</strong><span>${mStats.wins}-${mStats.losses} • ${formatUnits(mStats.net)}</span></summary><div class="official-log-header"><span>Date</span><span>Bet</span><span>Type</span><span>W/L</span></div>${sorted.map(r=>`<div class="official-log-row"><span>${r.date}</span><strong>${r.bet}</strong><span>${officialHistoryType(r)}</span><span class="${Number(r.result)>0?'status-WIN':Number(r.result)<0?'status-LOSS':'status-PUSH'}">${Number(r.result)>0?'W':Number(r.result)<0?'L':'P'}</span><small>${r.notes||''}</small></div>`).join('')}</details>`;
    }).join('');
    const exposure = currentPerformanceExposure();
    const openHtml = exposure.rows.length ? `<details class="month-performance" open><summary><strong>Open / Live Card</strong><span>${exposure.rows.length} picks • ${exposure.units.toFixed(2)}U listed</span></summary><div class="official-log-header"><span>Date</span><span>Bet</span><span>Status</span><span>Units</span></div>${exposure.rows.slice().sort((a,b)=>dateKey(parseSlateDate(b.slate)).localeCompare(dateKey(parseSlateDate(a.slate)))).map(r=>`<div class="official-log-row"><span>${r.slate||''}</span><strong>${r.pick||''}</strong><span>${normalizedPickStatus(r)}</span><span>${explicitUnitSize(r)?r.units:'—'}</span><small>${r.edge||''}</small></div>`).join('')}</details>` : '';
    log.innerHTML = openHtml + (monthHtml || '<p class="subtle">No graded performance rows match the filters.</p>');
  }
}


// V42 F5 Performance Lab
let selectedF5Team = 'ALL';
function f5AllBets(){ const base=Array.isArray(window.f5PerformanceBets) ? window.f5PerformanceBets : (typeof f5PerformanceBets !== 'undefined' ? f5PerformanceBets : []); const recent=Array.isArray(window.SportsEdgeRecentF5Results) ? window.SportsEdgeRecentF5Results : []; const seen=new Set(); return [...base,...recent].filter(row=>{ const key=`${row.date}|${String(row.bet||'').toUpperCase().replace(/[^A-Z0-9.+-]/g,'')}`; if(seen.has(key)) return false; seen.add(key); return true; }); }
function f5Teams(){ return Array.isArray(window.mlbTeams) ? window.mlbTeams : (typeof mlbTeams !== 'undefined' ? mlbTeams : []); }
function f5Stats(rows){
  const total = rows.length;
  const decisions = rows.filter(r=>r.outcome==='win' || r.outcome==='loss' || Number(r.result)!==0);
  const wins = decisions.filter(r=>r.outcome==='win' || Number(r.result)>0).length;
  const losses = decisions.filter(r=>r.outcome==='loss' || Number(r.result)<0).length;
  const pushes = rows.filter(r=>r.outcome==='push').length;
  const profit = rows.reduce((s,r)=>s+Number(r.result||0),0);
  const risk = decisions.reduce((s,r)=>s+(Number(String(r.units||1).replace(/[^0-9.]/g,''))||1),0);
  const winRate = wins + losses ? (wins / (wins + losses)) * 100 : 0;
  const roi = risk ? (profit / risk) * 100 : 0;
  const scores = rows.map(r=>Number(r.score)).filter(Number.isFinite);
  const avgScore = scores.length ? scores.reduce((s,v)=>s+v,0) / scores.length : 0;
  const avgOdds = total ? rows.reduce((s,r)=>s+(Number.parseInt(String(r.odds||'').replace(/[^+\-\d]/g,''),10)||0),0) / total : 0;
  return {total,wins,losses,pushes,profit,risk,winRate,roi,avgScore,avgOdds};
}
function f5MetricClass(value){ return Number(value) >= 0 ? 'metric-pop positive-metric' : 'metric-pop negative-metric'; }
function f5FormatPct(value){ return `${Number(value||0).toFixed(2)}%`; }
function f5FormatUnits(value){ const n=Number(value||0); return `${n>0?'+':''}${n.toFixed(2)}U`; }
function f5LogoBadge(team){ return `<div class="f5-logo-badge">${team.abbr}</div>`; }
function renderF5Overall(){
  const el = $('#f5OverallSummary');
  if(!el) return;
  const stats = f5Stats(f5AllBets());
  el.innerHTML = `<div><strong>${stats.total}</strong><small>Total F5 Bets</small></div><div><strong>${stats.wins}-${stats.losses}</strong><small>Record</small></div><div><strong class="metric-pop positive-metric">${f5FormatPct(stats.winRate)}</strong><small>Win %</small></div><div><strong class="${f5MetricClass(stats.roi)}">${f5FormatPct(stats.roi)}</strong><small>ROI</small></div><div><strong class="${f5MetricClass(stats.profit)}">${f5FormatUnits(stats.profit)}</strong><small>Profit</small></div><div><strong>${stats.avgScore.toFixed(2)}</strong><small>Avg AI Score</small></div>`;
}
function renderF5TeamGrid(){
  const grid = $('#f5TeamGrid');
  if(!grid) return;
  const bets = f5AllBets();
  const teams = f5Teams();
  grid.innerHTML = teams.map(team=>{
    const rows = bets.filter(b=>b.team===team.abbr);
    const s = f5Stats(rows);
    const active = selectedF5Team === team.abbr;
    return `<button class="f5-team-card ${active?'active':''}" data-f5-team="${team.abbr}">${f5LogoBadge(team)}<span><strong>${team.name}</strong><small>${rows.length ? `${s.wins}-${s.losses} • ${f5FormatPct(s.winRate)} Win` : 'No F5 data yet'}</small></span></button>`;
  }).join('');
  grid.querySelectorAll('[data-f5-team]').forEach(btn=>btn.addEventListener('click',()=>{ selectedF5Team = btn.dataset.f5Team; renderF5PerformanceLab(); }));
}
function renderF5SelectedTeam(){
  const title = $('#f5SelectedTeamTitle'), sub = $('#f5SelectedTeamSub'), statsEl = $('#f5SelectedTeamStats'), table = $('#f5BetTable');
  if(!title || !sub || !statsEl || !table) return;
  const teams = f5Teams();
  const bets = f5AllBets();
  const team = teams.find(t=>t.abbr===selectedF5Team) || teams.find(t=>bets.some(b=>b.team===t.abbr)) || teams[0];
  if(!team){ title.textContent='No F5 database loaded'; sub.textContent='Add F5 bets to data.js.'; return; }
  const rows = bets.filter(b=>b.team===team.abbr).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const s = f5Stats(rows);
  title.innerHTML = `${f5LogoBadge(team)} ${team.name}`;
  sub.textContent = rows.length ? `${rows.length} tracked F5 bets for ${team.name}.` : `${team.name} has no F5 bets in the database yet.`;
  statsEl.innerHTML = `<div><strong>${rows.length}</strong><small>Team Bets</small></div><div><strong>${s.wins}-${s.losses}</strong><small>Record</small></div><div><strong class="metric-pop positive-metric">${rows.length?f5FormatPct(s.winRate):'—'}</strong><small>Win %</small></div><div><strong class="${f5MetricClass(s.roi)}">${rows.length?f5FormatPct(s.roi):'—'}</strong><small>ROI</small></div><div><strong class="${f5MetricClass(s.profit)}">${rows.length?f5FormatUnits(s.profit):'—'}</strong><small>Profit</small></div><div><strong>${rows.length?s.avgScore.toFixed(2):'—'}</strong><small>Avg AI Score</small></div>`;
  if(!rows.length){ table.innerHTML = '<p class="subtle">No F5 bets for this team yet. This team card is ready for future updates.</p>'; return; }
  table.innerHTML = `<div class="f5-table-wrap"><table class="f5-bet-table"><thead><tr><th>Date</th><th>Bet</th><th>Odds</th><th>Result</th><th>W/L</th><th>AI Score</th></tr></thead><tbody>${rows.map(r=>{const outcome=String(r.outcome||'').toLowerCase();const icon=outcome==='win'?'✅':outcome==='loss'?'❌':'➖';const status=outcome==='loss'?'status-LOSS':'status-WIN';const score=Number(r.score);return `<tr><td>${r.date}</td><td><strong>${r.bet}</strong></td><td><strong class="f5-odds">${r.odds}</strong></td><td class="${status}">${f5FormatUnits(r.result)}</td><td>${icon}</td><td><strong>${Number.isFinite(score)?score.toFixed(2):'—'}</strong></td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderF5PerformanceLab(){
  if(!$('#f5OverallSummary')) return;
  if(selectedF5Team === 'ALL'){
    const bets=f5AllBets();
    const topTeam = f5Teams().map(t=>({team:t, stats:f5Stats(bets.filter(b=>b.team===t.abbr))})).filter(x=>x.stats.total).sort((a,b)=>b.stats.profit-a.stats.profit)[0];
    if(topTeam) selectedF5Team = topTeam.team.abbr;
  }
  renderF5Overall();
  renderF5TeamGrid();
  renderF5SelectedTeam();
}


function isWaitForValuePick(p){
  const raw = [p.status, p.pick, p.edge, p.rank, ...(Array.isArray(p.why) ? p.why : [])].join(' ').toUpperCase();
  return raw.includes('LIVE') || raw.includes('WAIT FOR VALUE') || raw.includes('IN-GAME') || raw.includes('IN GAME');
}
function isMainBoardPick(p){ return !isWaitForValuePick(p); }
function renderPickDropdownRow(p){
  const st = normalizedPickStatus(p);
  const resultClass = st==='WIN'?'status-WIN':st==='LOSS'?'status-LOSS':(st==='PUSH'?'status-PUSH':(st==='UNVERIFIED'||st==='UNGRADED'?'status-UNGRADED':'status-'+slugStatus(st)));
  const unitText = explicitUnitSize(p) ? String(p.units).trim() : 'No unit';
  const trendText = Array.isArray(p.trendTags) && p.trendTags.length ? p.trendTags.join(' • ') : '';
  const proof = trendEvidenceCardSummary(p) || `<p class="card-summary">${consumerReasoningNotes(p)[0] || compactWhy(p)[0] || 'Sports Edge tracked play. Open details for model context.'}</p>`;
  return `<article class="slate-play-card compact-dropdown-pick ${isOfficialPlay(p)?'official-play':'research-play'}">
    <div class="series-card-top"><span class="tag ${isOfficialPlay(p)?'':'blue'}">${isOfficialPlay(p)?'Official':'Research'}</span><span class="pill ${resultClass}">${statusDisplayIcon(st)}</span></div>
    <h3>${cleanPickTitle(p)}</h3>
    ${matchupSubtitleHtml(p)}
    <div class="meta"><span class="pill">${bettorCategory(p)}</span><span class="pill">Odds ${p.odds || '-'}</span><span class="pill">${unitText}</span>${trendText?`<span class="pill">${trendText}</span>`:''}</div>
    ${proof}
    <button class="secondary details-cta" onclick="openPick(${coreDailyPicks.indexOf(p)})">Open Bet Details</button>
  </article>`;
}
function renderPickDropdownSection(title, subtitle, picks, options={}){
  const open = options.open ? ' open' : '';
  const label = `${title} (${picks.length})`;
  return `<details class="pick-dropdown-section"${open}><summary><div><strong>${label}</strong><small>${subtitle}</small></div><span>Expand</span></summary><div class="pick-dropdown-body">${picks.length ? picks.map(renderPickDropdownRow).join('') : `<p class="subtle small-empty">${options.empty || 'No plays in this section.'}</p>`}</div></details>`;
}
function renderCategorizedPlayBoard(picks, emptyMessage, options={}){
  const includeLiveLooks = options.includeLiveLooks !== false;
  if(!picks.length) return `<p class="subtle">${emptyMessage}</p>`;
  const buckets = [
    {key:'First Five', title:'F5 Plays', sub:'First-five inning plays with F5 grading and F5 database tracking.'},
    {key:'Moneyline', title:'Moneylines', sub:'Team win bets, auto-graded by official final score.'},
    {key:'Over', title:'Overs', sub:'Totals marked over.'},
    {key:'Under', title:'Unders', sub:'Totals marked under.'},
    {key:'Totals', title:'Other Totals', sub:'Totals that need additional classification.'},
    {key:'Spread', title:'Spreads / Runlines', sub:'Spread-style positions.'},
    {key:'Props', title:'Props', sub:'Player prop and K history plays.'}
  ];
  const by = Object.fromEntries(buckets.map(b=>[b.key, []]));
  picks.filter(isClassifiedPick).forEach(p=>{
    const cat = bettorCategory(p);
    if(by[cat]) by[cat].push(p);
    else if(cat === 'Totals') by['Totals'].push(p);
  });
  const trendBacked = picks.filter(p=>Array.isArray(p.trendTags) && p.trendTags.length);
  const sections = [];
  if(includeLiveLooks) sections.push(renderPickDropdownSection('Wait For Value / Live Looks', 'LIVE-tagged plays to monitor for a better entry price.', picks.filter(isWaitForValuePick), {open:true, empty:'No wait-for-value plays.'}));
  buckets.forEach((b, idx)=>sections.push(renderPickDropdownSection(b.title, b.sub, by[b.key] || [], {open: idx===0 && !includeLiveLooks})));
  sections.push(renderPickDropdownSection('Trend-Backed Plays', 'Picks with AtS, SWEEP, previously scored/allowed, or no-CLV tags attached.', trendBacked, {empty:'No trend-tagged plays in this group.'}));
  return `<div class="pick-dropdown-board">${sections.join('')}</div>`;
}

function renderHomeDailyDashboard(){
  const latest = latestPickDateKey();
  const latestLabel = latest ? new Date(latest+'T00:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : 'Latest Slate';
  const slate = latestLabel;
  const nonSeries = latestNonSeriesPlays();
  const series = latestSeriesPlays();
  const classifiedNonSeries = nonSeries.filter(isClassifiedPick);
  const official = classifiedNonSeries.filter(isOfficialPlay);
  const research = classifiedNonSeries.filter(isResearchPlay);
  const units = official.reduce((sum,p)=>sum+parseUnits(p.units),0);
  const oc = $('#homeOfficialCount'), rc = $('#homeResearchCount'), ur = $('#homeUnitsRisked');
  if(oc) oc.textContent = official.length;
  if(rc) rc.textContent = research.length + series.length;
  if(ur) ur.textContent = units.toFixed(2).replace(/\.00$/,'') + 'U';
  const officialEl = $('#homeOfficialBoard');
  const researchEl = $('#homeResearchBoard');
  if(officialEl) officialEl.innerHTML = `<div class="board-header"><div><p class="eyebrow">${slate}</p><h2>Today’s Official Card</h2><p>Only unit-sized plays appear here. If no units are attached yet, the slate stays in Research until you confirm what was actually bet.</p></div><button class="secondary jump" data-page="today">Full Dashboard</button></div>` + renderCategorizedPlayBoard(official, 'No unit-sized official plays for the latest slate yet. Add unit sizes to move plays here.');
  if(researchEl) researchEl.innerHTML = `<div class="board-header research-header"><div><p class="eyebrow">Research Edges</p><h2>Today’s Plays Found</h2><p>Non-series plays stay here until unit sizes are attached. Series plays live on the Series Board so users are not mixing bet types.</p></div><button class="secondary jump" data-page="series">Series Board</button></div>` + renderCategorizedPlayBoard(research, 'No non-series research plays for the latest slate.') + `<div class="series-home-callout"><strong>${series.length} Series Plays</strong><span>Series bets have their own clean board with Vegas %, model %, edge, grade, and why.</span><button class="secondary jump" data-page="series">View Series</button></div>`;
  renderOfficialPerformanceSnapshot();
  $$('.jump').forEach(b=>b.onclick=null);
  $$('.jump').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
}
function renderPerformanceDashboard(allPicks){
  const rec = pickRecord(allPicks);
  const graded = allPicks.filter(p=>['WIN','LOSS'].includes(normalizedPickStatus(p)));
  const unitGraded = graded.filter(explicitUnitSize);
  const risked = unitGraded.reduce((s,p)=>s+unitsValue(p),0);
  const net = unitGraded.reduce((s,p)=>s+profitUnits(p),0);
  const winRate = rec.total ? ((rec.wins/rec.total)*100).toFixed(1)+'%' : '—';
  const roi = risked ? ((net/risked)*100).toFixed(1)+'%' : '—';
  return `<div class="performance-board performance-board-tight">
    <div class="perf-card"><strong>${rec.wins}-${rec.losses}</strong><small>Record</small></div>
    <div class="perf-card"><strong>${winRate}</strong><small>Win %</small></div>
    <div class="perf-card"><strong>${formatUnits(net)}</strong><small>Units</small></div>
    <div class="perf-card"><strong>${roi}</strong><small>ROI</small></div>
  </div>`;
}

function renderCategoryPerformance(allPicks){
  const cats = uniq(allPicks.filter(isClassifiedPick).map(p=>pickCategory(p)));
  return `<div class="category-board">${cats.map(cat=>{
    const group = allPicks.filter(p=>pickCategory(p)===cat);
    const rec = pickRecord(group);
    const unitGroup = group.filter(p=>['WIN','LOSS'].includes(normalizedPickStatus(p)) && explicitUnitSize(p));
    const net = unitGroup.reduce((s,p)=>s+profitUnits(p),0);
    const risk = unitGroup.reduce((s,p)=>s+unitsValue(p),0);
    const winRate = rec.total ? ((rec.wins/rec.total)*100).toFixed(1)+'%' : '—';
    const roiText = risk ? `${formatUnits(net)} • ${((net/risk)*100).toFixed(1)}% ROI` : 'No unit ROI';
    return `<div class="category-card"><strong>${cat}</strong><span>${rec.wins}-${rec.losses}</span><small>${winRate} • ${roiText}</small></div>`;
  }).join('')}</div>`;
}
function groupBySlate(picks){
  const grouped = {};
  picks.forEach(p=>{ const key = p.slate || 'Unknown Date'; (grouped[key] ||= []).push(p); });
  return Object.entries(grouped).sort((a,b)=>dateKey(parseSlateDate(b[0])).localeCompare(dateKey(parseSlateDate(a[0]))));
}
function renderPicks(){
  const status=$('#pickStatusFilter').value, slate=$('#pickSlateFilter').value, q=$('#pickSearch').value.toLowerCase();
  let picks=coreDailyPicks.filter(p=>(slate==='all'||p.slate===slate));
  if(status!=='all') picks=picks.filter(p=>normalizedPickStatus(p)===status);
  if(q) picks=picks.filter(p=>JSON.stringify(p).toLowerCase().includes(q));
  $('#pickSummary').innerHTML = '<div class="board-note"><strong>Today’s Picks</strong><span>Grouped into clean dropdowns. Open only the section you want.</span></div>' + apiGradeSummaryHtml();

  const latest = latestPickDateKey();
  const currentSlate = picks.filter(p=>dateKey(parseSlateDate(p.slate))===latest);
  const nonSeriesCurrent = currentSlate.filter(p=>!isSeriesPick(p));
  const classifiedCurrent = nonSeriesCurrent.filter(isClassifiedPick);
  const waitForValue = classifiedCurrent.filter(isWaitForValuePick);
  const regularCurrent = classifiedCurrent.filter(isMainBoardPick);
  const official = regularCurrent.filter(isOfficialPlay);
  const research = regularCurrent.filter(isResearchPlay);
  const f5All = classifiedCurrent.filter(p=>bettorCategory(p)==='First Five');
  const trendBacked = classifiedCurrent.filter(p=>Array.isArray(p.trendTags) && p.trendTags.length);
  const archive = picks.filter(p=>dateKey(parseSlateDate(p.slate))!==latest && isClassifiedPick(p));

  const latestLabel = latest ? new Date(latest+'T00:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : 'Latest Slate';
  const header = `<section class="today-command-card"><div><p class="eyebrow">${latestLabel}</p><h3>Latest MLB Slate</h3><p>Official plays are unit-sized. LIVE tags are shown as Wait For Value. Past slates are automatically graded by the API when final data is available.</p></div><div class="mini-grid"><div><strong>${official.length}</strong><small>Official</small></div><div><strong>${waitForValue.length}</strong><small>Wait Value</small></div><div><strong>${classifiedCurrent.length}</strong><small>Total Picks</small></div></div></section>`;
  const officialHtml = renderPickDropdownSection('Official Plays', 'Unit-sized plays only. These feed the Performance Lab ROI.', official, {open:true, empty:'No unit-sized official plays for the latest slate yet.'});
  const waitValueHtml = renderPickDropdownSection('Wait For Value / Live Looks', 'LIVE-tagged plays. Monitor for better in-game price.', waitForValue, {open:false, empty:'No LIVE / wait-for-value plays for the latest slate.'});
  const f5Html = renderPickDropdownSection('F5 Plays', 'Every first-five play on this slate. These also feed the F5 Performance tab.', f5All, {open:false, empty:'No F5 plays for this slate.'});
  const researchHtml = renderPickDropdownSection('Research Plays', 'Non-live, non-unit plays that need a unit size before they become official.', research, {open:false, empty:'No research plays for the latest slate.'});
  const trendHtml = renderPickDropdownSection('Trend-Backed Plays', 'Picks carrying AtS, SWEEP, previously scored/allowed, or no-CLV evidence tags.', trendBacked, {open:false, empty:'No trend-backed plays for this slate.'});
  const marketHtml = `<details class="pick-dropdown-section"><summary><div><strong>Market Type Dropdowns</strong><small>Open by bet type instead of scanning a wall of cards.</small></div><span>Expand</span></summary><div class="pick-dropdown-body">${renderCategorizedPlayBoard(classifiedCurrent, 'No current slate plays.', {includeLiveLooks:false})}</div></details>`;
  const archiveHtml = `<details class="pick-dropdown-section graded-archive-section"><summary><div><strong>Graded Archive (${archive.length})</strong><small>Past slates with API grades, ROI, and details.</small></div><span>Expand</span></summary><div class="archive-list">${groupBySlate(archive).map(([slate,items])=>`<details class="date-group"><summary>${slate} <span>${items.length} picks</span></summary><div class="archive-list">${items.map(p=>archiveRow(p)).join('')}</div></details>`).join('')}</div></details>`;

  $('#picksGrid').className = 'picks-dashboard grouped-today-dashboard';
  $('#picksGrid').innerHTML = header + officialHtml + waitValueHtml + f5Html + researchHtml + trendHtml + marketHtml + archiveHtml;
  if($('#homePicks')) $('#homePicks').textContent=coreDailyPicks.length;
  renderHomeDailyDashboard();
}
function pickCard(p){
  const st = normalizedPickStatus(p);
  return `<article class="pick-card"><span class="tag">${p.slate}</span><h3>${p.pick}</h3><div class="score ${'status-'+slugStatus(st)}">${pickScoreDisplay(p)}</div><div class="meta">${formatPickLine(p)}<span class="pill ${'status-'+slugStatus(st)}">${st}</span></div><p>${p.edge || ''}</p><button class="secondary" onclick="openPick(${coreDailyPicks.indexOf(p)})">View Details</button></article>`;
}
function archiveRow(p){
  const st = normalizedPickStatus(p);
  const pl = profitUnits(p);
  const resultClass = st==='WIN'?'status-WIN':st==='LOSS'?'status-LOSS':(st==='UNVERIFIED'||st==='UNGRADED')?'status-UNGRADED':'status-'+slugStatus(st);
  return `<div class="archive-row"><div><strong>${p.pick}</strong><small>${pickCategory(p)} • ${p.edge || 'Tracked pick'}</small></div><div>${p.odds || '-'}</div><div>${explicitUnitSize(p)?String(p.units).trim():'—'}</div><div class="${resultClass}">${statusDisplayIcon(st)}</div><div>${explicitUnitSize(p)&&['WIN','LOSS'].includes(st)?formatUnits(pl):(st==='PUSH'?'0.00U':'—')}</div><button class="secondary" onclick="openPick(${coreDailyPicks.indexOf(p)})">Details</button></div>`;
}

function currentKLineHtml(p){
  const ctx = matchupContextForPick(p);
  if(!ctx) return '<p class="subtle">Current matchup is not stored for this pick yet, so no current K prop line can be matched.</p>';
  const slateIso = slateDateIso(p);
  const tokens = [`@ ${ctx.home}`, `vs. ${ctx.away}`].map(x=>x.toUpperCase());
  const rows = trendRows.filter(r=>normalizeStyleKey(r.style)==='PROP' && tokens.includes(String(r.opponent||'').trim().toUpperCase()) && (!slateIso || trendDateIso(r.date)===slateIso));
  if(!rows.length) return `<p class="subtle">Current K prop line not imported for ${ctx.label} yet. Historical prop evidence below is opponent/location evidence only.</p>`;
  return `<ul class="clean evidence-list">${rows.map(r=>`<li><b>${r.description}</b><span>${strikeoutLineFromDescription(r.description)}</span><small>${formatTrendDate(r.date)} • ${r.opponent || ''} • ${r.situation || '-'}</small></li>`).join('')}</ul>`;
}
function matchupPropHistoryHtml(p){
  const ctx = matchupContextForPick(p);
  if(!ctx) return '<p class="subtle">No matchup context is stored for this pick yet.</p>';
  const locationToken = `@ ${ctx.home}`;
  const opponentToken = `vs. ${ctx.away}`;
  const awayEnv = currentEnvironmentForSide(p, 'away');
  const homeEnv = currentEnvironmentForSide(p, 'home');
  const atLocation = propRowsForOppToken(locationToken, 8, awayEnv);
  const vsOpponent = propRowsForOppToken(opponentToken, 8, homeEnv);
  const renderRows = rows => rows.length ? `<ul class="clean evidence-list">${rows.map(r=>`<li><b>${propPitcherName(r.description)}</b>${propKAmount(r.description)?` <span class="k-highlight">${propKAmount(r.description)}</span>`:''}<small>${formatTrendDate(r.date)} • ${r.opponent || ''} • ${r.situation || '-'}</small></li>`).join('')}</ul>` : '<p class="subtle">No exact environment-matched prop-history rows for this bucket yet.</p>';
  return `<div class="prop-history-grid"><div class="prop-history-bucket"><h4>At ${ctx.home} (${locationToken})</h4><p class="subtle">Showing rows matching today’s away-side environment: <b>${awayEnv}</b>.</p>${renderRows(atLocation)}</div><div class="prop-history-bucket"><h4>Against ${ctx.away} (${opponentToken})</h4><p class="subtle">Showing rows matching today’s home-side environment: <b>${homeEnv}</b>.</p>${renderRows(vsOpponent)}</div></div>`;
}

/* Legacy pitcherPropHistoryHtml implementation removed during clean sweep. */

function detailAccordion(title, html, open=false){
  return `<details class="detail-accordion" ${open?'open':''}><summary>${title}</summary><div class="detail-accordion-body">${html}</div></details>`;
}
/* Legacy openPick implementation removed during clean sweep. */

$('#closeModal').addEventListener('click',()=>$('#modal').classList.add('hidden'));
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')});
function renderJournal(){ const sorted = journal.slice().sort((a,b)=>dateKey(parseSlateDate(b.date||'')).localeCompare(dateKey(parseSlateDate(a.date||'')))); $('#journalGrid').innerHTML=sorted.map(j=>`<article class="model-panel"><span class="tag blue">${j.date}</span><h3>${j.title}</h3><ul class="clean">${j.items.map(x=>`<li>${x}</li>`).join('')}</ul></article>`).join('');}
function seriesHomeAwayText(p){
  if(p.away && p.home) return `${p.away} @ ${p.home}`;
  return (p.matchup ? p.matchup : 'Series matchup');
}
function seriesResultBadge(p){
  const result = String(p.result || p.status || '').toUpperCase();
  if(result==='WIN' || result==='LOSS' || result==='PUSH') return `<span class="pill status-${result}">${result}</span>`;
  return `<span class="pill status-PENDING">Series Pending</span>`;
}
function renderSeries(){
  const picks = (typeof seriesBoardPicks !== 'undefined') ? seriesBoardPicks.slice().sort((a,b)=>dateKey(parseSlateDate(b.date||'')).localeCompare(dateKey(parseSlateDate(a.date||''))) ) : [];
  const summary = `<div class="series-intro"><div><p class="eyebrow">Series Edge Board</p><h3>Newest series bets first</h3><p>Each card keeps the pick, price, model edge, decision, home/away context, and series result status in one clean view. If this board looks stale, it means no new series-specific picks were entered into the series dataset yet.</p></div></div>`;
  const modelSteps = `<details class="model-steps series-method-top"><summary>How the Series Engine works</summary><div class="cards">${seriesModule.map((s,idx)=>`<article class="model-panel"><span class="tag gray">Step ${idx+1}</span><h3>${s.step}</h3><p>${s.detail}</p></article>`).join('')}</div></details>`;
  const cards = picks.length ? picks.map((p,idx)=>`<article class="series-pick-card ${p.type==='BET'?'series-bet':'series-lean'}">
    <div class="series-card-top"><span class="tag ${p.type==='BET'?'':'gold-tag'}">${p.type}</span><span class="series-grade">Grade ${p.grade}</span>${seriesResultBadge(p)}</div>
    <h3>${p.pick} <span>${p.odds}</span></h3>
    <p class="series-matchup"><b>${p.date || 'Date TBD'}</b> • ${seriesHomeAwayText(p)}</p>
    <div class="series-metrics">
      <div><small>Vegas No-Vig</small><strong>${p.vegas}</strong></div>
      <div><small>Model Win Prob</small><strong>${p.model}</strong></div>
      <div><small>Edge</small><strong>${p.edge}</strong></div>
      <div><small>Decision</small><strong>${p.decision}</strong></div>
    </div>
    <details class="why-box" ${idx<2?'open':''}><summary>Why this is on the board</summary><ul class="clean">${(p.why||[]).map(w=>`<li>${w}</li>`).join('')}</ul></details>
  </article>`).join('') : '<p class="subtle">No series picks entered yet.</p>';
  $('#seriesCards').className='series-board';
  $('#seriesCards').innerHTML=summary + modelSteps + `<div class="series-card-grid">${cards}</div>`;
}


const DEFAULT_MODEL_WEIGHTS = {
  'Starting Pitcher Edge': 30,
  'Opponent Early Offense': 15,
  'Team F5 Split Performance': 15,
  'Ballpark + Weather': 10,
  'Lineup Construction': 10,
  'Travel / Environment': 5,
  'Market Inefficiency': 10,
  'Umpire / Micro': 5
};
let activeModelWeights = {...DEFAULT_MODEL_WEIGHTS};
function isModelUnlocked(){return localStorage.getItem('sportsEdgeModelUnlocked') === 'yes';}
function setModelUnlocked(value){localStorage.setItem('sportsEdgeModelUnlocked', value ? 'yes' : 'no'); renderModelAccess(); if(value){showPage('models'); setTimeout(()=>$('#modelLab')?.scrollIntoView({behavior:'smooth',block:'start'}),80);} }
function renderModelAccess(){
  const paywall = $('#modelPaywall');
  const lab = $('#modelLab');
  if(!paywall || !lab) return;
  const unlocked = isModelUnlocked();
  paywall.classList.toggle('hidden', unlocked);
  lab.classList.toggle('hidden', !unlocked);
  if(unlocked){renderWeights(); renderCustomModelBoard();}
}
function componentValue(breakdown, aliases){
  if(!breakdown) return null;
  for(const key of aliases){
    if(breakdown[key] !== undefined){
      const n = Number(breakdown[key]);
      if(Number.isFinite(n)) return n;
    }
  }
  return null;
}
function modelComponentsForPick(p){
  const b = p.breakdown || {};
  return {
    'Starting Pitcher Edge': componentValue(b, ['SP Edge','Starting Pitcher Edge']),
    'Opponent Early Offense': componentValue(b, ['Opponent Early Offense','Opponent Offense','Opp Off']),
    'Team F5 Split Performance': componentValue(b, ['Team F5 Splits','F5 Split','F5 Splits']),
    'Ballpark + Weather': componentValue(b, ['Ballpark/Weather','Ballpark + Weather','Weather']),
    'Lineup Construction': componentValue(b, ['Lineup Construction','Lineup']),
    'Travel / Environment': componentValue(b, ['Travel/Environment','Travel / Environment','Travel']),
    'Market Inefficiency': componentValue(b, ['Market Edge','Market Inefficiency','Mkt Edge']),
    'Umpire / Micro': componentValue(b, ['Umpire','Umpire / Micro'])
  };
}
function customScoreForPick(p){
  const comps = modelComponentsForPick(p);
  let weighted = 0, usedWeight = 0;
  Object.entries(activeModelWeights).forEach(([key,weight])=>{
    const value = comps[key];
    if(Number.isFinite(value)){
      weighted += value * weight;
      usedWeight += weight;
    }
  });
  return usedWeight ? weighted / usedWeight : (typeof p.score === 'number' ? p.score : 0);
}
function gradeForScore(score){
  if(score >= 7) return 'GRADE A';
  if(score >= 6.5) return 'PLAYABLE';
  return 'PASS';
}
function modelEligiblePicks(){
  return coreDailyPicks.filter(p=>p.breakdown && Object.keys(p.breakdown).length && typeof p.score === 'number');
}
function renderWeights(){
  const wrap = $('#f5Weights');
  if(!wrap) return;
  wrap.innerHTML = Object.entries(activeModelWeights).map(([k,v])=>`<label class="weight-slider"><span><b>${k}</b><em>${v}%</em></span><input type="range" min="0" max="40" step="1" value="${v}" data-weight="${k}"><div class="slider-track"><i style="width:${Math.min(v*2.5,100)}%"></i></div></label>`).join('');
  wrap.querySelectorAll('input[type="range"]').forEach(input=>{
    input.addEventListener('input', e=>{
      activeModelWeights[e.target.dataset.weight] = Number(e.target.value);
      renderWeights();
      renderCustomModelBoard();
    });
  });
  const total = Object.values(activeModelWeights).reduce((s,v)=>s+v,0);
  const totalEl = $('#weightTotal');
  if(totalEl) totalEl.innerHTML = `<strong>Total active weight: ${total}%</strong><small> Scores are normalized to the active slider total, so custom models still calculate on a 0-10 scale.</small>`;
}
function renderCustomModelBoard(){
  const board = $('#customModelBoard');
  if(!board) return;
  const rows = modelEligiblePicks().map(p=>({p, custom: customScoreForPick(p)})).sort((a,b)=>b.custom-a.custom);
  board.innerHTML = `<div class="model-board-table"><table><thead><tr><th>Pick</th><th>Default</th><th>Custom</th><th>Grade</th><th>Odds</th><th>Edge</th></tr></thead><tbody>${rows.map(({p,custom})=>`<tr><td><strong>${p.pick}</strong><br><small>${p.slate}</small></td><td>${Number(p.score).toFixed(2)}</td><td><strong>${custom.toFixed(2)}</strong></td><td><span class="pill ${gradeForScore(custom)==='GRADE A'?'status-WIN':gradeForScore(custom)==='PLAYABLE'?'status-ACTIVE':'status-UNGRADED'}">${gradeForScore(custom)}</span></td><td>${p.odds||'-'}</td><td><small>${p.edge||''}</small></td></tr>`).join('')}</tbody></table></div>`;
}
function initPremiumModelCenter(){
  const unlock = $('#unlockModelDemo');
  const lock = $('#lockModelDemo');
  const reset = $('#resetWeights');
  if(unlock) unlock.addEventListener('click',()=>setModelUnlocked(true));
  if(lock) lock.addEventListener('click',()=>setModelUnlocked(false));
  if(reset) reset.addEventListener('click',()=>{activeModelWeights={...DEFAULT_MODEL_WEIGHTS}; renderWeights(); renderCustomModelBoard();});
  renderModelAccess();
}


['officialTypeFilter','officialBetSearch'].forEach(id=>{ const el=$('#'+id); if(el) el.addEventListener('input', renderPerformanceLab); if(el) el.addEventListener('change', renderPerformanceLab); });

function cfbPropRows(){
  return Array.isArray(window.ncaaFootballPropRows) ? window.ncaaFootballPropRows : (typeof ncaaFootballPropRows !== 'undefined' ? ncaaFootballPropRows : []);
}
function cfbTeams(){ return uniq(cfbPropRows().map(r=>String(r.team||'').trim()).filter(Boolean)); }
function cfbTeamMatches(value){
  const q = String(value||'').trim().toLowerCase();
  if(!q) return [];
  return cfbTeams().filter(t=>t.toLowerCase().includes(q));
}
function cfbSelectedTeam(){
  const search = $('#cfbTeamSearch')?.value || '';
  const select = $('#cfbTeamSelect')?.value || '';
  const exact = cfbTeams().find(t=>t.toLowerCase()===search.trim().toLowerCase());
  return exact || select || cfbTeamMatches(search)[0] || '';
}
function cfbPlayerKey(row){ return [row.team,row.player,row.position].join('::'); }
function cfbGroupByPlayer(rows){
  const grouped = {};
  rows.forEach(r=>{ const key = cfbPlayerKey(r); (grouped[key] ||= {team:r.team, player:r.player, position:r.position, newTeam:r.newTeam, trackedHitRate:r.trackedHitRate, rows:[]}).rows.push(r); });
  return Object.values(grouped).sort((a,b)=>String(a.position).localeCompare(String(b.position)) || String(a.player).localeCompare(String(b.player)));
}
function cfbPropHitSummary(rows){
  const graded = rows.filter(r=>['YES','NO'].includes(String(r.hit||'').toUpperCase()));
  const hits = graded.filter(r=>String(r.hit).toUpperCase()==='YES').length;
  return {hits, misses: graded.length-hits, total: graded.length, rate: graded.length ? Math.round((hits/graded.length)*100) : null};
}
function cfbLineText(row){
  const line = String(row.line||'').trim();
  const odds = String(row.odds||'').trim();
  if(line && line !== '-') return line;
  if(odds && odds !== '-') return odds.startsWith('+') || odds.startsWith('-') ? odds : (Number(odds)>0?'+'+odds:odds);
  return 'Line not stored';
}
function cfbPropGroupRows(rows){
  const by = {};
  rows.forEach(r=>{ const prop = r.prop || 'Unknown Prop'; (by[prop] ||= []).push(r); });
  return Object.entries(by).sort((a,b)=>a[0].localeCompare(b[0]));
}
function cfbRenderPropGroup(prop, rows){
  const yes = rows.filter(r=>String(r.hit||'').toUpperCase()==='YES');
  const no = rows.filter(r=>String(r.hit||'').toUpperCase()==='NO');
  const unknown = rows.filter(r=>!['YES','NO'].includes(String(r.hit||'').toUpperCase()));
  const summary = cfbPropHitSummary(rows);
  const currentLabel = prop.includes('ANYT') ? 'Current TD price' : 'Current prop line';
  const list = (arr, cls) => arr.length ? arr.map(r=>`<span class="cfb-line-chip ${cls}">${cfbLineText(r)}</span>`).join('') : '<span class="subtle">None stored</span>';
  return `<div class="cfb-prop-block">
    <div class="cfb-prop-head"><strong>${prop}</strong><span>${summary.total ? `${summary.hits}-${summary.misses}${summary.rate!=null?` • ${summary.rate}% hit`:''}` : 'history stored / result pending'}</span></div>
    <div class="cfb-current-line"><span>${currentLabel}</span><strong>Not imported yet</strong><small>When today's sportsbook prop line is entered, it goes here.</small></div>
    <div class="cfb-line-grid"><div><small>Hit / Over Lines</small><div>${list(yes,'hit')}</div></div><div><small>Miss / Under Lines</small><div>${list(no,'miss')}</div></div>${unknown.length?`<div><small>Ungraded Stored Lines</small><div>${list(unknown,'unknown')}</div></div>`:''}</div>
  </div>`;
}
function cfbRenderPlayerCard(player){
  const summary = cfbPropHitSummary(player.rows);
  const propCount = uniq(player.rows.map(r=>r.prop)).length;
  return `<details class="cfb-player-card">
    <summary><div><span class="position-badge">${player.position||'POS'}</span><strong>${player.player}</strong><small>${player.team}${String(player.newTeam||'').toUpperCase()==='YES'?' • New Team':''}</small></div><div class="cfb-player-summary"><span>${propCount} prop types</span><b>${summary.total ? `${summary.hits}-${summary.misses}` : 'history pending'}</b></div></summary>
    <div class="cfb-player-body">
      ${player.trackedHitRate?`<p class="subtle"><b>User-tracked hit rate:</b> ${player.trackedHitRate}</p>`:''}
      ${cfbPropGroupRows(player.rows).map(([prop,rows])=>cfbRenderPropGroup(prop,rows)).join('')}
    </div>
  </details>`;
}
function renderCollegeFootballProps(){
  const rows = cfbPropRows();
  const teams = cfbTeams();
  const hero = $('#cfbHeroStats');
  if(hero) hero.textContent = `${rows.length} stored prop rows • ${teams.length} teams`;
  const datalist = $('#cfbTeamList');
  if(datalist) datalist.innerHTML = teams.map(t=>`<option value="${t}"></option>`).join('');
  const select = $('#cfbTeamSelect');
  if(select && select.options.length <= 1){ select.innerHTML = '<option value="">Select Team</option>'+teams.map(t=>`<option value="${t}">${t}</option>`).join(''); }
  const summary = $('#cfbSummary');
  if(summary){
    const players = uniq(rows.map(r=>r.player)).length;
    const props = uniq(rows.map(r=>r.prop)).length;
    summary.innerHTML = `<div><strong>${teams.length}</strong><small>Teams</small></div><div><strong>${players}</strong><small>Players</small></div><div><strong>${props}</strong><small>Prop Types</small></div><div><strong>${rows.length}</strong><small>2025 Rows</small></div>`;
  }
  const team = cfbSelectedTeam();
  const title = $('#cfbSelectedTeamTitle');
  const sub = $('#cfbSelectedTeamSub');
  const board = $('#cfbPlayerBoard');
  if(!board) return;
  if(!team){
    if(title) title.textContent = 'Select a team';
    if(sub) sub.textContent = 'Search or choose a team to see all stored player prop history.';
    board.innerHTML = '<p class="subtle">No team selected yet.</p>';
    return;
  }
  const teamRows = rows.filter(r=>String(r.team||'').toUpperCase()===team.toUpperCase());
  const players = cfbGroupByPlayer(teamRows);
  if(title) title.textContent = team;
  if(sub) sub.textContent = `${players.length} players with 2025 prop history • ${teamRows.length} stored rows`;
  board.innerHTML = players.length ? players.map(cfbRenderPlayerCard).join('') : '<p class="subtle">No player props found for this team.</p>';
}
function initCollegeFootballProps(){
  ['cfbTeamSearch','cfbTeamSelect'].forEach(id=>{
    const el = $('#'+id);
    if(el){ el.addEventListener('input', renderCollegeFootballProps); el.addEventListener('change', renderCollegeFootballProps); }
  });
  renderCollegeFootballProps();
}

function safeRender(label, fn){
  try { fn(); }
  catch(err){ console.error('Sports Edge render error in '+label, err); }
}
function boot(){
  safeRender('filters', initFilters);
  safeRender('trends', renderTrends);
  safeRender('picks', renderPicks);
  safeRender('journal', renderJournal);
  safeRender('series', renderSeries);
  safeRender('performance', renderPerformanceLab);
  safeRender('f5 performance lab', renderF5PerformanceLab);
  safeRender('model center', initPremiumModelCenter);
  safeRender('college football props', initCollegeFootballProps);
  safeRender('home stats', ()=>{
    const homeTeams=$('#homeTeams'); if(homeTeams) homeTeams.textContent=uniq(trendRows.map(r=>r.team)).length;
    const homeTrendRows=$('#homeTrendRows'); if(homeTrendRows) homeTrendRows.textContent=trendRows.length;
  });
  safeRender('api verified grades', fetchVerifiedGrades);
}

// Live feed
function parseGameTime(g){
  const raw = g.game_time || g.gameTime || g.commence_time || g.gameDate || g.game_date;
  const t = raw ? new Date(raw).getTime() : Number.MAX_SAFE_INTEGER;
  return Number.isFinite(t) ? t : Number.MAX_SAFE_INTEGER;
}
function sortedGames(games){return [...(games||[])].sort((a,b)=>parseGameTime(a)-parseGameTime(b));}
function statusBadge(s){
  if(s==='Live') return '<span class="pill" style="background:#ef4444;color:#fff">LIVE</span>';
  if(s==='Final') return '<span class="pill" style="background:#22c55e;color:#fff">FINAL</span>';
  return '<span class="pill">PREVIEW</span>';
}
function fmtTime(raw){
  if(!raw) return 'Time TBD';
  const d = new Date(raw);
  if(Number.isNaN(d.getTime())) return String(raw);
  return d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
}
function fmtOdd(n){return n==null || Number.isNaN(Number(n)) ? 'No line' : (Number(n)>0?'+'+Number(n):String(Number(n)));}
function eventTeamNames(obj){return [normalizeTeamName(obj.away_team || obj.awayTeam), normalizeTeamName(obj.home_team || obj.homeTeam)];}
function findOddsForGame(g){
  const gameTeams = [teamAbbr(g.away_team_abbr || g.away_team), teamAbbr(g.home_team_abbr || g.home_team)];
  return (liveState.odds||[]).find(o=>{
    const oddsTeams = [teamAbbr(o.away_team), teamAbbr(o.home_team)];
    return gameTeams.every(t=>oddsTeams.includes(t));
  });
}
function moneylineForGame(g){
  const o = findOddsForGame(g);
  if(!o) return {away:'No ML', home:'No ML'};
  const books=Array.isArray(o.odds_json)?o.odds_json:[];
  const preferred = books.find(b=>['draftkings','fanduel','betmgm'].includes(b.key)) || books[0];
  const h2h=preferred?.markets?.find(m=>m.key==='h2h');
  const awayName = o.away_team;
  const homeName = o.home_team;
  const away=h2h?.outcomes?.find(x=>x.name===awayName || teamAbbr(x.name)===teamAbbr(awayName));
  const home=h2h?.outcomes?.find(x=>x.name===homeName || teamAbbr(x.name)===teamAbbr(homeName));
  return {away:fmtOdd(away?.price), home:fmtOdd(home?.price), book:preferred?.title || preferred?.key || 'Book'};
}
function renderLiveScores(games){
  const el=$('#liveScoresGrid');
  if(!el) return;
  const ordered = sortedGames(games);
  if(!ordered.length){el.innerHTML='<p class="subtle">No games today yet.</p>';return;}
  el.innerHTML=ordered.map(g=>{
    const away = teamAbbr(g.away_team_abbr || g.away_team);
    const home = teamAbbr(g.home_team_abbr || g.home_team);
    const awayPitcher = g.away_pitcher || g.awayPitcher || 'TBD';
    const homePitcher = g.home_pitcher || g.homePitcher || 'TBD';
    const ml = moneylineForGame(g);
    const awayCtx = teamGameContext(away, g);
    const homeCtx = teamGameContext(home, g);
    return `<article class="model-panel live-game-card"><div class="live-top"><div>${statusBadge(g.status)} <span class="pill">${fmtTime(g.game_time || g.gameTime || g.gameDate || g.game_date)}</span></div>${g.status==='Live'?`<small>Inn ${g.inning} ${g.inning_half||''}</small>`:''}</div><h3>${away} ${g.away_score ?? 0} @ ${home} ${g.home_score ?? 0}</h3><p class="subtle"><b>Starting Pitchers:</b> ${awayPitcher} vs ${homePitcher}</p><div class="game-context-grid"><div><strong>${away}</strong><small>${awayCtx.full}</small><span>${ml.away}</span></div><div><strong>${home}</strong><small>${homeCtx.full}</small><span>${ml.home}</span></div></div><div class="meta"><span class="pill">${away}: ${awayCtx.full}</span><span class="pill">${home}: ${homeCtx.full}</span>${ml.book?`<span class="pill">${ml.book}</span>`:''}</div></article>`;
  }).join('');
}
function renderOddsLines(odds){
  const el=$('#liveOddsGrid');
  if(!el) return;
  if(!odds||!odds.length){el.innerHTML='<p class="subtle">No odds loaded. ODDS_API_KEY required. Live game cards will still show No ML placeholders.</p>';return;}
  const ordered = [...odds].sort((a,b)=>new Date(a.commence_time||0)-new Date(b.commence_time||0));
  el.innerHTML=ordered.map(o=>{
    const books=Array.isArray(o.odds_json)?o.odds_json:[];
    const preferred=books.find(b=>['draftkings','fanduel','betmgm'].includes(b.key)) || books[0];
    const h2h=preferred?.markets?.find(m=>m.key==='h2h');
    const away=h2h?.outcomes?.find(x=>x.name===o.away_team);
    const home=h2h?.outcomes?.find(x=>x.name===o.home_team);
    const fakeGame = {away_team:o.away_team, home_team:o.home_team};
    const awayAbbr = teamAbbr(o.away_team);
    const homeAbbr = teamAbbr(o.home_team);
    const awayProb = americanImpliedProbability(away?.price);
    const homeProb = americanImpliedProbability(home?.price);
    const favSide = awayProb == null || homeProb == null ? null : (Math.abs(awayProb-homeProb)<0.0001 ? 'pickem' : (awayProb>homeProb?'away':'home'));
    const awayLabel = favSide === 'away' ? 'AWAY FAVORITE' : favSide === 'home' ? 'AWAY UNDERDOG' : 'AWAY';
    const homeLabel = favSide === 'home' ? 'HOME FAVORITE' : favSide === 'away' ? 'HOME UNDERDOG' : 'HOME';
    return `<article class="model-panel"><h3>${awayAbbr} @ ${homeAbbr}</h3><p class="subtle">${fmtTime(o.commence_time)} • ${preferred?.title || preferred?.key || 'Sportsbook'}</p><div class="game-context-grid"><div><strong>${awayAbbr}</strong><small>${awayLabel}</small><span>${fmtOdd(away?.price)}</span></div><div><strong>${homeAbbr}</strong><small>${homeLabel}</small><span>${fmtOdd(home?.price)}</span></div></div><div class="meta"><span class="pill">${awayAbbr}: ${awayLabel}</span><span class="pill">${homeAbbr}: ${homeLabel}</span></div></article>`;
  }).join('');
}

function normalizeMlbGameForApp(game){
  const awayTeam = game?.teams?.away?.team || {};
  const homeTeam = game?.teams?.home?.team || {};
  const linescore = game?.linescore || {};
  const statusText = game?.status?.abstractGameState || game?.status?.detailedState || 'Preview';
  const normalizedStatus = /final|game over|completed/i.test(statusText) ? 'Final' : (/live|in progress/i.test(statusText) ? 'Live' : 'Preview');
  return {
    game_pk: String(game?.gamePk || ''),
    away_team: TEAM_NAME_TO_ABBR[awayTeam.name] || teamAbbr(awayTeam.abbreviation || awayTeam.name),
    home_team: TEAM_NAME_TO_ABBR[homeTeam.name] || teamAbbr(homeTeam.abbreviation || homeTeam.name),
    away_team_abbr: TEAM_NAME_TO_ABBR[awayTeam.name] || teamAbbr(awayTeam.abbreviation || awayTeam.name),
    home_team_abbr: TEAM_NAME_TO_ABBR[homeTeam.name] || teamAbbr(homeTeam.abbreviation || homeTeam.name),
    away_pitcher: game?.teams?.away?.probablePitcher?.fullName || 'TBD',
    home_pitcher: game?.teams?.home?.probablePitcher?.fullName || 'TBD',
    away_score: game?.teams?.away?.score ?? linescore?.teams?.away?.runs ?? 0,
    home_score: game?.teams?.home?.score ?? linescore?.teams?.home?.runs ?? 0,
    status: normalizedStatus,
    inning: linescore?.currentInning ?? 0,
    inning_half: linescore?.inningHalf || '',
    game_time: game?.gameDate,
    gameDate: game?.gameDate
  };
}
function normalizeOddsEventForApp(event){
  return {
    event_id: event?.id || '',
    away_team: event?.away_team || '',
    home_team: event?.home_team || '',
    commence_time: event?.commence_time || '',
    odds_json: event?.bookmakers || [],
    updated_at: event?.fetchedAt || new Date().toISOString()
  };
}
async function fetchLiveData(){
  try{
    const [liveRes, oddsRes] = await Promise.allSettled([
      fetch('/api/live-data', { cache: 'no-store' }),
      fetch('/api/odds', { cache: 'no-store' })
    ]);

    let livePayload = null;
    let oddsPayload = null;

    if(liveRes.status === 'fulfilled' && liveRes.value.ok) livePayload = await liveRes.value.json();
    if(oddsRes.status === 'fulfilled' && oddsRes.value.ok) oddsPayload = await oddsRes.value.json();

    const rawGames = livePayload?.games || [];
    const rawOdds = oddsPayload?.events || oddsPayload?.odds || [];

    liveState.games = sortedGames(rawGames.map(normalizeMlbGameForApp));
    liveState.odds = rawOdds.map(normalizeOddsEventForApp);

    renderLiveScores(liveState.games);
    renderOddsLines(liveState.odds);
    renderTrends();

    const el=$('#liveUpdated');
    if(el) el.textContent='Last updated: '+new Date(livePayload?.fetchedAt || oddsPayload?.fetchedAt || new Date()).toLocaleTimeString();
  }catch(e){
    console.warn('Live data fetch failed:',e);
    renderLiveScores(liveState.games || []);
    renderOddsLines(liveState.odds || []);
  }
}
function initLiveFeed(){fetchLiveData();setInterval(fetchLiveData,60_000);}
boot();
/* V51 Consumer Experience Rebuild overrides
   Goal: one clean consumer-facing experience, API-first verification, clean trend evidence,
   no broken symbols, no vague "developing" language, and consistent pick details. */
function showPage(page){
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
  $$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('.nav,.jump').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));

function verifiedStatusForPick(p){
  const apiStatus = apiStatusForPick(p);
  if(apiStatus) return apiStatus;
  const raw = String(p.status || '').toUpperCase();
  if(raw === 'LIVE' || raw === 'PENDING' || raw === 'ACTIVE') return 'ACTIVE';
  return null;
}
function verificationNoteForPick(p){
  const apiNote = apiVerificationNoteForPick(p);
  if(apiNote) return apiNote;
  const d = dateKey(parseSlateDate(p?.slate || ''));
  return `API verification pending for ${d}. This pick will display WIN, LOSS, PUSH, or UNVERIFIED after /api/grade-picks returns an official MLB result.`;
}
function statusDisplayName(st){
  if(st === 'UNVERIFIED') return 'API Pending';
  if(st === 'UNGRADED') return 'API Pending';
  if(st === 'ACTIVE') return 'Live / Pending';
  if(st === 'NO_ACTION') return 'No Action';
  return st;
}
function statusDisplayIcon(st){
  if(st === 'WIN') return 'WIN';
  if(st === 'LOSS') return 'LOSS';
  if(st === 'PUSH') return 'PUSH';
  if(st === 'ACTIVE') return 'LIVE / PENDING';
  if(st === 'NO_ACTION') return 'NO ACTION';
  if(st === 'UNVERIFIED' || st === 'UNGRADED') return 'API PENDING';
  return st;
}
function pickScoreDisplay(p){
  const st = normalizedPickStatus(p);
  if(typeof p.score === 'number') return p.score.toFixed(2);
  if(st === 'WIN') return 'WIN';
  if(st === 'LOSS') return 'LOSS';
  if(st === 'PUSH') return 'PUSH';
  if(st === 'ACTIVE') return 'LIVE';
  if(st === 'NO_ACTION') return 'NA';
  return 'PENDING';
}
function trendEvidenceConfidence(row){
  if(row.matchTier) return row.matchTier;
  const score = Number(row.matchScore || 0);
  if(score >= 85) return 'Exact Environment Match';
  if(score >= 70) return 'Strong Environment Match';
  return 'Relevant Team / Market Match';
}
function trendEvidenceMetric(row){
  const rate = pct(row.hitRate);
  const rec = trendEvidenceRecord(row);
  if(rate !== null) return row.hitRate;
  if(rec.total) return rec.rate || `${rec.wins}-${rec.losses}`;
  return 'Pending';
}
function trendEvidenceRecordClean(row){
  const rec = trendEvidenceRecord(row);
  const rateFromRow = pct(row.hitRate);
  if(rec.total){
    return { wins:rec.wins, losses:rec.losses, total:rec.total, rate:rec.rate || 'N/A', source:'Game log' };
  }
  if(rateFromRow !== null){
    return { wins:null, losses:null, total:row.duration && row.duration !== '-' ? row.duration : 'Stored trend', rate:row.hitRate, source:'Trend database' };
  }
  return { wins:null, losses:null, total:'Needs more rows', rate:'Pending', source:'Trend database' };
}
function trendEvidenceHtml(p){
  const trends = matchedTrendEvidenceForPick(p, 6);
  if(!trends.length){
    return `<div class="trend-evidence empty-evidence"><strong>No qualifying matched environment yet</strong><p class="subtle">Sports Edge did not find a same-team, same-market historical row above the minimum match threshold. This pick remains visible, but no unsupported hit rate is shown.</p></div>`;
  }
  return `<div class="trend-evidence upgraded-trend-evidence"><strong>Matched Trend Evidence</strong><p class="subtle">Ranked by team, market, current role, opponent, and explicit historical environment. Imported rates remain labeled separately from calculated game-log records.</p><div class="trend-evidence-grid">${trends.map(t=>{
    const rec = trendEvidenceRecordClean(t);
    const badgeClass = t.matchScore >= 85 ? '' : (t.matchScore >= 70 ? 'medium' : 'pending');
    const reasons = (t.matchReasons || []).map(reason=>`<li>${reason}</li>`).join('');
    return `<article class="trend-proof-card clean-proof"><div class="trend-proof-top"><b>${trendEvidenceTitle(t)}</b><span class="proof-badge ${badgeClass}">${trendEvidenceConfidence(t)}</span></div><div class="trend-proof-metrics"><div><small>Hit Rate</small><strong>${rec.rate}</strong></div><div><small>Record</small><strong>${rec.wins!==null ? `${rec.wins}-${rec.losses}` : 'Imported'}</strong></div><div><small>Match Score</small><strong>${t.matchScore}/100</strong></div></div><p class="subtle"><b>Data source:</b> ${rec.source}</p><p class="subtle"><b>Stored environment:</b> ${String(t.situation || '-')}</p><ul class="clean evidence-list match-reason-list">${reasons}</ul><p class="subtle"><b>Date:</b> ${formatTrendDate(t.date)}${t.opponent && t.opponent !== '-' ? ` • ${t.opponent}` : ''}</p>${t.notes && t.notes !== '-' ? `<p class="subtle"><b>Note:</b> ${t.notes}</p>` : ''}${trendEvidenceHistoryHtml(t)}</article>`;
  }).join('')}</div></div>`;
}
function trendEvidenceCardSummary(p){
  const trends = matchedTrendEvidenceForPick(p, 1);
  if(!trends.length) return '';
  const t = trends[0];
  const rec = trendEvidenceRecordClean(t);
  const reason = (t.matchReasons || []).slice(0,2).join(' • ');
  return `<div class="matched-trend-card upgraded-card-evidence"><strong>Matched Trend Evidence</strong><div class="pick-card-proof"><div><small>Hit Rate</small><strong>${rec.rate}</strong></div><div><small>Record</small><strong>${rec.wins!==null ? `${rec.wins}-${rec.losses}` : 'Imported'}</strong></div><div><small>Match</small><strong>${t.matchScore}/100</strong></div></div><small>${trendEvidenceConfidence(t)} • ${reason || trendEvidenceTitle(t)}</small></div>`;
}
function apiProofStrip(p){
  const st = normalizedPickStatus(p);
  const hit = apiResultForPick(p);
  const source = hit ? 'Official MLB API' : 'API pending';
  return `<div class="pick-verified-strip"><span class="verified-pill verified-${st}">${statusDisplayIcon(st)}</span><span class="verified-pill verified-${st}">${source}</span></div>`;
}
function slatePlayCard(p){
  const st = normalizedPickStatus(p);
  const official = isOfficialPlay(p);
  const statusText = official ? 'Official Play' : 'Research Play';
  const scoreLine = typeof p.score === 'number' ? p.score.toFixed(2) : 'Pending';
  return `<article class="slate-play-card ${official?'official-play':'research-play'}"><div class="series-card-top"><span class="tag ${official?'':'blue'}">${statusText}</span><span class="pill ${'status-'+slugStatus(st)}">${statusDisplayIcon(st)}</span></div><h3>${cleanPickTitle(p)}</h3>${matchupSubtitleHtml(p)}${apiProofStrip(p)}<div class="pick-card-proof"><div><small>Market</small><strong>${bettorCategory(p)}</strong></div><div><small>Odds</small><strong>${p.odds || '-'}</strong></div><div><small>Model Score</small><strong>${scoreLine}</strong></div></div>${trendEvidenceCardSummary(p) || `<p class="card-summary">${consumerReasoningNotes(p)[0] || compactWhy(p)[0] || 'Sports Edge is waiting for connected evidence on this pick.'}</p>`}<button class="secondary details-cta" onclick="openPick(${coreDailyPicks.indexOf(p)})">Open Bet Details</button></article>`;
}
function startingPitcherBlock(p){
  const ctx = matchupContextForPick(p);
  if(!ctx) return '<p class="subtle">Starting pitchers will appear when the pick has a stored matchup or live MLB matchup link.</p>';
  const game = (liveState.games || []).find(g=>{
    const away = teamAbbr(g.away_team_abbr || g.away_team);
    const home = teamAbbr(g.home_team_abbr || g.home_team);
    return away === teamAbbr(ctx.away) && home === teamAbbr(ctx.home);
  });
  const awayPitcher = game?.away_pitcher || game?.awayPitcher || 'Probable starter pending';
  const homePitcher = game?.home_pitcher || game?.homePitcher || 'Probable starter pending';
  return `<div class="pitcher-card"><div><small>${teamAbbr(ctx.away)}</small><strong>${awayPitcher}</strong><span>Road starter</span></div><div><small>${teamAbbr(ctx.home)}</small><strong>${homePitcher}</strong><span>Home starter</span></div></div>`;
}
function modelBreakdownHtml(p){
  const b = p.breakdown || {};
  const rows = [
    ['Model Score', typeof p.score === 'number' ? p.score.toFixed(2) : 'Pending'],
    ['Market', bettorCategory(p)],
    ['Starting Pitcher', b.pitcher || b['Starting Pitcher'] || 'Pending'],
    ['Opponent Offense', b.offense || b['Opponent Offense'] || 'Pending'],
    ['Ballpark', b.ballpark || b['Ballpark'] || 'Pending'],
    ['Market Edge', b.market || b['Market Edge'] || 'Pending'],
    ['Lineup', b.lineup || b['Lineup'] || 'Pending'],
    ['Travel', b.travel || b['Travel'] || 'Neutral / pending']
  ];
  return `<div class="model-score-grid">${rows.map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join('')}</div>`;
}
function verificationHtml(p){
  const st = normalizedPickStatus(p);
  const hit = apiResultForPick(p);
  const game = hit?.grading?.game;
  return `<div class="consumer-detail-grid"><div class="consumer-metric"><small>Status</small><strong>${statusDisplayIcon(st)}</strong><span>${hit ? 'Verified through grade-picks API' : 'Waiting for API match'}</span></div><div class="consumer-metric"><small>Source</small><strong>${hit ? 'MLB API' : 'Pending'}</strong><span>${verificationNoteForPick(p)}</span></div>${game ? `<div class="consumer-metric"><small>Final</small><strong>${game.away} ${game.awayScore} - ${game.home} ${game.homeScore}</strong><span>${game.status || 'Final'}</span></div>` : ''}</div>`;
}
function pitcherPropHistoryHtml(p){
  return `<div class="current-k-line"><h4>Starting Pitchers</h4>${startingPitcherBlock(p)}</div><div class="historical-prop-evidence"><h4>Pitcher / K Prop History</h4>${currentKLineHtml(p)}${matchupPropHistoryHtml(p)}</div>`;
}
function openPick(i){
  const p = coreDailyPicks[i];
  const st = normalizedPickStatus(p);
  const scoreMeta = typeof p.score === 'number' ? `<span class="pill">Model Score ${p.score}</span>` : `<span class="pill ${'status-'+slugStatus(st)}">Result ${pickScoreDisplay(p)}</span>`;
  const consumerWhy = consumerReasoningNotes(p);
  const reasoningHtml = consumerWhy.length ? `<div class="reason-block"><ul class="clean">${consumerWhy.map(w=>`<li>${w}</li>`).join('')}</ul></div>` : '<p class="subtle">Consumer-facing reasoning notes are pending for this pick.</p>';
  const detailSections = [
    detailAccordion('Verified Result', verificationHtml(p), true),
    detailAccordion('Starting Pitchers / K Prop History', pitcherPropHistoryHtml(p), false),
    detailAccordion('Model Breakdown', modelBreakdownHtml(p), false),
    detailAccordion('Matched Trend Evidence', trendEvidenceHtml(p), true),
    detailAccordion('Reasoning Notes', reasoningHtml, false)
  ].join('');
  $('#modalBody').innerHTML = `<h2>${cleanPickTitle(p)}</h2>${matchupSubtitleHtml(p)}<p class="eyebrow">${p.slate} • ${statusDisplayName(st)}</p><div class="meta"><span class="pill">Category ${pickCategory(p)}</span><span class="pill">Odds ${p.odds || '-'}</span><span class="pill">Units ${explicitUnitSize(p)?String(p.units).trim():'No unit size'}</span>${scoreMeta}<span class="pill">P/L ${explicitUnitSize(p)&&['WIN','LOSS'].includes(st)?formatUnits(profitUnits(p)):'-'}</span></div>${detailSections}`;
  $('#modal').classList.remove('hidden');
}

// V57 Unified MLB Truth Engine
// One pick collection now drives Today's Picks, Performance Lab, and F5 Performance.
(function sportsEdgeUnifiedTruthEngine(){
  function unifiedPickRows(){
    return (typeof coreDailyPicks !== 'undefined' && Array.isArray(coreDailyPicks)) ? coreDailyPicks : [];
  }
  function unifiedGradedRows(){
    return unifiedPickRows().filter(p => ['WIN','LOSS','PUSH'].includes(normalizedPickStatus(p)) && isClassifiedPick(p));
  }
  function unifiedType(p){
    const cat = bettorCategory(p);
    if(cat === 'First Five') return 'First Five';
    if(cat === 'Moneyline') return 'Moneyline';
    if(cat === 'Over') return 'Over';
    if(cat === 'Under') return 'Under';
    if(cat === 'Series') return 'Series';
    if(cat === 'Props') return 'Props';
    return cat || 'Other';
  }
  function unifiedStats(rows){
    const wins = rows.filter(p=>normalizedPickStatus(p)==='WIN').length;
    const losses = rows.filter(p=>normalizedPickStatus(p)==='LOSS').length;
    const pushes = rows.filter(p=>normalizedPickStatus(p)==='PUSH').length;
    const unitRows = rows.filter(p=>['WIN','LOSS'].includes(normalizedPickStatus(p)) && explicitUnitSize(p));
    const risk = unitRows.reduce((s,p)=>s+unitsValue(p),0);
    const net = unitRows.reduce((s,p)=>s+profitUnits(p),0);
    return {wins,losses,pushes,total:wins+losses+pushes,risk,net,roi:risk?(net/risk)*100:0};
  }
  function unifiedGroups(rows){
    const map = {};
    rows.forEach(p=>{ const type=unifiedType(p); (map[type] ||= []).push(p); });
    return Object.entries(map).map(([type,items])=>({type,items,stats:unifiedStats(items)}));
  }

  window.renderPerformanceLab = function renderPerformanceLabV57(){
    const all = unifiedPickRows().filter(isClassifiedPick);
    const graded = unifiedGradedRows();
    const typeSel = $('#officialTypeFilter');
    if(typeSel){
      const current = typeSel.value || 'all';
      typeSel.innerHTML = '<option value="all">All Bet Types</option>' + unifiedGroups(all).map(g=>g.type).sort().map(t=>`<option value="${t}">${t}</option>`).join('');
      if([...typeSel.options].some(o=>o.value===current)) typeSel.value=current;
    }
    const q = ($('#officialBetSearch')?.value || '').toLowerCase();
    const type = typeSel?.value || 'all';
    let rows = graded.filter(p => type==='all' || unifiedType(p)===type);
    if(q) rows = rows.filter(p=>JSON.stringify(p).toLowerCase().includes(q));
    const stats = unifiedStats(rows);
    const exposure = currentPerformanceExposure();
    const summary = $('#officialPerformanceSummary');
    if(summary) summary.innerHTML = `<div><strong>${stats.wins}-${stats.losses}${stats.pushes?`-${stats.pushes}`:''}</strong><small>Verified Record</small></div><div><strong>${stats.total?((stats.wins/(stats.wins+stats.losses))*100).toFixed(1)+'%':'—'}</strong><small>Win Rate</small></div><div><strong>${formatUnits(stats.net)}</strong><small>Unit Profit</small></div><div><strong>${stats.risk?stats.roi.toFixed(1)+'%':'—'}</strong><small>ROI</small></div><div><strong>${exposure.rows.length}</strong><small>Open / Unverified</small></div>`;
    const board = $('#officialCategoryPerformance');
    if(board){
      const preferred=['First Five','Moneyline','Over','Under','Series','Props'];
      const grouped=Object.fromEntries(unifiedGroups(graded).map(g=>[g.type,g]));
      board.innerHTML = `<div class="performance-columns">${preferred.filter(t=>grouped[t]).map(t=>{const g=grouped[t];return `<section class="performance-column"><div class="pick-column-head"><h3>${t==='First Five'?'F5':t}</h3><span>${g.stats.wins}-${g.stats.losses}</span></div><div class="perf-mini"><strong>${formatUnits(g.stats.net)}</strong><small>${g.stats.risk?g.stats.roi.toFixed(1)+'% ROI':'No unit ROI'}</small></div></section>`;}).join('')}</div>`;
    }
    const log = $('#officialBetLog');
    if(log){
      const monthGroups={};
      rows.forEach(p=>{const k=monthKeyFromDate(p.slate);(monthGroups[k] ||= []).push(p);});
      const openHtml = exposure.rows.length ? `<details class="month-performance" open><summary><strong>Open / Awaiting Verification</strong><span>${exposure.rows.length} picks</span></summary><div class="official-log-header"><span>Date</span><span>Bet</span><span>Status</span><span>Units</span></div>${exposure.rows.slice().sort((a,b)=>dateKey(parseSlateDate(b.slate)).localeCompare(dateKey(parseSlateDate(a.slate)))).map(p=>`<div class="official-log-row"><span>${p.slate||''}</span><strong>${cleanPickTitle(p)}</strong><span>${statusDisplayName(normalizedPickStatus(p))}</span><span>${explicitUnitSize(p)?p.units:'—'}</span><small>${verificationNoteForPick(p)||p.edge||''}</small></div>`).join('')}</details>` : '';
      const gradedHtml = Object.entries(monthGroups).sort((a,b)=>b[0].localeCompare(a[0])).map(([m,items])=>{const s=unifiedStats(items);return `<details class="month-performance" open><summary><strong>${monthLabelFromKey(m)}</strong><span>${s.wins}-${s.losses}${s.pushes?`-${s.pushes}`:''} • ${formatUnits(s.net)}</span></summary><div class="official-log-header"><span>Date</span><span>Bet</span><span>Type</span><span>Result</span></div>${items.slice().sort((a,b)=>dateKey(parseSlateDate(b.slate)).localeCompare(dateKey(parseSlateDate(a.slate)))).map(p=>{const st=normalizedPickStatus(p);return `<div class="official-log-row"><span>${p.slate||''}</span><strong>${cleanPickTitle(p)}</strong><span>${unifiedType(p)}</span><span class="status-${st}">${st}</span><small>${verificationNoteForPick(p)||p.edge||''}</small></div>`;}).join('')}</details>`;}).join('');
      log.innerHTML = openHtml + (gradedHtml || '<p class="subtle">No verified graded plays match the current filters.</p>');
    }
  };

  function dailyF5Rows(){
    return unifiedGradedRows().filter(p=>bettorCategory(p)==='First Five').map(p=>{
      const st=normalizedPickStatus(p);
      const title=cleanPickTitle(p);
      const team=(title.match(/^F5\s+([A-Z]{2,3}|A'S)\b/i)||[])[1] || teamAbbr(title.replace(/^F5\s+/i,'').split(/\s+/)[0]);
      return {date:dateKey(parseSlateDate(p.slate)),team:String(team||'').toUpperCase(),bet:title,odds:p.odds||'-',outcome:st==='WIN'?'win':st==='LOSS'?'loss':'push',result:st==='PUSH'?0:profitUnits(p),score:Number(p.score)||0,source:'unified-pick-ledger'};
    });
  }
  const originalF5AllBets = window.f5AllBets || f5AllBets;
  window.f5AllBets = function f5AllBetsV57(){
    const base = originalF5AllBets();
    const map = new Map();
    [...base,...dailyF5Rows()].forEach(r=>{
      const key=`${String(r.date||'').slice(0,10)}::${normalizePickKeyText(r.bet||'')}`;
      map.set(key,r);
    });
    return [...map.values()];
  };
  try { f5AllBets = window.f5AllBets; } catch(e) {}

  window.fetchVerifiedGrades = async function fetchVerifiedGradesV57(){
    if(apiGradeState.loading) return;
    apiGradeState.loading=true; apiGradeState.error='';
    try{
      const payload = unifiedPickRows().map(p=>({date:dateKey(parseSlateDate(p.slate)),rawPick:cleanPickTitle(p),odds:p.odds||'',units:p.units||'',slate:p.slate||''})).filter(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date) && p.rawPick);
      const res=await fetch('/api/grade-picks',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({picks:payload})});
      if(!res.ok) throw new Error(`grade-picks returned ${res.status}`);
      const data=await res.json();
      if(!data.ok) throw new Error(data.error||'grade-picks returned ok:false');
      const lookup={};
      (data.dateBatches||[]).forEach(batch=>(batch.results||[]).forEach(result=>{lookup[apiGradeKey(batch.date||result.date,result.rawPick)]=result;}));
      apiGradeState={loading:false,loaded:true,error:'',summary:data.summary||null,dateBatches:data.dateBatches||[],resultByKey:lookup};
      renderPicks(); renderHomeDailyDashboard(); window.renderPerformanceLab(); renderF5PerformanceLab();
    }catch(err){apiGradeState.loading=false;apiGradeState.loaded=false;apiGradeState.error=err.message||'Could not load verified grades.';renderPicks();window.renderPerformanceLab();}
  };

  function cleanText(value){
    return String(value||'')
      .replace(/âš¾/g,'MLB')
      .replace(/⚾/g,'MLB')
      .replace(/âœ…/g,'WIN')
      .replace(/âœ•|âœ–|âŒ/g,'LOSS')
      .replace(/â€™/g,"'")
      .replace(/â€œ|â€/g,'"')
      .replace(/Â/g,'');
  }
  function sanitizeNode(root){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{const fixed=cleanText(n.nodeValue);if(fixed!==n.nodeValue)n.nodeValue=fixed;});
  }
  const startSanitizer=()=>{
    sanitizeNode(document.body);
    new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>sanitizeNode(n.nodeType===1?n:n.parentNode)))).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startSanitizer,{once:true}); else startSanitizer();
})();


// V59 customer-facing cleanup.
// The full performance ledger remains loaded in the background for future features,
// but the general Performance Dashboard is intentionally removed from public navigation.
(function sportsEdgeV59CustomerCleanup(){
  const MOJIBAKE_REPLACEMENTS = [
    [/âš¾/g, ''], [/⚾/g, ''], [/ðŸŽ¯/g, ''], [/ðŸ“Š/g, ''],
    [/âœ…/g, 'WIN'], [/âœ•|âœ–|âŒ/g, 'LOSS'], [/â€™/g, "'"],
    [/â€œ|â€/g, '"'], [/Â/g, '']
  ];
  function cleanValue(value){
    let output=String(value||'');
    MOJIBAKE_REPLACEMENTS.forEach(([pattern,replacement])=>{output=output.replace(pattern,replacement);});
    return output.replace(/^\s+/, '');
  }
  function cleanTree(root){
    if(!root) return;
    if(root.nodeType===3){root.nodeValue=cleanValue(root.nodeValue);return;}
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{const fixed=cleanValue(node.nodeValue);if(fixed!==node.nodeValue)node.nodeValue=fixed;});
    if(root.querySelectorAll){
      root.querySelectorAll('[title],[aria-label]').forEach(el=>{
        ['title','aria-label'].forEach(attr=>{if(el.hasAttribute(attr))el.setAttribute(attr,cleanValue(el.getAttribute(attr)));});
      });
    }
  }
  function removePublicPerformanceDashboard(){
    document.querySelectorAll('[data-page="performance"]').forEach(el=>el.remove());
    const page=document.getElementById('performance'); if(page) page.remove();
    const snapshot=document.getElementById('homePerformanceSnapshot'); if(snapshot) snapshot.remove();
    document.querySelectorAll('article,section,button,a').forEach(el=>{
      const text=cleanValue(el.textContent).trim().toLowerCase();
      if(text==='performance lab' || (text.includes('performance lab') && el.matches('.route-card,.jump,.nav'))){el.remove();}
    });
  }
  function applyCleanup(){cleanTree(document.body);removePublicPerformanceDashboard();}
  const start=()=>{
    applyCleanup();
    const observer=new MutationObserver(()=>applyCleanup());
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();


// Release 1 repository stabilization: customer-facing encoding guard.
// Stored pick and trend records are not changed. Only rendered text is cleaned.
(function sportsEdgeEncodingGuard(){
  const knownHeadings = [
    "Today's MLB Picks", "Series Board", "F5 Performance", "Trend Database",
    "Verified Result", "Matched Trend Evidence", "Starting Pitchers / K Prop History",
    "Model Breakdown"
  ];

  function cleanRenderedText(value){
    let text = String(value ?? '');
    // Remove common single- and multi-decoded UTF-8 mojibake tokens.
    text = text
      .replace(/(?:Ã.|Â.|â..|ð...|�)+/g, '')
      .replace(/⚾|🎯|📊/g, '')
      .replace(/\s{2,}/g, ' ')
      .trimStart();

    // Restore exact customer-facing headings if damaged text precedes them.
    for (const heading of knownHeadings) {
      const index = text.indexOf(heading);
      if (index > 0) text = text.slice(index);
    }
    return text;
  }

  function cleanNode(root){
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const cleaned = cleanRenderedText(root.nodeValue);
      if (cleaned !== root.nodeValue) root.nodeValue = cleaned;
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const cleaned = cleanRenderedText(node.nodeValue);
      if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
    });
  }

  function start(){
    cleanNode(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') cleanNode(record.target);
        record.addedNodes.forEach(cleanNode);
      }
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();

/* Release 3: Official matchup resolution connected to Today's Picks.
   Uses the existing /api/live-data?date=YYYY-MM-DD&team=XXX endpoint.
   API context is preferred; existing stored/manual context remains a fallback. */
(function sportsEdgeOfficialMatchupConnection(){
  const contextCache = new Map();
  const pendingRequests = new Map();
  const baseMatchupContextForPick = matchupContextForPick;
  const baseOpenPick = openPick;

  function resolverTeamForPick(p){
    const teams = teamsFromPickText(p?.pick || '');
    return teams.length ? teamAbbr(teams[0]) : '';
  }

  function contextKeyForPick(p){
    const date = slateDateIso(p);
    const team = resolverTeamForPick(p);
    return date && team ? `${date}|${team}` : '';
  }

  function apiContextFromPayload(payload){
    if(!payload?.resolved || !payload?.game) return null;
    const game = payload.game;
    const away = teamAbbr(game?.awayTeam?.abbreviation || '');
    const home = teamAbbr(game?.homeTeam?.abbreviation || '');
    if(!away || !home) return null;
    return {
      away,
      home,
      label: game.matchup || `${away} @ ${home}`,
      opponent: teamAbbr(payload.opponent || ''),
      role: payload.role || '',
      gamePk: game.gamePk || null,
      officialDate: game.officialDate || null,
      gameDate: game.gameDate || null,
      venue: game?.venue?.name || '',
      status: game?.status?.detailed || game?.status?.abstract || '',
      seriesDescription: game.seriesDescription || '',
      seriesGameNumber: game.seriesGameNumber ?? null,
      gamesInSeries: game.gamesInSeries ?? null,
      dayNight: game.dayNight || '',
      awayPitcher: game?.awayTeam?.probablePitcher?.fullName || 'Probable starter pending',
      homePitcher: game?.homeTeam?.probablePitcher?.fullName || 'Probable starter pending',
      source: 'Official MLB Stats API'
    };
  }

  matchupContextForPick = function(p){
    if(p?._officialMatchupContext) return p._officialMatchupContext;
    const key = contextKeyForPick(p);
    if(key && contextCache.has(key)) return contextCache.get(key);
    return baseMatchupContextForPick(p);
  };

  async function resolvePickContext(p){
    const key = contextKeyForPick(p);
    if(!key) return null;
    if(p?._officialMatchupContext) return p._officialMatchupContext;
    if(contextCache.has(key)){
      p._officialMatchupContext = contextCache.get(key);
      return p._officialMatchupContext;
    }
    if(pendingRequests.has(key)) return pendingRequests.get(key);

    const [date, team] = key.split('|');
    const request = fetch(`/api/live-data?date=${encodeURIComponent(date)}&team=${encodeURIComponent(team)}`, {cache:'no-store'})
      .then(async response => {
        if(!response.ok) throw new Error(`Matchup API returned ${response.status}`);
        const payload = await response.json();
        if(payload?.reason === 'AMBIGUOUS_MULTIPLE_GAMES'){
          p._matchupResolutionReason = 'AMBIGUOUS_MULTIPLE_GAMES';
          return null;
        }
        const ctx = apiContextFromPayload(payload);
        if(ctx){
          contextCache.set(key, ctx);
          p._officialMatchupContext = ctx;
          p.gamePk = p.gamePk || ctx.gamePk;
          p.opponent = p.opponent || ctx.opponent;
          p.homeAway = p.homeAway || ctx.role;
        }else{
          p._matchupResolutionReason = payload?.reason || 'NO_MATCHING_GAME';
        }
        return ctx;
      })
      .catch(error => {
        console.warn('Sports Edge matchup resolution failed:', key, error);
        p._matchupResolutionReason = 'API_REQUEST_FAILED';
        return null;
      })
      .finally(() => pendingRequests.delete(key));

    pendingRequests.set(key, request);
    return request;
  }

  function latestSlateRows(){
    if(!Array.isArray(coreDailyPicks) || !coreDailyPicks.length) return [];
    const dated = coreDailyPicks
      .map(p => ({p, date: slateDateIso(p)}))
      .filter(x => x.date)
      .sort((a,b) => b.date.localeCompare(a.date));
    if(!dated.length) return [];
    const latest = dated[0].date;
    return dated.filter(x => x.date === latest).map(x => x.p);
  }

  async function resolveLatestSlate(){
    const rows = latestSlateRows();
    if(!rows.length) return;
    await Promise.all(rows.map(resolvePickContext));
    try{ renderPicks(); }catch(error){ console.warn('Could not refresh picks after matchup resolution:', error); }
  }

  openPick = function(index){
    const p = coreDailyPicks[index];
    baseOpenPick(index);
    if(!p?._officialMatchupContext){
      resolvePickContext(p).then(ctx => {
        if(ctx && !$('#modal')?.classList.contains('hidden')) baseOpenPick(index);
      });
    }
  };

  const baseStartingPitcherBlock = startingPitcherBlock;
  startingPitcherBlock = function(p){
    const ctx = matchupContextForPick(p);
    if(ctx?._unused) return baseStartingPitcherBlock(p);
    if(ctx?.source === 'Official MLB Stats API'){
      const seriesText = ctx.seriesGameNumber ? `Game ${ctx.seriesGameNumber}${ctx.gamesInSeries ? ` of ${ctx.gamesInSeries}` : ''}` : (ctx.seriesDescription || 'Series context pending');
      return `<div class="pitcher-card"><div><small>${ctx.away}</small><strong>${ctx.awayPitcher}</strong><span>Road starter</span></div><div><small>${ctx.home}</small><strong>${ctx.homePitcher}</strong><span>Home starter</span></div></div><div class="meta"><span class="pill">Official game ${ctx.gamePk || '-'}</span><span class="pill">${ctx.venue || 'Venue pending'}</span><span class="pill">${seriesText}</span><span class="pill">${ctx.status || 'Status pending'}</span></div>`;
    }
    return baseStartingPitcherBlock(p);
  };

  setTimeout(resolveLatestSlate, 150);
})();
