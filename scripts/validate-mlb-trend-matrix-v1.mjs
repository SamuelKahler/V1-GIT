import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const sql = read('supabase/migrations/009_mlb_trend_matrix_engine.sql');
const customer = read('lib/mlb/customer-intelligence.js');
const query = read('lib/mlb/query-engine.js');
const app = read('sports/mlb/mlb-app.js');
const css = read('sports/mlb/mlb.css');

const categories = ['1-DAY REST','AFTER A LOSS','AFTER A WIN','AWAY','AWAY FAVORITE','AWAY UNDERDOG','DIVISION','HOME FAVORITE','HOME UNDERDOG'];
const environments = ['PREV_ALLOWED 0','PREV_ALLOWED 10+','PREV_SCRD 0','PREV_SCRD 10+','10+','SWEEP','AtS','ML','OVER','UNDER'];

assert(sql.includes('sports_edge_mlb_trend_matrix'), 'Trend matrix RPC is missing.');
assert(sql.includes('sports_edge_mlb_trend_matrix_audit'), 'Trend matrix audit RPC is missing.');
for (const value of categories) assert(sql.includes(`'${value}'`), `Missing trend category: ${value}`);
for (const value of environments) assert(sql.includes(`'${value}'`), `Missing environment tag: ${value}`);
assert(sql.includes("x.period='F5'"), 'F5 market isolation is missing.');
assert(sql.includes("x.market in ('ML','MONEYLINE')"), 'Moneyline market isolation is missing.');
assert(sql.includes("x.market in ('TOTAL','TOTALS')"), 'Total market isolation is missing.');
assert(query.includes('async trendMatrix'), 'Query engine trendMatrix method is missing.');
assert(customer.includes('normalizeMatrixTrend'), 'Customer adapter does not normalize matrix trends.');
assert(customer.includes('selectedMatrix'), 'Selected-side trend matrix is missing.');
assert(customer.includes('opponentMatrix'), 'Opponent trend matrix is missing.');
assert(app.includes('trend-category'), 'Trend category presentation is missing.');
assert(app.includes('trend-environment'), 'Trend environment presentation is missing.');
assert(app.includes('minimumSample: 3'), 'Trend minimum sample is not explicit.');
assert(!app.includes('30-2858 games'), 'Concatenated record/sample regression found.');
assert(css.includes('.trend-card-record b'), 'Separated record/sample styling is missing.');

console.log('MLB_TREND_MATRIX_V1_VALIDATION_PASSED');
