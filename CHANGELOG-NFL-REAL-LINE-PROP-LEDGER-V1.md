# NFL Real-Line Prop Ledger V1

- Consumer prop history now starts at the 2025 season and rolls forward.
- Prop hit rates are graded against the actual game-specific sportsbook line instead of synthetic X+ thresholds.
- Added canonical `nfl.player_prop_lines` storage with consensus closing line, book count, line range, actual result, and WIN/LOSS/PUSH grade.
- Added week-by-week historical prop-line ingestion through The Odds API with a dry-run credit estimate before any paid historical calls.
- Added real-line player profile aggregation and line-by-line verified game logs.
- Synthetic threshold profiles remain available in the backend but are no longer used in the consumer Prop Lab.
- Added Developer Console controls for preview/import, grading, and auditing of real-line prop history.
