import { callRpc } from '../mlb/supabase.js';

const SPORT = 'americanfootball_nfl';
const DEFAULT_MARKETS = [
  'player_pass_yds',
  'player_pass_completions',
  'player_pass_tds',
  'player_rush_yds',
  'player_rush_attempts',
  'player_receptions',
  'player_reception_yds'
];

const MARKET_MAP = Object.freeze({
  player_pass_yds: 'PASS_YARDS',
  player_pass_completions: 'COMPLETIONS',
  player_pass_tds: 'PASS_TDS',
  player_rush_yds: 'RUSH_YARDS',
  player_rush_attempts: 'RUSH_ATTEMPTS',
  player_receptions: 'RECEPTIONS',
  player_reception_yds: 'REC_YARDS'
});

const TEAM_NAMES = Object.freeze({
  ARI:'Arizona Cardinals', ATL:'Atlanta Falcons', BAL:'Baltimore Ravens', BUF:'Buffalo Bills', CAR:'Carolina Panthers', CHI:'Chicago Bears', CIN:'Cincinnati Bengals', CLE:'Cleveland Browns', DAL:'Dallas Cowboys', DEN:'Denver Broncos', DET:'Detroit Lions', GB:'Green Bay Packers', HOU:'Houston Texans', IND:'Indianapolis Colts', JAX:'Jacksonville Jaguars', KC:'Kansas City Chiefs', LAC:'Los Angeles Chargers', LAR:'Los Angeles Rams', LV:'Las Vegas Raiders', MIA:'Miami Dolphins', MIN:'Minnesota Vikings', NE:'New England Patriots', NO:'New Orleans Saints', NYG:'New York Giants', NYJ:'New York Jets', PHI:'Philadelphia Eagles', PIT:'Pittsburgh Steelers', SEA:'Seattle Seahawks', SF:'San Francisco 49ers', TB:'Tampa Bay Buccaneers', TEN:'Tennessee Titans', WAS:'Washington Commanders'
});

