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
    if(current.period!==historical.period)return null;
    if(!current.team||!historical.team||current.team!==historical.team)return null;

    const currentEnv=current.environment.dimensions;
    const historicalEnv=historical.environment.dimensions;
    const dimensions=[];
    let score=70;

    dimensions.push({key:'team',label:`Same team: ${current.team}`,weight:30});
    dimensions.push({key:'market',label:`Same market: ${current.market}`,weight:25});
    dimensions.push({key:'period',label:`Same period: ${current.period.replaceAll('_',' ')}`,weight:15});

    if(current.opponent&&historical.opponent&&current.opponent===historical.opponent){
      score+=12;
      dimensions.push({key:'opponent',label:`Same opponent: ${current.opponent}`,weight:12});
    }
    if(currentEnv.role&&currentEnv.role!=='UNKNOWN_ROLE'&&historicalEnv.role===currentEnv.role){
      score+=8;
      dimensions.push({key:'role',label:`Same role: ${currentEnv.role}`,weight:8});
    }
    if(currentEnv.oddsBucket&&currentEnv.oddsBucket!=='NO_ODDS'&&historicalEnv.oddsBucket===currentEnv.oddsBucket){
      score+=10;
      dimensions.push({key:'oddsBucket',label:`Same odds range: ${currentEnv.oddsBucket.replaceAll('_',' ')}`,weight:10});
    }
    if(currentEnv.dayNight&&historicalEnv.dayNight===currentEnv.dayNight){
      score+=3;
      dimensions.push({key:'dayNight',label:`Same game time: ${currentEnv.dayNight}`,weight:3});
    }
    if(currentEnv.seriesGameNumber&&historicalEnv.seriesGameNumber===currentEnv.seriesGameNumber){
      score+=5;
      dimensions.push({key:'seriesGameNumber',label:`Same series game: ${currentEnv.seriesGameNumber}`,weight:5});
    }
    if(currentEnv.starterHand&&historicalEnv.starterHand===currentEnv.starterHand){
      score+=5;
      dimensions.push({key:'starterHand',label:`Same starter handedness: ${currentEnv.starterHand}`,weight:5});
    }

    const matchedEnvironmentDimensions=dimensions.filter(d=>!['team','market','period'].includes(d.key));
    const exactEnvironment=matchedEnvironmentDimensions.length>=2;
    const tier=exactEnvironment?'EXACT_ENVIRONMENT':matchedEnvironmentDimensions.length===1?'CONTEXT_MATCH':'TEAM_MARKET';
    return{score:Math.min(score,100),reasons:dimensions.map(d=>d.label),dimensions,matchedEnvironmentDimensions,tier};
  }
  let state={observations:[],counted:[],pending:[],audit:{}};
  function rebuild(){
    const source=window.SportsEdgeDatabase?.evidenceObservations||window.SportsEdgeCore?.evidenceObservations||window.SportsEdgeDatabase?.observations||window.SportsEdgeCore?.picks||[];
    const observations=source.map(observation);const counted=observations.filter(row=>COUNTED.has(row.result));const pending=observations.filter(row=>!COUNTED.has(row.result));const environments=new Map();observations.forEach(row=>{if(!environments.has(row.environmentId))environments.set(row.environmentId,{...row.environment,observationIds:[]});environments.get(row.environmentId).observationIds.push(row.id);});
    state={observations,counted,pending,environments:[...environments.values()],audit:{version:'12.0.0',generatedAt:new Date().toISOString(),sourcePicks:source.length,observations:observations.length,countedInHitRates:counted.length,pending:pending.length,environments:environments.size,untraceable:observations.filter(row=>!row.traceable).length,missingGameId:observations.filter(row=>!row.gameId).length,missingOpponent:observations.filter(row=>!row.opponent).length,unknownMarket:observations.filter(row=>row.market==='UNKNOWN').length}};
    window.dispatchEvent(new CustomEvent('sportsedge:evidence-rebuilt',{detail:state.audit}));return state.audit;
  }
  function matchPick(pick,limit=8){
    const current=observation(pick,-1);
    const candidates=state.counted.map(row=>{const match=scoreMatch(current,row);return match?{row,...match}:null;}).filter(Boolean);

    const definitions=[
      {id:'TEAM_MARKET',title:`${current.team} ${current.market.replaceAll('_',' ')} — All graded games`,required:[]},
      {id:'ROLE',title:`${current.team} ${current.market.replaceAll('_',' ')} — ${current.environment.dimensions.role.replaceAll('_',' ')}`,required:['role']},
      {id:'ODDS_BUCKET',title:`${current.team} ${current.market.replaceAll('_',' ')} — ${current.environment.dimensions.oddsBucket.replaceAll('_',' ')}`,required:['oddsBucket']},
      {id:'OPPONENT',title:`${current.team} ${current.market.replaceAll('_',' ')} — vs ${current.opponent||'opponent'}`,required:['opponent']},
      {id:'EXACT_ENVIRONMENT',title:'Closest verified game-log environment',required:['__EXACT__']}
    ];

    const groups=[];
    for(const def of definitions){
      if(def.id==='ROLE'&&current.environment.dimensions.role==='UNKNOWN_ROLE')continue;
      if(def.id==='ODDS_BUCKET'&&current.environment.dimensions.oddsBucket==='NO_ODDS')continue;
      if(def.id==='OPPONENT'&&!current.opponent)continue;
      let rows=candidates;
      if(def.required.includes('__EXACT__')) rows=candidates.filter(c=>c.matchedEnvironmentDimensions.length>=2);
      else if(def.required.length) rows=candidates.filter(c=>def.required.every(req=>c.dimensions.some(d=>d.key===req)));
      const unique=new Map();
      rows.forEach(c=>{if(!unique.has(c.row.id))unique.set(c.row.id,c);});
      rows=[...unique.values()];
      if(rows.length<3)continue;
      const observations=rows.map(c=>c.row);
      const stats=recordFor(observations);
      const dimensions=[...new Map(rows.flatMap(c=>c.dimensions).map(d=>[d.key,d])).values()];
      const confidence=stats.decisions>=50?'HIGH':stats.decisions>=20?'MEDIUM':stats.decisions>=8?'DEVELOPING':'EARLY';
      const matchScore=Math.max(...rows.map(c=>c.score));
      groups.push({
        evidenceId:`EVD-${hash(`${current.id}|${def.id}|${observations.map(r=>r.id).sort().join(',')}`)}`,
        evidenceType:'GAME_LOG',
        evidenceCategory:def.id,
        title:def.title,
        team:current.team,
        market:current.market,
        period:current.period,
        matchScore,
        matchTier:def.id==='EXACT_ENVIRONMENT'?'Verified environment match':def.id==='TEAM_MARKET'?'Team game log':'Verified context match',
        matchReasons:dimensions.map(d=>d.label),
        matchedDimensions:dimensions,
        confidence,
        ...stats,
        supportingObservations:observations.sort((a,b)=>String(b.date).localeCompare(String(a.date))),
        environment:current.environment
      });
    }
    return groups.sort((a,b)=>{
      const priority={EXACT_ENVIRONMENT:5,OPPONENT:4,ROLE:3,ODDS_BUCKET:2,TEAM_MARKET:1};
      return (priority[b.evidenceCategory]||0)-(priority[a.evidenceCategory]||0)||b.decisions-a.decisions;
    }).slice(0,limit);
  }
  rebuild();
  window.addEventListener('sportsedge:database-updated',rebuild);
  window.SportsEdgeIntelligence=Object.freeze({version:'12.0.0',get observations(){return state.observations;},get counted(){return state.counted;},get pending(){return state.pending;},get environments(){return state.environments;},get audit(){return state.audit;},environmentForPick,matchPick,recordFor,rebuild});
  console.info('[Sports Edge Intelligence] V12 evidence index initialized',state.audit);
})();
