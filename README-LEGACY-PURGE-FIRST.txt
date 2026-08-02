SPORTS EDGE MLB — LEGACY PURGE + DECISION ENGINE

INSTALL
1. Use GitHub Desktop and select branch: phase-2-mlb-database
2. Replace the repository contents with this folder's contents.
3. Commit: Install Legacy Purge and Decision Engine
4. Push origin.
5. In Supabase SQL Editor run:
   supabase/migrations/008_legacy_purge_decision_engine_audit.sql
6. Wait for the Vercel Preview deployment to become Ready.
7. Do not merge to main until acceptance testing passes.

SUPABASE CHECK
Run:
select public.sports_edge_mlb_decision_engine_audit();
Expected JSON includes:
- passed: true
- duplicateGamePks: 0
- games > 0
- environments > 0

CUSTOMER ACCEPTANCE
- Today's Picks cards do not show legacy hit rates or 0-5 fallback records.
- F5 details show Official Sports Edge F5 performance separately.
- No generic whole-season team F5 baseline is shown.
- ML details contain no F5 wording or F5 statistics.
- Verified Trends show current-season data for the selected side and opponent.
- Exact Environment displays one consistent record, hit rate, sample, condition chips, and matching games.
- No Excel/stored trend card, match score, generic team record, or implementation explanation appears.
- Starting Pitchers / K Prop History remains available.
- Verified Result appears only after final grading.
