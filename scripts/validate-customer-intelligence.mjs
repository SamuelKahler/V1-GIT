import assert from "node:assert/strict";
import {
  SportsEdgeCustomerIntelligence,
  pickCriteria,
  presentationReport
} from "../lib/mlb/customer-intelligence.js";

const criteria = pickCriteria({
  teamAbbreviation: "mil",
  role: "HOME",
  favorite: true,
  period: "F5",
  seriesGameNumber: 2
});
assert.equal(criteria.teamAbbreviation, "MIL");
assert.equal(criteria.period, "F5");
assert.equal(criteria.seriesGameNumber, 2);

assert.throws(() => pickCriteria({ role: "HOME" }), /team is required/i);

const raw = {
  period: "FULL_GAME",
  exactMatch: {
    exactnessPercent: 100,
    summary: { wins: 2, losses: 1, pushes: 0, sample_size: 3, hit_rate: 66.67 }
  },
  bestQualified: {
    exactnessPercent: 80,
    evidenceScore: 71,
    removedConditions: ["Same odds bucket"],
    supportingGames: [{ game_pk: 1 }],
    summary: {
      wins: 8,
      losses: 4,
      pushes: 0,
      sample_size: 12,
      hit_rate: 66.67,
      roi_percent: 8.5,
      average_completeness: 91
    }
  },
  strongestReasons: [{ key: "role", label: "Same home/away role" }],
  contradictingEvidence: { losses: 4, statement: "4 losses matched." },
  exactEnvironmentMatchDetails: [{ key: "role", label: "Same home/away role" }],
  generatedAt: "2026-08-02T00:00:00.000Z"
};
const presented = presentationReport(raw);
assert.equal(presented.headline.sampleSize, 12);
assert.equal(presented.verifiedGameLogs.supportingGames.length, 1);
assert.equal(presented.disclosure.gameLogsAreSportsEdgePicks, false);
assert.equal(presented.disclosure.importedTrendsIncluded, false);

const fakeEngine = { async report(received) { assert.equal(received.teamAbbreviation, "MIL"); return raw; } };
const engine = new SportsEdgeCustomerIntelligence(fakeEngine);
const report = await engine.report({ teamAbbreviation: "MIL", role: "HOME" });
assert.equal(report.headline.evidenceScore, 71);
assert.equal(report.criteria.teamAbbreviation, "MIL");

console.log("CUSTOMER_INTELLIGENCE_VALIDATION_PASSED");
