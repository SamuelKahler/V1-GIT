import fs from 'node:fs';
const must=(file,parts)=>{const s=fs.readFileSync(file,'utf8');for(const p of parts){if(!s.includes(p))throw new Error(`${file} missing ${p}`)}};
must('supabase/migrations/025_nfl_prop_qualification_smart_backfill_v1.sql',['player_roster_seasons','sports_edge_nfl_qualified_real_line_prop_board','p_min_hit_rate','NEW TEAM','featuredProfilesBelow10Games']);
must('lib/nfl/prop-line-ingestion.js',['previewNflPropSmartBackfill','runNflPropSmartBackfill','withinConfiguredBudget']);
must('lib/nfl/roster-ingestion.js',['nflverse-data/releases/download/rosters','sports_edge_nfl_import_roster_batch']);
must('developer.html',['Qualified Profiles + Smart Backfill','Preview 2025 Smart Backfill','Import 2026 Roster']);
must('sports/nfl/nfl-app.js',["action:'qualifiedRealLinePropBoard'","minGames:'10'","minHitRate:'60'"]);
console.log('NFL_PROP_QUALIFICATION_SMART_BACKFILL_V1_VALIDATION_PASSED');
