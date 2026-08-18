import { loadRecentDailyPicks } from '../lib/mlb/daily-operations.js';
import { requireAdmin } from '../lib/mlb/auth.js';
const SCHEDULE_URL = 'https://statsapi.mlb.com/api/v1/schedule';
const FEED_URL = 'https://statsapi.mlb.com/api/v1.1/game';

const TEAM = Object.freeze({
  ARI:'ARI',ATL:'ATL',BAL:'BAL',BOS:'BOS',CHC:'CHC',CWS:'CWS',CIN:'CIN',CLE:'CLE',COL:'COL',DET:'DET',HOU:'HOU',KC:'KC',KCR:'KC',LAA:'LAA',LAD:'LAD',MIA:'MIA',MIL:'MIL',MIN:'MIN',NYM:'NYM',NYY:'NYY',ATH:'ATH',OAK:'ATH',PHI:'PHI',PIT:'PIT',SD:'SD',SDP:'SD',SEA:'SEA',SF:'SF',SFG:'SF',STL:'STL',TB:'TB',TBR:'TB',TEX:'TEX',TOR:'TOR',WSH:'WSH',WAS:'WSH',
  'ARIZONA DIAMONDBACKS':'ARI',DIAMONDBACKS:'ARI','ATLANTA BRAVES':'ATL',BRAVES:'ATL','BALTIMORE ORIOLES':'BAL',ORIOLES:'BAL','BOSTON RED SOX':'BOS','RED SOX':'BOS','CHICAGO CUBS':'CHC',CUBS:'CHC','CHICAGO WHITE SOX':'CWS','WHITE SOX':'CWS','CINCINNATI REDS':'CIN',REDS:'CIN','CLEVELAND GUARDIANS':'CLE',GUARDIANS:'CLE','COLORADO ROCKIES':'COL',ROCKIES:'COL','DETROIT TIGERS':'DET',TIGERS:'DET','HOUSTON ASTROS':'HOU',ASTROS:'HOU','KANSAS CITY ROYALS':'KC',ROYALS:'KC','LOS ANGELES ANGELS':'LAA',ANGELS:'LAA','LOS ANGELES DODGERS':'LAD',DODGERS:'LAD','MIAMI MARLINS':'MIA',MARLINS:'MIA','MILWAUKEE BREWERS':'MIL',BREWERS:'MIL','MINNESOTA TWINS':'MIN',TWINS:'MIN','NEW YORK METS':'NYM',METS:'NYM','NEW YORK YANKEES':'NYY',YANKEES:'NYY','OAKLAND ATHLETICS':'ATH',ATHLETICS:'ATH','A\'S':'ATH','PHILADELPHIA PHILLIES':'PHI',PHILLIES:'PHI','PITTSBURGH PIRATES':'PIT',PIRATES:'PIT','SAN DIEGO PADRES':'SD',PADRES:'SD','SEATTLE MARINERS':'SEA',MARINERS:'SEA','SAN FRANCISCO GIANTS':'SF',GIANTS:'SF','ST LOUIS CARDINALS':'STL','ST. LOUIS CARDINALS':'STL',CARDINALS:'STL','TAMPA BAY RAYS':'TB',RAYS:'TB','TEXAS RANGERS':'TEX',RANGERS:'TEX','TORONTO BLUE JAYS':'TOR','BLUE JAYS':'TOR','WASHINGTON NATIONALS':'WSH',NATIONALS:'WSH'
});
const TEAM_ID = Object.freeze({109:'ARI',144:'ATL',110:'BAL',111:'BOS',112:'CHC',145:'CWS',113:'CIN',114:'CLE',115:'COL',116:'DET',117:'HOU',118:'KC',108:'LAA',119:'LAD',146:'MIA',158:'MIL',142:'MIN',121:'NYM',147:'NYY',133:'ATH',143:'PHI',134:'PIT',135:'SD',136:'SEA',137:'SF',138:'STL',139:'TB',140:'TEX',141:'TOR',120:'WSH'});

