const MLB_SCHEDULE_URL = 'https://statsapi.mlb.com/api/v1/schedule';

const TEAM_ALIASES = Object.freeze({
  ARI: 'ARI', ARIZONA: 'ARI', 'ARIZONA DIAMONDBACKS': 'ARI', 'D-BACKS': 'ARI', DIAMONDBACKS: 'ARI',
  ATL: 'ATL', ATLANTA: 'ATL', 'ATLANTA BRAVES': 'ATL', BRAVES: 'ATL',
  BAL: 'BAL', BALTIMORE: 'BAL', 'BALTIMORE ORIOLES': 'BAL', ORIOLES: 'BAL',
  BOS: 'BOS', BOSTON: 'BOS', 'BOSTON RED SOX': 'BOS', 'RED SOX': 'BOS',
  CHC: 'CHC', CHIC: 'CHC', CHICAGO: 'CHC', 'CHICAGO CUBS': 'CHC', CUBS: 'CHC',
  CWS: 'CWS', 'CHICAGO WHITE SOX': 'CWS', 'WHITE SOX': 'CWS',
  CIN: 'CIN', CINCINNATI: 'CIN', 'CINCINNATI REDS': 'CIN', REDS: 'CIN',
  CLE: 'CLE', CLEVELAND: 'CLE', 'CLEVELAND GUARDIANS': 'CLE', GUARDIANS: 'CLE',
  COL: 'COL', COLORADO: 'COL', 'COLORADO ROCKIES': 'COL', ROCKIES: 'COL',
  DET: 'DET', DETROIT: 'DET', 'DETROIT TIGERS': 'DET', TIGERS: 'DET',
  HOU: 'HOU', HOUSTON: 'HOU', 'HOUSTON ASTROS': 'HOU', ASTROS: 'HOU',
  KC: 'KC', KCR: 'KC', 'KANSAS CITY': 'KC', 'KANSAS CITY ROYALS': 'KC', ROYALS: 'KC',
  LAA: 'LAA', ANGELS: 'LAA', 'LOS ANGELES ANGELS': 'LAA',
  LAD: 'LAD', DODGERS: 'LAD', 'LOS ANGELES DODGERS': 'LAD',
  MIA: 'MIA', MIAMI: 'MIA', 'MIAMI MARLINS': 'MIA', MARLINS: 'MIA',
  MIL: 'MIL', MILWAUKEE: 'MIL', 'MILWAUKEE BREWERS': 'MIL', BREWERS: 'MIL',
  MIN: 'MIN', MINNESOTA: 'MIN', 'MINNESOTA TWINS': 'MIN', TWINS: 'MIN',
  NYM: 'NYM', METS: 'NYM', 'NEW YORK METS': 'NYM',
  NYY: 'NYY', YANKEES: 'NYY', 'NEW YORK YANKEES': 'NYY',
  ATH: 'ATH', OAK: 'ATH', OAKLAND: 'ATH', ATHLETICS: 'ATH', "A'S": 'ATH',
  PHI: 'PHI', PHILADELPHIA: 'PHI', 'PHILADELPHIA PHILLIES': 'PHI', PHILLIES: 'PHI',
  PIT: 'PIT', PITTSBURGH: 'PIT', 'PITTSBURGH PIRATES': 'PIT', PIRATES: 'PIT',
  SD: 'SD', SDP: 'SD', 'SAN DIEGO': 'SD', 'SAN DIEGO PADRES': 'SD', PADRES: 'SD',
  SEA: 'SEA', SEATTLE: 'SEA', 'SEATTLE MARINERS': 'SEA', MARINERS: 'SEA',
  SF: 'SF', SFG: 'SF', 'SAN FRANCISCO': 'SF', 'SAN FRANCISCO GIANTS': 'SF', GIANTS: 'SF',
  STL: 'STL', 'ST. LOUIS': 'STL', 'ST LOUIS': 'STL', 'ST. LOUIS CARDINALS': 'STL', CARDINALS: 'STL',
  TB: 'TB', TBR: 'TB', 'TAMPA BAY': 'TB', 'TAMPA BAY RAYS': 'TB', RAYS: 'TB',
  TEX: 'TEX', TEXAS: 'TEX', 'TEXAS RANGERS': 'TEX', RANGERS: 'TEX',
  TOR: 'TOR', TORONTO: 'TOR', 'TORONTO BLUE JAYS': 'TOR', 'BLUE JAYS': 'TOR',
  WSH: 'WSH', WAS: 'WSH', WASHINGTON: 'WSH', 'WASHINGTON NATIONALS': 'WSH', NATIONALS: 'WSH'
});

function cleanString(value) {
  return String(value ?? '').trim();
}

function normalizeTeam(value) {
  const raw = cleanString(value).toUpperCase().replace(/\s+/g, ' ');
  return TEAM_ALIASES[raw] || raw;
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(cleanString(value));
}

function teamAbbreviation(team) {
  return normalizeTeam(team?.abbreviation || team?.name || '');
}

