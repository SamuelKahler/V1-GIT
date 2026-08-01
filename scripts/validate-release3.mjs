import assert from "node:assert/strict";
import {
    buildQualifiedVariants,
    contradictionSummary,
    matchedDetails,
    rankQualifiedResults,
    scoreEvidence
} from "../lib/mlb/evidence-engine.js";

const criteria = {
    teamAbbreviation: "MIL",
    role: "HOME",
    favorite: true,
    oddsBucket: "-105 to -120",
    divisionGame: true,
    pitcherHand: "L",
    limit: 100
};

const variants = buildQualifiedVariants(criteria, 6);
assert.equal(variants[0].name, "Exact environment match");
assert.deepEqual(variants[0].removed, []);
assert.ok(variants.length > 1);
assert.ok(!("limit" in Object.fromEntries(matchedDetails(criteria).map((row) => [row.key, row.value]))));

const strong = scoreEvidence({
    sample_size: 38,
    hit_rate: 68.42,
    roi_percent: 11.7,
    average_completeness: 94
}, 100);
const weak = scoreEvidence({
    sample_size: 4,
    hit_rate: 75,
    roi_percent: null,
    average_completeness: 55
}, 60);
assert.ok(strong.score > weak.score);
assert.ok(strong.score <= 100);

const contradiction = contradictionSummary({ wins: 26, losses: 12, pushes: 0 });
assert.equal(contradiction.losses, 12);
assert.equal(contradiction.contradictionRate, 31.58);

const ranked = rankQualifiedResults([
    { evidenceScore: 95, exactnessPercent: 100, summary: { sample_size: 4 } },
    { evidenceScore: 80, exactnessPercent: 85, summary: { sample_size: 30 } }
], 10);
assert.equal(ranked[0].summary.sample_size, 30);

console.log("RELEASE_3_VALIDATION_PASSED");