const clean = value => String(value ?? '').trim();
const upper = value => clean(value).toUpperCase().replace(/\s+/g,' ');
const normalizeTeam = value => { const raw=upper(value).replace(/\./g,''); if(!raw) return null; if(TEAM[raw]) return TEAM[raw]; for(const key of Object.keys(TEAM).sort((a,b)=>b.length-a.length)){ if(raw.includes(key.replace(/\./g,''))) return TEAM[key]; } return raw; };
const finite = value => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
const finalState = value => /final|game over|completed/i.test(clean(value));

function aliasesInText(value) {
  const text = ` ${upper(value).replace(/[^A-Z0-9'+. -]/g,' ')} `;
  const found = [];
  Object.keys(TEAM).sort((a,b)=>b.length-a.length).forEach(alias => {
    const pattern = new RegExp(`(^|[^A-Z])${alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Z]|$)`);
    if (pattern.test(text)) found.push(TEAM[alias]);
  });
  return [...new Set(found)];
}

async function getJson(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        headers:{ Accept:'application/json', 'User-Agent':'Sports-Edge/11.0' },
        signal:controller.signal
      });
      if (!response.ok) throw new Error(`Upstream MLB request failed (${response.status})`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 250 * attempt));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError || new Error('Upstream MLB request failed');
}

async function mapWithConcurrency(items, limit, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length:Math.min(limit, items.length || 1) }, runner));
  return output;
}

function scheduleGames(payload) {
  return (payload?.dates || []).flatMap(day => day.games || []).map(game => ({
    gamePk: game.gamePk,
    date: game.officialDate,
    status: game?.status?.detailedState || game?.status?.abstractGameState,
    away: TEAM_ID[game?.teams?.away?.team?.id] || normalizeTeam(game?.teams?.away?.team?.abbreviation || game?.teams?.away?.team?.name),
    home: TEAM_ID[game?.teams?.home?.team?.id] || normalizeTeam(game?.teams?.home?.team?.abbreviation || game?.teams?.home?.team?.name),
    awayName: game?.teams?.away?.team?.name || null,
    homeName: game?.teams?.home?.team?.name || null,
    venue: game?.venue?.name || null,
    seriesGameNumber: game?.seriesGameNumber ?? null,
    gamesInSeries: game?.gamesInSeries ?? null,
    dayNight: game?.dayNight || null
  }));
}

function resolveGame(pick, games) {
  if (pick.gamePk) {
    const direct = games.find(game => String(game.gamePk) === String(pick.gamePk));
    if (direct) return { game:direct, confidence:100, reason:'EXISTING_GAME_PK' };
  }
  const rawTeams = aliasesInText(pick.rawPick || pick.pick || pick.selection || '');
  const selected = normalizeTeam(pick.selectedTeam || pick.team || rawTeams[0] || '');
  const opponent = normalizeTeam(pick.opponent || rawTeams.find(team => team !== selected) || '');
  let candidates = games.filter(game => [game.away, game.home].includes(selected));
  if (opponent) candidates = candidates.filter(game => [game.away, game.home].includes(opponent));
  if (candidates.length === 1) return { game:candidates[0], confidence:opponent ? 100 : 85, reason:opponent ? 'DATE_AND_TEAMS' : 'DATE_AND_SELECTED_TEAM' };
  if (!selected && rawTeams.length >= 2) {
    candidates = games.filter(game => rawTeams.includes(game.away) && rawTeams.includes(game.home));
    if (candidates.length === 1) return { game:candidates[0], confidence:100, reason:'DATE_AND_RAW_TEAMS' };
  }
  return { game:null, confidence:0, reason:candidates.length > 1 ? 'AMBIGUOUS_DOUBLEHEADER' : 'GAME_NOT_FOUND', candidates:candidates.map(g=>g.gamePk) };
}

