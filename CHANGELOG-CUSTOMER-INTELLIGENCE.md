# Customer Intelligence Integration

## Added
- `lib/mlb/customer-intelligence.js`: one presentation adapter between the evidence engine and customer UI.
- `publicCustomerIntelligence` action in the consolidated MLB API.
- Browser client `customerIntelligence()` method.
- Exact environment details and transparent relaxed-condition disclosures.
- Deterministic validation suite.

## Changed
- Customer UI now consumes a stable presentation-ready report rather than raw query-engine output.
- Current game series position and day/night are included when verified by the live MLB schedule feed.
- Legacy Sports Edge graded-pick observations are no longer labeled as Verified Game Logs in pick-card summaries.

## Unchanged
- Sports Edge grading and performance databases.
- Current tabs, layouts, navigation, and visual design.
- Supabase schema.
