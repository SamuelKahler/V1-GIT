# NFL Historical Prop Date Fix V1

- Canonicalizes historical Odds API timestamps to second-precision ISO8601 (`YYYY-MM-DDTHH:mm:ssZ`).
- Stops pre-encoding the historical `date` query value before URL construction.
- Adds `dateFormat=iso` explicitly to the historical events lookup.
- Preserves all Real-Line Prop Ledger, qualification, continuity, and smart-backfill behavior.
- No Supabase migration is required for this compatibility fix.
