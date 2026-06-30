# Sports Edge V18 - Clarity + Series Board Cleanup

## Main goals
This update focuses on making the website easier to understand for real users. The mindset going forward is: every page should clearly explain what the user is looking at, why it matters, and what action/status applies.

## Today's Picks / Performance Dashboard
- Clearer performance explainer added.
- Only verified wins/losses count toward record, units, and ROI.
- Older picks without a result are labeled **Needs Grading** instead of being confused with live picks.
- Today's slate remains Active / Pending until results are provided or an auto-grading engine is connected.

## Series Board
The old generic Series Engine step cards were replaced with a clean board:
- Pick
- Odds
- Bet vs Lean
- Confidence grade
- Vegas no-vig probability
- Model probability
- Edge
- Decision
- Plain-English why dropdown

## Current limitation
This update does not invent results for historical ungraded picks. To fully grade all ungraded bets, Sports Edge needs either:
1. verified results supplied manually, or
2. a box-score/odds grading engine connected to live historical data.

## Files changed
- data.js
- app.js
- index.html
- styles.css
