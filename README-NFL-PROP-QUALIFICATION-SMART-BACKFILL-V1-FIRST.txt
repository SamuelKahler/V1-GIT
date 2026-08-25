NFL PROP QUALIFICATION + SMART BACKFILL V1

1. Run supabase/migrations/025_nfl_prop_qualification_smart_backfill_v1.sql.
2. In /developer import the 2026 nflverse roster (free) so continuity can be evaluated.
3. Run Qualification Audit. FeaturedProfilesBelow10Games must equal 0.
4. Preview the 2025 Smart Backfill before any historical provider requests.
5. Do not run the paid backfill until historical player-prop access is confirmed for the configured provider plan.

Customer default: real 2025 closing lines only; >=10 graded games; >=60% hit rate.
Historical records are retained for new-team players but marked NEW TEAM and ranked with lower current-season relevance.
