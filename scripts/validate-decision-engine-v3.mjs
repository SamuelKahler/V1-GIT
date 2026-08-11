import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const app = read('sports/mlb/mlb-app.js');
const customer = read('lib/mlb/customer-intelligence.js');
const sql = read('supabase/migrations/011_decision_engine_v3_actionable_evidence.sql');
const css = read('sports/mlb/mlb.css');

const checks = [
  ['V3 release marker', customer.includes("version: 'DECISION_ENGINE_V3'")],
  ['No market-only ML environment', !sql.includes("('ML', x.period")],
  ['No market-only OVER environment', !sql.includes("('OVER', x.total_direction")],
  ['No market-only UNDER environment', !sql.includes("('UNDER', x.total_direction")],
  ['Previous game fallback', sql.includes('prior_game.previous_runs_scored') && sql.includes('prior_game.previous_runs_allowed')],
  ['Support threshold', sql.includes('minimum_hit_rate') && sql.includes('r.hit_rate,0)>=x.minimum_hit_rate')],
  ['Friendly previous-score labels', app.includes('Scored 10+ Runs Last Game') && app.includes('Allowed 0 Runs Last Game')],
  ['No match-type customer labels', !app.includes("const typeLabel = matchType === 'EXACT'")],
  ['Market-only filters', app.includes("new Set(['ML','OVER','UNDER'])")],
  ['Opponent inversion', customer.includes('invertOpponent')],
  ['Premium V3 styling', css.includes('Decision Engine V3 — actionable evidence presentation')],
  ['V3 audit function', sql.includes('sports_edge_mlb_decision_engine_v3_audit')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}
console.log('DECISION_ENGINE_V3_VALIDATION_PASSED');
