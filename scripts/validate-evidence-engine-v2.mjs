import assert from 'node:assert/strict';
import fs from 'node:fs';
import { normalizeCriteria } from '../lib/mlb/query-engine.js';
import { periodSummary } from '../lib/mlb/evidence-engine.js';

const app = fs.readFileSync('sports/mlb/mlb-app.js','utf8');
const customer = fs.readFileSync('lib/mlb/customer-intelligence.js','utf8');
const migration = fs.readFileSync('supabase/migrations/006_evidence_engine_v2.sql','utf8');

const f5 = normalizeCriteria({teamAbbreviation:'CIN', opponentAbbreviation:'PIT', role:'HOME', f5Line:-0.5});
assert.equal(f5.f5Line,-0.5);
const summary = periodSummary({f5_wins:8,f5_losses:2,f5_pushes:0},'F5');
assert.equal(summary.wins,8);
assert.equal(summary.losses,2);
assert.equal(summary.hit_rate,80);
assert.doesNotMatch(customer,/seasonBaseline/);
assert.match(customer,/DECISION_ENGINE_V1/);
assert.match(migration,/when \(p\.team_f5_score \+ x\.f5_line\) > p\.opponent_f5_score then 'WIN'/);
assert.doesNotMatch(app,/Market-specific results only/);
assert.doesNotMatch(app,/Legacy spreadsheet trends are not used/);
assert.match(app,/Historical Evidence/);
assert.doesNotMatch(app.slice(app.indexOf('function openPick'), app.indexOf('// V57 Unified MLB Truth Engine')), /trendEvidenceHtml/);
console.log('EVIDENCE_ENGINE_V2_VALIDATION_PASSED');
