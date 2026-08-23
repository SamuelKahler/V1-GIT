import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const migration=read('supabase/migrations/022_nfl_prop_intelligence_engine_v2.sql');
const api=read('api/nfl.js');
const lib=read('lib/nfl/intelligence.js');
const app=read('sports/nfl/nfl-app.js');
const html=read('developer.html');
const checks=[
  ['migration function prop board',migration.includes('sports_edge_nfl_prop_board')],
  ['canonical threshold source',migration.includes('CANONICAL_PLAYER_GAME_STATS')],
  ['minimum sample audit',migration.includes("'minimumFeaturedSample',10")],
  ['player intelligence function',migration.includes('sports_edge_nfl_player_prop_intelligence')],
  ['environment split function',migration.includes('sports_edge_nfl_player_threshold_splits')],
  ['dashboard uses canonical prop board',migration.includes("'hotProps',public.sports_edge_nfl_prop_board")],
  ['api prop board',api.includes("propBoard: { method: 'GET'" )],
  ['api player intelligence',api.includes("playerIntelligence: { method: 'GET'" )],
  ['lib prop board',lib.includes('getNflPropBoard')],
  ['consumer canonical player count',app.includes('canonical players')],
  ['consumer prop lab',app.includes('NFL Prop Lab')],
  ['small sample exclusion copy',app.includes('Tiny 1–0 and 2–0 samples are excluded')],
  ['season window controls',app.includes("propWindow:'3Y'")],
  ['market groups',app.includes('PASSING')&&app.includes('RUSHING')&&app.includes('RECEIVING')&&app.includes('TDS')],
  ['player intelligence modal',app.includes('Historical Thresholds')&&app.includes('Environment Splits')&&app.includes('Verified Game Log')],
  ['week one hygiene preserved',app.includes('Week 1 suppresses previous-game carryover signals')],
  ['developer prop audit',html.includes('NFL Prop Engine Audit')]
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if(failed.length){console.error(`NFL_PROP_INTELLIGENCE_ENGINE_V2_VALIDATION_FAILED (${failed.length})`);process.exit(1);}
console.log('NFL_PROP_INTELLIGENCE_ENGINE_V2_VALIDATION_PASSED');
