import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('sports/mlb/mlb-app.js', 'utf8');
const customer = fs.readFileSync('lib/mlb/customer-intelligence.js', 'utf8');
const css = fs.readFileSync('sports/mlb/mlb.css', 'utf8');

assert.match(customer, /version: 'DECISION_ENGINE_V1'/);
assert.doesNotMatch(customer, /seasonBaseline:/);
assert.match(app, /Historical Evidence/);
assert.match(app, /No verified historical sample\./);
assert.doesNotMatch(app, /Every completed first-five result at this exact F5 line/);
assert.doesNotMatch(app, /Market-specific results only\. F5 evidence ends after five innings/);
assert.doesNotMatch(app, /Source: completed official MLB games stored in Sports Edge/);
assert.doesNotMatch(app, /Trend-Backed Plays/);
assert.doesNotMatch(app, /const proof = trendEvidenceCardSummary\(p\)/);
assert.match(app, /Official Sports Edge F5/);
assert.match(app, /View Evidence/);
assert.match(css, /Decision Engine V1: facts only/);
console.log('DECISION_ENGINE_V1_VALIDATION_PASSED');