function statusName(game) {
  return game?.status?.detailedState || game?.status?.abstractGameState || 'Unknown';
}

function pitcherSummary(side) {
  const pitcher = side?.probablePitcher;
  if (!pitcher) return null;
  return {
    id: pitcher.id ?? null,
    fullName: pitcher.fullName || pitcher.nameFirstLast || null
  };
}

function normalizeGame(game) {
  const away = game?.teams?.away || {};
  const home = game?.teams?.home || {};
  const awayAbbr = teamAbbreviation(away.team);
  const homeAbbr = teamAbbreviation(home.team);

  return {
    gamePk: game?.gamePk ?? null,
    officialDate: game?.officialDate || null,
    gameDate: game?.gameDate || null,
    matchup: `${awayAbbr} @ ${homeAbbr}`,
    awayTeam: {
      id: away?.team?.id ?? null,
      abbreviation: awayAbbr,
      name: away?.team?.name || null,
      score: away?.score ?? game?.linescore?.teams?.away?.runs ?? null,
      probablePitcher: pitcherSummary(away)
    },
    homeTeam: {
      id: home?.team?.id ?? null,
      abbreviation: homeAbbr,
      name: home?.team?.name || null,
      score: home?.score ?? game?.linescore?.teams?.home?.runs ?? null,
      probablePitcher: pitcherSummary(home)
    },
    status: {
      abstract: game?.status?.abstractGameState || null,
      detailed: statusName(game),
      coded: game?.status?.codedGameState || null
    },
    venue: game?.venue ? {
      id: game.venue.id ?? null,
      name: game.venue.name || null
    } : null,
    seriesDescription: game?.seriesDescription || null,
    seriesGameNumber: game?.seriesGameNumber ?? null,
    gamesInSeries: game?.gamesInSeries ?? null,
    dayNight: game?.dayNight || null,
    doubleHeader: game?.doubleHeader || null,
    gameNumber: game?.gameNumber ?? null,
    linescore: game?.linescore || null
  };
}

function queryValue(req, key) {
  const value = req?.query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

async function fetchSchedule(date) {
  const params = new URLSearchParams({
    sportId: '1',
    date,
    hydrate: 'linescore,probablePitcher,team,venue'
  });

  const response = await fetch(`${MLB_SCHEDULE_URL}?${params.toString()}`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`MLB schedule request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload?.dates?.flatMap((entry) => entry?.games || []) || [];
}

function resolveTeamGame(games, team) {
  const requestedTeam = normalizeTeam(team);
  const matches = games.filter((game) => {
    const away = teamAbbreviation(game?.teams?.away?.team);
    const home = teamAbbreviation(game?.teams?.home?.team);
    return away === requestedTeam || home === requestedTeam;
  });

  if (matches.length === 0) {
    return {
      resolved: false,
      reason: 'NO_MATCHING_GAME',
      requestedTeam,
      candidateCount: 0,
      candidates: []
    };
  }

  if (matches.length > 1) {
    return {
      resolved: false,
      reason: 'AMBIGUOUS_MULTIPLE_GAMES',
      requestedTeam,
      candidateCount: matches.length,
      candidates: matches.map(normalizeGame)
    };
  }

  const normalized = normalizeGame(matches[0]);
  const isHome = normalized.homeTeam.abbreviation === requestedTeam;
  const selectedTeam = isHome ? normalized.homeTeam : normalized.awayTeam;
  const opponent = isHome ? normalized.awayTeam : normalized.homeTeam;

  return {
    resolved: true,
    reason: null,
    requestedTeam,
    role: isHome ? 'HOME' : 'AWAY',
    opponent: opponent.abbreviation,
    opponentName: opponent.name,
    selectedTeam,
    game: normalized
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      ok: false,
      error: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const requestedDate = cleanString(queryValue(req, 'date'));
    const requestedTeam = cleanString(queryValue(req, 'team'));
    const date = requestedDate || new Date().toISOString().slice(0, 10);

    if (!isIsoDate(date)) {
      return res.status(400).json({
        ok: false,
        error: 'INVALID_DATE',
        message: 'Use date=YYYY-MM-DD.'
      });
    }

    const games = await fetchSchedule(date);
    const fetchedAt = new Date().toISOString();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    if (requestedTeam) {
      const resolution = resolveTeamGame(games, requestedTeam);
      return res.status(200).json({
        ok: true,
        mode: 'team-resolution',
        source: 'Official MLB Stats API',
        date,
        ...resolution,
        fetchedAt
      });
    }

    return res.status(200).json({
      ok: true,
      mode: 'daily-schedule',
      source: 'Official MLB Stats API',
      date,
      gameCount: games.length,
      games,
      normalizedGames: games.map(normalizeGame),
      fetchedAt
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'MLB_LIVE_DATA_FAILED',
      message: error instanceof Error ? error.message : String(error),
      fetchedAt: new Date().toISOString()
    });
  }
}
