# Decision Engine V3

- Removed customer-facing Exact/Trend/Environment match labels.
- Removed standalone ML, OVER, and UNDER as evidence signals.
- Added dynamic prior-game lookup for current and fallback game context.
- Added PREV_SCRD and PREV_ALLOWED evidence for totals and side markets.
- Added minimum supportive hit-rate threshold.
- Inverted opponent side-market results so opponent-context cards support the selected wager rather than argue against it.
- Deduplicated broad signals when a more specific combined signal exists.
- Rewrote evidence labels into customer-readable language.
