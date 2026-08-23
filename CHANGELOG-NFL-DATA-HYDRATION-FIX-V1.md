# NFL Data Hydration Fix V1

- Fixes the consumer NFL dashboard blanking to zero when the expensive prop-threshold aggregation is slow or fails.
- Makes the overview RPC lightweight and authoritative for games, markets, team facts and canonical player counts.
- Lazy-loads player profiles and prop profiles only when the customer opens Prop Lab.
- Adds `sports_edge_nfl_hydration_audit()` to prove the imported game/player data is present independently of the UI.
- Preserves NFL migrations 018-022 and all existing MLB releases.
