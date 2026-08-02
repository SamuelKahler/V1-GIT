# Decision Engine V1

- Removed the broad per-team season baseline from customer evidence.
- Reduced the evidence view to exact historical record, hit rate, sample, matching conditions, and matching games.
- Removed customer-facing database/source explanations.
- Removed legacy trend tags and trend-backed proof from Today's Picks cards.
- Removed the duplicate Trend-Backed Plays bucket.
- Kept Official Sports Edge F5 performance separate from MLB historical evidence.
- Preserved strict market isolation between F5 and full-game moneyline evidence.
- Added a read-only Supabase audit RPC for Decision Engine acceptance checks.