function feedSummary(payload) {
  const gd = payload?.gameData || {};
  const ld = payload?.liveData || {};
  const ls = ld.linescore || {};
  const innings = Array.isArray(ls.innings) ? ls.innings : [];
  const sum = (side, count) => innings.filter(row=>Number(row.num)<=count).reduce((total,row)=>total + (finite(row?.[side]?.runs) || 0),0);
  const away = TEAM_ID[gd?.teams?.away?.id] || normalizeTeam(gd?.teams?.away?.abbreviation || gd?.teams?.away?.name);
  const home = TEAM_ID[gd?.teams?.home?.id] || normalizeTeam(gd?.teams?.home?.abbreviation || gd?.teams?.home?.name);
  const awayRuns = finite(ls?.teams?.away?.runs);
  const homeRuns = finite(ls?.teams?.home?.runs);
  const f5Available = [1,2,3,4,5].every(num=>innings.some(row=>Number(row.num)===num && row?.away?.runs != null && row?.home?.runs != null));
  return {
    gamePk: gd?.game?.pk || null,
    status: gd?.status?.detailedState || gd?.status?.abstractGameState || null,
    isFinal: finalState(gd?.status?.detailedState || gd?.status?.abstractGameState),
    away, home, awayRuns, homeRuns,
    f5: { available:f5Available, away:f5Available ? sum('away',5) : null, home:f5Available ? sum('home',5) : null },
    venue: gd?.venue?.name || null,
    dayNight: gd?.datetime?.dayNight || null,
    weather: ld?.boxscore?.info ? Object.fromEntries(ld.boxscore.info.map(row=>[row.label,row.value])) : {},
    starters: {
      away: gd?.probablePitchers?.away?.fullName || null,
      home: gd?.probablePitchers?.home?.fullName || null
    }
  };
}

function market(pick) {
  const stored = upper(pick.market);
  if (stored && stored !== 'UNKNOWN') return stored;
  const raw = upper(pick.rawPick || pick.pick || pick.selection);
  if (/\bO(?:VER)?\s*\d|\bU(?:NDER)?\s*\d|TOTAL/.test(raw)) return 'TOTAL';
  if (/\bML\b|MONEYLINE/.test(raw)) return 'MONEYLINE';
  if (/[+-]\s*\d+(?:\.5)?|RUN LINE|SPREAD/.test(raw)) return 'SPREAD';
  return 'UNKNOWN';
}
function period(pick) { return upper(pick.period) || (/\bF5\b|FIRST FIVE|FIRST 5/.test(upper(pick.rawPick || pick.pick)) ? 'FIRST_FIVE' : 'FULL_GAME'); }
function line(pick) {
  if (finite(pick.line) != null) return finite(pick.line);
  const raw = upper(pick.rawPick || pick.pick || pick.selection);
  const total = raw.match(/\b(?:O|OVER|U|UNDER)\s*\*?\s*(\d+(?:\.5)?)/);
  if (total) return Number(total[1]);
  const spread = raw.match(/(?:^|\s)([+-]\d+(?:\.5)?)(?:\s|$)/);
  return spread ? Number(spread[1]) : null;
}
function totalSide(pick) { const raw=upper(pick.rawPick || pick.pick || pick.selection); return /\bU(?:NDER)?\s*\d/.test(raw) ? 'UNDER' : /\bO(?:VER)?\s*\d/.test(raw) ? 'OVER' : null; }
function grade(pick, game) {
  if (!game.isFinal) return { result:'PENDING', reason:'GAME_NOT_FINAL' };
  const m = market(pick); const p = period(pick); const l = line(pick);
  const selected = normalizeTeam(pick.selectedTeam || pick.team || aliasesInText(pick.rawPick || pick.pick)[0] || '');
  const isAway = selected === game.away; const isHome = selected === game.home;
  const score = p === 'FIRST_FIVE' ? game.f5 : { available:true, away:game.awayRuns, home:game.homeRuns };
  if (!score.available) return { result:'UNVERIFIED', reason:'F5_SCORE_UNAVAILABLE' };
  if (m === 'TOTAL') {
    if (l == null || !totalSide(pick)) return { result:'UNVERIFIED', reason:'TOTAL_LINE_OR_SIDE_MISSING' };
    const total = score.away + score.home;
    if (total === l) return { result:'PUSH', reason:'OFFICIAL_SCORE', observed:total };
    const win = totalSide(pick)==='OVER' ? total > l : total < l;
    return { result:win?'WIN':'LOSS', reason:'OFFICIAL_SCORE', observed:total };
  }
  if (!isAway && !isHome) return { result:'UNVERIFIED', reason:'SELECTED_TEAM_MISSING' };
  const selectedScore = isAway ? score.away : score.home;
  const opponentScore = isAway ? score.home : score.away;
  if (m === 'MONEYLINE') {
    if (selectedScore === opponentScore) return { result:'PUSH', reason:'OFFICIAL_SCORE' };
    return { result:selectedScore>opponentScore?'WIN':'LOSS', reason:'OFFICIAL_SCORE' };
  }
  if (m === 'SPREAD') {
    if (l == null) return { result:'UNVERIFIED', reason:'SPREAD_LINE_MISSING' };
    const adjusted = selectedScore + l;
    if (adjusted === opponentScore) return { result:'PUSH', reason:'OFFICIAL_SCORE' };
    return { result:adjusted>opponentScore?'WIN':'LOSS', reason:'OFFICIAL_SCORE' };
  }
  return { result:'UNVERIFIED', reason:'UNSUPPORTED_MARKET' };
}

