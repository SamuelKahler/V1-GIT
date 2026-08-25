import fs from 'node:fs';
const checks=[
 ['migration',fs.existsSync('supabase/migrations/023_nfl_data_hydration_fix_v1.sql')],
 ['dashboard lightweight',fs.readFileSync('supabase/migrations/023_nfl_data_hydration_fix_v1.sql','utf8').includes('Prop profiles and player cards are intentionally lazy-loaded')],
 ['audit rpc',fs.readFileSync('supabase/migrations/023_nfl_data_hydration_fix_v1.sql','utf8').includes('sports_edge_nfl_hydration_audit')],
 ['api action',fs.readFileSync('api/nfl.js','utf8').includes('hydrationAudit')],
 ['lazy players',fs.readFileSync('sports/nfl/nfl-app.js','utf8').includes('loadPlayerProfiles')]
];
const failed=checks.filter(([,ok])=>!ok); if(failed.length){console.error('NFL_DATA_HYDRATION_FIX_V1_VALIDATION_FAILED',failed);process.exit(1);} console.log('NFL_DATA_HYDRATION_FIX_V1_VALIDATION_PASSED');