function httpError(message, statusCode=500, details=null){
  const error=new Error(message); error.statusCode=statusCode; error.details=details; return error;
}
function normalizeName(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function median(values){
  const clean=values.map(Number).filter(Number.isFinite).sort((a,b)=>a-b); if(!clean.length)return null;
  const m=Math.floor(clean.length/2); return clean.length%2?clean[m]:(clean[m-1]+clean[m])/2;
}
function numberOrNull(value){const n=Number(value); return Number.isFinite(n)?n:null;}
function providerIso(value){
  const d=value instanceof Date?value:new Date(value);
  if(Number.isNaN(d.getTime())) throw httpError(`Invalid NFL kickoff timestamp: ${value}`,500);
  return d.toISOString().replace(/\.\d{3}Z$/,'Z');
}
function isoBefore(kickoffAt, minutes=5){const d=new Date(kickoffAt); return providerIso(new Date(d.getTime()-minutes*60_000));}
function isHistorical(kickoffAt){return new Date(kickoffAt).getTime()<Date.now()-60*60_000;}

async function oddsFetch(path){
  const key=String(process.env.ODDS_API_KEY||'').trim();
  if(!key) throw httpError('ODDS_API_KEY is missing in Vercel Environment Variables.',503);
  const join=path.includes('?')?'&':'?';
  const response=await fetch(`https://api.the-odds-api.com${path}${join}apiKey=${encodeURIComponent(key)}`);
  const text=await response.text(); let payload;
  try{payload=text?JSON.parse(text):null;}catch{payload=text;}
  if(!response.ok){
    const msg=payload?.message||payload?.error||payload?.error_code||`The Odds API returned ${response.status}`;
    throw httpError(`NFL prop odds request failed: ${msg}`,response.status===401||response.status===403?403:502,{status:response.status,payload});
  }
  return {payload,usage:{remaining:response.headers.get('x-requests-remaining'),used:response.headers.get('x-requests-used'),last:response.headers.get('x-requests-last')}};
}

function unwrap(payload){return payload?.data??payload;}
function findEvent(events, game){
  const away=normalizeName(TEAM_NAMES[game.awayTeam]||game.awayTeam),home=normalizeName(TEAM_NAMES[game.homeTeam]||game.homeTeam);
  return (Array.isArray(events)?events:[]).find(event=>normalizeName(event.away_team)===away&&normalizeName(event.home_team)===home)||null;
}

async function getEventForGame(game){
  if(isHistorical(game.kickoffAt)){
    // NFL Historical Event Match Debug V2: Add logging to diagnose Odds API response
    const pregameWindows=[1440,720,360,180,60,30];
    let lastError=null;
    let diagnostics=[];
    
    for(const minutes of pregameWindows){
      try{
        const date=isoBefore(game.kickoffAt,minutes);
        const path=`/v4/historical/sports/${SPORT}/events?date=${date}&dateFormat=iso`;
        const {payload,usage}=await oddsFetch(path);
        
        const data=unwrap(payload)||{};
        const eventCount=Array.isArray(data)?data.length:0;
        const event=findEvent(data,game);
        
        diagnostics.push({
          window:minutes,
          queryDate:date,
          eventCount,
          found:!!event,
          sampleEvents:eventCount>0?data.slice(0,2).map(e=>({away:e.away_team,home:e.home_team})):[]
        });
        
        if(event){
          return {event,usage,historical:true,pregameWindow:minutes,diagnostics};
        }
      }catch(error){
        lastError=error;
        diagnostics.push({window:minutes,error:error.message});
      }
    }
    
    return {event:null,usage:null,historical:true,pregameWindow:null,searchError:lastError?.message||'No matching event in any pregame window',diagnostics};
  }
  const {payload,usage}=await oddsFetch(`/v4/sports/${SPORT}/events?dateFormat=iso`);
  return {event:findEvent(unwrap(payload),game),usage,historical:false};
}

async function getEventOdds(eventId, game, markets){
  const marketCsv=markets.join(',');
  if(isHistorical(game.kickoffAt)){
    const date=isoBefore(game.kickoffAt,5);
    return oddsFetch(`/v4/historical/sports/${SPORT}/events/${encodeURIComponent(eventId)}/odds?regions=us&markets=${encodeURIComponent(marketCsv)}&oddsFormat=american&dateFormat=iso&date=${date}`);
  }
  return oddsFetch(`/v4/sports/${SPORT}/events/${encodeURIComponent(eventId)}/odds?regions=us&markets=${encodeURIComponent(marketCsv)}&oddsFormat=american&dateFormat=iso`);
}

function parseConsensusRows(payload, game, eventId, markets){
  const data=unwrap(payload)||{};
  const groups=new Map();
  for(const book of (data.bookmakers||[])){
    for(const market of (book.markets||[])){
      if(!markets.includes(market.key)||!MARKET_MAP[market.key])continue;
      for(const outcome of (market.outcomes||[])){
        const direction=String(outcome.name||'').toUpperCase();
        if(direction!=='OVER'&&direction!=='UNDER')continue;
        const playerName=String(outcome.description||'').trim();
        const point=numberOrNull(outcome.point);
        if(!playerName||point==null)continue;
        const key=[normalizeName(playerName),MARKET_MAP[market.key],direction].join('|');
        if(!groups.has(key))groups.set(key,{playerName,market:MARKET_MAP[market.key],direction,offers:[]});
        groups.get(key).offers.push({bookmaker:book.key||book.title,bookmakerTitle:book.title||book.key,line:point,americanOdds:numberOrNull(outcome.price),lastUpdate:market.last_update||book.last_update});
      }
    }
  }
  const historical=isHistorical(game.kickoffAt);
  return [...groups.values()].map(group=>{
    const lines=group.offers.map(x=>x.line).filter(Number.isFinite);
    const prices=group.offers.map(x=>x.americanOdds).filter(Number.isFinite);
    return {
      gameId:game.gameId,season:game.season,week:game.week,playerName:group.playerName,team:null,
      market:group.market,direction:group.direction,line:median(lines),americanOdds:prices.length?Math.round(median(prices)):null,bookCount:group.offers.length,
      lineMin:lines.length?Math.min(...lines):null,lineMax:lines.length?Math.max(...lines):null,
      capturedAt:historical?isoBefore(game.kickoffAt,5):new Date().toISOString(),snapshotType:historical?'CLOSING':'CURRENT',
      source:'THE_ODDS_API',sourceEventId:eventId,offers:group.offers
    };
  });
}

function parseMarkets(markets){
  const requested=(Array.isArray(markets)?markets:String(markets||'').split(','))
    .map(x=>String(x).trim()).filter(Boolean);
  const list=requested.length?requested:DEFAULT_MARKETS;
  return [...new Set(list.filter(key=>MARKET_MAP[key]))];
}

export async function importNflRealPropLines({season=2025,week=null,markets=DEFAULT_MARKETS,dryRun=false}={}){
  const targetSeason=Number(season);
  const targetWeek=week==null||week===''?null:Number(week);
  if(!Number.isInteger(targetSeason)||targetSeason<2025)throw httpError('Real-line consumer prop history starts with the 2025 season.',400);
  if(targetWeek!=null&&(!Number.isInteger(targetWeek)||targetWeek<1||targetWeek>22))throw httpError('NFL week must be between 1 and 22.',400);
  const marketList=parseMarkets(markets);
  if(!marketList.length)throw httpError('Select at least one supported NFL player prop market.',400);
  const games=await callRpc('sports_edge_nfl_games_for_prop_import',{p_season:targetSeason,p_week:targetWeek});
  const gameList=Array.isArray(games)?games:[];
  const historicalGames=gameList.filter(g=>isHistorical(g.kickoffAt));
  const estimate=historicalGames.length*marketList.length*10;
  if(dryRun){return {dryRun:true,season:targetSeason,week:targetWeek,games:gameList.length,historicalGames:historicalGames.length,markets:marketList,estimatedHistoricalEventOddsCredits:estimate,normalizedRows:0,persisted:{receivedRows:0,gradedRows:0},failures:[],matchedEvents:0,providerUsage:{}};}

  const allRows=[]; const failures=[]; let lastUsage=null; let matchedEvents=0;
  for(const game of gameList){
    try{
      const eventResult=await getEventForGame(game); lastUsage=eventResult.usage||lastUsage;
      if(!eventResult.event){
        failures.push({
          game:`${game.awayTeam}@${game.homeTeam}`,
          reason:eventResult.searchError||'Odds API event not found',
          window:eventResult.pregameWindow,
          diagnostics:eventResult.diagnostics
        });
        continue;
      }
      matchedEvents++;
      const oddsResult=await getEventOdds(eventResult.event.id,game,marketList); lastUsage=oddsResult.usage||lastUsage;
      allRows.push(...parseConsensusRows(oddsResult.payload,game,eventResult.event.id,marketList));
    }catch(error){failures.push({game:`${game.awayTeam}@${game.homeTeam}`,reason:error.message,statusCode:error.statusCode||null});}
  }
  let persisted={receivedRows:0,gradedRows:0};
  for(let i=0;i<allRows.length;i+=500){
    const batch=allRows.slice(i,i+500);
    const result=await callRpc('sports_edge_nfl_upsert_real_prop_lines',{p_rows:batch},{timeoutMs:60_000,attempts:2});
    persisted.receivedRows+=(result?.receivedRows||0); persisted.gradedRows+=(result?.gradedRows||0);
  }
  const audit=await callRpc('sports_edge_nfl_real_line_prop_audit',{});
  return {dryRun:false,season:targetSeason,week:targetWeek,games:gameList.length,matchedEvents,markets:marketList,normalizedRows:allRows.length,persisted,failures:failures.slice(0,30),providerUsage:lastUsage||{},audit};
}

export { DEFAULT_MARKETS, MARKET_MAP };

export async function previewNflPropSmartBackfill({season=2025,startWeek=1,endWeek=18,markets=DEFAULT_MARKETS,maxEstimatedCredits=18000}={}){
  const first=Math.max(1,Number(startWeek)||1), last=Math.min(22,Math.max(first,Number(endWeek)||18));
  const marketList=parseMarkets(markets); const weeks=[]; let totalGames=0,totalHistoricalGames=0,totalEstimate=0;
  for(let week=first;week<=last;week++){
    const games=await callRpc('sports_edge_nfl_games_for_prop_import',{p_season:Number(season),p_week:week});
    const gameList=Array.isArray(games)?games:[]; const historical=gameList.filter(g=>isHistorical(g.kickoffAt)).length; const estimate=historical*marketList.length*10;
    weeks.push({week,games:gameList.length,historicalGames:historical,estimatedCredits:estimate}); totalGames+=gameList.length; totalHistoricalGames+=historical; totalEstimate+=estimate;
  }
  return {season:Number(season),startWeek:first,endWeek:last,markets:marketList,weeks,totalGames,totalHistoricalGames,estimatedHistoricalEventOddsCredits:totalEstimate,maxEstimatedCredits:Number(maxEstimatedCredits),withinConfiguredBudget:totalEstimate<=Number(maxEstimatedCredits)};
}

export async function runNflPropSmartBackfill({season=2025,startWeek=1,endWeek=18,markets=DEFAULT_MARKETS,maxEstimatedCredits=18000}={}){
  const preview=await previewNflPropSmartBackfill({season,startWeek,endWeek,markets,maxEstimatedCredits});
  if(!preview.withinConfiguredBudget) throw httpError(`Smart backfill blocked: estimated ${preview.estimatedHistoricalEventOddsCredits} credits exceeds configured budget ${preview.maxEstimatedCredits}`,400);
  const results=[]; let estimatedConsumed=0;
  for(const plan of preview.weeks){
    if(!plan.games) continue;
    if(estimatedConsumed+plan.estimatedCredits>preview.maxEstimatedCredits) break;
    const result=await importNflRealPropLines({season:preview.season,week:plan.week,markets:preview.markets,dryRun:false});
    results.push({week:plan.week,estimatedCredits:plan.estimatedCredits,normalizedRows:result.normalizedRows,persisted:result.persisted,failures:result.failures,providerUsage:result.providerUsage});
    estimatedConsumed+=plan.estimatedCredits;
    if(result.failures?.some(f=>[401,402,403].includes(Number(f.statusCode)))) break;
  }
  const audit=await callRpc('sports_edge_nfl_prop_qualification_audit',{});
  return {...preview,completedWeeks:results.length,estimatedConsumed,results,audit};
}
