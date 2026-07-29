# Sports Edge Core V10 audit

## Confirmed legacy sources

- `trackedPickResults`: 936 rows
- `officialBetHistory`: 146 rows
- `f5PerformanceBets`: 142 rows
- `seriesBoardPicks`: 24 rows
- Total preserved source rows at initialization: 1,248

The former system reconciled these into fewer canonical records before every original row had a permanent identity. It also limited recent grade application to dates on or after July 26, and the F5 page mixed a static array with a separate recent-results array.

## V10 architecture

`SportsEdgeDatabase` preserves every source row first. Each source row receives an immutable `sourceId`. Existing grades remain authoritative. The official-grading API enriches rows with `gamePk`, opponent, starters, score, and environment, and grades rows that do not already have a final result.

All MLB customer views now receive data through the canonical database compatibility layer. F5 performance reads `SportsEdgeDatabase.f5Bets` directly.

## Reliability rules

1. No source row is deleted during reconciliation.
2. Existing final grades cannot be downgraded by an API or metadata failure.
3. API calls are batched, concurrent, retried, and time limited.
4. Failed batches return explicit retry-required rows.
5. Local storage preserves completed work between page loads.
6. Supabase persistence remains available when environment variables are configured.
7. Every unresolved observation remains visible through `SportsEdgeRecent.unresolved()`.

## Honest limitation

Some specialized markets require dedicated settlement logic or a trusted existing result: series wagers, player props, parlays, NRFI, and Grand Salami markets. V10 never silently invents these results. Existing final results are preserved; otherwise the record remains explicitly unresolved until its dedicated grader is added.
