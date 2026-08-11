import assert from 'node:assert/strict';
import fs from 'node:fs';

const daily=fs.readFileSync(new URL('../daily-import.js', import.meta.url),'utf8');
for(const date of ['08/02','08/01','07/31','07/30']) assert.ok(daily.includes(`\n${date}\n`),`missing ${date}`);
assert.ok(daily.includes('CWS ML +125 - DISREGARD'),'disregard marker missing');
assert.ok(daily.includes('F5 CIN -0.5 -120, .25U'),'official CIN F5 missing');
assert.ok(daily.includes('F5 HOU -0.5 +100, .3U'),'official HOU F5 missing');
assert.ok(daily.includes('F5 PHI -0.5 -105 NOW -120, .25U'),'official PHI F5 missing');

const db=fs.readFileSync(new URL('../sports/mlb/core/sports-edge-database.js', import.meta.url),'utf8');
assert.ok(db.includes('hasExplicitUnits:explicitUnits(row,rawPick)'),'database explicit-unit marker missing');
assert.ok(db.includes('hasExplicitUnits:row.hasExplicitUnits'),'F5 mapping explicit-unit marker missing');

const perf=fs.readFileSync(new URL('../sports/mlb/core/performance-engine.js', import.meta.url),'utf8');
assert.ok(perf.includes('row.hasExplicitUnits===true'),'performance engine is not filtering additions by explicit units');
assert.ok(perf.includes('AUTHORITATIVE_F5_SHEET_PLUS_EXPLICIT_UNIT_OFFICIAL_GRADES'),'official F5 policy missing');

const app=fs.readFileSync(new URL('../sports/mlb/mlb-app.js', import.meta.url),'utf8');
assert.ok(app.includes("window.SportsEdgePerformance.allF5()"),'F5 UI is not using stable official ledger');
assert.ok(app.includes("bettorCategory(p)==='First Five' && explicitUnitSize(p)"),'daily F5 additions are not explicit-unit only');

console.log('DAILY_PICKS_AND_F5_WORKFLOW_VALIDATION_PASSED');
