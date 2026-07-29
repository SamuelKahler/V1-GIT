(function(){
  'use strict';
  const COUNTED=new Set(['WIN','LOSS']);
  const text=value=>String(value==null?'':value).trim();
  const upper=value=>text(value).toUpperCase();
  const number=value=>{if(value===null||value===undefined||value==='')return null;const parsed=Number(String(value).replace(/[^0-9+-.]/g,''));return Number.isFinite(parsed)?parsed:null;};
  const hash=value=>{let h=2166136261;for(const char of String(value)){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36).toUpperCase();};
  function americanProfit(odds,result,units){const stake=Number.isFinite(units)&&units>0?units:1;if(result==='LOSS')return-stake;if(result!=='WIN'||!Number.isFinite(odds)||odds===0)return 0;return odds>0?stake*(odds/100):stake*(100/Math.abs(odds));}
  function marketFromPick(pick){const stored=upper(pick.market);if(stored&&stored!=='UNKNOWN')return stored;const raw=upper(pick.pick||pick.rawPick||pick.selection);if(/SERIES/.test(raw))return'SERIES';if(/\bO(?:VER)?\s*\d|\bU(?:NDER)?\s*\d|TOTAL/.test(raw))return'TOTAL';if(/\bML\b|MONEYLINE/.test(raw))return'MONEYLINE';if(/[+-]\s*(?:0?\.5|1\.5)|RUN\s*LINE|SPREAD/.test(raw))return'SPREAD';return'UNKNOWN';}
  function periodFromPick(pick){const stored=upper(pick.period);if(stored)return stored;return/\bF5\b|FIRST\s*FIVE|FIRST\s*5/.test(upper(pick.pick||pick.rawPick))?'FIRST_FIVE':'FULL_GAME';}
  function selectedTeam(pick){return upper(pick.selectedTeam||pick.team)||null;}
  function environmentForPick(pick){const team=selectedTeam(pick);const opponent=upper(pick.opponent)||null;const saved=pick.environment||{};const role=upper(saved.role||pick.homeAway||pick.role||pick.locationRole)||'UNKNOWN_ROLE';const odds=number(pick.odds);const oddsBucket=saved.oddsBucket||(odds==null?'NO_ODDS':odds<=-151?'HEAVY_FAVORITE':odds<=-111?'FAVORITE':odds<=109?'NEAR_PICKEM':odds<=150?'UNDERDOG':'BIG_UNDERDOG');const dimensions={team:team||'UNKNOWN_TEAM',opponent:opponent||'UNKNOWN_OPPONENT',market:marketFromPick(pick),period:periodFromPick(pick),role,oddsBucket,venue:saved.venue||null,dayNight:saved.dayNight||null,seriesGameNumber:saved.seriesGameNumber||null,starterHand:saved.starterHand||null};const key=Object.entries(dimensions).map(([key,value])=>`${key}=${value??'UNKNOWN'}`).join('|');return{id:`ENV-${hash(key)}`,key,dimensions};}
  function observation(pick,index){const result=upper(pick.result||pick.status);const odds=number(pick.odds);const units=number(pick.units)||1;const environment=environmentForPick(pick);return{id:pick.sourceId||pick.id||pick.coreId||`OBS-${hash(`${pick.date||pick.normalizedDate}|${pick.rawPick||pick.pick}|${index}`)}`,pickId:pick.sourceId||pick.id||pick.coreId||null,gameId:pick.gamePk?`MLB-${pick.gamePk}`:null,date:pick.date||pick.normalizedDate||pick.slate||null,team:selectedTeam(pick),opponent:upper(pick.opponent)||null,market:marketFromPick(pick),period:periodFromPick(pick),result,odds,units,profit:pick.profit!=null?number(pick.profit):americanProfit(odds,result,units),environmentId:environment.id,environment,traceable:Boolean((pick.sourceId||pick.id||pick.coreId)&&(pick.date||pick.normalizedDate||pick.slate)),original:pick};}
  function recordFor(rows){const wins=rows.filter(row=>row.result==='WIN').length;const losses=rows.filter(row=>row.result==='LOSS').length;const pushes=rows.filter(row=>row.result==='PUSH').length;const decisions=wins+losses;const profit=rows.reduce((sum,row)=>sum+(number(row.profit)||0),0);const risked=rows.filter(row=>COUNTED.has(row.result)).reduce((sum,row)=>sum+row.units,0);return{wins,losses,pushes,decisions,hitRate:decisions?(wins/decisions)*100:null,profit,roi:risked?(profit/risked)*100:null};}
  function scoreMatch(current,historical){
    if(current.market==='UNKNOWN'||current.market!==historical.market)return null;
    let score=25;const reasons=[`Same market: ${current.market}`];let tier='LEAGUE_MARKET';
    if(current.period===historical.period){score+=15;reasons.push(`Same period: ${current.period.replaceAll('_',' ')}`);}else return null;
    if(current.team&&current.team===historical.team){score+=30;tier='TEAM_MARKET';reasons.push(`Same team: ${current.team}`);}
    if(current.opponent&&historical.opponent&&current.opponent===historical.opponent){score+=12;reasons.push(`Same opponent: ${current.opponent}`);}
    const currentEnv=current.environment.dimensions;const historicalEnv=historical.environment.dimensions;
    if(currentEnv.role!=='UNKNOWN_ROLE'&&currentEnv.role===historicalEnv.role){score+=8;reasons.push(`Same role: ${currentEnv.role}`);}
    if(currentEnv.oddsBucket!=='NO_ODDS'&&currentEnv.oddsBucket===historicalEnv.oddsBucket){score+=10;reasons.push(`Same odds bucket: ${currentEnv.oddsBucket.replaceAll('_',' ')}`);}
    if(currentEnv.dayNight&&currentEnv.dayNight===historicalEnv.dayNight){score+=3;reasons.push(`Same day/night setting`);}
    return{score:Math.min(score,100),reasons,tier};
  }
  let state={observations:[],counted:[],pending:[],audit:{}};
  function rebuild(){
    const source=window.SportsEdgeDatabase?.evidenceObservations||window.SportsEdgeCore?.evidenceObservations||window.SportsEdgeDatabase?.observations||window.SportsEdgeCore?.picks||[];
    const observations=source.map(observation);const counted=observations.filter(row=>COUNTED.has(row.result));const pending=observations.filter(row=>!COUNTED.has(row.result));const environments=new Map();observations.forEach(row=>{if(!environments.has(row.environmentId))environments.set(row.environmentId,{...row.environment,observationIds:[]});environments.get(row.environmentId).observationIds.push(row.id);});
    state={observations,counted,pending,environments:[...environments.values()],audit:{version:'11.0.0',generatedAt:new Date().toISOString(),sourcePicks:source.length,observations:observations.length,countedInHitRates:counted.length,pending:pending.length,environments:environments.size,untraceable:observations.filter(row=>!row.traceable).length,missingGameId:observations.filter(row=>!row.gameId).length,missingOpponent:observations.filter(row=>!row.opponent).length,unknownMarket:observations.filter(row=>row.market==='UNKNOWN').length}};
    window.dispatchEvent(new CustomEvent('sportsedge:evidence-rebuilt',{detail:state.audit}));return state.audit;
  }
  function matchPick(pick,limit=8){
    const current=observation(pick,-1);const matches=state.counted.map(row=>{const match=scoreMatch(current,row);return match?{row,...match}:null;}).filter(Boolean);const buckets=new Map();
    matches.forEach(candidate=>{const band=candidate.score>=85?'EXACT':candidate.score>=70?'STRONG':candidate.score>=55?'RELEVANT':'BASELINE';const key=`${band}|${candidate.tier}|${candidate.row.market}|${candidate.row.period}`;if(!buckets.has(key))buckets.set(key,{band,tier:candidate.tier,score:candidate.score,reasons:new Set(),rows:[]});const bucket=buckets.get(key);bucket.score=Math.max(bucket.score,candidate.score);candidate.reasons.forEach(reason=>bucket.reasons.add(reason));bucket.rows.push(candidate.row);});
    return[...buckets.values()].filter(bucket=>bucket.rows.length>=3).map(bucket=>{const stats=recordFor(bucket.rows);const confidence=stats.decisions>=50?'HIGH':stats.decisions>=20?'MEDIUM':stats.decisions>=8?'DEVELOPING':'EARLY';const label=bucket.band==='EXACT'?'Exact Environment Match':bucket.band==='STRONG'?'Strong Environment Match':bucket.band==='RELEVANT'?'Relevant Team / Market Match':'League Market Baseline';return{evidenceId:`EVD-${hash(`${current.id}|${bucket.band}|${bucket.rows.map(row=>row.id).sort().join(',')}`)}`,team:current.team,market:current.market,period:current.period,matchScore:bucket.score,matchTier:label,matchReasons:[...bucket.reasons],confidence,...stats,supportingObservations:bucket.rows.sort((a,b)=>String(b.date).localeCompare(String(a.date))),environment:current.environment};}).sort((a,b)=>b.matchScore-a.matchScore||b.decisions-a.decisions).slice(0,limit);
  }
  rebuild();
  window.addEventListener('sportsedge:database-updated',rebuild);
  window.SportsEdgeIntelligence=Object.freeze({version:'11.0.0',get observations(){return state.observations;},get counted(){return state.counted;},get pending(){return state.pending;},get environments(){return state.environments;},get audit(){return state.audit;},environmentForPick,matchPick,recordFor,rebuild});
  console.info('[Sports Edge Intelligence] V11 evidence index initialized',state.audit);
})();
