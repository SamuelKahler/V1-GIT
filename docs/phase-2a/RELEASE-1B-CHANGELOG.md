# Release 1B Changelog

## Added
- Central official MLB Stats API client.
- Verified environment rebuild RPC and protected API endpoint.
- Automatic environment rebuild after successful non-dry-run imports.
- Division/interleague, rest days and advantage, previous game results and scoring, starter hand, series position, day/night, odds and total buckets.
- Environment completeness counts and percentage.
- Full data-quality audit RPC.

## Corrected
- API, importer, transformer, HTTP, auth, and Supabase modules now share one contract.
- Audit endpoint now calls a real audit RPC.
- F5 is unavailable unless innings 1 through 5 each contain both team run values.
- Schedule games are deduplicated by official MLB gamePk before import.

## Unchanged
- Customer-facing UI and design.
- Sports Edge picks, grading, F5 performance, and overall performance.
- Existing tabs and navigation.
