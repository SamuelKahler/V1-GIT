import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const db = read('sports/mlb/core/sports-edge-database.js');
const api = read('api/intelligence-sync.js');
const recent = read('sports/mlb/core/recent-results.js');
const app = read('sports/mlb/mlb-app.js');
const sql = read('supabase/migrations/016_canonical_grade_hydration_v1.sql');

assert(db.includes('function gradeIdentity'), 'canonical grade identity fallback missing');
assert(db.includes('canonicalRows(state.observations'), 'canonical payload/display dedupe missing');
assert(api.includes('sports_edge_pick_grade_canonical'), 'stored grades must read canonical grade view');
assert(!api.includes("pick_id=like.SRC-DAILYIMPORTPICKS-*"), 'legacy source-id-only hydration filter still present');
assert(api.includes('if(persistRows) requireAdmin(req);'), 'browser persistence must be admin protected');
assert(recent.includes('recentSync(from,false)'), 'public browser must not persist duplicate grading rows');
assert(recent.includes('syncAll(false)'), 'public full sync must be preview-only');
assert(app.includes('refreshCoreDailyPicks'), 'MLB app must refresh pick snapshots after grade hydration');
assert(app.includes("['WIN','LOSS','PUSH','VOID'].includes(canonical)"), 'customer status must honor persisted canonical grade');
assert(sql.includes('sports_edge_pick_grade_canonical'), 'canonical grade SQL view missing');
assert(sql.includes('sports_edge_grade_hydration_audit'), 'grade hydration audit missing');

console.log('CANONICAL_GRADE_HYDRATION_V1_VALIDATION_PASSED');
