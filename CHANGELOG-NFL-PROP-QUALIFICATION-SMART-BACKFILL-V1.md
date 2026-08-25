# NFL Prop Qualification + Smart Backfill V1

- Keeps all seven supported real-line player prop markets.
- Customer featured board now requires 10+ graded 2025 closing lines and 60%+ hit rate.
- Adds qualified/strong/elite profile labels based on sample and hit rate.
- Adds free nflverse current-roster ingestion and flags SAME TEAM / NEW TEAM / UNKNOWN continuity.
- New-team status never rewrites the historical hit rate; it only adjusts relevance and displays a warning.
- Adds full-season smart-backfill planning by week with a configurable estimated-credit ceiling.
- Smart Backfill blocks before starting when the estimate exceeds the configured budget and stops on provider authorization/billing failures.
- Preserves every underlying prop-line observation in Supabase even when a profile is not customer-facing.
