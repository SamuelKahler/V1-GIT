SPORTS EDGE - VERIFIED V5 + V6 UPDATE
Built directly from your uploaded repository: V1-GIT-main (4).zip

WHAT WAS CHANGED
1. index.html
2. sports/mlb/mlb-app.js
3. sports/mlb/mlb-data.js

WHAT WAS ADDED
1. api/intelligence-sync.js
2. daily-import.js
3. sports/mlb/core/intelligence-pipeline.js
4. sports/mlb/core/recent-results.js
5. supabase/migrations/001_sports_edge_intelligence.sql
6. .env.example
7. .gitignore

WHAT WAS NOT CHANGED
- styles.css
- package.json
- vercel.json
- api/grade-picks.js
- api/live-data.js
- api/odds.js
- sports/mlb/core/master-ledger.js
- sports/mlb/core/intelligence-engine.js
- all NFL files

INSTALL
This ZIP is a complete, updated copy of your repository. Replace your current repository folder only after making a backup, or copy only the files listed above into matching locations.

AFTER DEPLOYMENT
Open the browser console and run:
  await SportsEdgeRecent.sync()
Then verify:
  SportsEdgeRecent.grades()
  SportsEdgeRecent.f5()
  SportsEdgePipeline.health()

SUPABASE
Run supabase/migrations/001_sports_edge_intelligence.sql in Supabase SQL Editor.
Add these Vercel environment variables:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
Redeploy after saving them.
