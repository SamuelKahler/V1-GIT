(function(){
  'use strict';

  const DB_KEY='sports-edge-canonical-db-v11';
  const VALID_RESULTS=new Set(['WIN','LOSS','PUSH','VOID']);
  const ALL_STATUSES=new Set(['PENDING','LIVE','WIN','LOSS','PUSH','VOID','UNVERIFIED','DISREGARD']);
  const TEAM_ALIASES={
    ARI:'ARI',ARIZONA:'ARI','ARIZONA DIAMONDBACKS':'ARI',DIAMONDBACKS:'ARI',ATL:'ATL',ATLANTA:'ATL','ATLANTA BRAVES':'ATL',BRAVES:'ATL',BAL:'BAL',BALTIMORE:'BAL','BALTIMORE ORIOLES':'BAL',ORIOLES:'BAL',
    BOS:'BOS',BOSTON:'BOS','BOSTON RED SOX':'BOS','RED SOX':'BOS',CHC:'CHC',CHIC:'CHC',CHICAGO:'CHC','CHICAGO CUBS':'CHC',CUBS:'CHC',CWS:'CWS','CHICAGO WHITE SOX':'CWS','WHITE SOX':'CWS',
    CIN:'CIN',CINCINNATI:'CIN','CINCINNATI REDS':'CIN',REDS:'CIN',CLE:'CLE',CLEVELAND:'CLE','CLEVELAND GUARDIANS':'CLE',GUARDIANS:'CLE',COL:'COL',COLORADO:'COL','COLORADO ROCKIES':'COL',ROCKIES:'COL',
    DET:'DET',DETROIT:'DET','DETROIT TIGERS':'DET',TIGERS:'DET',HOU:'HOU',HOUSTON:'HOU','HOUSTON ASTROS':'HOU',ASTROS:'HOU',KC:'KC',KCR:'KC','KANSAS CITY':'KC','KANSAS CITY ROYALS':'KC',ROYALS:'KC',
    LAA:'LAA','LOS ANGELES ANGELS':'LAA',ANGELS:'LAA',LAD:'LAD','LOS ANGELES DODGERS':'LAD',DODGERS:'LAD',MIA:'MIA',MIAMI:'MIA','MIAMI MARLINS':'MIA',MARLINS:'MIA',MIL:'MIL',MILWAUKEE:'MIL','MILWAUKEE BREWERS':'MIL',BREWERS:'MIL',
    MIN:'MIN',MINNESOTA:'MIN','MINNESOTA TWINS':'MIN',TWINS:'MIN',NYM:'NYM','NEW YORK METS':'NYM',METS:'NYM',NYY:'NYY','NEW YORK YANKEES':'NYY',YANKEES:'NYY',ATH:'ATH',OAK:'ATH',OAKLAND:'ATH','OAKLAND ATHLETICS':'ATH',ATHLETICS:'ATH',"A'S":'ATH',
    PHI:'PHI',PHILADELPHIA:'PHI','PHILADELPHIA PHILLIES':'PHI',PHILLIES:'PHI',PIT:'PIT',PITTSBURGH:'PIT','PITTSBURGH PIRATES':'PIT',PIRATES:'PIT',SD:'SD',SDP:'SD','SAN DIEGO':'SD','SAN DIEGO PADRES':'SD',PADRES:'SD',
    SEA:'SEA',SEATTLE:'SEA','SEATTLE MARINERS':'SEA',MARINERS:'SEA',SF:'SF',SFG:'SF','SAN FRANCISCO':'SF','SAN FRANCISCO GIANTS':'SF',GIANTS:'SF',STL:'STL','ST LOUIS':'STL','ST. LOUIS':'STL','ST LOUIS CARDINALS':'STL',CARDINALS:'STL',
    TB:'TB',TBR:'TB','TAMPA BAY':'TB','TAMPA BAY RAYS':'TB',RAYS:'TB',TEX:'TEX',TEXAS:'TEX','TEXAS RANGERS':'TEX',RANGERS:'TEX',TOR:'TOR',TORONTO:'TOR','TORONTO BLUE JAYS':'TOR','BLUE JAYS':'TOR',
    WSH:'WSH',WAS:'WSH',WASHINGTON:'WSH','WASHINGTON NATIONALS':'WSH',NATIONALS:'WSH'
  };

  const text=value=>String(value==null?'':value).replace(/[\uFFFD]/g,'').replace(/\s+/g,' ').trim();
  const upper=value=>text(value).toUpperCase().replace(/[’]/g,"'");
  const finite=value=>{if(value===null||value===undefined||value==='')return null;const number=Number(String(value).replace(/[^0-9.+-]/g,''));return Number.isFinite(number)?number:null;};
  const hash=value=>{let h=2166136261;for(const char of String(value)){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(36).toUpperCase();};
  const todayIso=()=>new Date().toISOString().slice(0,10);
  function explicitUnits(row,rawPick){
    const direct=row?.units??row?.unit??row?.stake;
    if(direct!==null&&direct!==undefined&&String(direct).trim()!=='')return true;
    return /(?:^|[,;\s])(\d+(?:\.\d+)?|\.\d+)\s*U\b/i.test(String(rawPick||''));
  }

  function isoDate(value){
    const raw=text(value);if(!raw)return null;
    let match=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);if(match)return`${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
    match=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);if(match){const year=match[3].length===2?`20${match[3]}`:match[3];return`${year}-${match[1].padStart(2,'0')}-${match[2].padStart(2,'0')}`;}
    const parsed=new Date(raw);return Number.isFinite(parsed.getTime())?`${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}`:null;
  }
  function normalizeTeam(value){
    const raw=upper(value).replace(/\./g,'').trim();if(!raw)return null;if(TEAM_ALIASES[raw])return TEAM_ALIASES[raw];
    for(const key of Object.keys(TEAM_ALIASES).sort((a,b)=>b.length-a.length)){const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(new RegExp(`(^|[^A-Z])${escaped}([^A-Z]|$)`).test(raw))return TEAM_ALIASES[key];}
    return null;
  }
  function teamsIn(value){
    const raw=upper(value).replace(/\./g,' ');const matches=[];
    for(const key of Object.keys(TEAM_ALIASES)){const escaped=key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const match=new RegExp(`(^|[^A-Z])${escaped}([^A-Z]|$)`).exec(raw);if(match)matches.push({team:TEAM_ALIASES[key],index:match.index+(match[1]?match[1].length:0),length:key.length});}
    matches.sort((a,b)=>a.index-b.index||b.length-a.length);const seen=new Set();return matches.filter(item=>!seen.has(item.team)&&seen.add(item.team)).map(item=>item.team);
  }
  function normalizeStatus(value,row,date){
    const raw=upper(value);const map={W:'WIN',WON:'WIN',SUCCESS:'WIN',L:'LOSS',LOST:'LOSS',TIE:'PUSH',CANCELLED:'VOID',CANCELED:'VOID',DISREGARD:'VOID',IGNORE:'VOID',NO_ACTION:'VOID',OPEN:'PENDING'};
    let status=map[raw]||raw;
    if(!status&&typeof row?.result==='number')status=row.result>0?'WIN':row.result<0?'LOSS':'PUSH';
    if(!ALL_STATUSES.has(status))status='PENDING';
    if(date&&date<todayIso()&&['LIVE','PENDING'].includes(status))return status;
    return status;
  }
  function parseMarket(rawPick,type){
    const source=upper(`${type||''} ${rawPick||''}`).replace(/[_*]/g,' ');
    if(/SERIES/.test(source))return'SERIES';if(/PARLAY/.test(source))return'PARLAY';if(/NRFI|NO RUN FIRST/.test(source))return'NRFI';if(/GRAND SALAMI/.test(source))return'GRAND_SALAMI';
    if(/STRIKEOUT|\bK'?S\b|PROP|HITS|RBI|HOME RUN|TO SCORE/.test(source))return'PLAYER_PROP';if(/\bML\b|MONEYLINE/.test(source))return'MONEYLINE';if(/\b(?:O|OVER|U|UNDER)\s*\d|TOTAL|\bTOT\b/.test(source))return'TOTAL';
    if(/RUN LINE|SPREAD|\bRL\b|(?:^|\s)[+-]\s*\d+(?:\.5)?/.test(source))return'SPREAD';return'UNKNOWN';
  }
  function parsePeriod(rawPick,type,market){const source=upper(`${type||''} ${rawPick||''}`);if(market==='SERIES')return'SERIES';if(/\bF5\b|FIRST\s*5|FIRST\s*FIVE/.test(source))return'FIRST_FIVE';if(market==='PLAYER_PROP')return'PLAYER_GAME';return'FULL_GAME';}
  function parseLine(rawPick,row){const direct=finite(row?.line);if(direct!==null)return direct;const source=upper(rawPick).replace(/[_*]/g,' ');let match=source.match(/\b(?:O|OVER|U|UNDER)\s*(\d+(?:\.5)?)/);if(match)return Number(match[1]);match=source.match(/(?:^|\s)([+-]\d+(?:\.5)?)(?:\s|$)/);return match?Number(match[1]):null;}
  function parseOdds(rawPick,row){const direct=finite(row?.odds);if(direct!==null&&Math.abs(direct)>=100)return direct;const matches=[...`${text(row?.odds)} ${text(rawPick)}`.matchAll(/(?:^|\s)([+-]\d{3,4})(?=\s|$|[,;])/g)].map(match=>Number(match[1]));return matches.length?matches[matches.length-1]:null;}
  function sourceRows(){const rows=[];const add=(source,arrayName,data)=>{if(Array.isArray(data))data.forEach((row,index)=>rows.push({source,arrayName,index,row}));};try{add('MLB_DATA','trackedPickResults',typeof trackedPickResults!=='undefined'?trackedPickResults:window.trackedPickResults);}catch{}try{add('OFFICIAL_HISTORY','officialBetHistory',typeof officialBetHistory!=='undefined'?officialBetHistory:window.officialBetHistory);}catch{}try{add('F5_HISTORY','f5PerformanceBets',typeof f5PerformanceBets!=='undefined'?f5PerformanceBets:window.f5PerformanceBets);}catch{}try{add('SERIES_BOARD','seriesBoardPicks',typeof seriesBoardPicks!=='undefined'?seriesBoardPicks:window.seriesBoardPicks);}catch{}try{add('DAILY_IMPORT','dailyImportPicks',typeof dailyImportPicks!=='undefined'?dailyImportPicks:(window.dailyImportPicks||window.DAILY_IMPORT_PICKS));}catch{}return rows;}
  function observation(source){
    const row=source.row||{};const rawPick=text(row.pick||row.bet||row.selection||row.edge||row.description);const date=isoDate(row.date||row.slate||row.gameDate);const found=teamsIn(rawPick);const explicitTeam=normalizeTeam(row.team||row.selectedTeam);const selectedTeam=explicitTeam||found[0]||null;const opponent=normalizeTeam(row.opponent||row.opp||row.matchup)||found.find(team=>team!==selectedTeam)||null;
    const market=parseMarket(rawPick,row.type||row.category);const period=parsePeriod(rawPick,row.type||row.category,market);const status=normalizeStatus(row.status||row.outcome||row.result,row,date);const sourceId=`SRC-${source.arrayName.toUpperCase()}-${String(source.index+1).padStart(6,'0')}`;
    return{id:sourceId,sourceId,canonicalId:`PICK-${hash([date,upper(rawPick),market,period].join('|'))}`,source:source.source,sourceArray:source.arrayName,sourceIndex:source.index,original:row,date,rawDate:text(row.date||row.slate||row.gameDate),rawPick,selectedTeam,opponent,market,period,line:parseLine(rawPick,row),odds:parseOdds(rawPick,row),units:finite(row.units??row.unit??row.stake)??1,hasExplicitUnits:explicitUnits(row,rawPick),status,result:VALID_RESULTS.has(status)?status:null,authoritativeResult:VALID_RESULTS.has(status),profit:finite(row.profit??row.net??(typeof row.result==='number'?row.result:null)),gamePk:row.gamePk||null,metadataStatus:row.gamePk?'RESOLVED':'NOT_RESOLVED',gradeReason:VALID_RESULTS.has(status)?'PRESERVED_EXISTING_GRADE':null,environment:row.environment||null,notes:text(row.notes||row.why||row.comment),updatedAt:null};
  }
  function loadStored(){try{return JSON.parse(localStorage.getItem(DB_KEY)||'null');}catch{return null;}}
  function save(){try{const grades=state.observations.filter(row=>row.updatedAt||row.gamePk||row.result).map(row=>({sourceId:row.sourceId,result:row.result,status:row.status,gamePk:row.gamePk,opponent:row.opponent,selectedTeam:row.selectedTeam,gradeReason:row.gradeReason,metadataStatus:row.metadataStatus,environment:row.environment,updatedAt:row.updatedAt,profit:row.profit}));localStorage.setItem(DB_KEY,JSON.stringify({version:'11.0.0',savedAt:new Date().toISOString(),grades}));return true;}catch(error){console.warn('[Sports Edge Database] Local cache save failed:',error.message);return false;}}
  function mergeStored(observations){const stored=loadStored();if(!stored?.grades)return observations;const map=new Map(stored.grades.map(grade=>[grade.sourceId,grade]));return observations.map(row=>{const grade=map.get(row.sourceId);if(!grade)return row;const preserve=row.authoritativeResult&&VALID_RESULTS.has(row.result);return{...row,...grade,result:preserve?row.result:grade.result,status:preserve?row.status:grade.status,authoritativeResult:row.authoritativeResult};});}
  function evidenceKey(row){const normalizedPick=upper(row.rawPick).replace(/\b[+-]\d{3,4}\b/g,'').replace(/[^A-Z0-9.+-]/g,'');return[row.date,row.period,row.market,row.selectedTeam||'',row.opponent||'',row.line??'',normalizedPick].join('|');}
  function buildEvidenceObservations(){const groups=new Map();state.observations.filter(row=>VALID_RESULTS.has(row.result)).forEach(row=>{const key=evidenceKey(row);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);});return[...groups.values()].map(group=>group.sort((a,b)=>(b.authoritativeResult-a.authoritativeResult)||(Boolean(b.gamePk)-Boolean(a.gamePk)))[0]);}
  function displayPick(row){return{...row.original,coreId:row.sourceId,sourceId:row.sourceId,slate:row.original.slate||row.original.date||row.rawDate,pick:row.original.pick||row.original.bet||row.rawPick,status:row.result||row.status,result:row.result,gamePk:row.gamePk,selectedTeam:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,normalizedDate:row.date,environment:row.environment,gradeReason:row.gradeReason,metadataStatus:row.metadataStatus};}
  function rebuildViews(){
    state.byId=new Map(state.observations.map(row=>[row.sourceId,row]));state.displayPicks=state.observations.filter(row=>['MLB_DATA','DAILY_IMPORT'].includes(row.source)).map(displayPick);state.evidenceObservations=buildEvidenceObservations();
    state.f5Bets=state.evidenceObservations.filter(row=>row.period==='FIRST_FIVE').map(row=>({id:`canonical-f5-${row.sourceId}`,pickId:row.sourceId,gamePk:row.gamePk,team:row.selectedTeam,teamName:row.selectedTeam,bet:row.rawPick,date:row.date?row.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$2/$3/$1'):row.rawDate,isoDate:row.date,odds:row.odds===null?'-':(row.odds>0?`+${row.odds}`:`${row.odds}`),result:row.profit!==null?row.profit:(row.result==='WIN'?(row.odds>0?row.units*row.odds/100:row.units*100/Math.abs(row.odds||-110)):row.result==='LOSS'?-row.units:0),outcome:row.result.toLowerCase(),units:row.units,hasExplicitUnits:row.hasExplicitUnits,gradeReason:row.gradeReason,resolutionConfidence:row.metadataStatus==='RESOLVED'?100:50,source:'canonical-database'}));
    state.officialHistory=state.evidenceObservations.map(row=>({date:row.date||row.rawDate,type:row.period==='FIRST_FIVE'?'F5':row.market,bet:row.rawPick,team:row.selectedTeam,opponent:row.opponent,result:row.profit!==null?row.profit:(row.result==='WIN'?1:row.result==='LOSS'?-1:0),outcome:row.result,status:row.result,units:row.units,gamePk:row.gamePk,environment:row.environment,pickId:row.sourceId}));
  }
  function applyGrades(rows){if(!Array.isArray(rows))return{applied:0};let applied=0;rows.forEach(grade=>{const row=state.byId.get(grade.pickId||grade.sourceId);if(!row)return;const incoming=upper(grade.result);const preserve=row.authoritativeResult&&VALID_RESULTS.has(row.result);if(!preserve&&VALID_RESULTS.has(incoming)){row.result=incoming;row.status=incoming;}else if(!preserve&&['PENDING','UNVERIFIED'].includes(incoming)){row.result=null;row.status=incoming;}row.gamePk=grade.gamePk||row.gamePk;row.selectedTeam=grade.selectedTeam||row.selectedTeam;row.opponent=grade.opponent||row.opponent;row.gradeReason=grade.gradeReason||row.gradeReason;row.metadataStatus=grade.gamePk?'RESOLVED':(grade.metadataStatus||row.metadataStatus);row.environment=grade.environment||row.environment;row.updatedAt=new Date().toISOString();applied++;});rebuildViews();const cacheSaved=save();publish();return{applied,total:state.observations.length,cacheSaved};}
  function publish(){window.SportsEdgeCanonicalF5Bets=state.f5Bets;window.SportsEdgeCanonicalOfficialHistory=state.officialHistory;window.SportsEdgeCore=Object.freeze({version:'11.0.0',picks:state.observations,uiPicks:state.displayPicks,preserved:state.observations,evidenceObservations:state.evidenceObservations,audit:audit(),getById:id=>state.byId.get(id)||null});window.dispatchEvent(new CustomEvent('sportsedge:database-updated',{detail:audit()}));}
  function audit(){const counts={};const reasons={};state.observations.forEach(row=>{const status=row.result||row.status;counts[status]=(counts[status]||0)+1;if(!VALID_RESULTS.has(row.result)){const reason=row.gradeReason||row.metadataStatus||'NEEDS_SYNC';reasons[reason]=(reasons[reason]||0)+1;}});return{sourceRows:state.observations.length,displayPicks:state.displayPicks.length,graded:state.observations.filter(row=>VALID_RESULTS.has(row.result)).length,evidenceSamples:state.evidenceObservations.length,duplicateGradeRows:state.observations.filter(row=>VALID_RESULTS.has(row.result)).length-state.evidenceObservations.length,needsGrade:state.observations.filter(row=>!VALID_RESULTS.has(row.result)).length,metadataResolved:state.observations.filter(row=>row.gamePk).length,f5Graded:state.f5Bets.length,statusCounts:counts,unresolvedReasons:reasons,unknownMarkets:state.observations.filter(row=>row.market==='UNKNOWN').length,missingOpponent:state.observations.filter(row=>!row.opponent).length};}
  function payload(options={}){return state.observations.filter(row=>(!options.from||row.date>=options.from)&&(!options.to||row.date<=options.to)).map(row=>({id:row.sourceId,sourceId:row.sourceId,date:row.date,rawPick:row.rawPick,selectedTeam:row.selectedTeam,opponent:row.opponent,market:row.market,period:row.period,line:row.line,odds:row.odds,units:row.units,hasExplicitUnits:row.hasExplicitUnits,status:row.status,result:row.result,authoritativeResult:row.authoritativeResult,gamePk:row.gamePk,source:row.source,sourceArray:row.sourceArray,sourceIndex:row.sourceIndex,notes:row.notes}));}

  const state={observations:mergeStored(sourceRows().map(observation)),byId:new Map(),displayPicks:[],evidenceObservations:[],f5Bets:[],officialHistory:[]};rebuildViews();
  window.SportsEdgeDatabase=Object.freeze({version:'11.0.0',get observations(){return state.observations;},get displayPicks(){return state.displayPicks;},get evidenceObservations(){return state.evidenceObservations;},get f5Bets(){return state.f5Bets;},get officialHistory(){return state.officialHistory;},payload,applyGrades,audit,save,get:id=>state.byId.get(id)||null});publish();console.info('[Sports Edge Database] V11 initialized',audit());
})();
