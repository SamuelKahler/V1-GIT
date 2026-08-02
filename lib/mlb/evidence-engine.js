import sportsEdgeQueryEngine, { normalizeCriteria } from "./query-engine.js";

const DEFAULT_MIN_SAMPLE = 10;
const DEFAULT_MAX_VARIANTS = 8;
const ALLOWED_PERIODS = new Set(["FULL_GAME", "F5"]);

const LABELS = Object.freeze({
    teamId: "Same team",
    teamAbbreviation: "Selected team",
    opponentAbbreviation: "Same opponent",
    role: "Same home/away role",
    favorite: "Same favorite status",
    underdog: "Same underdog status",
    divisionGame: "Same division status",
    interleagueGame: "Same interleague status",
    seriesGameNumber: "Same series game number",
    dayNight: "Same day/night setting",
    pitcherHand: "Same starting-pitcher hand",
    opponentPitcherHand: "Same opponent starter hand",
    previousResult: "Same previous-game result",
    previousRunsScoredMin: "Previous runs scored threshold",
    previousRunsScoredMax: "Previous runs scored ceiling",
    previousRunsAllowedMin: "Previous runs allowed threshold",
    previousRunsAllowedMax: "Previous runs allowed ceiling",
    restDaysMin: "Same minimum rest",
    restDaysMax: "Same maximum rest",
    restAdvantage: "Same rest-advantage status",
    oddsBucket: "Same odds bucket",
    totalBucket: "Same total bucket",
    f5Line: "Same first-five line",
    minimumCompleteness: "Verified data-completeness threshold",
    dateFrom: "Historical date floor",
    dateTo: "Historical date ceiling"
});

const RELAXATION_ORDER = Object.freeze([
    "dateFrom",
    "dateTo",
    "minimumCompleteness",
    "totalBucket",
    "f5Line",
    "opponentPitcherHand",
    "restDaysMax",
    "restDaysMin",
    "restAdvantage",
    "previousRunsAllowedMax",
    "previousRunsAllowedMin",
    "previousRunsScoredMax",
    "previousRunsScoredMin",
    "previousResult",
    "dayNight",
    "seriesGameNumber",
    "divisionGame",
    "interleagueGame",
    "pitcherHand",
    "oddsBucket",
    "favorite",
    "underdog",
    "role"
]);

function finite(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
}

function round(value, decimals = 1) {
    const factor = 10 ** decimals;
    return Math.round((finite(value) + Number.EPSILON) * factor) / factor;
}

function normalizePeriod(value) {
    const normalized = String(value || "FULL_GAME").trim().toUpperCase().replace(/\s+/g, "_");
    if (!ALLOWED_PERIODS.has(normalized)) {
        const error = new Error("period must be FULL_GAME or F5.");
        error.statusCode = 400;
        throw error;
    }
    return normalized;
}

function describeCriterion(key, value) {
    const label = LABELS[key] || key;
    if (typeof value === "boolean") return `${label}: ${value ? "Yes" : "No"}`;
    return `${label}: ${value}`;
}

function matchedDetails(criteria) {
    return Object.entries(criteria)
        .filter(([key]) => key !== "limit")
        .map(([key, value]) => ({ key, value, label: describeCriterion(key, value) }));
}

function variantKey(criteria) {
    return JSON.stringify(Object.keys(criteria).sort().reduce((result, key) => {
        result[key] = criteria[key];
        return result;
    }, {}));
}

function buildQualifiedVariants(criteria, maximum = DEFAULT_MAX_VARIANTS) {
    const exact = { ...criteria };
    const variants = [{ name: "Exact environment match", criteria: exact, removed: [] }];
    const seen = new Set([variantKey(exact)]);
    const relaxed = { ...exact };
    const removed = [];

    for (const key of RELAXATION_ORDER) {
        if (!(key in relaxed)) continue;
        delete relaxed[key];
        removed.push(key);
        const keyValue = variantKey(relaxed);
        if (seen.has(keyValue)) continue;
        seen.add(keyValue);
        variants.push({
            name: `Qualified match (${removed.length} condition${removed.length === 1 ? "" : "s"} relaxed)`,
            criteria: { ...relaxed },
            removed: [...removed]
        });
        if (variants.length >= maximum) break;
    }

    return variants;
}

function periodSummary(summary, period) {
    if (period !== "F5") {
        return {
            ...summary,
            period: "FULL_GAME"
        };
    }

    const wins = finite(summary?.f5_wins);
    const losses = finite(summary?.f5_losses);
    const pushes = finite(summary?.f5_pushes);
    const decisions = wins + losses;

    return {
        ...summary,
        period: "F5",
        wins,
        losses,
        pushes,
        sample_size: wins + losses + pushes,
        hit_rate: decisions ? round(wins / decisions * 100, 2) : null,
        roi_sample: 0,
        profit_units: null,
        roi_percent: null
    };
}

