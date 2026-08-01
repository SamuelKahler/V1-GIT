import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync("supabase/migrations/004_release_a_ingestion_acceptance.sql", "utf8");
const endpoint = fs.readFileSync("api/mlb/release-a-test.js", "utf8");
const auditEndpoint = fs.readFileSync("api/mlb/release-a-audit.js", "utf8");
const adminPage = fs.readFileSync("release-a-admin.html", "utf8");

const requiredMigrationFragments = [
  "alter table mlb.game_innings add column if not exists away_hits",
  "delete from mlb.game_pitchers where game_id = v_game_id",
  "{weather,temperatureF}",
  "sports_edge_mlb_release_a_audit",
  "fiveInningGamesMissingF5",
  "duplicateGamePks"
];

for (const fragment of requiredMigrationFragments) {
  assert.ok(migration.includes(fragment), `Migration missing: ${fragment}`);
}

assert.ok(endpoint.includes("secondImportDidNotIncreaseCount"));
assert.ok(endpoint.includes("eligibleF5GamesComplete"));
assert.ok(endpoint.includes("sports_edge_mlb_release_a_audit"));
assert.ok(auditEndpoint.includes("requireAdmin"));
assert.ok(adminPage.includes("/api/mlb/release-a-test"));
assert.ok(adminPage.includes("x-sports-edge-admin-token"));

console.log("RELEASE_A_VALIDATION_PASSED");
