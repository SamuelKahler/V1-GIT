# Sports Edge Intelligence Engine V4

## What this release adds

- A permanent canonical observation for every master-ledger pick.
- A deterministic environment ID for every observation.
- Automatic win/loss, hit-rate, unit-profit, and ROI calculations.
- Matched evidence generated from graded master-ledger records before imported trend summaries.
- Traceability from evidence back to the exact historical pick records.
- An audit object at `window.SportsEdgeIntelligence.audit`.

## Data rules

1. Only WIN and LOSS records count in hit rate.
2. PUSH and VOID are preserved but excluded from decisions.
3. PENDING, LIVE, and UNVERIFIED never count in evidence metrics.
4. Profit is calculated from American odds and units when odds are available.
5. No historical pick is deleted or overwritten.
6. Computed ledger evidence is ranked above manually imported trend percentages.

## Current audit limitations

The historical source currently contains many records without an official MLB game ID or opponent. Those records remain preserved, but they cannot yet receive the strongest game-level environment match. The next subsystem must resolve official game IDs, opponents, scores, and first-five scores before automated grading can be considered complete.
