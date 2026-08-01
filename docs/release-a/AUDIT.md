# Release A build audit

Baseline: uploaded `V1-GIT-phase-2-mlb-database(1).zip`.

## Audit findings corrected

1. The transformer emits `weather.temperatureF`, but migration 002 read `weather.tempF`; temperature would therefore have been stored as null.
2. The transformer already normalized inning hits/errors, but the database discarded them.
3. Re-imports upserted pitcher associations without clearing stale roles.
4. Existing status/audit routes did not execute the required two-pass idempotency acceptance test.

## Local validations

- `npm run check`: passed
- `npm run validate:phase2a`: passed
- `npm run validate:release2a`: passed
- `npm run validate:release3`: passed
- `npm run validate:release4`: passed
- `npm run validate:release-a`: passed

The build environment could not resolve `statsapi.mlb.com`, so the live MLB/Supabase acceptance test must run from the Vercel Preview using `release-a-admin.html`.
