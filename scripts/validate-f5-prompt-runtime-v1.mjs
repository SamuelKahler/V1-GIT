import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseAuthoritativeF5Slate, normalizePromptWeights, enforcePromptRules, DEFAULT_PROMPT_WEIGHTS } from '../lib/mlb/f5-prompt-runtime.js';

const sample=`08/17\nBaltimore Orioles at Tampa Bay Rays\nTropicana Field\n3:05PM PST\nBrandon Young\nShane McClanahan\nBaltimore Orioles +.5 -110\nTampa Bay Rays -.5 -120\n\nMiami Marlins at Philadelphia Phillies\nCitizens Bank Park\n3:40PM PST\nJanson Junk\nCristopher Sanchez\nMiami Marlins +.5 +135`;
const slate=parseAuthoritativeF5Slate(sample);
assert.equal(slate.date,'2026-08-17');
assert.equal(slate.games.length,2);
assert.equal(slate.games[0].away,'BAL');
assert.equal(slate.games[0].home,'TB');
assert.equal(slate.games[0].sides.length,2);
assert.equal(slate.games[1].sides[0].team,'MIA');
assert.equal(Object.values(normalizePromptWeights(DEFAULT_PROMPT_WEIGHTS)).reduce((a,b)=>a+b,0),100);

const aiPayload={games:[{game_key:'BAL@TB',selected_team:'TB',category_scores:{sp_edge:8.5,opponent_run_suppression:8,f5_splits:7.5,park_weather:7,lineup_strength_certainty:7.5,travel_rest:7,market_inefficiency:8,home_plate_umpire:7},projected_f5_pct:65,weather_override:false,sp_volatility_triggered:true,bullish_indicators:['starter','suppression'],rationales:{},sources:[]},{game_key:'MIA@PHI',selected_team:'MIA',category_scores:{sp_edge:8,opponent_run_suppression:8,f5_splits:8,park_weather:8,lineup_strength_certainty:8,travel_rest:8,market_inefficiency:8,home_plate_umpire:8},projected_f5_pct:58,weather_override:false,sp_volatility_triggered:false,bullish_indicators:['starter'],rationales:{},sources:[]}]};
const result=enforcePromptRules({slate,aiPayload,weights:DEFAULT_PROMPT_WEIGHTS});
assert.equal(result.games.length,2);
assert.equal(result.games[0].categoryScores.sp_edge,8,'SP volatility cap must apply');
assert.ok(['TOP_PLAY','PASSED'].includes(result.games[0].decision));
assert.equal(result.games[1].price,135);
assert.ok(Number.isFinite(result.games[1].finalModelScore));

for (const file of ['api/f5-prompt-runtime.js','api/admin-f5-slate.js','supabase/migrations/017_f5_prompt_runtime_v1.sql','developer.html','developer-console.js','sports/mlb/mlb-app.js']) assert.ok(fs.existsSync(new URL(`../${file}`,import.meta.url)),`${file} missing`);
const app=fs.readFileSync(new URL('../sports/mlb/mlb-app.js',import.meta.url),'utf8');
for (const marker of ['SP Edge','Opponent Run Suppression','Lineup Strength & Certainty','Home Plate Umpire','/api/f5-prompt-runtime','Run My F5 Prompt']) assert.ok(app.includes(marker),`missing marker ${marker}`);
const migration=fs.readFileSync(new URL('../supabase/migrations/017_f5_prompt_runtime_v1.sql',import.meta.url),'utf8');
assert.ok(migration.includes('sports_edge_f5_slates'));
assert.ok(migration.includes('sports_edge_f5_prompt_runtime_audit'));
console.log('F5_PROMPT_RUNTIME_V1_VALIDATION_PASSED');
