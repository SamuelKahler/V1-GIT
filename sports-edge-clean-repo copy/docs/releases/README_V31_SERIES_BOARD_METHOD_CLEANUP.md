# Sports Edge V31 — Series Board Method Cleanup

Base: V30 Stability Restore.

## What changed
- Removed the 06/22 series picks from the Series Engine step-by-step methodology panel.
- Kept the 06/22 Astros, Twins, Guardians, and Reds series picks inside the Series Board cards where they belong.
- Rewrote the methodology panel as a clean 8-step process:
  1. Map the series
  2. Score starting pitching
  3. Check injuries and lineups
  4. Measure team form
  5. Convert variables to scores
  6. Calculate true probability
  7. Compare to Vegas
  8. Classify the decision

## Why
The Series Board now separates the user-facing picks from the model explanation. Picks live in cards. The methodology panel explains how the model works.

## Stability note
No changes were made to the MLB picks flow, Research Journal, Performance Lab, Model Center, or Bet Details render pipeline.
