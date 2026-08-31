import fs from 'node:fs';
const src=fs.readFileSync('sports/mlb/mlb-app.js','utf8');
function assert(v,m){if(!v)throw new Error(m)}
assert(src.includes("replace(/^\\s*TIER\\s*[123]\\s*\\|\\s*/i,''"), 'Tier prefix normalization missing from cleanPickTitle.');
assert(src.includes("const f5 = title.match(/^F5\\s+([A-Z']+)/);"), 'F5 selected-team parser missing.');
assert(src.includes("if(/^F5\\b/.test(title)) return {period:'F5',market:'SIDE'};"), 'F5 evidence market parser missing.');
assert(src.includes('function mlbEvidenceCriteriaForPick(p){'), 'MLB evidence criteria builder missing.');
console.log('MLB_TIER_EVIDENCE_RECOVERY_V1_VALIDATION_PASSED');
