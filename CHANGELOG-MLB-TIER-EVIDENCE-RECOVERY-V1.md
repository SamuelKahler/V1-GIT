# MLB Tier Evidence Recovery V1

- Fixed Decision Evidence parsing for official picks whose titles begin with `TIER 1 |`, `TIER 2 |`, or `TIER 3 |`.
- Tier metadata is stripped only for market/team parsing; the displayed pick title remains unchanged.
- Restores F5/Moneyline identification and selected-team resolution for tiered picks, allowing the existing canonical MLB Trend Matrix and customer-intelligence pipeline to run.
- No Supabase migration and no historical data mutation.
