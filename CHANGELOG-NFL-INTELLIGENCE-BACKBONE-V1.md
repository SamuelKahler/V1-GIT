# NFL Intelligence Backbone V1

- Added isolated `nfl` Supabase schema.
- Added canonical NFL teams, games, team-game facts, quarter/half/final scoring, markets, player-game stats, continuity eras, and quality-issue tables.
- Preserved bundled owner research in explicit reference tables rather than treating spreadsheet percentages as canonical truth.
- Seeded current repository win trends, system rows, and prop observations into Supabase.
- Added trend-strength scoring with sample-size protection.
- Added reference prop-profile aggregation.
- Added read-only NFL API and browser client.
- NFL overview now surfaces the hottest qualified reference trends and prop profiles from Supabase.
- Ambiguous source rows are flagged for review instead of silently corrected.
- MLB schema and runtime remain untouched.
