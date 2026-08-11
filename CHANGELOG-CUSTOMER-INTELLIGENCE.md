# Customer Intelligence Integration

## Added
- `lib/mlb/customer-intelligence.js`: stable presentation adapter between database evidence and the browser UI.
- Public read-only `customerIntelligence` action inside the consolidated `/api/mlb` function.
- Browser client method for customer intelligence reports.
- Deterministic integration validation.

## Changed
- Customer evidence UI now consumes a presentation-ready contract rather than database-shaped evidence directly.
- Supporting-game rendering accepts normalized customer fields.
- Existing publicEvidence action remains as a compatibility fallback.

## Preserved
- Existing tabs, navigation, layout and color scheme.
- Sports Edge performance/grading pipeline.
- Stored Trend Database separation.
- Vercel Hobby single MLB function architecture.

## Database
- No migration required.