function environment(pick, schedule, game) {
  const selected = normalizeTeam(pick.selectedTeam || pick.team || aliasesInText(pick.rawPick || pick.pick)[0] || '');
  const role = selected === schedule.home ? 'HOME' : selected === schedule.away ? 'AWAY' : 'UNKNOWN';
  const opponent = role === 'HOME' ? schedule.away : role === 'AWAY' ? schedule.home : null;
  const odds = finite(pick.odds);
  const oddsBucket = odds == null ? 'NO_ODDS' : odds <= -151 ? 'HEAVY_FAVORITE' : odds <= -111 ? 'FAVORITE' : odds <= 109 ? 'NEAR_PICKEM' : odds <= 150 ? 'UNDERDOG' : 'BIG_UNDERDOG';
  return { team:selected || null, opponent, role, market:market(pick), period:period(pick), line:line(pick), odds, oddsBucket, venue:game.venue || schedule.venue, dayNight:game.dayNight || schedule.dayNight, seriesGameNumber:schedule.seriesGameNumber, gamesInSeries:schedule.gamesInSeries, starters:game.starters, weather:game.weather };
}

function authoritativeResult(pick){
  const candidate=upper(pick.result||pick.status);
  return ['WIN','LOSS','PUSH','VOID'].includes(candidate)?candidate:null;
}

