const FINAL_CODES = new Set(['F', 'O']);
const toNumber = value => value === null || value === undefined || value === '' ? null : Number(value);
const finiteInteger = value => Number.isFinite(toNumber(value)) ? Math.trunc(toNumber(value)) : null;

function team(teamData = {}) {
  return {
    id: finiteInteger(teamData.id),
    abbreviation: teamData.abbreviation || null,
    name: teamData.name || null,
    league_name: teamData.league?.name || null,
    division_name: teamData.division?.name || null
  };
}

function venue(gameData = {}, scheduleGame = {}) {
  const source = gameData.venue || scheduleGame.venue || {};
  return {
    id: finiteInteger(source.id),
    name: source.name || 'Unknown',
    city: source.location?.city || null,
    state: source.location?.stateAbbrev || source.location?.state || null,
    country: source.location?.country || null,
    timezone: source.timeZone?.id || null
  };
}

function inningRows(linescore = {}) {
  return (linescore.innings || []).map(row => ({
    inning_number: finiteInteger(row.num),
    ordinal: row.ordinalNum || null,
    home_runs: finiteInteger(row.home?.runs),
    away_runs: finiteInteger(row.away?.runs),
    home_hits: finiteInteger(row.home?.hits),
    away_hits: finiteInteger(row.away?.hits),
    home_errors: finiteInteger(row.home?.errors),
    away_errors: finiteInteger(row.away?.errors)
  })).filter(row => row.inning_number);
}

function firstFive(innings) {
  const first = innings.filter(row => row.inning_number <= 5);
  const complete = [1, 2, 3, 4, 5].every(number => first.some(row => row.inning_number === number && row.home_runs !== null && row.away_runs !== null));
  return {
    complete,
    home: complete ? first.reduce((sum, row) => sum + row.home_runs, 0) : null,
    away: complete ? first.reduce((sum, row) => sum + row.away_runs, 0) : null
  };
}

function probablePitchers(gameData = {}, scheduleGame = {}) {
  const rows = [];
  for (const side of ['away', 'home']) {
    const person = gameData.probablePitchers?.[side] || scheduleGame.teams?.[side]?.probablePitcher;
    if (person?.id) rows.push({ side, role: 'probable', person_id: person.id, full_name: person.fullName || null, pitch_hand: person.pitchHand?.code || null, confirmed: false });
  }
  return rows;
}

function confirmedStarters(liveData = {}, gameData = {}) {
  const rows = [];
  for (const side of ['away', 'home']) {
    const teamBox = liveData.boxscore?.teams?.[side];
    const starterId = teamBox?.pitchers?.[0];
    const player = starterId ? teamBox?.players?.[`ID${starterId}`] : null;
    const person = player?.person || gameData.players?.[`ID${starterId}`];
    if (starterId) rows.push({ side, role: 'starter', person_id: starterId, full_name: person?.fullName || null, pitch_hand: player?.pitchHand?.code || person?.pitchHand?.code || null, confirmed: true });
  }
  return rows;
}

export function buildGameBundle(scheduleGame, feed) {
  const gameData = feed?.gameData || {};
  const liveData = feed?.liveData || {};
  const linescore = liveData.linescore || {};
  const innings = inningRows(linescore);
  const f5 = firstFive(innings);
  const status = gameData.status || scheduleGame.status || {};
  const final = FINAL_CODES.has(status.statusCode) || /final|game over|completed/i.test(status.detailedState || '');
  const boxInfo = Object.fromEntries((liveData.boxscore?.info || []).map(item => [String(item.label || '').toLowerCase(), item.value]));
  const pitchers = [...probablePitchers(gameData, scheduleGame), ...confirmedStarters(liveData, gameData)];
  const uniquePitchers = [...new Map(pitchers.map(row => [`${row.side}:${row.role}`, row])).values()];
  const homeTeam = team(gameData.teams?.home || scheduleGame.teams?.home?.team);
  const awayTeam = team(gameData.teams?.away || scheduleGame.teams?.away?.team);
  if (!homeTeam.id || !awayTeam.id) throw new Error('TEAM_IDS_MISSING');

  return {
    game: {
      game_pk: finiteInteger(gameData.game?.pk || scheduleGame.gamePk),
      official_date: gameData.datetime?.officialDate || scheduleGame.officialDate,
      season: finiteInteger(gameData.game?.season || scheduleGame.season || String(scheduleGame.officialDate || '').slice(0, 4)),
      game_type: gameData.game?.type || scheduleGame.gameType || null,
      status_code: status.statusCode || null,
      status_abstract: status.abstractGameState || null,
      status_detailed: status.detailedState || null,
      is_final: final,
      game_number: finiteInteger(scheduleGame.gameNumber),
      double_header: scheduleGame.doubleHeader || null,
      series_description: scheduleGame.seriesDescription || null,
      series_game_number: finiteInteger(scheduleGame.seriesGameNumber),
      games_in_series: finiteInteger(scheduleGame.gamesInSeries),
      day_night: gameData.datetime?.dayNight || scheduleGame.dayNight || null,
      scheduled_innings: finiteInteger(gameData.game?.scheduledInnings || scheduleGame.scheduledInnings),
      home_final_runs: finiteInteger(linescore.teams?.home?.runs ?? scheduleGame.teams?.home?.score),
      away_final_runs: finiteInteger(linescore.teams?.away?.runs ?? scheduleGame.teams?.away?.score),
      home_f5_runs: f5.home,
      away_f5_runs: f5.away,
      f5_complete: f5.complete,
      weather_condition: gameData.weather?.condition || boxInfo.weather || null,
      temperature_f: finiteInteger(gameData.weather?.temp),
      wind: gameData.weather?.wind || boxInfo.wind || null,
      source_updated_at: gameData.datetime?.dateTime || scheduleGame.gameDate || null
    },
    home_team: homeTeam,
    away_team: awayTeam,
    venue: venue(gameData, scheduleGame),
    innings,
    pitchers: uniquePitchers,
    raw_schedule: scheduleGame,
    raw_feed_metadata: {
      copyright: feed?.copyright || null,
      gameDataStatus: gameData.status || null,
      linescoreCurrentInning: linescore.currentInning || null
    }
  };
}
