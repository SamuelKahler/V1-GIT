# Customer Intelligence Integration Audit

## Customer path
`MLB pick modal -> SportsEdgeMLBIntelligence.customerIntelligence -> POST /api/mlb -> customer-intelligence adapter -> evidence engine -> query engine -> Supabase RPC`

## Verified separation
- Sports Edge graded picks remain in the performance/grading pipeline.
- Verified Game Logs are returned only from `sports_edge_mlb_query_game_logs` over `mlb.games` and `mlb.environments`.
- Stored Trend Database rows remain in their own UI section.

## Public safety
- Customer intelligence is read-only.
- Imports, audits, status and environment rebuilds remain admin-token protected.
- The Supabase secret key remains server-side in Vercel.

## Data behavior
- Missing environments remain null and cannot match a requested verified filter.
- ROI is null when verified historical moneylines are unavailable.
- Best-qualified samples disclose every relaxed condition.
- Supporting games include the official MLB gamePk and exact matched game context.

## Database changes
None.
