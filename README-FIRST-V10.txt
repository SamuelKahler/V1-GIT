SPORTS EDGE CORE V10 - CANONICAL DATABASE REBUILD

PURPOSE
This release preserves the existing Sports Edge layout, tabs, colors, and customer workflow while replacing the fragmented MLB data engine with one canonical database.

IMPORTANT INSTALLATION METHOD
Do not merge V10 into a repository that is currently showing merge conflicts.
1. In GitHub Desktop click Abort Merge.
2. Close GitHub Desktop.
3. Make a backup copy of the current repository folder.
4. Replace the repository contents with the contents of this V10 folder.
5. Reopen GitHub Desktop, review the changes, commit, and push.

CORE FLOW
All legacy source rows -> immutable source IDs -> canonical database -> official MLB grading -> metadata/environment -> F5/performance/evidence.

NEW SOURCE OF TRUTH
sports/mlb/core/sports-edge-database.js

Every original row is preserved with an immutable ID such as:
SRC-TRACKEDPICKRESULTS-000001
SRC-OFFICIALBETHISTORY-000001
SRC-F5PERFORMANCEBETS-000001

Existing WIN/LOSS/PUSH/VOID results are authoritative and are never erased when metadata resolution fails.

FIRST DEPLOYMENT
After Vercel is Ready, hard refresh and open the browser console.
Run:
await SportsEdgeRecent.syncAll()

Then inspect:
SportsEdgeDatabase.audit()
SportsEdgePipeline.health()
SportsEdgeRecent.unresolved()
SportsEdgePerformance.refresh()
SportsEdgePerformance.stats()

The full sync is batched, retried, and preserves partial failures. Leave the browser tab open until it finishes.

NO PAID CREDITS
The grading route uses the official MLB Stats API. It does not consume odds-provider credits.

FILES THAT PRESERVE THE EXISTING UI
index.html
styles.css
sports/mlb/mlb-app.js
sports/nfl/*

The UI design and tab structure are retained. Only the data wiring was changed.
