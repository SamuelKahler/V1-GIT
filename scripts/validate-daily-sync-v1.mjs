import fs from 'node:fs';
const files = [
  'daily-import.js','api/mlb.js','lib/mlb/supabase.js','sports/mlb/core/mlb-intelligence-client.js','sports/mlb/mlb-app.js','vercel.json','supabase/migrations/012_daily_sync_freshness_audit.sql'
];
for (const file of files) if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
const daily = fs.readFileSync('daily-import.js','utf8');
for (const date of ['08/03','08/04','08/05','08/07','08/08','08/10','08/11']) if (!daily.includes(date)) throw new Error(`Missing daily picks ${date}`);
if (!daily.includes('F5 BAL +0.5 -125, .4U')) throw new Error('Missing official F5 BAL play');
if (!daily.includes('F5 SD -0.5 +115, .6U')) throw new Error('Missing official F5 SD play');
if (!daily.includes('F5 BOS -0.5 +130, .65U')) throw new Error('Missing official F5 BOS play');
const api = fs.readFileSync('api/mlb.js','utf8');
if (!api.includes('cronSync') || !api.includes('syncRange')) throw new Error('Missing sync actions');
const vercel = JSON.parse(fs.readFileSync('vercel.json','utf8'));
if (!Array.isArray(vercel.crons) || !vercel.crons.length) throw new Error('Missing cron');
const client = fs.readFileSync('sports/mlb/core/mlb-intelligence-client.js','utf8');
if (!client.includes('attempt <= 3')) throw new Error('Missing evidence retry');
console.log('DAILY_SYNC_V1_VALIDATION_PASSED');
