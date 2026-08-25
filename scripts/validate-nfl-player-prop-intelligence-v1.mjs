import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const sql=read('supabase/migrations/021_nfl_player_prop_intelligence_v1.sql');
const api=read('api/nfl.js');
const ui=read('sports/nfl/nfl-app.js');
const dev=read('developer.html');
const checks=[
  ['player stats batch RPC',sql.includes('sports_edge_nfl_import_player_stats_batch')],
  ['player profile RPC',sql.includes('sports_edge_nfl_player_profiles')],
  ['hot player intelligence',sql.includes('sports_edge_nfl_hot_player_profiles')],
  ['player game log',sql.includes('sports_edge_nfl_player_game_log')],
  ['week one previous game filter',sql.includes("v_week=1")&&sql.includes("AFTER A WIN")&&sql.includes("REST DISADVANTAGE")],
  ['player API actions',api.includes('importPlayers')&&api.includes('playerGameLog')&&api.includes('playerAudit')],
  ['consumer player database',ui.includes('Player Performance Database')&&ui.includes('openPlayerProfile')],
  ['developer player import',dev.includes('NFL Player Stats + Prop Intelligence')&&dev.includes('nflImportPlayers')]
];
const failed=checks.filter(([,ok])=>!ok);
if(failed.length){console.error(failed.map(([name])=>`FAIL: ${name}`).join('\n'));process.exit(1)}
console.log('NFL_PLAYER_PROP_INTELLIGENCE_V1_VALIDATION_PASSED');
