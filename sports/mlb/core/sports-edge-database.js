(function(){
  'use strict';

  const DB_KEY='sports-edge-canonical-db-v10';
  const VALID_RESULTS=new Set(['WIN','LOSS','PUSH','VOID']);
  const ALL_STATUSES=new Set(['PENDING','LIVE','WIN','LOSS','PUSH','VOID','UNVERIFIED','DISREGARD']);
  const TEAM_ALIASES={
    ARI:'ARI',ARIZONA:'ARI',DIAMONDBACKS:'ARI',ATL:'ATL',ATLANTA:'ATL',BRAVES:'ATL',BAL:'BAL',BALTIMORE:'BAL',ORIOLES:'BAL',
    BOS:'BOS',BOSTON:'BOS','RED SOX':'BOS',CHC:'CHC',CHIC:'CHC',CHICAGO:'CHC',CUBS:'CHC',CWS:'CWS','WHITE SOX':'CWS',
    CIN:'CIN',CINCINNATI:'CIN',REDS:'CIN',CLE:'CLE',CLEVELAND:'CLE',GUARDIANS:'CLE',COL:'COL',COLORADO:'COL',ROCKIES:'COL',
    DET:'DET',DETROIT:'DET',TIGERS:'DET',HOU:'HOU',HOUSTON:'HOU',ASTROS:'HOU',KC:'KC',KCR:'KC','KANSAS CITY':'KC',ROYALS:'KC',
    LAA:'LAA',ANGELS:'LAA',LAD:'LAD',DODGERS:'LAD',MIA:'MIA',MIAMI:'MIA',MARLINS:'MIA',MIL:'MIL',MILWAUKEE:'MIL',BREWERS:'MIL',
    MIN:'MIN',MINNESOTA:'MIN',TWINS:'MIN',NYM:'NYM',METS:'NYM',NYY:'NYY',YANKEES:'NYY',ATH:'ATH',OAK:'ATH',"A'S":'ATH',ATHLETICS:'ATH',
    PHI:'PHI',PHILADELPHIA:'PHI',PHILLIES:'PHI',PIT:'PIT',PITTSBURGH:'PIT',PIRATES:'PIT',SD:'SD',SDP:'SD','SAN DIEGO':'SD',PADRES:'SD',
    SEA:'SEA',SEATTLE:'SEA',MARINERS:'SEA',SF:'SF',SFG:'SF','SAN FRANCISCO':'SF',GIANTS:'SF',STL:'STL','ST LOUIS':'STL',CARDINALS:'STL',
    TB:'TB',TBR:'TB',TAMPA:'TB',RAYS:'TB',TEX:'TEX',TEXAS:'TEX',RANGERS:'TEX',TOR:'TOR',TORONTO:'TOR','BLUE JAYS':'TOR',
    WSH:'WSH',WAS:'WSH',WASHINGTON:'WSH',NATIONALS:'WSH'
  };

  const text=v=>String(v==null?'':v).replace(/[\uFFFD]/g,'').replace(/\s+/g,' ').trim();
  const upper=v=>text(v).toUpperCase().replace(/[’]/g,"'");
  const finite=v=>{ if(v===null||v===undefined||v==='') return null; const n=Number(String(v).replace(/[^0-9.+-]/g,'')); return Number.isFinite(n)?n:null; };
  const hash=value=>{ let h=2166136261; const s=String(value); for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return (h>>>0).toString(36).toUpperCase(); };

  function isoDate(value){
    const raw=text(value); if(!raw) return null;
    let m=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); if(m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/); if(m){ const y=m[3].length===2?`20${m[3]}`:m[3]; return `${y}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`; }
    const d=new Date(raw); return Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:null;
  }
  function normalizeTeam(value){
    const raw=upper(value).replace(/\./g,'').trim(); if(!raw) return null;
    if(TEAM_ALIASES[raw]) return TEAM_ALIASES[raw];
    for(const key of Object.keys(TEAM_ALIASES).sort((a,b)=>b.length-a.length)){
      const re=new RegExp(`(^|[^A-Z])${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Z]|$)`); if(re.test(raw)) return TEAM_ALIASES[key];
    }
    return null;
  }
  function teamsIn(value){
    const raw=upper(value).replace(/\./g,' '); const found=[];
    for(const key of Object.keys(TEAM_ALIASES).sort((a,b)=>b.length-a.length)){
      const re=new RegExp(`(^|[^A-Z])${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Z]|$)`); if(re.test(raw)) found.push(TEAM_ALIASES[key]);
    }
    return [...new Set(found)];
  }
  function normalizeStatus(value,row){
    const s=upper(value); const map={W:'WIN',WON:'WIN',SUCCESS:'WIN',L:'LOSS',LOST:'LOSS',TIE:'PUSH',CANCELLED:'VOID',CANCELED:'VOID',DISREGARD:'VOID',IGNORE:'VOID',NO_ACTION:'VOID',OPEN:'PENDING'};
    let out=map[s]||s;
    if(!out){ const pnl=finite(row?.result); if(pnl!==null) out=pnl>0?'WIN':pnl<0?'LOSS':'PUSH'; }
    return ALL_STATUSES.has(out)?out:'PENDING';
  }
  function parseMarket(rawPick,type){
    const s=upper(`${type||''} ${rawPick||''}`).replace(/[_*]/g,' ');
    if(/SERIES/.test(s)) return 'SERIES';
    if(/PARLAY/.test(s)) return 'PARLAY';
    if(/NRFI|NO RUN FIRST/.test(s)) return 'NRFI';
    if(/GRAND SALAMI/.test(s)) return 'GRAND_SALAMI';
    if(/STRIKEOUT|\bK'?S\b|PROP|HITS|RBI|HOME RUN|TO SCORE/.test(s)) return 'PLAYER_PROP';
    if(/\bML\b|MONEYLINE/.test(s)) return 'MONEYLINE';
    if(/\b(?:O|OVER|U|UNDER)\s*\d|TOTAL/.test(s)) return 'TOTAL';
    if(/RUN LINE|SPREAD|\bRL\b|(?:^|\s)[+-]\s*\d+(?:\.5)?/.test(s)) return 'SPREAD';
    return 'UNKNOWN';
  }
  function parsePeriod(rawPick,type,market){ const s=upper(`${type||''} ${rawPick||''}`); if(market==='SERIES') return 'SERIES'; if(/\bF5\b|FIRST\s*5|FIRST\s*FIVE/.test(s)) return 'FIRST_FIVE'; if(market==='PLAYER_PROP') return 'PLAYER_GAME'; return 'FULL_GAME'; }
  function parseLine(rawPick,row){
    const direct=finite(row?.line); if(direct!==null) return direct;
    const s=upper(rawPick).replace(/[_*]/g,' '); let m=s.match(/\b(?:O|OVER|U|UNDER)\s*(\d+(?:\.5)?)/); if(m) return Number(m[1]);
    m=s.match(/(?:^|\s)([+-]\d+(?:\.5)?)(?:\s|$)/); return m?Number(m[1]):null;
  }
  function parseOdds(rawPick,row){
    const direct=finite(row?.odds); if(direct!==null && Math.abs(direct)>=100) return direct;
    const s=`${text(row?.odds)} ${text(rawPick)}`; const matches=[...s.matchAll(/(?:^|\s)([+-]\d{3,4})(?=\s|$|[,;])/g)].map(m=>Number(m[1])); return matches.length?matches[0]:null;
  }
  function sourceRows(){
    const rows=[]; const add=(source,arrayName,data)=>{ if(!Array.isArray(data)) return; data.forEach((row,index)=>rows.push({source,arrayName,index,row})); };
    try{ add('MLB_DATA','trackedPickResults',typeof trackedPickResults!=='undefined'?trackedPickResults:window.trackedPickResults); }catch{}
    try{ add('OFFICIAL_HISTORY','officialBetHistory',typeof officialBetHistory!=='undefined'?officialBetHistory:window.officialBetHistory); }catch{}
    try{ add('F5_HISTORY','f5PerformanceBets',typeof f5PerformanceBets!=='undefined'?f5PerformanceBets:window.f5PerformanceBets); }catch{}
    try{ add('SERIES_BOARD','seriesBoardPicks',typeof seriesBoardPicks!=='undefined'?seriesBoardPicks:window.seriesBoardPicks); }catch{}
    try{ add('DAILY_IMPORT','dailyImportPicks',typeof dailyImportPicks!=='undefined'?dailyImportPicks:(window.dailyImportPicks||window.DAILY_IMPORT_PICKS)); }catch{}
    return rows;
  }
  function observation(source){
    const row=source.row||{}; const rawPick=text(row.pick||row.bet||row.selection||row.edge||row.description); const date=isoDate(row.date||row.slate||row.gameDate);
    const found=teamsIn(rawPick); const selectedTeam=normalizeTeam(row.team||row.selectedTeam)||found[0]||null; const opponent=normalizeTeam(row.opponent||row.opp||row.matchup)||found.find(t=>t!==selectedTeam)||null;
    const market=parseMarket(rawPick,row.type||row.category); const period=parsePeriod(rawPick,row.type||row.category,market); const status=normalizeStatus(row.status||row.outcome||row.result,row);
    const sourceId=`SRC-${source.arrayName.toUpperCase()}-${String(source.index+1).padStart(6,'0')}`;
    return {
      id:sourceId, sourceId, canonicalId:`PICK-${hash([date,rawPick,source.arrayName,source.index].join('|'))}`,
      source:source.source, sourceArray:source.arrayName, sourceIndex:source.index, original:row,
      date, rawDate:text(row.date||row.slate||row.gameDate), rawPick, selectedTeam, opponent, market, period,
      line:parseLine(rawPick,row), odds:parseOdds(rawPick,row), units:finite(row.units??row.unit??row.stake)??1,
      status, result:VALID_RESULTS.has(status)?status:null, authoritativeResult:VALID_RESULTS.has(status),
      profit:finite(row.profit??row.net??(typeof row.result==='number'?row.result:null)), gamePk:row.gamePk||null,
      metadataStatus:row.gamePk?'RESOLVED':'NOT_RESOLVED', gradeReason:VALID_RESULTS.has(status)?'PRESERVED_EXISTING_GRADE':null,
      environment:row.environment||null, notes:text(row.notes||row.why||row.comment), updatedAt:null
    };
  }
  function loadStored(){ try{return JSON.parse(localStorage.getItem(DB_KEY)||'null');}catch{return null;} }
  function save(){ try{ localStorage.setItem(DB_KEY,JSON.stringify({version:'10.0.0',savedAt:new Date().toISOString(),grades:state.observations.map(o=>({sourceId:o.sourceId,result:o.result,status:o.status,gamePk:o.gamePk,opponent:o.opponent,selectedTeam:o.selectedTeam,gradeReason:o.gradeReason,metadataStatus:o.metadataStatus,environment:o.environment,updatedAt:o.updatedAt,profit:o.profit}))})); }catch{} }
  function mergeStored(observations){
    const stored=loadStored(); if(!stored?.grades) return observations; const map=new Map(stored.grades.map(g=>[g.sourceId,g]));
    return observations.map(o=>{ const g=map.get(o.sourceId); if(!g) return o; const keepSource=o.authoritativeResult&&VALID_RESULTS.has(o.result); return {...o,...g,result:keepSource?o.result:g.result,status:keepSource?o.status:g.status,authoritativeResult:o.authoritativeResult}; });
  }
  function displayPick(o){ return {...o.original,coreId:o.sourceId,sourceId:o.sourceId,slate:o.original.slate||o.original.date||o.rawDate,pick:o.original.pick||o.original.bet||o.rawPick,status:o.result||o.status,result:o.result,gamePk:o.gamePk,selectedTeam:o.selectedTeam,opponent:o.opponent,market:o.market,period:o.period,normalizedDate:o.date,environment:o.environment,gradeReason:o.gradeReason,metadataStatus:o.metadataStatus}; }
  function rebuildViews(){
    state.byId=new Map(state.observations.map(o=>[o.sourceId,o]));
    state.displayPicks=state.observations.filter(o=>['MLB_DATA','DAILY_IMPORT'].includes(o.source)).map(displayPick);
    state.f5Bets=state.observations.filter(o=>o.period==='FIRST_FIVE'&&VALID_RESULTS.has(o.result)).map((o,i)=>({id:`canonical-f5-${o.sourceId}`,pickId:o.sourceId,gamePk:o.gamePk,team:o.selectedTeam,teamName:o.selectedTeam,bet:o.rawPick,date:o.date?o.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$2/$3/$1'):o.rawDate,isoDate:o.date,odds:o.odds===null?'-':(o.odds>0?`+${o.odds}`:`${o.odds}`),result:o.profit!==null?o.profit:(o.result==='WIN'?(o.odds>0?o.units*o.odds/100:o.units*100/Math.abs(o.odds||-110)):o.result==='LOSS'?-o.units:0),outcome:o.result.toLowerCase(),units:o.units,gradeReason:o.gradeReason,resolutionConfidence:o.metadataStatus==='RESOLVED'?100:50,source:'canonical-database'}));
    state.officialHistory=state.observations.filter(o=>VALID_RESULTS.has(o.result)).map(o=>({date:o.date||o.rawDate,type:o.period==='FIRST_FIVE'?'F5':o.market,bet:o.rawPick,team:o.selectedTeam,opponent:o.opponent,result:o.profit!==null?o.profit:(o.result==='WIN'?1:o.result==='LOSS'?-1:0),outcome:o.result,status:o.result,units:o.units,gamePk:o.gamePk,environment:o.environment,pickId:o.sourceId}));
  }
  function applyGrades(rows){
    if(!Array.isArray(rows)) return {applied:0}; let applied=0;
    rows.forEach(g=>{ const o=state.byId.get(g.pickId||g.sourceId); if(!o) return; const incoming=upper(g.result); const sourceWins=o.authoritativeResult&&VALID_RESULTS.has(o.result); if(!sourceWins&&VALID_RESULTS.has(incoming)){o.result=incoming;o.status=incoming;} else if(!sourceWins&&['PENDING','UNVERIFIED'].includes(incoming)){o.status=incoming;}
      o.gamePk=g.gamePk||o.gamePk; o.selectedTeam=g.selectedTeam||o.selectedTeam; o.opponent=g.opponent||o.opponent; o.gradeReason=g.gradeReason||o.gradeReason; o.metadataStatus=g.gamePk?'RESOLVED':(g.metadataStatus||o.metadataStatus); o.environment=g.environment||o.environment; o.updatedAt=new Date().toISOString(); applied++; });
    rebuildViews(); save(); publish(); return {applied,total:state.observations.length};
  }
  function publish(){
    window.SportsEdgeCanonicalF5Bets=state.f5Bets; window.SportsEdgeCanonicalOfficialHistory=state.officialHistory;
    window.SportsEdgeCore=Object.freeze({version:'10.0.0',picks:state.observations,uiPicks:state.displayPicks,preserved:state.observations,audit:audit(),getById:id=>state.byId.get(id)||null});
    window.dispatchEvent(new CustomEvent('sportsedge:database-updated',{detail:audit()}));
  }
  function audit(){ const counts={}; state.observations.forEach(o=>{const k=o.result||o.status;counts[k]=(counts[k]||0)+1;}); return {sourceRows:state.observations.length,displayPicks:state.displayPicks.length,graded:state.observations.filter(o=>VALID_RESULTS.has(o.result)).length,needsGrade:state.observations.filter(o=>!VALID_RESULTS.has(o.result)).length,metadataResolved:state.observations.filter(o=>o.gamePk).length,f5Graded:state.f5Bets.length,statusCounts:counts,unknownMarkets:state.observations.filter(o=>o.market==='UNKNOWN').length,missingOpponent:state.observations.filter(o=>!o.opponent).length}; }
  function payload(options={}){ return state.observations.filter(o=>(!options.from||o.date>=options.from)&&(!options.to||o.date<=options.to)).map(o=>({id:o.sourceId,sourceId:o.sourceId,date:o.date,rawPick:o.rawPick,selectedTeam:o.selectedTeam,opponent:o.opponent,market:o.market,period:o.period,line:o.line,odds:o.odds,units:o.units,status:o.status,result:o.result,authoritativeResult:o.authoritativeResult,gamePk:o.gamePk,source:o.source,sourceArray:o.sourceArray,sourceIndex:o.sourceIndex})); }

  const state={observations:mergeStored(sourceRows().map(observation)),byId:new Map(),displayPicks:[],f5Bets:[],officialHistory:[]}; rebuildViews();
  window.SportsEdgeDatabase=Object.freeze({version:'10.0.0',get observations(){return state.observations;},get displayPicks(){return state.displayPicks;},get f5Bets(){return state.f5Bets;},get officialHistory(){return state.officialHistory;},payload,applyGrades,audit,save,get:id=>state.byId.get(id)||null});
  publish();
  console.info('[Sports Edge Database] V10 initialized',audit());
})();