async function persist(rows) {
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if(!url||!key) return {enabled:false,inserted:0,reason:'SUPABASE_ENV_NOT_CONFIGURED'};
  const body=rows.map(row=>({pick_id:row.pickId,game_pk:row.gamePk,pick_date:row.date,selected_team:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,line:row.line,odds:row.odds,result:row.result,grade_reason:row.gradeReason,resolution_confidence:row.resolutionConfidence,environment:row.environment,source_record:row.sourceRecord}));
  let lastError;
  for(let attempt=1;attempt<=3;attempt+=1){
    try{
      const response=await fetch(`${url}/rest/v1/pick_observations?on_conflict=pick_id`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
      if(!response.ok) throw new Error(`Supabase persistence failed (${response.status}): ${await response.text()}`);
      return {enabled:true,inserted:rows.length,attempts:attempt};
    }catch(error){
      lastError=error;
      if(attempt<3) await new Promise(resolve=>setTimeout(resolve,400*attempt));
    }
  }
  throw lastError;
}

function requireCronSecret(req){
  const configured=String(process.env.CRON_SECRET||'').trim();
  const authorization=String(req?.headers?.authorization||req?.headers?.Authorization||'').trim();
  if(!configured) throw new Error('CRON_SECRET_NOT_CONFIGURED');
  if(authorization!==`Bearer ${configured}`) throw new Error('CRON_AUTHORIZATION_FAILED');
}

async function storedGrades(days=120){
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if(!url||!key) throw new Error('SUPABASE_ENV_NOT_CONFIGURED');
  const start=new Date();
  start.setUTCDate(start.getUTCDate()-Math.max(1,Number(days)||120));
  const startDate=start.toISOString().slice(0,10);
  const select='pick_id,game_pk,pick_date,selected_team,opponent,market,period,line,odds,result,grade_reason,resolution_confidence,environment,source_record,updated_at';
  const endpoint=`${url}/rest/v1/sports_edge_pick_grade_canonical?select=${encodeURIComponent(select)}&pick_date=gte.${startDate}&order=pick_date.asc`;
  const response=await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'}});
  if(!response.ok) throw new Error(`Stored grade fetch failed (${response.status}): ${await response.text()}`);
  const rows=await response.json();
  return rows.map(row=>({
    pickId:row.pick_id,
    sourceId:row.pick_id,
    gamePk:row.game_pk,
    date:row.pick_date,
    selectedTeam:row.selected_team,
    opponent:row.opponent,
    market:row.market,
    period:row.period,
    line:row.line,
    odds:row.odds,
    rawPick:row.source_record?.rawPick || row.source_record?.raw_pick || row.source_record?.pick || null,
    result:row.result,
    gradeReason:row.grade_reason,
    resolutionConfidence:row.resolution_confidence,
    metadataStatus:row.game_pk?'RESOLVED':'RETRY_REQUIRED',
    environment:row.environment,
    updatedAt:row.updated_at
  }));
}

export async function processPicks(picks,{persistRows=false}={}){
  if(!Array.isArray(picks)||!picks.length) return {version:'12.0.0',generatedAt:new Date().toISOString(),total:0,counts:{},unresolved:0,pending:0,diagnostics:{dates:0,gamesResolved:0,source:'Official MLB Stats API',paidCreditsRequired:false},persistence:{enabled:false,inserted:0,reason:'NO_PICKS'},rows:[]};
  const dates=[...new Set(picks.map(p=>p.date||p.normalizedDate).filter(Boolean))];
  const scheduleRows=await mapWithConcurrency(dates,4,async date=>{
    try{return [date,scheduleGames(await getJson(`${SCHEDULE_URL}?sportId=1&date=${encodeURIComponent(date)}&hydrate=team,linescore,probablePitcher,venue`))];}
    catch(error){return [date,{error:error.message,games:[]}];}
  });
  const schedules=new Map(scheduleRows);
  const resolved=picks.map(pick=>{
    const entry=schedules.get(pick.date||pick.normalizedDate); const games=Array.isArray(entry)?entry:(entry?.games||[]);
    return {pick,resolution:resolveGame(pick,games),scheduleError:entry?.error||null};
  });
  const gamePks=[...new Set(resolved.map(x=>x.resolution.game?.gamePk).filter(Boolean))];
  const feedRows=await mapWithConcurrency(gamePks,8,async gamePk=>{try{return [gamePk,feedSummary(await getJson(`${FEED_URL}/${gamePk}/feed/live`))];}catch(error){return [gamePk,{error:error.message}];}});
  const feeds=new Map(feedRows);
  const rows=resolved.map(({pick,resolution,scheduleError})=>{
    const preserved=authoritativeResult(pick); const pickId=pick.id||pick.sourceId||pick.coreId||pick.preservationId;
    const base={pickId,date:pick.date||pick.normalizedDate,selectedTeam:pick.selectedTeam||null,opponent:pick.opponent||null,market:market(pick),period:period(pick),line:line(pick),odds:finite(pick.odds),gamePk:resolution.game?.gamePk||pick.gamePk||null,sourceRecord:pick};
    if(!resolution.game){return {...base,result:preserved||'UNVERIFIED',gradeReason:preserved?'PRESERVED_EXISTING_GRADE_METADATA_UNRESOLVED':(scheduleError?`SCHEDULE_API_FAILED: ${scheduleError}`:resolution.reason),metadataStatus:'RETRY_REQUIRED',resolutionConfidence:0,environment:null};}
    const game=feeds.get(resolution.game.gamePk);
    if(!game||game.error){return {...base,result:preserved||'UNVERIFIED',gradeReason:preserved?'PRESERVED_EXISTING_GRADE_FEED_UNRESOLVED':`GAME_FEED_FAILED: ${game?.error||'UNKNOWN'}`,metadataStatus:'RETRY_REQUIRED',resolutionConfidence:resolution.confidence,environment:null};}
    const env=environment(pick,resolution.game,game); const computed=grade(pick,game);
    return {...base,selectedTeam:env.team,opponent:env.opponent,gamePk:resolution.game.gamePk,result:preserved||computed.result,gradeReason:preserved?'PRESERVED_EXISTING_GRADE':computed.reason,metadataStatus:'RESOLVED',resolutionConfidence:resolution.confidence,environment:env};
  });
  const persistence=persistRows?await persist(rows):{enabled:false,inserted:0,reason:'PREVIEW_MODE'};
  const counts={}; rows.forEach(r=>counts[r.result]=(counts[r.result]||0)+1);
  return {version:'12.0.0',generatedAt:new Date().toISOString(),total:rows.length,counts,unresolved:rows.filter(r=>r.result==='UNVERIFIED').length,pending:rows.filter(r=>r.result==='PENDING').length,diagnostics:{dates:dates.length,gamesResolved:gamePks.length,source:'Official MLB Stats API',paidCreditsRequired:false},persistence,rows};
}

async function runDailyCron(req){
  requireCronSecret(req);
  const days=Math.min(45,Math.max(7,Number(req.query?.days)||28));
  const picks=await loadRecentDailyPicks(days,false);
  const batches=[];
  for(let i=0;i<picks.length;i+=90) batches.push(picks.slice(i,i+90));
  const parts=[];
  for(const batch of batches) parts.push(await processPicks(batch,{persistRows:true}));
  const counts={}; let total=0,unresolved=0,pending=0,inserted=0;
  parts.forEach(part=>{
    total+=part.total; unresolved+=part.unresolved; pending+=part.pending; inserted+=Number(part.persistence?.inserted||0);
    Object.entries(part.counts||{}).forEach(([key,value])=>counts[key]=(counts[key]||0)+Number(value||0));
  });
  return {version:'12.0.0',mode:'DAILY_OPERATIONS_CRON',generatedAt:new Date().toISOString(),lookbackDays:days,batches:batches.length,total,counts,unresolved,pending,persistence:{enabled:true,inserted}};
}

export default async function handler(req,res){
  try{
    if(req.method==='GET'){
      const mode=String(req.query?.mode||'').trim().toLowerCase();
      if(mode==='stored'){
        const rows=await storedGrades(req.query?.days||120);
        return res.status(200).json({version:'12.0.0',mode:'STORED_GRADES',generatedAt:new Date().toISOString(),total:rows.length,rows});
      }
      if(mode==='cron') return res.status(200).json(await runDailyCron(req));
      return res.status(400).json({error:'UNKNOWN_GET_MODE',allowed:['stored','cron']});
    }
    if(req.method!=='POST') return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
    const picks=Array.isArray(req.body?.picks)?req.body.picks:[];
    if(!picks.length) return res.status(400).json({error:'NO_PICKS'});
    if(picks.length>100) return res.status(413).json({error:'BATCH_TOO_LARGE',limit:100});
    const persistRows=req.query.persist==='1';
    if(persistRows) requireAdmin(req);
    const data=await processPicks(picks,{persistRows});
    return res.status(200).json(data);
  }catch(error){
    const message=error?.message||String(error);
    const status=/AUTHORIZATION_FAILED/.test(message)?401:/NOT_CONFIGURED/.test(message)?503:500;
    return res.status(status).json({error:'INTELLIGENCE_SYNC_FAILED',message});
  }
}
