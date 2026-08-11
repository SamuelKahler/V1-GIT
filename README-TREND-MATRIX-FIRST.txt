SPORTS EDGE MLB TREND MATRIX V1

INSTALL ORDER
1. Upload this full repository to GitHub branch phase-2-mlb-database.
2. Commit: Install MLB Trend Matrix V1
3. In Supabase SQL Editor run:
   supabase/migrations/009_mlb_trend_matrix_engine.sql
4. Run the audit:
   select public.sports_edge_mlb_trend_matrix_audit();
5. Redeploy or wait for the Vercel Preview deployment.
6. Open current MLB picks and inspect Decision Evidence.

TREND CATEGORIES (exactly 9)
- 1-DAY REST
- AFTER A LOSS
- AFTER A WIN
- AWAY
- AWAY FAVORITE
- AWAY UNDERDOG
- DIVISION
- HOME FAVORITE
- HOME UNDERDOG

ENVIRONMENT TAGS
- PREV_ALLOWED 0
- PREV_ALLOWED 10+
- PREV_SCRD 0
- PREV_SCRD 10+
- 10+
- SWEEP
- AtS
- ML
- OVER
- UNDER

A customer trend is only displayed when:
- the trend category applies to today's selected team;
- the environment tag applies to today's game or wager;
- the historical rows use the same market and period;
- the current-season sample contains at least 3 graded games.

F5, full-game moneyline, and totals are graded independently. No cross-market fallback is allowed.
