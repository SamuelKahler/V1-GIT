SPORTS EDGE — NFL INTELLIGENCE BACKBONE V1

1. Create a feature branch from the current main branch: nfl-intelligence-backbone-v1
2. Replace the repository contents with this release.
3. Commit: Install NFL Intelligence Backbone V1
4. Push and wait for Vercel Preview.
5. In Supabase SQL Editor run supabase/migrations/018_nfl_intelligence_backbone_v1.sql
6. Run: select public.sports_edge_nfl_backbone_audit();
7. Expected: passed=true, teams=32, referenceWinTrends>0, referenceSystemRows>0, referencePropObservations>0.
8. Open the NFL page in Preview. Confirm the NFL Intelligence Backbone banner and Hot Trends / Hot Props render.

This release does not modify MLB tables or MLB runtime behavior.
Canonical NFL games/player stats/market tables are intentionally separate from owner-supplied reference research.
