// V44.2 Sports Edge Verified July Bulk Grading Engine
// Location in repo: sports-edge-clean-repo/api/grade-picks.js
// Purpose: server-side verified MLB grading helper + July bulk grading test.
// IMPORTANT: Do not paste API keys in this file. Vercel reads ODDS_API_KEY from Environment Variables.

const MLB_TEAM_ABBR = {
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Athletics': "A's",
  'Oakland Athletics': "A's",
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago Cubs': 'CHC',
  'Chicago White Sox': 'CWS',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Mets': 'NYM',
  'New York Yankees': 'NYY',
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WSH'
};

const TEAM_ALIASES = {
  ARI: 'ARI', ATL: 'ATL', BAL: 'BAL', BOS: 'BOS', CHC: 'CHC', CWS: 'CWS', CIN: 'CIN', CLE: 'CLE', COL: 'COL', DET: 'DET', HOU: 'HOU', KC: 'KC', LAA: 'LAA', LAD: 'LAD', MIA: 'MIA', MIL: 'MIL', MIN: 'MIN', NYM: 'NYM', NYY: 'NYY', PHI: 'PHI', PIT: 'PIT', SD: 'SD', SF: 'SF', SEA: 'SEA', STL: 'STL', TB: 'TB', TEX: 'TEX', TOR: 'TOR', WSH: 'WSH',
  ATH: "A's", OAK: "A's", AS: "A's", A: "A's", ATHLETICS: "A's",
  RAYS: 'TB', MARLINS: 'MIA', BREWERS: 'MIL', CUBS: 'CHC', METS: 'NYM', GUARDIANS: 'CLE', DODGERS: 'LAD', TWINS: 'MIN', CARDINALS: 'STL', ASTROS: 'HOU', BLUEJAYS: 'TOR', 'BLUE JAYS': 'TOR', REDS: 'CIN', WHITESOX: 'CWS', 'WHITE SOX': 'CWS', PADRES: 'SD', BRAVES: 'ATL', MARINERS: 'SEA', PIRATES: 'PIT', PHILLIES: 'PHI', GIANTS: 'SF', ANGELS: 'LAA', ORIOLES: 'BAL', RANGERS: 'TEX', ROCKIES: 'COL', DIAMONDBACKS: 'ARI', NATIONALS: 'WSH', TIGERS: 'DET', YANKEES: 'NYY', ROYALS: 'KC', REDSOX: 'BOS', 'RED SOX': 'BOS'
};

