import { callRpc, requestSupabase } from './supabase.js';

export const PROMPT_RUNTIME_VERSION = 'F5_PROMPT_RUNTIME_V1_1';
export const DEFAULT_PROMPT_WEIGHTS = Object.freeze({
  sp_edge: 30,
  opponent_run_suppression: 15,
  f5_splits: 12,
  park_weather: 10,
  lineup_strength_certainty: 13,
  travel_rest: 5,
  market_inefficiency: 10,
  home_plate_umpire: 5
});
export const PROMPT_FACTOR_ORDER = Object.freeze(Object.keys(DEFAULT_PROMPT_WEIGHTS));
export const PROMPT_FACTOR_LABELS = Object.freeze({
  sp_edge: 'SP Edge',
  opponent_run_suppression: 'Opponent Run Suppression',
  f5_splits: 'F5 Splits',
  park_weather: 'Park & Weather',
  lineup_strength_certainty: 'Lineup Strength & Certainty',
  travel_rest: 'Travel & Rest',
  market_inefficiency: 'Market Inefficiency',
  home_plate_umpire: 'Home Plate Umpire'
});

const TEAM_ALIASES = Object.freeze({
  ARI:'ARI',ARIZONA:'ARI','ARIZONA DIAMONDBACKS':'ARI',ATL:'ATL',ATLANTA:'ATL','ATLANTA BRAVES':'ATL',BAL:'BAL',BALTIMORE:'BAL','BALTIMORE ORIOLES':'BAL',BOS:'BOS',BOSTON:'BOS','BOSTON RED SOX':'BOS',CHC:'CHC','CHICAGO CUBS':'CHC',CWS:'CWS','CHICAGO WHITE SOX':'CWS',CIN:'CIN',CINCINNATI:'CIN','CINCINNATI REDS':'CIN',CLE:'CLE',CLEVELAND:'CLE','CLEVELAND GUARDIANS':'CLE',COL:'COL',COLORADO:'COL','COLORADO ROCKIES':'COL',DET:'DET',DETROIT:'DET','DETROIT TIGERS':'DET',HOU:'HOU',HOUSTON:'HOU','HOUSTON ASTROS':'HOU',KC:'KC',KCR:'KC','KANSAS CITY':'KC','KANSAS CITY ROYALS':'KC',LAA:'LAA','LOS ANGELES ANGELS':'LAA',LAD:'LAD','LOS ANGELES DODGERS':'LAD',MIA:'MIA',MIAMI:'MIA','MIAMI MARLINS':'MIA',MIL:'MIL',MILWAUKEE:'MIL','MILWAUKEE BREWERS':'MIL',MIN:'MIN',MINNESOTA:'MIN','MINNESOTA TWINS':'MIN',NYM:'NYM','NEW YORK METS':'NYM',NYY:'NYY','NEW YORK YANKEES':'NYY',ATH:'ATH',OAK:'ATH',"A'S":'ATH',"A’S":'ATH',ATHLETICS:'ATH',PHI:'PHI',PHILADELPHIA:'PHI','PHILADELPHIA PHILLIES':'PHI',PIT:'PIT',PITTSBURGH:'PIT','PITTSBURGH PIRATES':'PIT',SD:'SD',SDP:'SD','SAN DIEGO PADRES':'SD',SEA:'SEA',SEATTLE:'SEA','SEATTLE MARINERS':'SEA',SF:'SF',SFG:'SF','SAN FRANCISCO GIANTS':'SF',STL:'STL','ST LOUIS':'STL','ST. LOUIS':'STL','ST. LOUIS CARDINALS':'STL',TB:'TB',TBR:'TB','TAMPA BAY':'TB','TAMPA BAY RAYS':'TB',TEX:'TEX',TEXAS:'TEX','TEXAS RANGERS':'TEX',TOR:'TOR',TORONTO:'TOR','TORONTO BLUE JAYS':'TOR',WSH:'WSH',WAS:'WSH',WASHINGTON:'WSH','WASHINGTON NATIONALS':'WSH'
});

