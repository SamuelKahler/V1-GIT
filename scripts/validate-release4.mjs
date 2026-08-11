import assert from "node:assert/strict";
import fs from "node:fs";
import {
    normalizePeriod,
    periodSummary
} from "../lib/mlb/evidence-engine.js";

function expectThrow(callback, pattern) {
    let thrown = null;
    try { callback(); } catch (error) { thrown = error; }
    assert.ok(thrown, "Expected callback to throw.");
    if (pattern) assert.match(String(thrown.message), pattern);
}

const f5 = periodSummary({
    sample_size: 20,
    wins: 12,
    losses: 8,
    f5_wins: 7,
    f5_losses: 3,
    f5_pushes: 2,
    hit_rate: 60,
    roi_percent: 8.4,
    average_completeness: 82
}, "F5");

assert.equal(f5.period, "F5");
assert.equal(f5.sample_size, 12);
assert.equal(f5.wins, 7);
assert.equal(f5.losses, 3);
assert.equal(f5.pushes, 2);
assert.equal(f5.hit_rate, 70);
assert.equal(f5.roi_percent, null);

const full = periodSummary({ sample_size: 10, wins: 6, losses: 4 }, "FULL_GAME");
assert.equal(full.period, "FULL_GAME");
assert.equal(full.wins, 6);

assert.equal(normalizePeriod("f5"), "F5");
assert.equal(normalizePeriod("full game"), "FULL_GAME");
expectThrow(() => normalizePeriod("first inning"), /FULL_GAME or F5/i);

const publicEndpoint = fs.readFileSync(new URL("../api/mlb.js", import.meta.url), "utf8");
assert.match(publicEndpoint, /CUSTOMER_READ_ONLY/);
assert.match(publicEndpoint, /publicEvidence: \{ method: "POST", admin: false \}/);

const browserClient = fs.readFileSync(new URL("../sports/mlb/core/mlb-intelligence-client.js", import.meta.url), "utf8");
assert.match(browserClient, /publicEvidence/);
assert.match(browserClient, /action: 'publicEvidence'/);

const app = fs.readFileSync(new URL("../sports/mlb/mlb-app.js", import.meta.url), "utf8");
assert.match(app, /Historical Evidence/);
assert.match(app, /No verified historical sample/);
assert.doesNotMatch(app, /Source: completed official MLB games stored/);
assert.doesNotMatch(app, /Calculated from individually graded wagers/);
assert.match(app, /loadVerifiedMLBEvidenceForPick\(p,i\)/);

console.log("RELEASE_4_VALIDATION_PASSED");
