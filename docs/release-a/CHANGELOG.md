# Release A changelog

## Added

- one-click Preview acceptance-test page;
- protected two-pass import test endpoint;
- protected date-range ingestion audit endpoint;
- database acceptance-audit RPC;
- inning hits and errors storage;
- weather wind speed and source storage;
- deterministic Release A validation script.

## Fixed

- corrected the weather temperature payload path from `weather.tempF` to `weather.temperatureF`;
- game-pitcher rows are refreshed on re-import so stale probable-starter associations do not accumulate;
- inning re-imports now retain runs, hits and errors.

## Preserved

- existing customer interface;
- Sports Edge picks and grading pipeline;
- all current tabs and navigation;
- separation between Sports Edge performance and MLB historical evidence.