function clean(value){ return String(value ?? '').trim(); }
function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }
function finite(value){ const n=Number(value); return Number.isFinite(n)?n:null; }
function normalizeTeam(value){ const key=clean(value).toUpperCase().replace(/\./g,'').replace(/\s+/g,' '); return TEAM_ALIASES[key] || (key.length<=3?key:null); }
function stripBullet(line){ return clean(line).replace(/^[*•\-]\s*/,'').trim(); }
function isoDateFromLine(line){
  const raw=stripBullet(line);
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const m=raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if(!m) return null;
  const year=m[3]?Number(m[3].length===2?`20${m[3]}`:m[3]):new Date().getUTCFullYear();
  return `${year}-${String(Number(m[1])).padStart(2,'0')}-${String(Number(m[2])).padStart(2,'0')}`;
}
function parseMatchup(line){
  const raw=stripBullet(line).replace(/\s+/g,' ');
  const m=raw.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
  if(!m) return null;
  const away=normalizeTeam(m[1]), home=normalizeTeam(m[2]);
  return away&&home?{away,home,raw}:null;
}
function parseSideLine(line, away, home){
  const raw=stripBullet(line).replace(/−/g,'-');
  const m=raw.match(/^(.+?)\s+([+-]?(?:0?\.5|1(?:\.0)?|1\.5|2(?:\.0)?))\s+([+-]\d{2,4})\s*$/i);
  if(!m) return null;
  const team=normalizeTeam(m[1]);
  if(team!==away&&team!==home) return null;
  return {team,line:Number(m[2]),odds:Number(m[3]),raw};
}
function parseCompactGame(line){
  const parts=stripBullet(line).split('|').map(x=>x.trim());
  if(parts.length<7) return null;
  const matchup=parseMatchup(parts[0]); if(!matchup) return null;
  const sides=parts.slice(5).map(x=>parseSideLine(x,matchup.away,matchup.home)).filter(Boolean);
  return {away:matchup.away,home:matchup.home,venue:parts[1]||null,firstPitch:parts[2]||null,awayStarter:parts[3]||null,homeStarter:parts[4]||null,sides};
}

export function parseAuthoritativeF5Slate(text,{defaultDate}={}){
  const lines=String(text||'').split(/\r?\n/).map(stripBullet).filter(Boolean);
  let date=defaultDate||null;
  const games=[];
  for(let i=0;i<lines.length;){
    const maybeDate=isoDateFromLine(lines[i]); if(maybeDate){date=maybeDate;i+=1;continue;}
    const compact=parseCompactGame(lines[i]);
    if(compact){games.push({...compact,date});i+=1;continue;}
    const matchup=parseMatchup(lines[i]);
    if(!matchup){i+=1;continue;}
    const venue=lines[i+1]||null, firstPitch=lines[i+2]||null, awayStarter=lines[i+3]||null, homeStarter=lines[i+4]||null;
    const sides=[]; let j=i+5;
    while(j<lines.length && !parseMatchup(lines[j]) && !isoDateFromLine(lines[j])){
      const side=parseSideLine(lines[j],matchup.away,matchup.home); if(side) sides.push(side); j+=1;
    }
    games.push({date,away:matchup.away,home:matchup.home,venue,firstPitch,awayStarter,homeStarter,sides});
    i=j;
  }
  const cleaned=games.map((game,index)=>({...game,id:`${game.date||date||'slate'}-${game.away}-${game.home}-${index+1}`}));
  return {date:date||cleaned[0]?.date||null,games:cleaned};
}

