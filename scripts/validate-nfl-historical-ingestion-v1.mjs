import fs from 'node:fs';
import assert from 'node:assert/strict';
import { normalizeGame, parseCsv } from '../lib/nfl/historical-ingestion.js';

const requiredFiles = [
  'lib/nfl/historical-ingestion.js',
  'supabase/migrations/019_nfl_historical_game_ingestion_v1.sql',
  'api/nfl.js',
  'developer.html',
  'developer-console.js'
];
for (const file of requiredFiles) assert.ok(fs.existsSync(file), `${file} missing`);

const rows = parseCsv('game_id,season,game_type,week,gameday,weekday,gametime,away_team,away_score,home_team,home_score,spread_line,total_line,away_moneyline,home_moneyline,away_rest,home_rest,div_game,stadium,away_qb_name,home_qb_name\n2023_01_DET_KC,2023,REG,1,2023-09-07,Thursday,20:20,DET,21,KC,20,4.5,53,+180,-210,7,7,0,Arrowhead Stadium,Jared Goff,Patrick Mahomes\n');
assert.equal(rows.length, 1);
const game = normalizeGame(rows[0]);
assert.equal(game.externalGameId, '2023_01_DET_KC');
assert.equal(game.awayTeam, 'DET');
assert.equal(game.homeTeam, 'KC');
assert.equal(game.status, 'FINAL');
assert.equal(game.spreadLine, 4.5);
assert.equal(game.primetime, true);

const migration = fs.readFileSync('supabase/migrations/019_nfl_historical_game_ingestion_v1.sql','utf8');
for (const token of [
  'sports_edge_nfl_import_schedule_batch',
  'sports_edge_nfl_rebuild_team_game_facts',
  'sports_edge_nfl_historical_ingestion_audit',
  'AFTER A WIN',
  'AFTER A COVER',
  'AFTER AN OVER',
  'REST ADVANTAGE'
]) assert.ok(migration.includes(token), `migration missing ${token}`);

const api = fs.readFileSync('api/nfl.js','utf8');
assert.ok(api.includes('importSchedules'));
assert.ok(api.includes('historicalAudit'));
const dev = fs.readFileSync('developer.html','utf8');
assert.ok(dev.includes('NFL Historical Game Ingestion'));
assert.ok(dev.includes('2023,2024,2025,2026'));

console.log('NFL_HISTORICAL_GAME_INGESTION_V1_VALIDATION_PASSED');
