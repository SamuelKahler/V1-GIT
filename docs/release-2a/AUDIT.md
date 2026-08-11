# Release 2A Audit

- MLB games remain separate from Sports Edge picks.
- Query calculations use only `mlb.games`, `mlb.teams`, `mlb.environments` and stored MLB odds.
- No Sports Edge pick is used as historical evidence.
- Environment values are derived from prior completed games, team metadata, stored starters and stored odds.
- Missing source fields remain null and fail exact-match filters.
- `game_pk` remains the unique official natural game identifier.
- Supporting-game responses include the exact records used in the summary calculation.
