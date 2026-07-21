# NFL Update Workflow

## Historical prop update
Open `sports/nfl/data/nfl-props.js` and add one pipe-separated row inside `NFL_PROP_RAW`:

`YEAR|PLAYER BET|HIT or MISS|TEAM|vs. OPP or @ OPP|ENVIRONMENT|STYLE|WEEK`

## Historical systems update
Open `sports/nfl/data/nfl-systems.js` and add one object matching the existing structure.

## Current weekly card
Open `sports/nfl/data/nfl-games.js`. Add only current, verified opportunities. Do not use sample picks. When no current card is available, keep `window.NFL_GAMES = [];` so the consumer sees a truthful empty state.

## Consumer summary
The NFL app generates a plain-language summary from `mainReason`, `biggestRisk`, and `bestBet` in each current game object. Historical-only mode shows a transparent research summary instead of inventing a pick.