export function normalizePromptWeights(input={}){
  const weights={};
  for(const key of PROMPT_FACTOR_ORDER){
    const n=Number(input[key]===undefined?DEFAULT_PROMPT_WEIGHTS[key]:input[key]);
    if(!Number.isFinite(n)||n<0||n>100){const e=new Error(`Invalid weight for ${key}.`);e.statusCode=400;throw e;}
    weights[key]=Math.round(n*10)/10;
  }
  const total=Object.values(weights).reduce((a,b)=>a+b,0);
  if(Math.abs(total-100)>0.01){const e=new Error(`Model weights must total 100%. Current total: ${total.toFixed(1)}%.`);e.statusCode=400;throw e;}
  return weights;
}

export function americanImplied(odds){
  const n=finite(odds); if(n===null||n===0) return null;
  return n>0?100/(n+100)*100:Math.abs(n)/(Math.abs(n)+100)*100;
}
function quarterKellyUnits(probabilityPct,odds){
  const p=finite(probabilityPct)/100, o=finite(odds); if(!Number.isFinite(p)||o===null||p<=0||p>=1) return 0;
  const b=o>0?o/100:100/Math.abs(o), q=1-p;
  const full=(b*p-q)/b; if(!Number.isFinite(full)||full<=0) return 0;
  return Math.round(clamp(full*0.25*100,0,1)*100)/100;
}
function selectedSide(game,team){ return (game.sides||[]).find(side=>side.team===team)||null; }
function gameKey(game){ return `${game.away}@${game.home}`; }
function getAiGame(aiGames,game){ return (aiGames||[]).find(row=>clean(row.game_key).toUpperCase()===gameKey(game).toUpperCase() || (normalizeTeam(row.away_team)===game.away&&normalizeTeam(row.home_team)===game.home)); }
function normalizedScores(raw={}){
  const out={}; for(const key of PROMPT_FACTOR_ORDER) out[key]=clamp(Number(raw[key]??5),0,10); return out;
}
function calculateFms(scores,weights){ return PROMPT_FACTOR_ORDER.reduce((sum,key)=>sum+(scores[key]*weights[key]/100),0); }
function priceLabel(odds){ return odds==null?'—':`${odds>0?'+':''}${odds}`; }

