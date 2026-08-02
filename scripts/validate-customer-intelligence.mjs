import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildCustomerIntelligence } from '../lib/mlb/customer-intelligence.js';

const api = fs.readFileSync('api/mlb.js','utf8');
const client = fs.readFileSync('sports/mlb/core/mlb-intelligence-client.js','utf8');
const app = fs.readFileSync('sports/mlb/mlb-app.js','utf8');

assert.match(api, /customerIntelligence: \{ method: "POST", admin: false \}/);
assert.match(api, /buildCustomerIntelligence/);
assert.match(client, /async customerIntelligence/);
assert.match(client, /action: 'customerIntelligence'/);
assert.match(app, /client\.customerIntelligence/);
assert.match(app, /Verified Game Logs/);
assert.match(app, /Stored Trend Database/);
assert.match(app, /evidence\.filter\(row=>row\.evidenceType!=='GAME_LOG'\)/);
assert.equal(typeof buildCustomerIntelligence, 'function');
console.log('CUSTOMER_INTELLIGENCE_INTEGRATION_VALIDATION_PASSED');
