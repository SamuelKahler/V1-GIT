import assert from "node:assert/strict";
import fs from "node:fs";

const gateway = fs.readFileSync("api/mlb.js", "utf8");
const client = fs.readFileSync("sports/mlb/core/mlb-intelligence-client.js", "utf8");
const adminPage = fs.readFileSync("release-a-admin.html", "utf8");

assert.ok(gateway.includes('publicEvidence: { method: "POST", admin: false }'));
assert.ok(gateway.includes('releaseATest: { method: "POST", admin: true }'));
assert.ok(gateway.includes('case "import"'));
assert.ok(gateway.includes('case "query"'));
assert.ok(gateway.includes('case "evidence"'));
assert.ok(gateway.includes('case "releaseATest"'));
assert.ok(client.includes("action: 'publicEvidence'"));
assert.ok(client.includes("action: 'query'"));
assert.ok(client.includes("action: 'evidence'"));
assert.ok(adminPage.includes("action:'releaseATest'"));
assert.equal(fs.existsSync("api/mlb"), false);

const apiFiles = fs.readdirSync("api", { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"));
assert.ok(apiFiles.length <= 12, `Expected at most 12 top-level API functions, found ${apiFiles.length}.`);

console.log("API_CONSOLIDATION_VALIDATION_PASSED");
