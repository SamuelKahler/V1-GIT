# MLB Trend Matrix V1

- Added a Supabase-backed 9-category trend matrix.
- Attached active environment tags to every applicable trend category.
- Added current-game context lookup by official `gamePk`.
- Added selected-team and opponent matrices.
- Isolated F5, moneyline, and totals grading.
- Added sweep and avoid-the-sweep sequence detection for historical games.
- Removed generic trend guessing from the customer adapter.
- Separated record and sample visually to prevent strings such as `30-2858 games`.
- Added clear category and environment labels to every card.
- Added a read-only Supabase audit function.
