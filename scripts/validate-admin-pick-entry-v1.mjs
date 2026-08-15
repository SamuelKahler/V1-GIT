import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseDailyImportPicks } from '../lib/mlb/daily-operations.js';

const migration = fs.readFileSync('supabase/migrations/014_admin_pick_entry_v1.sql','utf8');
const api = fs.readFileSync('api/admin-picks.js','utf8');
const dev = fs.readFileSync('developer-console.js','utf8');
const html = fs.readFileSync('developer.html','utf8');
const daily = fs.readFileSync('daily-import.js','utf8');
const bootstrap = fs.readFileSync('app-bootstrap.js','utf8');
const index = fs.readFileSync('index.html','utf8');

assert(migration.includes('create table if not exists public.sports_edge_picks'), 'sports_edge_picks table missing');
assert(migration.includes('sports_edge_pick_entry_audit'), 'pick entry audit missing');
assert(api.includes("mode === 'publicText'"), 'public canonical text mode missing');
assert(api.includes("action !== 'publish'") && api.includes("published: true"), 'publish action missing');
assert(api.includes('processPicks(picks, { persistRows: true })'), 'publish must immediately grade persisted picks');
assert(html.includes("id=\"pickEntryText\""), 'developer pick publisher textarea missing');
assert(dev.includes('previewPicks'), 'preview workflow missing');
assert(dev.includes('publishPicks'), 'publish workflow missing');
assert(daily.includes('SPORTS_EDGE_DAILY_IMPORT_READY'), 'async canonical pick loader missing');
assert(bootstrap.includes('SPORTS_EDGE_DAILY_IMPORT_READY'), 'bootstrap must wait for canonical picks');
assert(index.includes('app-bootstrap.js'), 'app bootstrap not wired');

const parsed = parseDailyImportPicks(`08/13\nF5 TEX -0.5 -120, .4U & LIVE\nBAL ML +125\nCLE / DET U8.5 -110\n\n08/14\nMIL ML -130, .25U`);
assert.equal(parsed.length, 4);
assert.equal(parsed[0].date, '2026-08-13');
assert.equal(parsed[0].hasExplicitUnits, true);
assert.equal(parsed[0].units, 0.4);
assert.equal(parsed[1].hasExplicitUnits, false);
assert.equal(parsed[2].rawPick, 'CLE / DET U8.5');
assert(parsed.every(row => /^SRC-DAILYIMPORTPICKS-[a-f0-9]{20}$/.test(row.id)), 'stable pick IDs are required');

console.log('ADMIN_PICK_ENTRY_V1_VALIDATION_PASSED');