function coreGateState({fms, edge, side}){
  const favorite=Number(side?.odds)<0;
  const scorePass=Number.isFinite(Number(fms)) && Number(fms)>=6.75;
  const pricePass=!favorite || Number(side.odds)>=-135;
  const edgePass=Number.isFinite(Number(edge)) && Number(edge)>=7.5;
  const failed=[];
  if(!scorePass) failed.push({key:'MODEL_SCORE',label:'Model score',required:'6.75+',actual:Number.isFinite(Number(fms))?Number(fms).toFixed(2):'—',shortfall:Number.isFinite(Number(fms))?Math.round((6.75-Number(fms))*100)/100:null});
  if(!pricePass) failed.push({key:'PRICE',label:'Preferred price',required:'-135 or better',actual:priceLabel(side?.odds),shortfall:Number.isFinite(Number(side?.odds))?Math.abs(Number(side.odds)+135):null});
  if(!edgePass) failed.push({key:'EDGE',label:'Expected edge',required:'+7.5 pp',actual:Number.isFinite(Number(edge))?`${Number(edge).toFixed(1)} pp`:'—',shortfall:Number.isFinite(Number(edge))?Math.round((7.5-Number(edge))*10)/10:null});
  return {scorePass,pricePass,edgePass,failed};
}
function evidenceFromSnapshot(snapshot){
  const factors=snapshot?.factors||{};
  const keys=['starter_history','team_f5_split','recent_f5_form','matchup_history','situation_match','rest_location','opponent_early_offense'];
  return keys.map(key=>factors[key]).filter(Boolean).map(item=>({
    key:item.key,label:item.label,available:Boolean(item.available),score:finite(item.score),sample:Number(item.sample)||0,wins:item.wins==null?null:Number(item.wins),losses:item.losses==null?null:Number(item.losses),pushes:item.pushes==null?null:Number(item.pushes),rawRate:item.rawRate==null?null:Number(item.rawRate),extra:item.extra||null
  })).filter(item=>item.available||item.sample>0);
}
function attachVerifiedEvidence(row,history){
  if(!row?.selectedTeam) return {...row,verifiedEvidence:[]};
  const gameHistory=history?.[gameKey(row)]||{};
  const selected=gameHistory[row.selectedTeam]||null;
  return {...row,verifiedEvidence:evidenceFromSnapshot(selected),verifiedSnapshot:selected||null};
}
function nearMissStrength(row){
  if(!row) return -999;
  const failures=Array.isArray(row.failedGates)?row.failedGates.length:9;
  const fms=Number(row.finalModelScore)||0, edge=Number(row.edge)||-50;
  return (3-failures)*100 + fms*5 + edge;
}
function buildSlateDiagnosis(games,topPlays,nearMisses,passFades){
  const positive=games.filter(g=>Number(g.edge)>0).length;
  const hardDq=games.filter(g=>['AUTO_DQ','NO_PLAY'].includes(g.decision)).length;
  const closest=nearMisses[0]||null;
  const avgScores={};
  for(const key of PROMPT_FACTOR_ORDER){
    const vals=games.map(g=>Number(g.categoryScores?.[key])).filter(Number.isFinite);
    avgScores[key]=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
  }
  const rankedFactors=Object.entries(avgScores).filter(([,v])=>v!=null).sort((a,b)=>b[1]-a[1]);
  return {
    headline:topPlays.length?`${topPlays.length} play${topPlays.length===1?'':'s'} cleared every model gate.`:'No play cleared every model gate today.',
    summary:topPlays.length
      ? `${nearMisses.length} near miss${nearMisses.length===1?'':'es'} remain for comparison, with ${positive} game${positive===1?'':'s'} showing positive estimated edge.`
      : `${nearMisses.length} near miss${nearMisses.length===1?'':'es'} • ${positive} positive-edge profile${positive===1?'':'s'} • ${passFades.length} pass/fade result${passFades.length===1?'':'s'}.`,
    positiveEdgeProfiles:positive,hardDisqualifications:hardDq,
    closestQualifier:closest?{id:closest.id,pick:closest.selectedTeam?`F5 ${closest.selectedTeam} ${closest.selectedLine>0?'+':''}${closest.selectedLine}`:gameKey(closest),edge:closest.edge,finalModelScore:closest.finalModelScore,failedGates:closest.failedGates}:null,
    strongestFactor:rankedFactors[0]?{key:rankedFactors[0][0],label:PROMPT_FACTOR_LABELS[rankedFactors[0][0]],average:Math.round(rankedFactors[0][1]*10)/10}:null,
    weakestFactor:rankedFactors.at(-1)?{key:rankedFactors.at(-1)[0],label:PROMPT_FACTOR_LABELS[rankedFactors.at(-1)[0]],average:Math.round(rankedFactors.at(-1)[1]*10)/10}:null
  };
}

