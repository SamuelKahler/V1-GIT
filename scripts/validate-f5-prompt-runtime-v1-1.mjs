import assert from 'node:assert/strict';
import fs from 'node:fs';
import { enforcePromptRules, DEFAULT_PROMPT_WEIGHTS } from '../lib/mlb/f5-prompt-runtime.js';

const slate={date:'2026-08-17',games:[
  {id:'g1',away:'TOR',home:'NYY',venue:'Test',firstPitch:'4:00 PM',sides:[{team:'TOR',line:-0.5,odds:110},{team:'NYY',line:0.5,odds:-130}]},
  {id:'g2',away:'MIA',home:'PHI',venue:'Test',firstPitch:'4:00 PM',sides:[{team:'MIA',line:-0.5,odds:110},{team:'PHI',line:0.5,odds:-125}]},
  {id:'g3',away:'KC',home:'LAA',venue:'Test',firstPitch:'4:00 PM',sides:[{team:'KC',line:-0.5,odds:110},{team:'LAA',line:0.5,odds:-120}]}
]};
const baseScores={sp_edge:7.5,opponent_run_suppression:7,f5_splits:7,park_weather:6.5,lineup_strength_certainty:7,travel_rest:6.5,market_inefficiency:7,home_plate_umpire:6};
const aiPayload={games:[
  {game_key:'TOR@NYY',selected_team:'TOR',candidate_team:'TOR',category_scores:baseScores,projected_f5_pct:57.5,weather_override:false,sp_volatility_triggered:false,rationales:{}},
  {game_key:'MIA@PHI',selected_team:'MIA',candidate_team:'MIA',category_scores:{...baseScores,sp_edge:6.7},projected_f5_pct:53,weather_override:false,sp_volatility_triggered:false,rationales:{}},
  {game_key:'KC@LAA',selected_team:'NO_PLAY',candidate_team:'KC',no_play:true,no_play_reason:'Research uncertainty.',category_scores:{...baseScores,sp_edge:6},projected_f5_pct:52,weather_override:false,sp_volatility_triggered:false,rationales:{}}
]};
const out=enforcePromptRules({slate,aiPayload,weights:DEFAULT_PROMPT_WEIGHTS,history:{}});
assert.equal(out.games.length,3);
assert.ok(Array.isArray(out.nearMisses));
assert.ok(Array.isArray(out.passFades));
assert.ok(out.slateDiagnosis && typeof out.slateDiagnosis.headline==='string');
assert.ok(out.games.every(g=>Array.isArray(g.verifiedEvidence)));
assert.ok(out.games.some(g=>Array.isArray(g.failedGates)));

const ui=fs.readFileSync(new URL('../sports/mlb/mlb-app.js',import.meta.url),'utf8');
for(const marker of ['Today’s Model Read','Near Misses — missed exactly one core gate','Verified historical support','One run = complete slate intelligence','failedGateHtml']) assert.ok(ui.includes(marker),`Missing UI marker: ${marker}`);
const css=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
for(const marker of ['.model-slate-read','.near-miss-card','.model-evidence-grid','.model-gate-list']) assert.ok(css.includes(marker),`Missing CSS marker: ${marker}`);
console.log('F5_PROMPT_RUNTIME_V1_1_FULL_SLATE_INTELLIGENCE_VALIDATION_PASSED');
