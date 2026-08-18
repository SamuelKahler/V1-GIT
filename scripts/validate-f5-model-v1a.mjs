import fs from 'node:fs';

const app = fs.readFileSync('sports/mlb/mlb-app.js','utf8');
const html = fs.readFileSync('index.html','utf8');
const api = fs.readFileSync('api/f5-model.js','utf8');
const engine = fs.readFileSync('lib/mlb/f5-model-engine.js','utf8');
const sql = fs.readFileSync('supabase/migrations/015_custom_f5_model_engine_v1a.sql','utf8');
const css = fs.readFileSync('styles.css','utf8');

const checks = [
  [html.includes('id="runF5Model"'), 'Run My F5 Model button'],
  [app.includes("fetch('/api/f5-model'"), 'browser model API integration'],
  [engine.includes('DEFAULT_F5_WEIGHTS'), 'server-owned default weights'],
  [engine.includes('Model weights must total 100%'), '100 percent weight guardrail'],
  [engine.includes('americanImpliedProbability'), 'market implied probability'],
  [engine.includes('sports_edge_f5_factor_snapshot'), 'Supabase factor snapshot'],
  [sql.includes('Starting Pitcher History'), 'starter factor'],
  [sql.includes('Opponent Early Offense'), 'opponent early offense factor'],
  [sql.includes('Recent F5 Form'), 'recent F5 factor'],
  [sql.includes("'CUSTOM_F5_MODEL_ENGINE_V1A'"), 'audit release marker'],
  [css.includes('.custom-model-result-card'), 'customer result card styling'],
  [app.includes('This is not yet a statistically calibrated probability model.'), 'calibration disclosure']
];

const failed = checks.filter(([ok])=>!ok).map(([,name])=>name);
if(failed.length){
  console.error('F5_MODEL_V1A_VALIDATION_FAILED:', failed.join(', '));
  process.exit(1);
}
console.log('CUSTOM_F5_MODEL_ENGINE_V1A_VALIDATION_PASSED');
