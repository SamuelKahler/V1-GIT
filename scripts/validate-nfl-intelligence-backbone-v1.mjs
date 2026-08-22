import fs from 'node:fs';

const required = [
  'supabase/migrations/018_nfl_intelligence_backbone_v1.sql',
  'api/nfl.js',
  'lib/nfl/intelligence.js',
  'sports/nfl/nfl-intelligence-client.js',
  'sports/nfl/nfl-app.js'
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
}
const sql = fs.readFileSync(required[0], 'utf8');
for (const marker of [
  'create schema if not exists nfl',
  'create table if not exists nfl.games',
  'create table if not exists nfl.team_game_facts',
  'create table if not exists nfl.player_game_stats',
  'create table if not exists nfl.market_history',
  'create table if not exists nfl.continuity_eras',
  'create table if not exists nfl.reference_win_trends',
  'create table if not exists nfl.reference_prop_observations',
  'sports_edge_nfl_backbone_audit',
  'sports_edge_nfl_reference_dashboard'
]) {
  if (!sql.toLowerCase().includes(marker.toLowerCase())) throw new Error(`Migration missing marker: ${marker}`);
}
if (/\b(drop table|truncate table|delete from mlb\.|alter table mlb\.)\b/i.test(sql)) throw new Error('NFL migration contains an MLB-destructive statement.');
const bootstrap = fs.readFileSync('app-bootstrap.js','utf8');
if (!bootstrap.includes('sports/nfl/nfl-intelligence-client.js')) throw new Error('NFL intelligence client is not bootstrapped.');
const app = fs.readFileSync('sports/nfl/nfl-app.js','utf8');
for (const marker of ['NFL Intelligence Backbone','Hottest Team Trends','Hottest Prop Profiles','sports-edge:nfl-backbone-ready']) {
  if (!app.includes(marker)) throw new Error(`NFL UI missing marker: ${marker}`);
}
console.log('NFL_INTELLIGENCE_BACKBONE_V1_VALIDATION_PASSED');
