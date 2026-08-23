NFL PROP INTELLIGENCE ENGINE V2

1. Run supabase/migrations/022_nfl_prop_intelligence_engine_v2.sql.
2. Redeploy the Preview branch.
3. Open /developer and run NFL Prop Engine Audit.
4. Confirm canonicalPlayers > 100, qualifiedThresholdProfiles > 0, tinySamplesOnFeaturedBoard = 0, passed = true.
5. Open NFL > Players and verify the Prop Lab uses canonical player coverage, 1Y/2Y/3Y windows, market filters, and sample-qualified historical thresholds.
6. Click a prop profile and verify Historical Thresholds, Environment Splits, Tracked Research, and Verified Game Log load.

No player re-import is required if NFL Player Audit already passed; V2 derives new profiles from the player_game_stats already in Supabase.
