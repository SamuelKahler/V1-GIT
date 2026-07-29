const SCHEDULE_URL = 'https://statsapi.mlb.com/api/v1/schedule';
const FEED_URL = 'https://statsapi.mlb.com/api/v1.1/game';

const TEAM = Object.freeze({
  ARI:'ARI',ATL:'ATL',BAL:'BAL',BOS:'BOS',CHC:'CHC',CWS:'CWS',CIN:'CIN',CLE:'CLE',COL:'COL',DET:'DET',HOU:'HOU',KC:'KC',KCR:'KC',LAA:'LAA',LAD:'LAD',MIA:'MIA',MIL:'MIL',MIN:'MIN',NYM:'NYM',NYY:'NYY',ATH:'ATH',OAK:'ATH',PHI:'PHI',PIT:'PIT',SD:'SD',SDP:'SD',SEA:'SEA',SF:'SF',SFG:'SF',STL:'STL',TB:'TB',TBR:'TB',TEX:'TEX',TOR:'TOR',WSH:'WSH',WAS:'WSH',
  'A\'S':'ATH',ATHLETICS:'ATH',ROYALS:'KC',DODGERS:'LAD',ANGELS:'LAA',MARINERS:'SEA',TIGERS:'DET',NATIONALS:'WSH',BLUEJAYS:'TOR','BLUE JAYS':'TOR',YANKEES:'NYY',METS:'NYM',CUBS:'CHC',WHITESOX:'CWS','WHITE SOX':'CWS',REDS:'CIN',GUARDIANS:'CLE',ROCKIES:'COL',ASTROS:'HOU',MARLINS:'MIA',BREWERS:'MIL',TWINS:'MIN',PHILLIES:'PHI',PIRATES:'PIT',PADRES:'SD',GIANTS:'SF',CARDINALS:'STL',RAYS:'TB',RANGERS:'TEX',BRAVES:'ATL',ORIOLES:'BAL',REDSOX:'BOS','RED SOX':'BOS',DIAMONDBACKS:'ARI'
});

const clean = value => String(value ?? '').trim();
const upper = value => clean(value).toUpperCase().replace(/\s+/g,' ');
const normalizeTeam = value => TEAM[upper(value).replace(/\./g,'')] || upper(value).replace(/\./g,'');
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
        headers:{ Accept:'application/json', 'User-Agent':'Sports-Edge/8.0' },
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
    away: normalizeTeam(game?.teams?.away?.team?.abbreviation || game?.teams?.away?.team?.name),
    home: normalizeTeam(game?.teams?.home?.team?.abbreviation || game?.teams?.home?.team?.name),
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
  const away = normalizeTeam(gd?.teams?.away?.abbreviation || gd?.teams?.away?.name);
  const home = normalizeTeam(gd?.teams?.home?.abbreviation || gd?.teams?.home?.name);
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

async function persist(rows) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { enabled:false, inserted:0, reason:'SUPABASE_ENV_NOT_CONFIGURED' };
  const response = await fetch(`${url}/rest/v1/pick_observations?on_conflict=pick_id`, {
    method:'POST', headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates,return=minimal' },
    body:JSON.stringify(rows.map(row=>({ pick_id:row.pickId, game_pk:row.gamePk, pick_date:row.date, selected_team:row.selectedTeam, opponent:row.opponent, market:row.market, period:row.period, line:row.line, odds:row.odds, result:row.result, grade_reason:row.gradeReason, resolution_confidence:row.resolutionConfidence, environment:row.environment, source_record:row.sourceRecord })))
  });
  if (!response.ok) throw new Error(`Supabase persistence failed (${response.status}): ${await response.text()}`);
  return { enabled:true, inserted:rows.length };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'METHOD_NOT_ALLOWED' });
  try {
    const picks = Array.isArray(req.body?.picks) ? req.body.picks : [];
    if (!picks.length) return res.status(400).json({ error:'NO_PICKS' });
    if (picks.length > 2500) return res.status(413).json({ error:'TOO_MANY_PICKS', limit:2500 });
    const dates = [...new Set(picks.map(p=>p.date || p.normalizedDate).filter(Boolean))];
    const scheduleRows = await mapWithConcurrency(dates, 4, async date => {
      const payload = await getJson(`${SCHEDULE_URL}?sportId=1&date=${encodeURIComponent(date)}&hydrate=team,linescore,probablePitcher,venue`);
      return [date, scheduleGames(payload)];
    });
    const schedules = new Map(scheduleRows);
    const resolved = picks.map(pick => ({ pick, resolution:resolveGame(pick, schedules.get(pick.date || pick.normalizedDate) || []) }));
    const uniqueGamePks = [...new Set(resolved.map(row=>row.resolution.game?.gamePk).filter(Boolean))];
    const feedRows = await mapWithConcurrency(uniqueGamePks, 8, async gamePk => [
      gamePk,
      feedSummary(await getJson(`${FEED_URL}/${gamePk}/feed/live`))
    ]);
    const feeds = new Map(feedRows);
    const rows = resolved.map(({pick,resolution}) => {
      const sourceStatus = upper(pick.status || pick.result);
      if (sourceStatus === 'VOID' || sourceStatus === 'DISREGARD') return { pickId:pick.id || pick.coreId || pick.preservationId, date:pick.date || pick.normalizedDate, selectedTeam:pick.selectedTeam || null, opponent:pick.opponent || null, market:market(pick), period:period(pick), line:line(pick), odds:finite(pick.odds), gamePk:resolution.game?.gamePk || null, result:'VOID', gradeReason:'SOURCE_MARKED_VOID', resolutionConfidence:resolution.game ? resolution.confidence : 100, environment:null, sourceRecord:pick };
      if (!resolution.game) return { pickId:pick.id || pick.coreId || pick.preservationId, date:pick.date || pick.normalizedDate, selectedTeam:pick.selectedTeam || null, opponent:pick.opponent || null, market:market(pick), period:period(pick), line:line(pick), odds:finite(pick.odds), gamePk:null, result:'UNVERIFIED', gradeReason:resolution.reason, resolutionConfidence:0, environment:null, sourceRecord:pick };
      const game = feeds.get(resolution.game.gamePk); const graded = grade(pick, game); const env = environment(pick,resolution.game,game);
      return { pickId:pick.id || pick.coreId || pick.preservationId, date:pick.date || pick.normalizedDate, selectedTeam:env.team, opponent:env.opponent, market:env.market, period:env.period, line:env.line, odds:env.odds, gamePk:resolution.game.gamePk, result:graded.result, gradeReason:graded.reason, resolutionConfidence:resolution.confidence, environment:env, sourceRecord:pick };
    });
    const persistence = req.query.persist === '1' ? await persist(rows) : { enabled:false, inserted:0, reason:'PREVIEW_MODE' };
    const counts = rows.reduce((out,row)=>{ out[row.result]=(out[row.result]||0)+1; return out; },{});
    return res.status(200).json({
      version:'8.0.0',
      generatedAt:new Date().toISOString(),
      total:rows.length,
      counts,
      unresolved:rows.filter(r=>r.result==='UNVERIFIED').length,
      pending:rows.filter(r=>r.result==='PENDING').length,
      diagnostics:{ dates:dates.length, gamesResolved:uniqueGamePks.length, source:'Official MLB Stats API', paidCreditsRequired:false },
      persistence,
      rows
    });
  } catch (error) {
    return res.status(500).json({ error:'INTELLIGENCE_SYNC_FAILED', message:error.message });
  }
};
