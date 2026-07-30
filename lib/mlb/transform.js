const finite = value => value === null || value === undefined || value === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const completed = status => /final|game over|completed early/i.test(String(status || ''));

function inningRows(linescore) {
  return (linescore?.innings || []).map(row => ({
    number:finite(row?.num), ordinal:row?.ordinalNum || null,
    awayRuns:finite(row?.away?.runs), homeRuns:finite(row?.home?.runs)
  })).filter(row => row.number !== null);
}

export function calculateFirstFive(innings) {
  const byNumber = new Map(innings.map(row => [Number(row.number), row]));
  const complete = [1,2,3,4,5].every(number => {
    const row = byNumber.get(number);
    return row && row.awayRuns !== null && row.homeRuns !== null;
  });
  if (!complete) return { available:false, away:null, home:null };
  let away = 0; let home = 0;
  for (let number=1; number<=5; number += 1) { away += byNumber.get(number).awayRuns; home += byNumber.get(number).homeRuns; }
  return { available:true, away, home };
}

function team(scheduleSide, gameDataTeam) {
  const source = gameDataTeam || scheduleSide?.team || {};
  return {
    id:finite(source.id), abbreviation:source.abbreviation || null, name:source.name || scheduleSide?.team?.name || null,
    leagueName:source?.league?.name || null, divisionName:source?.division?.name || null
  };
}

function actualStarter(liveData, side) {
  const sideBox = liveData?.boxscore?.teams?.[side] || {};
  const players = sideBox.players || {};
  const id = sideBox.pitchers?.[0];
  const player = id ? players[`ID${id}`] : null;
  return player?.person ? { ...player.person, pitchHand:player?.person?.pitchHand || player?.position?.pitchHand } : null;
}

function pitcherRecord(person, side, role, source) {
  if (!person?.id) return null;
  return { id:person.id, fullName:person.fullName || person.nameFirstLast || `Pitcher ${person.id}`,
    pitchHandCode:person?.pitchHand?.code || null, pitchHandDescription:person?.pitchHand?.description || null,
    side, role, source };
}

function extractWeather(liveData) {
  const info = Object.fromEntries((liveData?.boxscore?.info || []).map(row => [String(row.label || '').toLowerCase(), row.value]));
  const tempMatch = String(info.weather || '').match(/(\d+)\s*degrees/i);
  return { condition:info.weather || null, tempF:tempMatch ? Number(tempMatch[1]) : null, wind:info.wind || null };
}

export function transformGame(scheduleGame, feed) {
  const gd = feed?.gameData || {};
  const ld = feed?.liveData || {};
  const linescore = ld.linescore || {};
  const innings = inningRows(linescore);
  const firstFive = calculateFirstFive(innings);
  const detailed = gd?.status?.detailedState || scheduleGame?.status?.detailedState || null;
  const probableAway = gd?.probablePitchers?.away;
  const probableHome = gd?.probablePitchers?.home;
  const confirmedAway = actualStarter(ld,'away');
  const confirmedHome = actualStarter(ld,'home');
  const pitchers = [
    pitcherRecord(probableAway,'away','probable_starter','gameData.probablePitchers'),
    pitcherRecord(probableHome,'home','probable_starter','gameData.probablePitchers'),
    pitcherRecord(confirmedAway,'away','confirmed_starter','liveData.boxscore'),
    pitcherRecord(confirmedHome,'home','confirmed_starter','liveData.boxscore')
  ].filter(Boolean);
  const uniquePitchers = [...new Map(pitchers.map(p => [`${p.side}:${p.role}`,p])).values()];
  const officialDate = gd?.datetime?.officialDate || scheduleGame?.officialDate;
  if (!scheduleGame?.gamePk || !officialDate) throw new Error('Game is missing gamePk or officialDate.');
  const away = team(scheduleGame?.teams?.away, gd?.teams?.away);
  const home = team(scheduleGame?.teams?.home, gd?.teams?.home);
  if (!away.id || !home.id) throw new Error(`Game ${scheduleGame.gamePk} is missing team IDs.`);
  return {
    gamePk:scheduleGame.gamePk, officialDate, season:Number(officialDate.slice(0,4)),
    gameDate:gd?.datetime?.dateTime || scheduleGame?.gameDate || null, gameType:gd?.game?.type || scheduleGame?.gameType || null,
    status:{ abstract:gd?.status?.abstractGameState || scheduleGame?.status?.abstractGameState || null, detailed,
      code:gd?.status?.codedGameState || scheduleGame?.status?.codedGameState || null, isFinal:completed(detailed) },
    awayTeam:away, homeTeam:home,
    venue:gd?.venue ? { id:gd.venue.id, name:gd.venue.name, city:gd.venue?.location?.city || null, state:gd.venue?.location?.stateAbbrev || null,
      country:gd.venue?.location?.country || null, timeZone:gd.venue?.timeZone?.id || null } : scheduleGame?.venue ? { id:scheduleGame.venue.id, name:scheduleGame.venue.name } : null,
    dayNight:gd?.datetime?.dayNight || scheduleGame?.dayNight || null,
    scheduledInnings:finite(gd?.game?.scheduledInnings || scheduleGame?.scheduledInnings), doubleHeader:gd?.game?.doubleHeader || scheduleGame?.doubleHeader || null,
    gameNumber:finite(gd?.game?.gameNumber || scheduleGame?.gameNumber), seriesDescription:gd?.game?.seriesDescription || scheduleGame?.seriesDescription || null,
    seriesGameNumber:finite(gd?.game?.seriesGameNumber || scheduleGame?.seriesGameNumber), gamesInSeries:finite(gd?.game?.gamesInSeries || scheduleGame?.gamesInSeries),
    finalScore:{ away:finite(linescore?.teams?.away?.runs ?? scheduleGame?.teams?.away?.score), home:finite(linescore?.teams?.home?.runs ?? scheduleGame?.teams?.home?.score) },
    firstFive, innings, pitchers:uniquePitchers, weather:extractWeather(ld), sourceUpdatedAt:feed?.metaData?.timeStamp || null,
    rawSchedule:scheduleGame, rawFeed:feed
  };
}
