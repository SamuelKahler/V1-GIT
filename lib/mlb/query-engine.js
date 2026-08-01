import { callRpc } from "./supabase.js";
import { requireIsoDate } from "./stats-api-client.js";

const ALLOWED_ROLES = new Set(["HOME", "AWAY"]);
const ALLOWED_HANDS = new Set(["L", "R", "S"]);
const ALLOWED_RESULTS = new Set(["WIN", "LOSS", "PUSH"]);
const MAX_SUPPORTING_GAMES = 500;

function queryError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function optionalInteger(value, name, { minimum = null, maximum = null } = {}) {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) throw queryError(`${name} must be an integer.`);
    if (minimum !== null && parsed < minimum) throw queryError(`${name} must be at least ${minimum}.`);
    if (maximum !== null && parsed > maximum) throw queryError(`${name} must be no greater than ${maximum}.`);
    return parsed;
}

function optionalNumber(value, name, { minimum = null, maximum = null } = {}) {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw queryError(`${name} must be numeric.`);
    if (minimum !== null && parsed < minimum) throw queryError(`${name} must be at least ${minimum}.`);
    if (maximum !== null && parsed > maximum) throw queryError(`${name} must be no greater than ${maximum}.`);
    return parsed;
}

function optionalBoolean(value, name) {
    if (value === null || value === undefined || value === "") return undefined;
    if (typeof value === "boolean") return value;
    const normalized = String(value).toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    throw queryError(`${name} must be true or false.`);
}

function optionalEnum(value, name, allowed) {
    if (value === null || value === undefined || value === "") return undefined;
    const normalized = String(value).trim().toUpperCase();
    if (!allowed.has(normalized)) {
        throw queryError(`${name} must be one of: ${[...allowed].join(", ")}.`);
    }
    return normalized;
}

function optionalText(value, { upper = false, lower = false } = {}) {
    if (value === null || value === undefined || value === "") return undefined;
    const text = String(value).trim();
    if (!text) return undefined;
    if (upper) return text.toUpperCase();
    if (lower) return text.toLowerCase();
    return text;
}

function normalizeCriteria(criteria = {}) {
    if (!criteria || Array.isArray(criteria) || typeof criteria !== "object") {
        throw queryError("Query criteria must be an object.");
    }

    const normalized = {
        teamId: optionalInteger(criteria.teamId, "teamId", { minimum: 1 }),
        teamAbbreviation: optionalText(criteria.teamAbbreviation, { upper: true }),
        role: optionalEnum(criteria.role, "role", ALLOWED_ROLES),
        favorite: optionalBoolean(criteria.favorite, "favorite"),
        underdog: optionalBoolean(criteria.underdog, "underdog"),
        divisionGame: optionalBoolean(criteria.divisionGame, "divisionGame"),
        interleagueGame: optionalBoolean(criteria.interleagueGame, "interleagueGame"),
        seriesGameNumber: optionalInteger(criteria.seriesGameNumber, "seriesGameNumber", { minimum: 1, maximum: 7 }),
        dayNight: optionalText(criteria.dayNight, { lower: true }),
        pitcherHand: optionalEnum(criteria.pitcherHand, "pitcherHand", ALLOWED_HANDS),
        opponentPitcherHand: optionalEnum(criteria.opponentPitcherHand, "opponentPitcherHand", ALLOWED_HANDS),
        previousResult: optionalEnum(criteria.previousResult, "previousResult", ALLOWED_RESULTS),
        previousRunsScoredMin: optionalInteger(criteria.previousRunsScoredMin, "previousRunsScoredMin", { minimum: 0 }),
        previousRunsScoredMax: optionalInteger(criteria.previousRunsScoredMax, "previousRunsScoredMax", { minimum: 0 }),
        previousRunsAllowedMin: optionalInteger(criteria.previousRunsAllowedMin, "previousRunsAllowedMin", { minimum: 0 }),
        previousRunsAllowedMax: optionalInteger(criteria.previousRunsAllowedMax, "previousRunsAllowedMax", { minimum: 0 }),
        restDaysMin: optionalInteger(criteria.restDaysMin, "restDaysMin", { minimum: 0 }),
        restDaysMax: optionalInteger(criteria.restDaysMax, "restDaysMax", { minimum: 0 }),
        restAdvantage: optionalBoolean(criteria.restAdvantage, "restAdvantage"),
        oddsBucket: optionalText(criteria.oddsBucket),
        totalBucket: optionalText(criteria.totalBucket),
        minimumCompleteness: optionalNumber(criteria.minimumCompleteness, "minimumCompleteness", { minimum: 0, maximum: 100 }),
        limit: optionalInteger(criteria.limit, "limit", { minimum: 1, maximum: MAX_SUPPORTING_GAMES }) ?? 100
    };

    if (criteria.dateFrom) normalized.dateFrom = requireIsoDate(criteria.dateFrom, "dateFrom");
    if (criteria.dateTo) normalized.dateTo = requireIsoDate(criteria.dateTo, "dateTo");
    if (normalized.dateFrom && normalized.dateTo && normalized.dateFrom > normalized.dateTo) {
        throw queryError("dateFrom cannot be after dateTo.");
    }
    if (normalized.favorite === true && normalized.underdog === true) {
        throw queryError("A team cannot be filtered as both favorite and underdog.");
    }
    if (normalized.previousRunsScoredMin !== undefined && normalized.previousRunsScoredMax !== undefined && normalized.previousRunsScoredMin > normalized.previousRunsScoredMax) {
        throw queryError("previousRunsScoredMin cannot exceed previousRunsScoredMax.");
    }
    if (normalized.previousRunsAllowedMin !== undefined && normalized.previousRunsAllowedMax !== undefined && normalized.previousRunsAllowedMin > normalized.previousRunsAllowedMax) {
        throw queryError("previousRunsAllowedMin cannot exceed previousRunsAllowedMax.");
    }
    if (normalized.restDaysMin !== undefined && normalized.restDaysMax !== undefined && normalized.restDaysMin > normalized.restDaysMax) {
        throw queryError("restDaysMin cannot exceed restDaysMax.");
    }

    return Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined));
}

class SportsEdgeQueryEngine {
    async query(criteria = {}) {
        const normalized = normalizeCriteria(criteria);
        return callRpc("sports_edge_mlb_query_game_logs", { p_criteria: normalized });
    }

    async teamHistory(teamId, criteria = {}) {
        return this.query({ ...criteria, teamId });
    }

    async teamHistoryByAbbreviation(teamAbbreviation, criteria = {}) {
        return this.query({ ...criteria, teamAbbreviation });
    }

    async environment(criteria = {}) {
        return this.query(criteria);
    }

    async trends(criteria = {}) {
        return this.query(criteria);
    }
}

const sportsEdgeQueryEngine = new SportsEdgeQueryEngine();

export {
    ALLOWED_HANDS,
    ALLOWED_RESULTS,
    ALLOWED_ROLES,
    MAX_SUPPORTING_GAMES,
    SportsEdgeQueryEngine,
    normalizeCriteria,
    sportsEdgeQueryEngine
};

export default sportsEdgeQueryEngine;
