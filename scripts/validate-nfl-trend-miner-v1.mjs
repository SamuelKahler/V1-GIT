import fs from 'node:fs';
const need=(file,markers)=>{const s=fs.readFileSync(file,'utf8');for(const m of markers){if(!s.includes(m))throw new Error(`${file} missing ${m}`)}};
need('supabase/migrations/020_nfl_environment_trend_miner_v1.sql',[
  'sports_edge_nfl_mined_trends','sports_edge_nfl_team_trend_history','sports_edge_nfl_weekly_intelligence','sports_edge_nfl_trend_miner_audit','sports_edge_nfl_consumer_dashboard','CANONICAL_NFL_GAMES'
]);
need('sports/nfl/nfl-app.js',['Hottest Team Trends','Hottest Prop Profiles','Explore Every Team','trendHistory','matching trends']);
need('index.html',['data-nfl-view="overview"','data-nfl-view="trends"','data-nfl-view="props"','data-nfl-view="teams"','data-nfl-view="model-lab"']);
need('styles.css',['NFL Environment + Trend Miner V1','nfl-dashboard-grid','nfl-trend-row','nfl-matchup-grid','nfl-modal']);
need('api/nfl.js',['minedTrends','weekly','trendHistory','trendMinerAudit']);
need('developer-console.js',['expireAdminSession','NFL environment + trend miner audit']);
console.log('NFL_ENVIRONMENT_TREND_MINER_V1_VALIDATION_PASSED');
