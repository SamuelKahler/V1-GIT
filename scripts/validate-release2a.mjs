import assert from "node:assert/strict";
import {
    MAX_ENVIRONMENT_DAYS,
    validateEnvironmentRange
} from "../lib/mlb/environment-engine.js";
import {
    MAX_SUPPORTING_GAMES,
    normalizeCriteria
} from "../lib/mlb/query-engine.js";

function expectThrow(callback, pattern) {
    let error = null;
    try { callback(); } catch (caught) { error = caught; }
    assert.ok(error, "Expected callback to throw.");
    if (pattern) assert.match(error.message, pattern);
}

const tests = [
    ["environment range accepts a season-sized request", () => {
        const range = validateEnvironmentRange("2026-03-25", "2026-09-27");
        assert.equal(range.startDate, "2026-03-25");
        assert.ok(range.dayCount <= MAX_ENVIRONMENT_DAYS);
    }],
    ["environment range rejects reversed dates", () => {
        expectThrow(() => validateEnvironmentRange("2026-09-01", "2026-08-01"), /cannot be after/i);
    }],
    ["query criteria normalizes customer-facing filters", () => {
        const result = normalizeCriteria({
            teamAbbreviation: "mil",
            role: "home",
            favorite: true,
            pitcherHand: "r",
            previousResult: "win",
            previousRunsScoredMin: 5,
            restAdvantage: true,
            minimumCompleteness: 75,
            limit: 38
        });
        assert.deepEqual(result, {
            teamAbbreviation: "MIL",
            role: "HOME",
            favorite: true,
            pitcherHand: "R",
            previousResult: "WIN",
            previousRunsScoredMin: 5,
            restAdvantage: true,
            minimumCompleteness: 75,
            limit: 38
        });
    }],
    ["query criteria rejects contradictory favorite status", () => {
        expectThrow(() => normalizeCriteria({ favorite: true, underdog: true }), /both favorite and underdog/i);
    }],
    ["query criteria caps supporting games", () => {
        expectThrow(() => normalizeCriteria({ limit: MAX_SUPPORTING_GAMES + 1 }), /no greater than/i);
    }],
    ["query criteria validates range bounds", () => {
        expectThrow(() => normalizeCriteria({ previousRunsScoredMin: 6, previousRunsScoredMax: 4 }), /cannot exceed/i);
    }],
    ["query criteria validates dates", () => {
        expectThrow(() => normalizeCriteria({ dateFrom: "2026-08-01", dateTo: "2026-07-01" }), /cannot be after/i);
    }]
];

let failed = false;
for (const [name, fn] of tests) {
    try {
        await fn();
        console.log(`PASS: ${name}`);
    } catch (error) {
        failed = true;
        console.error(`FAIL: ${name}`);
        console.error(error);
    }
}

if (failed) {
    console.error("RELEASE_2A_VALIDATION_FAILED");
    process.exitCode = 1;
} else {
    console.log("RELEASE_2A_VALIDATION_PASSED");
}
