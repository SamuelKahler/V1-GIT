# NFL Historical Game Ingestion V1

- Adds idempotent nflverse schedule/results ingestion for selected seasons.
- Normalizes historical games into `nfl.games`.
- Stores closing moneyline, spread and total snapshots in `nfl.market_history`.
- Builds two team-perspective `nfl.team_game_facts` rows per game.
- Derives home/away, favorite/underdog, division/conference, primetime, rest, previous-result, previous-ATS and previous-total environment tags.
- Preserves QB, coach, venue, roof, surface, temperature, wind and referee context when present in the source.
- Adds a Developer Console importer with dry-run and audit controls.
- Adds a historical-ingestion audit for duplicates, missing final scores and market coverage.
- Keeps quarter-score/player-stat enrichment reserved for the next NFL ingestion release.
