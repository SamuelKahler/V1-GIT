import fs from 'node:fs';
import assert from 'node:assert/strict';
import { normalizeWeights } from '../lib/mlb/f5-model-engine.js';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../sports/mlb/mlb-app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const requiredHtml = [
  'id="modelLabLauncher"',
  'id="modelLabSidebar"',
  'id="sidebarF5Weights"',
  'id="sidebarRunF5Model"',
  'id="modelAutoBalance"',
  'data-model-preset="pitching"',
  'data-model-preset="form"',
  'data-model-preset="market"'
];
for (const marker of requiredHtml) assert.ok(html.includes(marker), `Missing sidebar marker: ${marker}`);

const requiredApp = [
  'function rebalanceModelWeights',
  'function setModelWeight',
  'function normalizedModelWeights',
  'function initModelSidebar',
  "localStorage.setItem(MODEL_WEIGHT_STORAGE_KEY",
  "min=\"0\" max=\"100\" step=\"1\"",
  'Run My F5 Model'
];
for (const marker of requiredApp) assert.ok(app.includes(marker), `Missing model behavior: ${marker}`);

assert.ok(css.includes('.model-lab-sidebar'), 'Missing persistent sidebar CSS');
assert.ok(css.includes('.weight-value-control'), 'Missing direct weight input CSS');
assert.ok(css.includes('.model-lab-launcher'), 'Missing floating Model Lab launcher CSS');

const wide = normalizeWeights({
  starter_history: 80,
  opponent_early_offense: 5,
  team_f5_split: 5,
  recent_f5_form: 5,
  matchup_history: 2,
  situation_match: 1,
  rest_location: 1,
  market_baseline: 1
});
assert.equal(wide.starter_history, 80, 'Backend must accept a factor above the old 60% ceiling');
assert.equal(Object.values(wide).reduce((a,b)=>a+b,0), 100, 'Wide weights must still total 100%');

let failed = false;
try {
  normalizeWeights({starter_history:101,opponent_early_offense:0,team_f5_split:0,recent_f5_form:0,matchup_history:0,situation_match:0,rest_location:0,market_baseline:-1});
} catch { failed = true; }
assert.equal(failed, true, 'Weights outside 0-100 must still be rejected');

console.log('CUSTOM_F5_MODEL_ENGINE_V1B_VALIDATION_PASSED');