export function enforcePromptRules({slate,aiPayload,weights,history={}}){
  const games=[];
  for(const game of slate.games){
    const ai=getAiGame(aiPayload?.games,game)||{};
    const selectedRaw=normalizeTeam(ai.selected_team);
    const candidateRaw=normalizeTeam(ai.candidate_team);
    const aiNoPlay=clean(ai.selected_team).toUpperCase()==='NO_PLAY' || Boolean(ai.no_play);
    const choice=(selectedRaw===game.away||selectedRaw===game.home)?selectedRaw:((candidateRaw===game.away||candidateRaw===game.home)?candidateRaw:null);
    if(!choice){
      games.push(attachVerifiedEvidence({...game,selectedTeam:null,decision:'NO_PLAY',qualificationReason:clean(ai.no_play_reason)||'No valid side was returned for this game.',categoryScores:normalizedScores(ai.category_scores||{}),finalModelScore:null,projectedF5Pct:null,edge:null,impliedPct:null,price:null,failedGates:[{key:'NO_CANDIDATE',label:'No candidate side',required:'One side for diagnostic scoring',actual:'No Play',shortfall:null}],sources:ai.sources||[],rationales:ai.rationales||{},aiNoPlay:true},history));continue;
    }
    const side=selectedSide(game,choice);
    if(!side){games.push(attachVerifiedEvidence({...game,selectedTeam:choice,decision:'NO_PLAY',qualificationReason:'No authoritative F5 price was supplied for the selected side.',categoryScores:normalizedScores(ai.category_scores||{}),finalModelScore:null,projectedF5Pct:null,edge:null,impliedPct:null,price:null,failedGates:[{key:'NO_PRICE',label:'Authoritative price',required:'Supplied F5 price',actual:'Unavailable',shortfall:null}],sources:ai.sources||[],rationales:ai.rationales||{},aiNoPlay:true},history));continue;}
    let scores=normalizedScores(ai.category_scores||{});
    const volatility=Boolean(ai.sp_volatility_triggered);
    if(volatility) scores={...scores,sp_edge:Math.min(8,scores.sp_edge)};
    const fms=Math.round(calculateFms(scores,weights)*100)/100;
    const bullish=Array.isArray(ai.bullish_indicators)?ai.bullish_indicators.filter(Boolean):[];
    let projected=clamp(Number(ai.projected_f5_pct)||50,1,99);
    if(projected>62&&bullish.length<2) projected=62;
    projected=Math.round(projected*10)/10;
    const implied=Math.round(americanImplied(side.odds)*10)/10;
    const edge=Math.round((projected-implied)*10)/10;
    const favorite=side.odds<0;
    const gateState=coreGateState({fms,edge,side});
    let decision='TOP_PLAY', reason='Cleared all qualification gates.';
    if(Boolean(ai.weather_override)){decision='NO_PLAY';reason=ai.weather_reason||'Weather override triggered.';}
    else if(favorite&&side.odds<-150){decision='AUTO_DQ';reason='Favorite priced worse than -150.';}
    else if(aiNoPlay){decision='NO_PLAY';reason=clean(ai.no_play_reason)||'AI research marked this matchup No Play before final qualification.';}
    else if(!gateState.scorePass){decision='PASSED';reason=`Final Model Score ${fms.toFixed(2)} is below 6.75.`;}
    else if(!gateState.pricePass){decision='PASSED';reason='Favorite is outside the preferred -135-or-better range.';}
    else if(!gateState.edgePass){decision='PASSED';reason=`Projected edge ${edge.toFixed(1)} pp is below 7.5 pp.`;}
    let tier='PASS_FADE';
    if(decision==='TOP_PLAY') tier='TOP_PLAY';
    else if(!['AUTO_DQ'].includes(decision) && !Boolean(ai.weather_override) && gateState.failed.length===1) tier='NEAR_MISS';
    const row={
      ...game,selectedTeam:choice,selectedLine:side.line,price:side.odds,priceLabel:priceLabel(side.odds),decision,tier,qualificationReason:reason,
      categoryScores:scores,finalModelScore:fms,projectedF5Pct:projected,impliedPct:implied,edge,failedGates:gateState.failed,coreGates:gateState,
      suggestedUnits:decision==='TOP_PLAY'?quarterKellyUnits(projected,side.odds):0,
      weatherOverride:Boolean(ai.weather_override),weatherReason:ai.weather_reason||null,spVolatilityTriggered:volatility,volatilityReason:ai.volatility_reason||null,
      bullishIndicators:bullish,lineupCertainty:clean(ai.lineup_certainty)||null,lineupRisk:clean(ai.material_lineup_risk)||null,rationales:ai.rationales||{},sources:Array.isArray(ai.sources)?ai.sources:[],aiNoPlay
    };
    games.push(attachVerifiedEvidence(row,history));
  }
  const topPlays=games.filter(g=>g.tier==='TOP_PLAY').sort((a,b)=>b.edge-a.edge||b.finalModelScore-a.finalModelScore);
  const nearMisses=games.filter(g=>g.tier==='NEAR_MISS').sort((a,b)=>nearMissStrength(b)-nearMissStrength(a));
  const passFades=games.filter(g=>g.tier==='PASS_FADE').sort((a,b)=>(Number(b.edge)||-99)-(Number(a.edge)||-99));
  const passed=[...nearMisses,...passFades];
  return {games,topPlays,nearMisses,passFades,passed,slateDiagnosis:buildSlateDiagnosis(games,topPlays,nearMisses,passFades)};
}

