import fs from 'node:fs';
const path='lib/nfl/prop-line-ingestion.js';
const text=fs.readFileSync(path,'utf8');
const checks=[
  ['multi-snapshot historical discovery', text.includes('const discoveryMinutes=[24*60,12*60,6*60,3*60,60,30,10]')],
  ['historical events endpoint retained', text.includes('/v4/historical/sports/${SPORT}/events?date=${date}&dateFormat=iso')],
  ['exact event matching retained', text.includes('const event=findEvent(unwrap(payload),game)')],
  ['near-kickoff event odds retained', text.includes('const date=isoBefore(game.kickoffAt,5)')]
];
const failed=checks.filter(([,ok])=>!ok);
if(failed.length){for(const [name] of failed) console.error('FAIL',name);process.exit(1);}
console.log('NFL_HISTORICAL_EVENT_MATCH_FIX_V1_VALIDATION_PASSED');
