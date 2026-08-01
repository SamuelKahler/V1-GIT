# Release 3 audit

Evidence source: `public.sports_edge_mlb_query_game_logs`, backed by `mlb.games`, `mlb.environments`, `mlb.teams`, and verified odds when present.

Sports Edge graded picks are not queried or counted.

Exact matches retain every requested verified condition. Qualified alternatives relax conditions in a documented order and return `removedConditions`; they are never presented as exact matches.

ROI is null when moneyline data is unavailable. Missing values are not inferred.
