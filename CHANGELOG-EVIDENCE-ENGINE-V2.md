# Evidence Engine V2

## Customer-facing changes
- Retired legacy Excel/imported trend percentages from Today’s Picks and the Trend Database page.
- Replaced them with 2026 MLB database calculations.
- Added strict market isolation.
- Added line-aware F5 cover calculations.
- Added exact-environment and this-season baseline sections.
- Preserved Official Sports Edge F5 Performance as a separate system.

## Backend changes
- Added `f5Line` query criteria.
- Added migration `006_evidence_engine_v2.sql`.
- Updated customer intelligence response to V2 with `seasonBaseline`.
- Disabled relaxed evidence variants for customer reports.

## Validation
- All syntax checks passed.
- All existing validation suites passed.
- `EVIDENCE_ENGINE_V2_VALIDATION_PASSED`.
