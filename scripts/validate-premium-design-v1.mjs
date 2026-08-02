import fs from 'node:fs';
const globalCss=fs.readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const mlbCss=fs.readFileSync(new URL('../sports/mlb/mlb.css',import.meta.url),'utf8');
const required=['PREMIUM DESIGN SYSTEM V1','--se-navy','--se-orange','--se-green'];
for(const token of required){if(!globalCss.includes(token))throw new Error(`Missing global design token: ${token}`)}
for(const token of ['PREMIUM DESIGN SYSTEM V1 — MLB CUSTOMER EXPERIENCE','verified-trend-card','exact-environment-card','decision-performance']){if(!mlbCss.includes(token))throw new Error(`Missing MLB design token: ${token}`)}
console.log('PREMIUM_DESIGN_SYSTEM_V1_VALIDATION_PASSED');
