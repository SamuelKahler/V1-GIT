# Sports Edge V15 — Outcome-Backed Trend Database

This patch cleans the Trend Database around the green/red sheet logic.

## What changed
- Imported the pasted green/red-style game-log sheet as authoritative outcome evidence.
- WINS column is now treated as win evidence.
- LOSSES column is now treated as loss evidence.
- Rows with both win and loss evidence show a mixed record instead of being forced into one outcome.
- Game Log Trend rows now display WIN / LOSS / MIXED / UNDEFINED.
- Game Log Trend rows calculate a local record from the evidence available in that row.
- Description column now explicitly emphasizes opponent and home/away location.
- History remains compact inside a dropdown per row.

## Important data note
The pasted text does not contain actual cell colors, but it does expose the green/red outcome logic through the WINS and LOSSES columns. No dates were invented for supporting examples beyond the date attached to the row.
