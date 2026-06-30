# Sports Edge V22.2 - Game Context Labels

## What changed
- Every live game card now clearly shows each team as:
  - AWAY
  - HOME
  - AWAY FAVORITE
  - AWAY UNDERDOG
  - HOME FAVORITE
  - HOME UNDERDOG
- Moneyline odds are shown beside those labels.
- Favorite/underdog status is inferred from American moneyline implied probability, not just whether a line is negative.
- The same context logic feeds the existing trend/environment matching engine.

## Why
Users should immediately understand the current game environment without choosing filters manually. This also supports matching stored Sports Edge trends such as AWAY UNDERDOG, HOME FAVORITE, etc.

## Important limitation
If no moneyline is available, the app still shows HOME/AWAY but will not claim favorite/underdog status.
