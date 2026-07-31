import assert from 'node:assert/strict';
import { calculateFirstFive, transformGame } from '../lib/mlb/transform.js';
import { extractScheduleGames, validateImportRange } from '../lib/mlb/importer.js';
import { buildUrl, requireIsoDate } from '../lib/mlb/stats-api-client.js';
import { safeEqual } from '../lib/mlb/auth.js';
import { validateRpcName } from '../lib/mlb/supabase.js';
import { validateEnvironmentRange } from '../lib/mlb/environment-engine.js';

const innings=[1,2,3,4,5].map((number,index)=>({number,awayRuns:[1,0,1,0,2][index],homeRuns:[0,2,0,1,0][index]}));
assert.deepEqual(calculateFirstFive(innings),{available:true,away:4,home:3});
assert.equal(calculateFirstFive(innings.slice(0,4)).available,false);
assert.equal(validateImportRange('2026-07-01','2026-07-07').dayCount,7);
assert.equal(validateEnvironmentRange('2026-07-01','2026-07-31').dayCount,31);
assert.equal(extractScheduleGames({dates:[{games:[{gamePk:1},{gamePk:2}]},{games:[{gamePk:1}]}]}).length,2);
assert.equal(requireIsoDate('2026-07-30','date'),'2026-07-30');
assert.equal(new URL(buildUrl('https://statsapi.mlb.com/api/v1','/schedule',{hydrate:'team,venue'})).searchParams.get('hydrate'),'team,venue');
assert.equal(safeEqual('abcdefghijklmnopqrstuvwxyz123456','abcdefghijklmnopqrstuvwxyz123456'),true);
assert.equal(safeEqual('abcdefghijklmnopqrstuvwxyz123456','abcdefghijklmnopqrstuvwxyz123457'),false);
assert.equal(validateRpcName('sports_edge_mlb_status'),'sports_edge_mlb_status');

const schedule={gamePk:777001,season:'2026',officialDate:'2026-07-29',gameDate:'2026-07-29T23:10:00Z',teams:{away:{score:4,team:{id:101,name:'Away'}},home:{score:3,team:{id:102,name:'Home'}}},venue:{id:10,name:'Park'},status:{detailedState:'Final'}};
const feed={metaData:{timeStamp:'x'},gameData:{game:{pk:777001,season:'2026'},datetime:{officialDate:'2026-07-29',dateTime:'2026-07-29T23:10:00Z'},status:{detailedState:'Final'},teams:{away:{id:101,name:'Away'},home:{id:102,name:'Home'}},venue:{id:10,name:'Park'}},liveData:{linescore:{teams:{away:{runs:4},home:{runs:3}},innings:[1,2,3,4,5].map((num,index)=>({num,away:{runs:[1,0,1,0,2][index]},home:{runs:[0,2,0,1,0][index]}}))},boxscore:{teams:{away:{pitchers:[],players:{}},home:{pitchers:[],players:{}}}}}};
const transformed=transformGame(schedule,feed);
assert.equal(transformed.gamePk,777001);
assert.deepEqual(transformed.firstFive,{available:true,away:4,home:3});
console.log('PHASE_2A_VALIDATION_PASSED');
