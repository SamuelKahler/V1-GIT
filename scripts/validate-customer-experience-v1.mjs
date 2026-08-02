import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeCriteria } from '../lib/mlb/query-engine.js';
import { LABELS } from '../lib/mlb/evidence-engine.js';

const app = fs.readFileSync(new URL('../sports/mlb/mlb-app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../sports/mlb/mlb.css', import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../supabase/migrations/005_customer_experience_v1.sql', import.meta.url), 'utf8');

const normalized = normalizeCriteria({
  teamAbbreviation: 'hou',
  opponentAbbreviation: 'tex',
  role: 'home',
  seriesGameNumber: 3,
  dayNight: 'night',
  limit: 50
});
assert.equal(normalized.teamAbbreviation, 'HOU');
assert.equal(normalized.opponentAbbreviation, 'TEX');
assert.equal(normalized.role, 'HOME');
assert.equal(LABELS.opponentAbbreviation, 'Same opponent');

assert.match(migration, /opponentAbbreviation/);
assert.match(migration, /p\.opponent_abbreviation/);
assert.match(app, /Exact Historical Evidence/);
assert.match(app, /Trend Database', trendEvidenceHtml\(p\), true/);
assert.match(app, /Sports Edge F5 Performance/);
assert.match(app, /No completed MLB games currently matches|No completed game currently matches/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /Model Breakdown/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /Reasoning Notes/);
assert.match(css, /Customer Experience Rewrite V1/);

console.log('CUSTOMER_EXPERIENCE_REWRITE_V1_VALIDATION_PASSED');
