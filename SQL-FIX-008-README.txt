SPORTS EDGE SQL FIX - MIGRATION 008

The original migration referenced columns that do not exist in the installed mlb.games schema:
- status_abstract_state
- home_f5_score
- away_f5_score

The corrected migration uses:
- is_final
- f5_home_score
- f5_away_score
- f5_available

Run supabase/migrations/008_legacy_purge_decision_engine_audit.sql again in Supabase SQL Editor.
The failed original CREATE FUNCTION statement made no database changes.
