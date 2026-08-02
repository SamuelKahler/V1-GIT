SPORTS EDGE — DECISION ENGINE V3

1. Upload this repository to phase-2-mlb-database.
2. Run supabase/migrations/011_decision_engine_v3_actionable_evidence.sql in Supabase SQL Editor.
3. Run: select public.sports_edge_mlb_decision_engine_v3_audit();
4. Redeploy the Preview branch.

Decision Engine V3 removes tautological ML/OVER/UNDER evidence, derives previous-game environments even when today's scheduled game does not yet have an environment row, and presents only supportive, market-specific evidence.
