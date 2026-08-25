# NFL Environment + Trend Miner V1

- Replaces the consumer-facing NFL command-center presentation with a clean light NFL Intelligence dashboard.
- Computes ATS, moneyline, Over and Under trends directly from canonical imported NFL games.
- Selects the strongest defensible season window for each team / market / environment instead of blindly favoring the longest window.
- Adds sample-size, persistence and recency-aware trend strength scoring.
- Adds current-week matchup intelligence by matching each scheduled team's real environment tags to verified historical trends.
- Adds click-through verified game logs for every mined trend.
- Adds searchable Team Database, Hot Trends and Hot Prop Profiles views.
- Keeps owner-entered reference research separate from canonical calculated history.
- Adds the NFL Trend Miner audit to the Developer Console.
- Automatically clears stale browser admin credentials after a 401/403 response instead of repeatedly showing an invalid-token error.
