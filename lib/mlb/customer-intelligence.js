import sportsEdgeEvidenceEngine from "./evidence-engine.js";

const ALLOWED_PERIODS = new Set(["FULL_GAME", "F5"]);
const CRITERIA_FIELDS = Object.freeze([
    "teamId",
    "teamAbbreviation",
    "role",
    "favorite",
    "underdog",
    "divisionGame",
    "interleagueGame",
    "seriesGameNumber",
    "dayNight",
    "pitcherHand",
    "opponentPitcherHand",
    "previousResult",
    "previousRunsScoredMin",
    "previousRunsScoredMax",
    "previousRunsAllowedMin",
    "previousRunsAllowedMax",
    "restDaysMin",
    "restDaysMax",
    "restAdvantage",
    "oddsBucket",
    "totalBucket",
    "minimumCompleteness",
    "dateFrom",
    "dateTo"
]);

function customerError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function cleanText(value) {
    const text = String(value ?? "").trim();
    return text || null;
}

function normalizePeriod(value) {
    const period = String(value || "FULL_GAME").trim().toUpperCase().replace(/\s+/g, "_");
    if (!ALLOWED_PERIODS.has(period)) {
        throw customerError("period must be FULL_GAME or F5.");
    }
    return period;
}

function pickCriteria(input = {}) {
    if (!input || Array.isArray(input) || typeof input !== "object") {
        throw customerError("Customer intelligence input must be an object.");
    }

    const source = input.criteria && typeof input.criteria === "object"
        ? input.criteria
        : input;
    const criteria = {};

    for (const field of CRITERIA_FIELDS) {
        if (source[field] !== undefined && source[field] !== null && source[field] !== "") {
            criteria[field] = source[field];
        }
    }

    const teamAbbreviation = cleanText(criteria.teamAbbreviation);
    if (teamAbbreviation) criteria.teamAbbreviation = teamAbbreviation.toUpperCase();

    if (!criteria.teamId && !criteria.teamAbbreviation) {
        throw customerError("A team is required for customer intelligence.");
    }

    criteria.period = normalizePeriod(input.period || source.period);
    return criteria;
}

function metric(value, fallback = null) {
    return value === undefined || value === null || value === "" ? fallback : value;
}

function presentationReport(report) {
    const exact = report?.exactMatch || {};
    const best = report?.bestQualified || exact;
    const bestSummary = best?.summary || {};
    const exactSummary = exact?.summary || {};

    return {
        headline: {
            label: "Best Qualified Hit Rate",
            hitRate: metric(bestSummary.hit_rate),
            wins: Number(bestSummary.wins || 0),
            losses: Number(bestSummary.losses || 0),
            pushes: Number(bestSummary.pushes || 0),
            sampleSize: Number(bestSummary.sample_size || 0),
            roiPercent: metric(bestSummary.roi_percent),
            evidenceScore: Number(best?.evidenceScore || 0)
        },
        exactMatch: {
            hitRate: metric(exactSummary.hit_rate),
            wins: Number(exactSummary.wins || 0),
            losses: Number(exactSummary.losses || 0),
            pushes: Number(exactSummary.pushes || 0),
            sampleSize: Number(exactSummary.sample_size || 0),
            exactnessPercent: Number(exact?.exactnessPercent ?? 100)
        },
        verifiedGameLogs: {
            source: "MLB_INTELLIGENCE_GAME_LOGS",
            period: report?.period || "FULL_GAME",
            supportingGames: Array.isArray(best?.supportingGames) ? best.supportingGames : [],
            matchedConditions: Array.isArray(report?.strongestReasons) ? report.strongestReasons : [],
            removedConditions: Array.isArray(best?.removedConditions) ? best.removedConditions : [],
            dataCompleteness: metric(bestSummary.average_completeness),
            environmentMatchPercent: Number(best?.exactnessPercent || 0)
        },
        strongestReasons: Array.isArray(report?.strongestReasons) ? report.strongestReasons : [],
        contradictingEvidence: report?.contradictingEvidence || {
            losses: 0,
            pushes: 0,
            contradictionRate: null,
            statement: "No contradiction summary is available."
        },
        exactEnvironmentMatchDetails: Array.isArray(report?.exactEnvironmentMatchDetails)
            ? report.exactEnvironmentMatchDetails
            : [],
        qualifiedAlternatives: Array.isArray(report?.qualifiedAlternatives)
            ? report.qualifiedAlternatives.map((entry) => ({
                name: entry.name,
                hitRate: metric(entry?.summary?.hit_rate),
                sampleSize: Number(entry?.summary?.sample_size || 0),
                evidenceScore: Number(entry?.evidenceScore || 0),
                exactnessPercent: Number(entry?.exactnessPercent || 0),
                removedConditions: Array.isArray(entry?.removedConditions) ? entry.removedConditions : []
            }))
            : [],
        disclosure: {
            gameLogsAreSportsEdgePicks: false,
            importedTrendsIncluded: false,
            missingValuesInferred: false,
            message: "Verified Game Logs are calculated only from individually stored MLB games. Sports Edge picks and imported trend research are excluded."
        },
        generatedAt: report?.generatedAt || new Date().toISOString()
    };
}

class SportsEdgeCustomerIntelligence {
    constructor(evidenceEngine = sportsEdgeEvidenceEngine) {
        this.evidenceEngine = evidenceEngine;
    }

    async report(input = {}, options = {}) {
        const criteria = pickCriteria(input);
        const report = await this.evidenceEngine.report(criteria, {
            minimumSample: options.minimumSample,
            maximumVariants: options.maximumVariants,
            limit: options.limit,
            period: criteria.period
        });

        return {
            criteria,
            ...presentationReport(report)
        };
    }
}

const sportsEdgeCustomerIntelligence = new SportsEdgeCustomerIntelligence();

export {
    ALLOWED_PERIODS,
    CRITERIA_FIELDS,
    SportsEdgeCustomerIntelligence,
    pickCriteria,
    presentationReport,
    sportsEdgeCustomerIntelligence
};

export default sportsEdgeCustomerIntelligence;
