SPORTS EDGE DECISION ENGINE V2

1. Upload this repository to the phase-2-mlb-database branch.
2. Run supabase/migrations/010_decision_engine_v2_ranked_evidence.sql in Supabase SQL Editor.
3. Run: select public.sports_edge_mlb_decision_engine_v2_audit();
4. Redeploy the Vercel Preview.
5. Validate moneyline, F5, and total picks before merging to main.

Decision Engine V2 displays evidence in three truthful levels:
- Exact: both today's trend category and environment match.
- Trend: today's trend category matches, even when no exact environment sample exists.
- Environment: today's environment matches, even when no trend-category combination qualifies.

No cross-market substitutions are allowed.
