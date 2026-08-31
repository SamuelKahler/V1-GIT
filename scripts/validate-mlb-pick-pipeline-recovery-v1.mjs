import fs from 'node:fs';
import assert from 'node:assert/strict';

const daily = fs.readFileSync('daily-import.js','utf8');
const ops = fs.readFileSync('lib/mlb/daily-operations.js','utf8');
const api = fs.readFileSync('api/admin-picks.js','utf8');
const dev = fs.readFileSync('developer-console.js','utf8');
const html = fs.readFileSync('developer.html','utf8');
const bootstrap = fs.readFileSync('app-bootstrap.js','utf8');

assert.match(daily,/08\/16\s+F5 TOR -0\.5 \+110/,'Known Aug 16 recovery fallback missing');
assert.match(daily,/08\/15\s+PIT ML -102/,'Known Aug 15 recovery fallback missing');
assert.match(ops,/loadObservationBackedPicks/,'Observation-backed pick recovery missing');
assert.match(ops,/PICK_OBSERVATION_RECOVERY/,'Recovery source marker missing');
assert.match(api,/MLB_PICK_PIPELINE_RECOVERY_V1/,'Pick pipeline audit missing');
assert.match(api,/mode === 'audit'/,'Admin pick audit route missing');
assert.match(dev,/auditPickPipeline/,'Developer pick audit handler missing');
assert.match(html,/Pick Pipeline Audit/,'Developer pick audit control missing');
assert.match(bootstrap,/SPORTS_EDGE_DAILY_IMPORT_READY/,'Bootstrap does not await canonical pick hydration');
console.log('MLB_PICK_PIPELINE_RECOVERY_V1_VALIDATION_PASSED');