function scoreEvidence(summary, exactnessPercent) {
    const sample = finite(summary?.sample_size);
    const hitRate = finite(summary?.hit_rate, 50);
    const roi = summary?.roi_percent === null || summary?.roi_percent === undefined
        ? null
        : finite(summary.roi_percent);
    const completeness = finite(summary?.average_completeness);

    const sampleScore = clamp(Math.log10(sample + 1) / Math.log10(101) * 30, 0, 30);
    const hitScore = clamp((hitRate - 50) / 25 * 25, 0, 25);
    const roiScore = roi === null ? 0 : clamp((roi + 5) / 25 * 20, 0, 20);
    const completenessScore = clamp(completeness / 100 * 15, 0, 15);
    const exactnessScore = clamp(exactnessPercent / 100 * 10, 0, 10);

    return {
        score: Math.round(sampleScore + hitScore + roiScore + completenessScore + exactnessScore),
        components: {
            sampleSize: round(sampleScore),
            hitRate: round(hitScore),
            roi: round(roiScore),
            dataCompleteness: round(completenessScore),
            environmentExactness: round(exactnessScore)
        }
    };
}

function contradictionSummary(summary) {
    const wins = finite(summary?.wins);
    const losses = finite(summary?.losses);
    const pushes = finite(summary?.pushes);
    const decisions = wins + losses;
    return {
        losses,
        pushes,
        contradictionRate: decisions ? round(losses / decisions * 100, 2) : null,
        statement: losses
            ? `${losses} historical loss${losses === 1 ? "" : "es"} matched these conditions.`
            : "No historical losses matched these conditions."
    };
}

function qualifyResult(variant, response, totalConditionCount, period) {
    const summary = periodSummary(response?.summary || {}, period);
    const matchedConditionCount = Math.max(0, totalConditionCount - variant.removed.length);
    const exactnessPercent = totalConditionCount
        ? round(matchedConditionCount / totalConditionCount * 100, 1)
        : 100;
    const score = scoreEvidence(summary, exactnessPercent);

    return {
        name: variant.name,
        criteria: variant.criteria,
        removedConditions: variant.removed.map((key) => LABELS[key] || key),
        matchedConditionCount,
        totalConditionCount,
        exactnessPercent,
        period,
        summary,
        supportingGames: Array.isArray(response?.supportingGames) ? response.supportingGames : [],
        evidenceScore: score.score,
        scoreComponents: score.components,
        contradictions: contradictionSummary(summary)
    };
}

function rankQualifiedResults(results, minimumSample) {
    return [...results].sort((left, right) => {
        const leftQualified = finite(left.summary?.sample_size) >= minimumSample ? 1 : 0;
        const rightQualified = finite(right.summary?.sample_size) >= minimumSample ? 1 : 0;
        if (leftQualified !== rightQualified) return rightQualified - leftQualified;
        if (left.evidenceScore !== right.evidenceScore) return right.evidenceScore - left.evidenceScore;
        if (left.exactnessPercent !== right.exactnessPercent) return right.exactnessPercent - left.exactnessPercent;
        return finite(right.summary?.sample_size) - finite(left.summary?.sample_size);
    });
}

class SportsEdgeEvidenceEngine {
    constructor(queryEngine = sportsEdgeQueryEngine) {
        this.queryEngine = queryEngine;
    }

    async report(criteria = {}, options = {}) {
        const period = normalizePeriod(criteria.period || options.period);
        const databaseCriteria = { ...criteria };
        delete databaseCriteria.period;
        delete databaseCriteria.market;

        const normalized = normalizeCriteria({
            ...databaseCriteria,
            limit: databaseCriteria.limit || options.limit || 100
        });
        const minimumSample = Number.isInteger(options.minimumSample)
            ? clamp(options.minimumSample, 1, 500)
            : DEFAULT_MIN_SAMPLE;
        const variants = buildQualifiedVariants(normalized, options.maximumVariants || DEFAULT_MAX_VARIANTS);
        const conditionCount = Object.keys(normalized).filter((key) => key !== "limit").length;

        const responses = [];
        for (const variant of variants) {
            const response = await this.queryEngine.query(variant.criteria);
            responses.push(qualifyResult(variant, response, conditionCount, period));
        }

        const ranked = rankQualifiedResults(responses, minimumSample);
        const exact = responses[0];
        const bestQualified = ranked.find((entry) => finite(entry.summary?.sample_size) >= minimumSample) || ranked[0] || exact;

        return {
            criteria: { ...normalized, period },
            period,
            minimumQualifiedSample: minimumSample,
            exactEnvironmentMatchDetails: matchedDetails(normalized),
            exactMatch: exact,
            bestQualified,
            qualifiedAlternatives: ranked.filter((entry) => entry !== bestQualified).slice(0, 4),
            strongestReasons: matchedDetails(bestQualified?.criteria || normalized).slice(0, 8),
            contradictingEvidence: bestQualified?.contradictions || contradictionSummary({}),
            generatedAt: new Date().toISOString(),
            source: "MLB_INTELLIGENCE_GAME_LOGS"
        };
    }
}

const sportsEdgeEvidenceEngine = new SportsEdgeEvidenceEngine();

export {
    ALLOWED_PERIODS,
    DEFAULT_MAX_VARIANTS,
    DEFAULT_MIN_SAMPLE,
    LABELS,
    RELAXATION_ORDER,
    SportsEdgeEvidenceEngine,
    buildQualifiedVariants,
    contradictionSummary,
    matchedDetails,
    normalizePeriod,
    periodSummary,
    rankQualifiedResults,
    scoreEvidence,
    sportsEdgeEvidenceEngine
};

export default sportsEdgeEvidenceEngine;
