const finite = value => value === null || value === undefined || value === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const positiveInt = value => Number.isInteger(finite(value)) && finite(value) > 0 ? finite(value) : null;
const text = value => value === null || value === undefined ? null : String(value).trim() || null;
const completed = status => /final|game over|completed early|completed/i.test(String(status || ''));

function normalizeInnings(linescore) {
  return (Array.isArray(linescore?.innings) ? linescore.innings : []).map(row => ({
    number: positiveInt(row?.num), ordinal: text(row?.ordinalNum || row?.ordinal),
    awayRuns: finite(row?.away?.runs), homeRuns: finite(row?.home?.runs),
    awayHits: finite(row?.away?.hits), homeHits: finite(row?.home?.hits),
    awayErrors: finite(row?.away?.errors), homeErrors: finite(row?.home?.errors)
  })).filter(row => row.number).sort((a,b) => a.number-b.number);
}
export function calculateFirstFive(innings = []) {
  const byNumber = new Map(innings.map(row => [Number(row.number), row]));
  for (let n=1;n<=5;n+=1) { const row=byNumber.get(n); if (!row || row.awayRuns === null || row.homeRuns === null) return { available:false, away:null, home:null }; }
  let away=0, home=0; for (let n=1;n<=5;n+=1) { away += Number(byNumber.get(n).awayRuns); home += Number(byNumber.get(n).homeRuns); }
  return { available:true, away, home };
}
function normalizeTeam(scheduleSide, gameTeam) {
  const fallback=scheduleSide?.team || {}; const source=gameTeam || fallback;
  return { id:positiveInt(source?.id || fallback?.id), abbreviation:text(source?.abbreviation || fallback?.abbreviation), name:text(source?.name || fallback?.name), leagueName:text(source?.league?.name), divisionName:text(source?.division?.name) };
}
function boxPlayer(liveData, side, id) { const players=liveData?.boxscore?.teams?.[side]?.players || {}; return players[`ID${id}`] || players[String(id)] || null; }
function starter(liveData, side) {
  const id=positiveInt(liveData?.boxscore?.teams?.[side]?.pitchers?.[0]); if (!id) return null;
  const player=boxPlayer(liveData,side,id); return { ...(player?.person || {id}), pitchHand:player?.person?.pitchHand || player?.pitchHand || null };
}
function pitcher(person, side, role, source) {
  const id=positiveInt(person?.id); if (!id) return null;
  return { id, fullName:text(person?.fullName || person?.nameFirstLast) || `Pitcher ${id}`, pitchHandCode:text(person?.pitchHand?.code), pitchHandDescription:text(person?.pitchHand?.description), side, role, source };
}
function weather(gameData, liveData) {
  const info=Object.fromEntries((liveData?.boxscore?.info || []).map(row=>[String(row?.label||'').toLowerCase(), text(row?.value)]));
  const official=gameData?.weather || null; const wind=text(official?.wind || info.wind); const condition=text(official?.condition || info.weather);
  const temp=finite(official?.temp) ?? finite(String(info.weather || '').match(/(-?\d+)\s*degrees/i)?.[1]);
  const speed=finite(String(wind || '').match(/(\d+(?:\.\d+)?)\s*mph/i)?.[1]);
  if (!condition && temp === null && !wind) return null;
  return { condition, temperatureF:temp, wind, windSpeedMph:speed };
}
export function transformGame(scheduleGame, feed) {
  const gd=feed?.gameData || {}; const ld=feed?.liveData || {}; const linescore=ld?.linescore || {};
  const gamePk=positiveInt(scheduleGame?.gamePk || gd?.game?.pk); if (!gamePk) throw new Error('Game is missing a valid official MLB gamePk.');
  const officialDate=text(gd?.datetime?.officialDate || scheduleGame?.officialDate); if (!officialDate) throw new Error(`Game ${gamePk} is missing officialDate.`);
  const awayTeam=normalizeTeam(scheduleGame?.teams?.away,gd?.teams?.away); const homeTeam=normalizeTeam(scheduleGame?.teams?.home,gd?.teams?.home);
  if (!awayTeam.id || !homeTeam.id || awayTeam.id === homeTeam.id) throw new Error(`Game ${gamePk} has invalid team identifiers.`);
  const innings=normalizeInnings(linescore); const firstFive=calculateFirstFive(innings);
  const probableAway=gd?.probablePitchers?.away || scheduleGame?.teams?.away?.probablePitcher; const probableHome=gd?.probablePitchers?.home || scheduleGame?.teams?.home?.probablePitcher;
  const pitchers=[pitcher(probableAway,'away','probable_starter','mlb'),pitcher(probableHome,'home','probable_starter','mlb'),pitcher(starter(ld,'away'),'away','confirmed_starter','mlb'),pitcher(starter(ld,'home'),'home','confirmed_starter','mlb')].filter(Boolean);
  const uniquePitchers=[...new Map(pitchers.map(p=>[[p.id,p.side,p.role].join(':'),p])).values()];
  return {
    gamePk, officialDate, season:positiveInt(gd?.game?.season || scheduleGame?.season) || Number(officialDate.slice(0,4)),
    gameDate:text(gd?.datetime?.dateTime || scheduleGame?.gameDate), gameType:text(gd?.game?.type || scheduleGame?.gameType),
    status:{ abstract:text(gd?.status?.abstractGameState || scheduleGame?.status?.abstractGameState), detailed:text(gd?.status?.detailedState || scheduleGame?.status?.detailedState), code:text(gd?.status?.codedGameState || scheduleGame?.status?.codedGameState), statusCode:text(gd?.status?.statusCode || scheduleGame?.status?.statusCode), isFinal:completed(gd?.status?.detailedState || scheduleGame?.status?.detailedState) },
    awayTeam, homeTeam,
    venue: gd?.venue?.id || scheduleGame?.venue?.id ? { id:positiveInt(gd?.venue?.id || scheduleGame?.venue?.id), name:text(gd?.venue?.name || scheduleGame?.venue?.name), city:text(gd?.venue?.location?.city), state:text(gd?.venue?.location?.stateAbbrev || gd?.venue?.location?.state), country:text(gd?.venue?.location?.country), timeZone:text(gd?.venue?.timeZone?.id) } : null,
    dayNight:text(gd?.datetime?.dayNight || scheduleGame?.dayNight), scheduledInnings:positiveInt(gd?.game?.scheduledInnings || scheduleGame?.scheduledInnings),
    doubleHeader:text(gd?.game?.doubleHeader || scheduleGame?.doubleHeader), gameNumber:positiveInt(gd?.game?.gameNumber || scheduleGame?.gameNumber),
    seriesDescription:text(gd?.game?.seriesDescription || scheduleGame?.seriesDescription), seriesGameNumber:positiveInt(gd?.game?.seriesGameNumber || scheduleGame?.seriesGameNumber), gamesInSeries:positiveInt(gd?.game?.gamesInSeries || scheduleGame?.gamesInSeries),
    finalScore:{ away:finite(linescore?.teams?.away?.runs) ?? finite(scheduleGame?.teams?.away?.score), home:finite(linescore?.teams?.home?.runs) ?? finite(scheduleGame?.teams?.home?.score) },
    firstFive, innings, pitchers:uniquePitchers, weather:weather(gd,ld), sourceUpdatedAt:text(feed?.metaData?.timeStamp), rawSchedule:scheduleGame, rawFeed:feed
  };
}
export { completed as isFinalStatus, normalizeInnings };
