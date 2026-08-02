import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeCriteria } from '../lib/mlb/query-engine.js';
import { LABELS } from '../lib/mlb/evidence-engine.js';

const app = fs.readFileSync(new URL('../sports/mlb/mlb-app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../sports/mlb/mlb.css', import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../supabase/migrations/006_evidence_engine_v2.sql', import.meta.url), 'utf8');

const normalized = normalizeCriteria({
  teamAbbreviation: 'cin',
  opponentAbbreviation: 'pit',
  role: 'home',
  f5Line: -0.5,
  dateFrom: '2026-01-01',
  dateTo: '2026-08-01',
  limit: 50
});
assert.equal(normalized.teamAbbreviation, 'CIN');
assert.equal(normalized.opponentAbbreviation, 'PIT');
assert.equal(normalized.role, 'HOME');
assert.equal(normalized.f5Line, -0.5);
assert.equal(LABELS.f5Line, 'Same first-five line');

assert.match(migration, /f5Line/);
assert.match(migration, /team_f5_score \+ x\.f5_line/);
assert.match(app, /Historical Evidence/);
assert.match(app, /Official Sports Edge F5/);
assert.doesNotMatch(app, /F5 evidence ends after five innings/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /Trend Database/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /Model Breakdown/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /Reasoning Notes/);
assert.match(css, /Evidence Engine V2/);

console.log('CUSTOMER_EXPERIENCE_REWRITE_V1_VALIDATION_PASSED');
