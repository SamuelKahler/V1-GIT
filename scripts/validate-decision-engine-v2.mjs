import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const sql = read('supabase/migrations/010_decision_engine_v2_ranked_evidence.sql');
const customer = read('lib/mlb/customer-intelligence.js');
const app = read('sports/mlb/mlb-app.js');
const css = read('sports/mlb/mlb.css');

assert(sql.includes("'EXACT'::text as match_type"), 'Exact evidence tier missing.');
assert(sql.includes("'TREND'::text as match_type"), 'Trend-only evidence tier missing.');
assert(sql.includes("'ENVIRONMENT'::text as match_type"), 'Environment-only evidence tier missing.');
assert(sql.includes("'DECISION_ENGINE_V2'"), 'Decision Engine V2 SQL marker missing.');
assert(sql.includes('sports_edge_mlb_decision_engine_v2_audit'), 'V2 audit RPC missing.');
assert(customer.includes("version: 'DECISION_ENGINE_V2'"), 'Customer adapter V2 marker missing.');
assert(customer.includes('matchType'), 'Customer adapter does not expose match type.');
assert(app.includes("market.market === 'TOTAL' ? ctx.away"), 'Totals are not assigned a primary team perspective.');
assert(app.includes("typeLabel = matchType === 'EXACT'"), 'Evidence tier labels missing from UI.');
assert(app.includes('No exact match. Strongest verified evidence is shown above.'), 'Supporting-evidence fallback message missing.');
assert(!app.includes('/\x08[OU]'), 'Control-character total regex remains.');
assert(css.includes('Decision Engine V2: ranked, readable evidence cards'), 'V2 evidence-card CSS missing.');

console.log('DECISION_ENGINE_V2_VALIDATION_PASSED');