const JULY_PICKS = [
  // 07/01
  {date:'2026-07-01', rawPick:'CWS / BAL O10', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'CWS ML', odds:'+115', trendTags:['SWEEP'], notes:'LIVE'},
  {date:'2026-07-01', rawPick:'TEX ML', odds:'+103', units:'.35U', trendTags:['SWEEP']},
  {date:'2026-07-01', rawPick:'DET ML', odds:'+119', trendTags:['SWEEP']},
  {date:'2026-07-01', rawPick:'DET / NYY O9.5', odds:'-123', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'F5 SD +.5', odds:'-125', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'SD ML', odds:'+105', trendTags:['AtS'], notes:'LIVE'},
  {date:'2026-07-01', rawPick:'SD / CHC O11.5', odds:'-118', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'PIT ML', odds:'+115', trendTags:['PREV_SCORED 0'], notes:'LIVE'},
  {date:'2026-07-01', rawPick:'PIT / PHI O8', odds:'-115', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'TOR ML', odds:'-115'},
  {date:'2026-07-01', rawPick:'STL / ATL U9', odds:'-105'},
  {date:'2026-07-01', rawPick:'TB / KC U10.5', odds:'-110', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'F5 TB -.5', odds:'+100'},
  {date:'2026-07-01', rawPick:'STL / ATL U9', odds:'-119', units:'.35U'},
  {date:'2026-07-01', rawPick:'MIL ML', odds:'-162', notes:'LIVE'},
  {date:'2026-07-01', rawPick:'MIN / HOU O8.5', odds:'-110', units:'.7U'},
  {date:'2026-07-01', rawPick:'F5 MIA -.5', odds:'-120', units:'.55U', notes:'LIVE'},

  // 07/02
  {date:'2026-07-02', rawPick:'PIT ML', odds:'+110', trendTags:['ALLOWED 10+']},
  {date:'2026-07-02', rawPick:'F5 MIL -.5', odds:'-125', notes:'LIVE'},
  {date:'2026-07-02', rawPick:'MIA / COL O12.5', odds:'-105', units:'.5U'},
  {date:'2026-07-02', rawPick:'CLE ML', odds:'+100', notes:'LIVE'},
  {date:'2026-07-02', rawPick:'STL / ATL U9', odds:'-110'},
  {date:'2026-07-02', rawPick:'TB / KC O10.5', odds:'-105'},
  {date:'2026-07-02', rawPick:'F5 TEX -.5', odds:'+120'},
  {date:'2026-07-02', rawPick:'LAA ML', odds:'+162'},
  {date:'2026-07-02', rawPick:'LAA / SEA U7.5', odds:'-110'},
  {date:'2026-07-02', rawPick:'F5 SEA -.5', odds:'-140'},

  // 07/03
  {date:'2026-07-03', rawPick:'STL / CHC O10.5', odds:'-105', notes:'LIVE'},
  {date:'2026-07-03', rawPick:'PIT / WSH O9.5', odds:'-105'},
  {date:'2026-07-03', rawPick:'MIN / NYY O9.5', odds:'-105', notes:'LIVE'},
  {date:'2026-07-03', rawPick:'F5 TB -.5', odds:'+115', units:'.35U'},
  {date:'2026-07-03', rawPick:'MIA / A\'s O10.5', odds:'-110'},
  {date:'2026-07-03', rawPick:'MIL ML', odds:'-161'},
  {date:'2026-07-03', rawPick:'SEA ML', odds:'+109'},
  {date:'2026-07-03', rawPick:'TOR / SEA U7', odds:'-102'},

  // 07/04
  {date:'2026-07-04', rawPick:'MIN / NYY O10.5', odds:'-105', units:'.35U', notes:'LIVE; opened O10 -105'},
  {date:'2026-07-04', rawPick:'TEX ML', odds:'+106', units:'.4U', notes:'LIVE; opened -102'},
  {date:'2026-07-04', rawPick:'DET / TEX U8', odds:'-114', notes:'LIVE'},
  {date:'2026-07-04', rawPick:'SEA ML', odds:'-160', trendTags:['PREV_SCORED 0']},
  {date:'2026-07-04', rawPick:'F5 SEA -.5', odds:'-125', notes:'LIVE'},
  {date:'2026-07-04', rawPick:'TOR / SEA U7.5', odds:'-105'},
  {date:'2026-07-04', rawPick:'CIN ML', odds:'-120', trendTags:['PREV_SCORED 0']},
  {date:'2026-07-04', rawPick:'BAL / CIN O9', odds:'-125'},
  {date:'2026-07-04', rawPick:'CHC ML', odds:'-166', trendTags:['PREV_ALLOWED 10+']},
  {date:'2026-07-04', rawPick:'F5 ATL -.5', odds:'-130'},
  {date:'2026-07-04', rawPick:'BOS / LAA U8.5', odds:'-115', units:'.5U'},
  {date:'2026-07-04', rawPick:"A's ML", odds:'+105', trendTags:['ALLOWED 10+']},
  {date:'2026-07-04', rawPick:"MIA / A's O11", odds:'-105', notes:'LIVE'},
  {date:'2026-07-04', rawPick:'MIL / ARI U9', odds:'-105'},
  {date:'2026-07-04', rawPick:'F5 MIL -.5', odds:'-120'},

  // 07/05
  {date:'2026-07-05', rawPick:'ATL ML', odds:'-123', notes:'LIVE'},
  {date:'2026-07-05', rawPick:'NYM / ATL U9', odds:'-120', units:'.25U', notes:'LIVE; opened U9.5 -110'},
  {date:'2026-07-05', rawPick:'PIT / WSH O9.5', odds:'-110', notes:'LIVE'},
  {date:'2026-07-05', rawPick:'MIN / NYY O8', odds:'-110', notes:'LIVE'},
  {date:'2026-07-05', rawPick:'CHC ML', odds:'-150', trendTags:['PREV_SCORED 0','AtS'], notes:'LIVE'},
  {date:'2026-07-05', rawPick:'PHI / KC U10', odds:'-108', notes:'LIVE'},
  {date:'2026-07-05', rawPick:'TEX ML', odds:'+105', trendTags:['PREV_SCORED 0']},

  // 07/06
  {date:'2026-07-06', rawPick:'HOU / WSH O9.5', odds:'-120'},
  {date:'2026-07-06', rawPick:'MIL / STL U8', odds:'-110'},
  {date:'2026-07-06', rawPick:'TOR / SF U7.5', odds:'-105', notes:'LIVE'},

  // 07/07
  {date:'2026-07-07', rawPick:'BAL ML', odds:'+100'},
  {date:'2026-07-07', rawPick:'ATL / PIT O8', odds:'-105', notes:'LIVE'},
  {date:'2026-07-07', rawPick:'SEA / MIA O8', odds:'-107'},
  {date:'2026-07-07', rawPick:"A's / DET O8", odds:'-110'},
  {date:'2026-07-07', rawPick:'HOU ML', odds:'+105', trendTags:['ALLOWED 10+'], notes:'LIVE'},
  {date:'2026-07-07', rawPick:'HOU / WSH O9', odds:'-115', notes:'LIVE'},
  {date:'2026-07-07', rawPick:'F5 PHI -.5', odds:'-125', notes:'LIVE'},
  {date:'2026-07-07', rawPick:'BOS / CWS O8.5', odds:'+100'},
  {date:'2026-07-07', rawPick:'CLE ML', odds:'-101', trendTags:['NO CLV']},
  {date:'2026-07-07', rawPick:'SD ML', odds:'-127', trendTags:['PREV_SCORED 0']},
  {date:'2026-07-07', rawPick:'ARI / SD U8.5', odds:'-105'},
  {date:'2026-07-07', rawPick:'TOR ML', odds:'-118', trendTags:['PREV_ALLOWED 10+']},


  // V52 Daily Import Engine: 07/08 through 07/12. DISREGARD picks excluded.
  {date: "2026-07-12", rawPick: "MIL ML", odds: "+105", units: ".875U"},
  {date: "2026-07-12", rawPick: "MIL / PIT O7.5", odds: "-115"},
  {date: "2026-07-12", rawPick: "KC ML", odds: "+125", trendTags: ["AtS"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-12", rawPick: "F5 WSH -.5", odds: "+105", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-12", rawPick: "WSH ML", odds: "-106", trendTags: ["AtS"]},
  {date: "2026-07-12", rawPick: "CLE ML", odds: "-105", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-12", rawPick: "SEA ML", odds: "+118", trendTags: ["AtS"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-12", rawPick: "CHC ML", odds: "-130", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-12", rawPick: "A's ML", odds: "+109", trendTags: ["AtS", "previously scored 0"]},
  {date: "2026-07-12", rawPick: "ATL ML", odds: "+113", units: ".85U", trendTags: ["AtS"]},
  {date: "2026-07-12", rawPick: "F5 HOU +.5", odds: "-115"},
  {date: "2026-07-12", rawPick: "F5 TOR +.5", odds: "-105"},
  {date: "2026-07-11", rawPick: "LAA / MIN O9", odds: "-110", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-11", rawPick: "A's ML", odds: "-110", trendTags: ["allowed 10+"]},
  {date: "2026-07-11", rawPick: "NYY / WSH O9", odds: "-105"},
  {date: "2026-07-11", rawPick: "F5 NYY -.5", odds: "-145", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-11", rawPick: "F5 SEA -.5", odds: "-115", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-11", rawPick: "TB ML", odds: "-115", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-11", rawPick: "CLE / MIA O7.5", odds: "-125"},
  {date: "2026-07-11", rawPick: "HOU / TEX O9", odds: "+100", units: ".65U"},
  {date: "2026-07-11", rawPick: "F5 PHI -.5", odds: "-105"},
  {date: "2026-07-11", rawPick: "TOR / SD U8", odds: "-226"},
  {date: "2026-07-10", rawPick: "PHI / DET U9", odds: "-105", units: ".35U"},
  {date: "2026-07-10", rawPick: "DET ML", odds: "-120", units: ".5U"},
  {date: "2026-07-10", rawPick: "NYY / WSH O10", odds: "-115", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-10", rawPick: "MIA ML", odds: "-128", units: ".4U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-10", rawPick: "TB ML", odds: "-127", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-10", rawPick: "F5 ATL ML", odds: "-120", units: ".575U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-10", rawPick: "F5 HOU -.5", odds: "-110", units: ".25U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-10", rawPick: "F5 DET -.5", odds: "-110"},
  {date: "2026-07-10", rawPick: "LAA / MIN O9.5", odds: "-102", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "NYY ML", odds: "+127", trendTags: ["AtS", "previously scored 0"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "NYY / TB U7.5", odds: "-110", units: ".6U"},
  {date: "2026-07-09", rawPick: "CHC ML", odds: "+109", units: ".5U", trendTags: ["SWEEP"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "CHC / BAL O9.5", odds: "-110", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "MIN ML", odds: "+110", trendTags: ["SWEEP"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "CWS ML", odds: "-118", trendTags: ["AtS", "previously scored 0"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "SEA ML", odds: "-150", trendTags: ["no CLV", "AtS", "previously scored 0"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "SEA / MIA U8", odds: "-110"},
  {date: "2026-07-09", rawPick: "MIL / STL U8.5", odds: "-113", units: ".4U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-09", rawPick: "TEX ML", odds: "-143", trendTags: ["no CLV"]},
  {date: "2026-07-09", rawPick: "ARI / SD U9", odds: "-117", units: ".55U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "TOR / SF U7", odds: "-114"},
  {date: "2026-07-08", rawPick: "CHC / BAL O10", odds: "-104", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "CHC ML", odds: "+113", units: ".65U"},
  {date: "2026-07-08", rawPick: "ATL ML", odds: "+103", units: ".8U", trendTags: ["no CLV", "previously allowed 10+"]},
  {date: "2026-07-08", rawPick: "ATL / PIT O9.5", odds: "-110", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "DET ML", odds: "-136"},
  {date: "2026-07-08", rawPick: "SEA / MIA U8.5", odds: "-110"},
  {date: "2026-07-08", rawPick: "TB ML", odds: "-120"},
  {date: "2026-07-08", rawPick: "WSH ML", odds: "-138", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "PHI ML", odds: "+120", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "KC / NYM O9.5", odds: "-110", units: ".3U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "BOS / CWS O8", odds: "-115"},
  {date: "2026-07-08", rawPick: "CLE ML", odds: "+100", trendTags: ["no CLV"]},
  {date: "2026-07-08", rawPick: "MIL ML", odds: "-151", trendTags: ["no CLV"], notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "MIL / STL U8", odds: "-105", units: ".35U", notes: "WAIT_FOR_VALUE"},
  {date: "2026-07-08", rawPick: "ARI / SD U8", odds: "-101"},];

function normalizeTeam(value) {
  const raw = String(value || '').trim().replace(/[’]/g, "'");
  if (!raw) return '';
  if (MLB_TEAM_ABBR[raw]) return MLB_TEAM_ABBR[raw];
  const cleaned = raw.toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim();
  return TEAM_ALIASES[cleaned] || cleaned.slice(0, 3);
}

function toIsoDate(value) {
  const raw = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function sumFirstFive(runsByInning) {
  return runsByInning.slice(0, 5).reduce((total, inning) => total + (Number(inning?.runs) || 0), 0);
}

function convertMlbGame(game) {
  const awayName = game?.teams?.away?.team?.name || '';
  const homeName = game?.teams?.home?.team?.name || '';
  const away = MLB_TEAM_ABBR[awayName] || normalizeTeam(awayName);
  const home = MLB_TEAM_ABBR[homeName] || normalizeTeam(homeName);
  const linescore = game?.linescore || {};
  const innings = Array.isArray(linescore.innings) ? linescore.innings : [];
  const awayInnings = innings.map(i => ({ inning: i.num, runs: i.away?.runs ?? 0 }));
  const homeInnings = innings.map(i => ({ inning: i.num, runs: i.home?.runs ?? 0 }));
  const awayScore = Number(game?.teams?.away?.score ?? linescore.teams?.away?.runs ?? 0);
  const homeScore = Number(game?.teams?.home?.score ?? linescore.teams?.home?.runs ?? 0);
  const isFinal = /final|game over|completed/i.test(game?.status?.detailedState || game?.status?.abstractGameState || '');
  return {
    gamePk: game.gamePk,
    gameDate: game.gameDate,
    status: game?.status?.detailedState || game?.status?.abstractGameState || 'Unknown',
    isFinal,
    away,
    home,
    awayName,
    homeName,
    awayScore,
    homeScore,
    totalRuns: awayScore + homeScore,
    f5: { away: sumFirstFive(awayInnings), home: sumFirstFive(homeInnings), available: innings.length >= 5 },
    innings: { away: awayInnings, home: homeInnings }
  };
}

async function fetchMlbGames(date) {
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${encodeURIComponent(date)}&hydrate=linescore,probablePitcher,team,venue`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`MLB Stats API error ${response.status}`);
  const data = await response.json();
  const games = (data?.dates || []).flatMap(day => day.games || []).map(convertMlbGame);
  return { sourceUrl: url, games };
}

function findMatchingGames(games, team, opponent, gamePk) {
  if (Number.isFinite(Number(gamePk))) {
    return games.filter(game => Number(game.gamePk) === Number(gamePk));
  }
  const selected = normalizeTeam(team);
  const opposing = normalizeTeam(opponent);
  return games.filter(game => {
    const teams = [game.away, game.home];
    if (!teams.includes(selected)) return false;
    return !opposing || teams.includes(opposing);
  });
}

function scoreFor(game, team, market) {
  const target = normalizeTeam(team);
  const useF5 = String(market).startsWith('F5_');
  if (useF5) return target === game.away ? game.f5.away : target === game.home ? game.f5.home : null;
  return target === game.away ? game.awayScore : target === game.home ? game.homeScore : null;
}

function oppScoreFor(game, team, market) {
  const target = normalizeTeam(team);
  const useF5 = String(market).startsWith('F5_');
  if (useF5) return target === game.away ? game.f5.home : target === game.home ? game.f5.away : null;
  return target === game.away ? game.homeScore : target === game.home ? game.awayScore : null;
}

function auditGrade(status, reason, game, calculation, scoreUsed) {
  return {
    status,
    reason,
    game,
    audit: {
      gradeSource: 'Official MLB Stats API',
      gamePk: game?.gamePk ?? null,
      calculation: calculation || null,
      scoreUsed: scoreUsed || null,
      gradedAt: new Date().toISOString()
    }
  };
}

function gradePick({ market, team, opponent, side, line, gamePk }, games) {
  const normalizedMarket = String(market || '').toUpperCase();
  const normalizedSide = String(side || '').toUpperCase();
  const numericLine = Number(line);
  const matches = findMatchingGames(games, team, opponent, gamePk);

  if (!normalizeTeam(team)) return { status: 'UNVERIFIED', reason: 'Selected team is missing or invalid.' };
  if (!matches.length) return { status: 'UNVERIFIED', reason: 'NO_MATCHING_GAME: no official MLB game matched this date and team.' };
  if (matches.length > 1) return { status: 'UNVERIFIED', reason: 'AMBIGUOUS_MULTIPLE_GAMES: more than one official MLB game matched. A gamePk is required.', candidates: matches.map(game => ({ gamePk: game.gamePk, away: game.away, home: game.home, status: game.status })) };

  const game = matches[0];
  if (!game.isFinal) return auditGrade('UNVERIFIED', `GAME_NOT_FINAL: ${game.status}.`, game, null, null);
  if (normalizedMarket.startsWith('F5_') && !game.f5.available) return auditGrade('UNVERIFIED', 'F5_NOT_COMPLETE: five complete innings were not available.', game, null, null);

  if (['ML', 'MONEYLINE', 'F5_ML'].includes(normalizedMarket)) {
    const scored = scoreFor(game, team, normalizedMarket);
    const allowed = oppScoreFor(game, team, normalizedMarket);
    const label = normalizedMarket === 'F5_ML' ? 'first-five moneyline' : 'full-game moneyline';
    const scoreUsed = `${normalizeTeam(team)} ${scored}, opponent ${allowed}`;
    if (scored === allowed) return auditGrade('PUSH', `${label} ended tied.`, game, `${scored} compared with ${allowed}`, scoreUsed);
    const status = scored > allowed ? 'WIN' : 'LOSS';
    return auditGrade(status, `${label} graded ${status}.`, game, `${scored} ${scored > allowed ? '>' : '<'} ${allowed}`, scoreUsed);
  }

  if (['TOTAL', 'OVER_UNDER', 'F5_TOTAL'].includes(normalizedMarket)) {
    if (!Number.isFinite(numericLine)) return auditGrade('UNVERIFIED', 'MISSING_LINE: total line missing or invalid.', game, null, null);
    if (!['O', 'OVER', 'U', 'UNDER'].includes(normalizedSide)) return auditGrade('UNVERIFIED', 'MISSING_SIDE: total must specify OVER or UNDER.', game, null, null);
    const runs = normalizedMarket === 'F5_TOTAL' ? game.f5.away + game.f5.home : game.totalRuns;
    const isOver = normalizedSide.startsWith('O');
    const scoreUsed = `${normalizedMarket === 'F5_TOTAL' ? 'F5' : 'Final'} total ${runs}`;
    if (runs === numericLine) return auditGrade('PUSH', `Total ${runs} pushed ${numericLine}.`, game, `${runs} = ${numericLine}`, scoreUsed);
    const won = isOver ? runs > numericLine : runs < numericLine;
    const status = won ? 'WIN' : 'LOSS';
    return auditGrade(status, `${normalizedMarket} ${isOver ? 'OVER' : 'UNDER'} ${numericLine} graded ${status}.`, game, `${runs} ${isOver ? (won ? '>' : '<=') : (won ? '<' : '>=')} ${numericLine}`, scoreUsed);
  }

  if (['SPREAD', 'RUNLINE', 'RUN_LINE', 'F5_SPREAD'].includes(normalizedMarket)) {
    if (!Number.isFinite(numericLine)) return auditGrade('UNVERIFIED', 'MISSING_LINE: spread line missing or invalid.', game, null, null);
    const scored = scoreFor(game, team, normalizedMarket);
    const allowed = oppScoreFor(game, team, normalizedMarket);
    const adjusted = scored - allowed + numericLine;
    const scoreUsed = `${normalizeTeam(team)} ${scored}, opponent ${allowed}, line ${numericLine > 0 ? '+' : ''}${numericLine}`;
    if (adjusted === 0) return auditGrade('PUSH', `Adjusted margin pushed the line.`, game, `${scored} - ${allowed} + (${numericLine}) = 0`, scoreUsed);
    const status = adjusted > 0 ? 'WIN' : 'LOSS';
    return auditGrade(status, `${normalizedMarket} graded ${status}.`, game, `${scored} - ${allowed} + (${numericLine}) = ${adjusted}`, scoreUsed);
  }

  return auditGrade('UNVERIFIED', `UNSUPPORTED_MARKET: ${normalizedMarket || '(missing)'}.`, game, null, null);
}

function parseRawPick(rawPick) {
  const text = String(rawPick || '')
    .trim()
    .replace(/[’]/g, "'")
    .replace(/_/g, ' ')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ');
  if (!text) return null;

  const f5Total = text.match(/^F5\s+([A-Za-z'.]+)\s*\/\s*([A-Za-z'.]+)\s+(O|U|OVER|UNDER)\s*([0-9]+(?:\.[0-9])?)/i);
  if (f5Total) return { market: 'F5_TOTAL', team: f5Total[1], opponent: f5Total[2], side: f5Total[3], line: Number(f5Total[4]) };

  const f5Spread = text.match(/^F5\s+([A-Za-z'.]+)\s*([+-])\s*([0-9]+(?:\.[0-9])?)/i);
  if (f5Spread) return { market: 'F5_SPREAD', team: f5Spread[1], line: Number(`${f5Spread[2]}${f5Spread[3]}`) };

  const f5Ml = text.match(/^F5\s+([A-Za-z'.]+)\s+ML\b/i);
  if (f5Ml) return { market: 'F5_ML', team: f5Ml[1] };

  const f5OddsOnly = text.match(/^F5\s+([A-Za-z'.]+)\s+[+-]\d{3,4}\b/i);
  if (f5OddsOnly) return { market: 'F5_ML', team: f5OddsOnly[1] };

  const total = text.match(/^([A-Za-z'.]+)\s*\/\s*([A-Za-z'.]+)\s+(O|U|OVER|UNDER)\s*([0-9]+(?:\.[0-9])?)/i);
  if (total) return { market: 'TOTAL', team: total[1], opponent: total[2], side: total[3], line: Number(total[4]) };

  const ml = text.match(/^([A-Za-z'.]+)\s+ML\b/i);
  if (ml) return { market: 'ML', team: ml[1] };

  const spread = text.match(/^([A-Za-z'.]+)\s*([+-])\s*([0-9]+(?:\.[0-9])?)/i);
  if (spread) return { market: 'SPREAD', team: spread[1], line: Number(`${spread[2]}${spread[3]}`) };

  return null;
}

function summarize(results) {
  const summary = { total: results.length, WIN: 0, LOSS: 0, PUSH: 0, NO_ACTION: 0, UNVERIFIED: 0, PARSE_FAILED: 0 };
  for (const r of results) {
    const key = r.grading?.status || (r.parsedPick ? 'UNVERIFIED' : 'PARSE_FAILED');
    if (summary[key] === undefined) summary[key] = 0;
    summary[key] += 1;
  }
  summary.graded = summary.WIN + summary.LOSS + summary.PUSH + summary.NO_ACTION;
  summary.record = `${summary.WIN}-${summary.LOSS}`;
  summary.winRate = summary.WIN + summary.LOSS ? `${((summary.WIN / (summary.WIN + summary.LOSS)) * 100).toFixed(1)}%` : 'N/A';
  return summary;
}

async function maybeFetchOdds() {
  const key = process.env.ODDS_API_KEY;
  if (!key) return { configured: false, message: 'ODDS_API_KEY is not configured in Vercel yet.' };
  return { configured: true, message: 'ODDS_API_KEY is configured. Odds fetch is intentionally off in V44.2 test mode to preserve quota.' };
}

async function gradeDate(date, picksForDate) {
  const { sourceUrl, games } = await fetchMlbGames(date);
  const results = picksForDate.map(pick => {
    const parsedPick = parseRawPick(pick.rawPick);
    const grading = parsedPick ? gradePick(parsedPick, games) : { status: 'UNVERIFIED', reason: 'Could not parse this pick safely.' };
    return { ...pick, parsedPick, grading };
  });
  return { date, sourceUrl, gameCount: games.length, results, summary: summarize(results) };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const query = req.query || Object.fromEntries(new URL(req.url, 'http://localhost').searchParams.entries());
    const odds = await maybeFetchOdds();

    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') body = JSON.parse(body || '{}');
      const submitted = Array.isArray(body.picks) ? body.picks.slice(0, 2500) : [];
      const normalized = submitted.map(p => ({
        ...p,
        date: toIsoDate(p.date || p.slate),
        rawPick: String(p.rawPick || p.pick || '').trim()
      })).filter(p => p.date && p.rawPick && !/DISREGARD/i.test(p.rawPick));
      const dates = [...new Set(normalized.map(p => p.date))].sort();
      const dateBatches = [];
      for (const date of dates) dateBatches.push(await gradeDate(date, normalized.filter(p => p.date === date)));
      const allResults = dateBatches.flatMap(batch => batch.results.map(r => ({ date: batch.date, ...r })));
      return res.status(200).json({
        ok: true,
        version: 'CORE-1.0',
        mode: 'traceable-ledger-bulk-grading',
        source: 'Official MLB Stats API',
        oddsApi: odds,
        submitted: submitted.length,
        accepted: normalized.length,
        summary: summarize(allResults),
        dateBatches,
        truthRule: 'Only official final MLB data can create a WIN, LOSS, or PUSH. Every grade includes a gamePk and calculation audit when resolved.'
      });
    }

    if (query.month === '2026-07' || query.july === 'true') {
      const dates = [...new Set(JULY_PICKS.map(p => p.date))].sort();
      const dateBatches = [];
      for (const date of dates) dateBatches.push(await gradeDate(date, JULY_PICKS.filter(p => p.date === date)));
      const allResults = dateBatches.flatMap(batch => batch.results.map(r => ({ date: batch.date, ...r })));
      return res.status(200).json({
        ok: true,
        version: 'CORE-1.0',
        mode: 'july-bulk-grading',
        source: 'Official MLB Stats API',
        oddsApi: odds,
        dateRange: '2026-07-01 through 2026-07-12',
        summary: summarize(allResults),
        dateBatches,
        truthRule: 'Only grade when official MLB data is final and complete. Otherwise return UNVERIFIED. DISREGARD picks were excluded.'
      });
    }

    const date = toIsoDate(query.date || new Date().toISOString().slice(0, 10));
    if (!date) return res.status(400).json({ ok: false, error: 'Missing or invalid date. Use YYYY-MM-DD.' });

    if (query.bulk === 'true') {
      const picks = JULY_PICKS.filter(p => p.date === date);
      const batch = await gradeDate(date, picks);
      return res.status(200).json({ ok: true, version: 'CORE-1.0', mode: 'single-date-bulk-grading', source: 'Official MLB Stats API', oddsApi: odds, ...batch, truthRule: 'Only grade when official MLB data is final and complete. Otherwise return UNVERIFIED.' });
    }

    const { sourceUrl, games } = await fetchMlbGames(date);
    let grading = null;
    const parsed = query.rawPick ? parseRawPick(query.rawPick) : null;
    const direct = query.market ? { market: query.market, team: query.team, opponent: query.opponent, side: query.side, line: query.line } : null;
    const pick = direct || parsed;
    if (pick) grading = gradePick(pick, games);

    return res.status(200).json({
      ok: true,
      version: 'CORE-1.0',
      date,
      source: 'Official MLB Stats API',
      sourceUrl,
      oddsApi: odds,
      gameCount: games.length,
      games,
      parsedPick: pick,
      grading,
      truthRule: 'Only grade when official MLB data is final and complete. Otherwise return UNVERIFIED.'
    });
  } catch (error) {
    return res.status(500).json({ ok: false, version: 'CORE-1.0', error: error.message });
  }
}
