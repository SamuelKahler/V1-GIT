SPORTS EDGE — CUSTOM F5 MODEL ENGINE V1A

PURPOSE
Turns the existing premium F5 weight sliders into a deterministic model backed by verified MLB first-five data.

WHAT V1A DOES
- User-adjustable weights must total 100%.
- Run My F5 Model calls a server-side engine.
- The engine reads the latest published F5 markets from the canonical pick system.
- Verified factor snapshots come from Supabase / the MLB backbone.
- Results show weighted win estimate, market implied probability, estimated edge, and data coverage.
- Every result expands to show factor score, configured weight, effective weight, contribution, record, and sample.
- Missing factor data is excluded rather than invented; available weights are re-normalized.

VERIFIED V1A FACTORS
1. Starting Pitcher History
2. Opponent Early Offense
3. Team F5 Split
4. Recent F5 Form
5. Matchup History
6. Situation Match
7. Rest / Location
8. Market Baseline

IMPORTANT
The V1A probability is a weighted empirical estimate, not yet a statistically calibrated probability model. Calibration and AI explanation belong to later releases.

INSTALL
1. Deploy repository on a feature branch.
2. Run supabase/migrations/015_custom_f5_model_engine_v1a.sql in Supabase SQL Editor.
3. Run: select public.sports_edge_f5_model_v1a_audit();
4. Open MLB > Model Center, unlock demo access, keep weights at 100%, click Run My F5 Model.
5. Move weights, keep total at 100%, run again and verify ranking / estimated edges change.