async function latestPublishedSlate(date){
  const filter=date?`&slate_date=eq.${encodeURIComponent(date)}`:'';
  const rows=await requestSupabase(`/rest/v1/sports_edge_f5_slates?select=slate_date,raw_text,games,published_at&order=slate_date.desc,published_at.desc&limit=1${filter}`);
  const row=Array.isArray(rows)?rows[0]:null;
  if(!row){const e=new Error(date?`No F5 model slate is published for ${date}.`:'No F5 model slate has been published yet.');e.statusCode=404;throw e;}
  return {date:row.slate_date,rawText:row.raw_text,games:Array.isArray(row.games)?row.games:[],publishedAt:row.published_at};
}

async function verifiedHistoryBundle(slate){
  const bundle={};
  for(const game of slate.games){
    const rows={};
    for(const side of game.sides||[]){
      try{rows[side.team]=await callRpc('sports_edge_f5_factor_snapshot',{p_pick_date:slate.date,p_team_abbreviation:side.team,p_line:side.line});}
      catch(error){rows[side.team]={error:error.message};}
    }
    bundle[gameKey(game)]=rows;
  }
  return bundle;
}

function extractOutputText(payload){
  const parts=[]; for(const item of Array.isArray(payload?.output)?payload.output:[]){for(const content of Array.isArray(item?.content)?item.content:[]){if(content?.type==='output_text'&&typeof content.text==='string')parts.push(content.text);}}
  return parts.join('\n').trim();
}
function parseJsonText(text){
  const cleaned=String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  try{return JSON.parse(cleaned);}catch{}
  const first=cleaned.indexOf('{'),last=cleaned.lastIndexOf('}'); if(first>=0&&last>first)return JSON.parse(cleaned.slice(first,last+1));
  throw new Error('AI model did not return valid JSON.');
}

function canonicalSystemPrompt(weights){
  return `You are the Sports Edge MLB First 5 Innings run-line +EV research model. Scope is MLB F5 run lines only. Score exactly one side or No Play per game. The customer can change only category weights; all hard rules remain fixed.\n\nCATEGORY WEIGHTS: ${JSON.stringify(weights)}\nCategories are 0.0-10.0: sp_edge, opponent_run_suppression, f5_splits, park_weather, lineup_strength_certainty, travel_rest, market_inefficiency, home_plate_umpire.\n\nHARD RULES: exactly one side or No Play per game; favorite worse than -150 is auto-disqualified; preferred favorite price is even through -135; projected F5 probability ceiling is 62% unless supported by at least two independent bullish indicators; market data must never raise baseball-only projected probability. SP Edge must be flagged for volatility if pitch restriction, fewer than 5 MLB starts, walk rate >12%, command collapse BB/9 >5 over last 3, or return from injury within 14 days. Weather override is true if rain probability >=70% at first pitch, severe thunderstorm during F5 window, or >=20 mph materially distorting wind.\n\nResearch all current inputs you can verify. User-supplied slate and prices are authoritative. Never replace supplied odds. Never invent a missing fact. If a category cannot be verified, score it 5.0 and explicitly say data was unavailable in its rationale. Market inefficiency may reflect price/value context but must not increase projected baseball probability.\n\nEvery game must still receive category scores and a candidate_team even when selected_team is NO_PLAY so the customer receives a complete slate diagnosis. Return JSON only with shape {"games":[{"game_key":"BAL@TB","away_team":"BAL","home_team":"TB","selected_team":"TB" or "NO_PLAY","candidate_team":"TB","no_play":boolean,"no_play_reason":"","category_scores":{"sp_edge":0-10,"opponent_run_suppression":0-10,"f5_splits":0-10,"park_weather":0-10,"lineup_strength_certainty":0-10,"travel_rest":0-10,"market_inefficiency":0-10,"home_plate_umpire":0-10},"projected_f5_pct":number,"weather_override":boolean,"weather_reason":"","sp_volatility_triggered":boolean,"volatility_reason":"","bullish_indicators":["..."],"lineup_certainty":"A|B|C|UNKNOWN","material_lineup_risk":"","rationales":{"sp_edge":"1-2 lines","opponent_run_suppression":"1-2 lines","f5_splits":"1-2 lines","park_weather":"1-2 lines","lineup_strength_certainty":"1-2 lines","travel_rest":"1-2 lines","market_inefficiency":"1-2 lines","home_plate_umpire":"1-2 lines"},"sources":[{"title":"","url":""}]}]}. Do not calculate Final Model Score, implied probability, edge, qualification, or units; Sports Edge code calculates those independently.`;
}

