# Sports Edge V30 — Stability Restore

Built from V29 with a stability-first approach. This update restores missing product sections without changing the working MLB pick/details flow.

## Fixed
- Performance Lab no longer crashes from an undefined `classifiedHistory` variable.
- Series Board render is protected from unrelated page errors.
- Research Journal render is protected and now includes the Casey Mize vs Yankees F5 research note.
- Model Center demo access is initialized even if another section has a display issue.
- Boot process now uses safe section rendering so one broken page cannot blank the entire app.

## Restored / Preserved
- Sport-first homepage from V29.
- MLB picks and Bet Details flow from the stable base.
- Series Board entries from June 22.
- Historical Research Journal logs already stored in the app.
- Performance Lab category W/L and unit summary from the official bet ledger.

## New Research Journal Entry
- Casey Mize F5 edge vs Yankees, including K-BB%, xFIP/ERA context, contact suppression, Rodon volatility, and model notes.

## Product Rule
Future updates should not alter unrelated working sections. New features should be isolated so the whole app does not fail if one data block is incomplete.
