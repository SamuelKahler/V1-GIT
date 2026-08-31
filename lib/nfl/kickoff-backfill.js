import { callRpc } from '../mlb/supabase.js';

const NFL_STATS_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

function httpError(message, statusCode=500, details=null){
  const error=new Error(message); error.statusCode=statusCode; error.details=details; return error;
}

async function fetchNflSchedule(season, week){
  const url=`${NFL_STATS_API}/scoreboard?season=${season}&week=${week}`;
  const response=await fetch(url);
  if(!response.ok) throw httpError(`NFL Stats API returned ${response.status}`,response.status);
  const data=await response.json();
  return data?.events||[];
}

function parseGameDateTime(espnEvent){
  const dateStr=espnEvent?.date;
  if(!dateStr) return null;
  try{
    const d=new Date(dateStr);
    if(Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }catch{
    return null;
  }
}

function getTeamAbbr(espnTeam){
  // ESPN uses full team names, convert to NFL abbreviations
  const teamMap={
    'Arizona Cardinals':'ARI', 'Atlanta Falcons':'ATL', 'Baltimore Ravens':'BAL', 'Buffalo Bills':'BUF',
    'Carolina Panthers':'CAR', 'Chicago Bears':'CHI', 'Cincinnati Bengals':'CIN', 'Cleveland Browns':'CLE',
    'Dallas Cowboys':'DAL', 'Denver Broncos':'DEN', 'Detroit Lions':'DET', 'Green Bay Packers':'GB',
    'Houston Texans':'HOU', 'Indianapolis Colts':'IND', 'Jacksonville Jaguars':'JAX', 'Kansas City Chiefs':'KC',
    'Los Angeles Chargers':'LAC', 'Los Angeles Rams':'LAR', 'Las Vegas Raiders':'LV', 'Miami Dolphins':'MIA',
    'Minnesota Vikings':'MIN', 'New England Patriots':'NE', 'New Orleans Saints':'NO', 'New York Giants':'NYG',
    'New York Jets':'NYJ', 'Philadelphia Eagles':'PHI', 'Pittsburgh Steelers':'PIT', 'Seattle Seahawks':'SEA',
    'San Francisco 49ers':'SF', 'Tampa Bay Buccaneers':'TB', 'Tennessee Titans':'TEN', 'Washington Commanders':'WAS'
  };
  const fullName=espnTeam?.name||'';
  return teamMap[fullName]||null;
}

export async function backfillNflGameKickoffTimes({season=2025,week=1,dryRun=false}={}){
  if(!Number.isInteger(season)||season<2025) throw httpError('Season must be 2025 or later',400);
  if(!Number.isInteger(week)||week<1||week>22) throw httpError('Week must be 1-22',400);

  // Fetch from ESPN
  const espnEvents=await fetchNflSchedule(season,week);
  if(!Array.isArray(espnEvents)||espnEvents.length===0){
    throw httpError(`No events found for season ${season} week ${week}`,404);
  }

  // Parse to kickoff times
  const updates=[];
  for(const event of espnEvents){
    const away=getTeamAbbr(event?.competitions?.[0]?.competitors?.[1]?.team);
    const home=getTeamAbbr(event?.competitions?.[0]?.competitors?.[0]?.team);
    const kickoffAt=parseGameDateTime(event);

    if(!away||!home||!kickoffAt){
      console.log(`[WARN] Skipping malformed event: ${away} @ ${home}, kickoff: ${kickoffAt}`);
      continue;
    }

    updates.push({awayTeam:away,homeTeam:home,kickoffAt,source:'ESPN_NFL_STATS_API'});
  }

  if(dryRun){
    return {
      dryRun:true,
      season,
      week,
      espnEventsFound:espnEvents.length,
      parsedGames:updates.length,
      sampleUpdates:updates.slice(0,3)
    };
  }

  // Apply updates to Supabase
  const result=await callRpc('sports_edge_nfl_backfill_game_kickoffs',{p_season:season,p_week:week,p_updates:updates});

  return {
    dryRun:false,
    season,
    week,
    espnEventsFound:espnEvents.length,
    parsedGames:updates.length,
    appliedUpdates:result?.updated||0,
    skippedGames:result?.skipped||0,
    nullToTimestampCount:result?.nullToTimestamp||0,
    checkedAt:new Date().toISOString()
  };
}