async function callOpenAiRuntime({slate,weights,history}){
  if(String(process.env.MODEL_LAB_AI_ENABLED||'').toLowerCase()!=='true'){const e=new Error('MODEL_LAB_AI_ENABLED is not enabled.');e.statusCode=503;throw e;}
  if(!process.env.OPENAI_API_KEY){const e=new Error('OPENAI_API_KEY is not configured.');e.statusCode=503;throw e;}
  const tools=String(process.env.MODEL_LAB_WEB_SEARCH_ENABLED||'true').toLowerCase()==='true'?[{type:'web_search'}]:undefined;
  const inputPayload={slate_date:slate.date,authoritative_games:slate.games,verified_sports_edge_history:history};
  const body={
    model:process.env.OPENAI_MODEL||'gpt-5.6-terra',
    input:[
      {role:'system',content:[{type:'input_text',text:canonicalSystemPrompt(weights)}]},
      {role:'user',content:[{type:'input_text',text:`Run the complete published F5 slate. Use web research when available for current weather, lineups/injuries, umpire assignments and current pitcher context. Supplied F5 prices are authoritative.\n\n${JSON.stringify(inputPayload,null,2)}`}]}
    ],
    max_output_tokens:7000
  };
  if(tools) body.tools=tools;
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify(body)});
  const payload=await response.json().catch(()=>null);
  if(!response.ok){const e=new Error(payload?.error?.message||`OpenAI request failed (${response.status}).`);e.statusCode=502;throw e;}
  const text=extractOutputText(payload); return {aiPayload:parseJsonText(text),model:process.env.OPENAI_MODEL||'gpt-5.6-terra',responseId:payload?.id||null};
}

export async function runF5PromptRuntime({date,weights:inputWeights}={}){
  const weights=normalizePromptWeights(inputWeights||DEFAULT_PROMPT_WEIGHTS);
  const slate=await latestPublishedSlate(date);
  if(!slate.games.length){const e=new Error('Published F5 slate contains no games.');e.statusCode=400;throw e;}
  const history=await verifiedHistoryBundle(slate);
  const {aiPayload,model,responseId}=await callOpenAiRuntime({slate,weights,history});
  const enforced=enforcePromptRules({slate,aiPayload,weights,history});
  return {version:PROMPT_RUNTIME_VERSION,generatedAt:new Date().toISOString(),date:slate.date,publishedAt:slate.publishedAt,weights,model,responseId,webResearchEnabled:String(process.env.MODEL_LAB_WEB_SEARCH_ENABLED||'true').toLowerCase()==='true',...enforced};
}
