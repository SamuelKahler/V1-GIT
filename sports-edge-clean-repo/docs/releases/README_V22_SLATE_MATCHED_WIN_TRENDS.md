# Sports Edge V22 — Slate-Matched Win Trend Evidence

## What changed
- Updated daily play cards so the description area prioritizes actual matched trend evidence instead of generic AI-style notes.
- Moneyline and series cards now look for matching stored `ML` hit-rate rows for the team.
- Over/Under cards now look for matching stored `OVER` or `UNDER` hit-rate rows for the teams in that matchup.
- If no stored hit-rate trend matches a card yet, the card clearly says no matched trend is available and falls back to model/research notes.
- The details modal also shows matched trend evidence first.

## Product logic
The bettor-facing card now answers:
1. What is the play?
2. Is it official or research?
3. What category is it?
4. What actual win trend supports it?
5. What deeper model/research notes exist if the user opens details?

## Important limitation
This version matches against the stored trend database. Full automatic environment matching still depends on the live data feed having game context, moneylines, rest status, division status, and prior game result context available.
