SPORTS EDGE V11 CANONICAL DATABASE INSTALL

This build was created from the uploaded repository: V1-GIT-main (5).zip.
It preserves the existing design, tabs, CSS, MLB/NFL pages, and daily picks.

CORE CHANGE
- Adds sports/mlb/core/sports-edge-database.js as the canonical source of truth.
- Rewires Today's Picks and F5 Performance to that canonical database.
- Preserves all source rows and authoritative historical grades.
- Resolves and grades standard MLB ML, spread/run line, total, and F5 wagers.
- Rebuilds matched trend evidence after grading.

SAFEST INSTALL
1. In GitHub Desktop, abort any merge in progress.
2. Make a backup of your current repository folder.
3. Copy the contents of this folder into the repository root and choose Replace.
4. Confirm sports/mlb/core/sports-edge-database.js exists.
5. Commit and push.

FILES ADDED
- sports/mlb/core/sports-edge-database.js

FILES REPLACED
- index.html
- package.json
- api/intelligence-sync.js
- sports/mlb/mlb-app.js
- sports/mlb/core/master-ledger.js
- sports/mlb/core/intelligence-engine.js
- sports/mlb/core/intelligence-pipeline.js
- sports/mlb/core/recent-results.js
- sports/mlb/core/performance-engine.js

FILES PRESERVED
- styles.css
- daily-import.js
- sports/mlb/mlb-data.js
- all NFL files

AFTER DEPLOYMENT
Run in the browser console:
  await SportsEdgeRecent.syncAll()
Then:
  SportsEdgeDatabase.audit()
  SportsEdgeRecent.audit()
  SportsEdgePerformance.refresh()
  SportsEdgeIntelligence.audit

No paid API credits are required for grading. The official MLB Stats API is used.
