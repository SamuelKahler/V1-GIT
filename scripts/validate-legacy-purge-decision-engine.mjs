import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync(new URL('../sports/mlb/mlb-app.js', import.meta.url), 'utf8');
const customer = fs.readFileSync(new URL('../lib/mlb/customer-intelligence.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../sports/mlb/mlb.css', import.meta.url), 'utf8');

assert.match(app, /function customerEvidenceCardSummary\(_p\)\{\s*return '';\s*\}/);
assert.doesNotMatch(app, /\$\{customerEvidenceCardSummary\(p\)\}/);
assert.match(app, /Verified Trends/);
assert.match(app, /Exact Environment/);
assert.match(app, /decision-engine-v2/);
assert.doesNotMatch(app, /Every completed first-five result at this exact F5 line/);
assert.doesNotMatch(app, /Market-specific results only\. F5 evidence ends after five innings/);
assert.match(customer, /trendSignals/);
assert.match(customer, /opponentTrendDefinitions/);
assert.match(customer, /sampleSize < 3/);
assert.match(css, /verified-trend-card/);
assert.match(css, /environment-match-strip\.vibrant/);

console.log('LEGACY_PURGE_DECISION_ENGINE_VALIDATION_PASSED');
