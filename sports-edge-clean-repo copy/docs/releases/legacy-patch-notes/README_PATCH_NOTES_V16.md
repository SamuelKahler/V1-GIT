# Sports Edge V16 - Game Log Environment Filter

## Main Trend Database Change
- Game Log Trend no longer uses game-log style checkboxes as the main consumer filter.
- Added a **Game Log Description / Game Environment** filter with:
  - AWAY UNDERDOG
  - AWAY FAVORITE
  - HOME UNDERDOG
  - HOME FAVORITE
- Styles such as PREV_SCORED, PREV_ALLOWED, SWEEP, AtS, OVER, UNDER, and 10+ are now displayed as automatic tags on rows instead of forcing users to choose them first.

## Product Logic
- User chooses: Sport -> Game Log Trend -> Game Environment.
- The app shows all matching applicable games from the current slate when live teams are available.
- Each row still keeps the dropdown history for that team/style scenario.
- ML and SPRD remain excluded from Game Log Trend.

## Why
This makes the page match the intended workflow: users care first about the current game's environment, then the system should surface the exact matching style tags and history.
