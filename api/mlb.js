/**
 * Sports Edge MLB Intelligence
 * Consolidated Vercel serverless gateway
 *
 * One public serverless function routes MLB actions to isolated modules.
 * This keeps the Vercel Hobby deployment below its function limit without
 * combining the underlying importer, query, evidence, or environment logic.
 */

import { requireAdmin } from "../lib/mlb/auth.js";
import {
    createHttpError,
    getQueryValue,
    handleOptions,
    parseJsonBody,
    requireBoolean,
    requireInteger,
    requireMethod,
    sendError,
    sendSuccess
} from "../lib/mlb/http.js";
import { rebuildEnvironments } from "../lib/mlb/environment-engine.js";
import sportsEdgeEvidenceEngine from "../lib/mlb/evidence-engine.js";
import sportsEdgeCustomerIntelligence from "../lib/mlb/customer-intelligence.js";
import { importDateRange } from "../lib/mlb/importer.js";
import sportsEdgeQueryEngine from "../lib/mlb/query-engine.js";
import { callRpc, checkDatabaseHealth } from "../lib/mlb/supabase.js";
import { requireIsoDate } from "../lib/mlb/stats-api-client.js";

const ACTIONS = Object.freeze({
    audit: { method: "GET", admin: true },
    environments: { method: "POST", admin: true },
    evidence: { method: "POST", admin: true },
    import: { method: "POST", admin: true },
    publicCustomerIntelligence: { method: "POST", admin: false },
    publicEvidence: { method: "POST", admin: false },
    query: { method: "POST", admin: true },
    releaseAAudit: { method: "GET", admin: true },
    releaseATest: { method: "POST", admin: true },
    status: { method: "GET", admin: true }
});

function getAction(request, body = {}) {
    const raw = body.action || getQueryValue(request, "action") || "";
    const action = String(raw).trim();

    if (!Object.prototype.hasOwnProperty.call(ACTIONS, action)) {
        throw createHttpError(
            "Unknown MLB API action.",
            400,
            { allowedActions: Object.keys(ACTIONS) }
        );
    }

    return action;
}

function countGames(audit) {
    return Number(audit?.games || 0);
}

async function handleImport(body) {
    const startDate = String(body.startDate || "").trim();
    const endDate = String(body.endDate || body.startDate || "").trim();
    const dryRun = requireBoolean(body.dryRun, "dryRun", false);
    const concurrency = requireInteger(body.concurrency, "concurrency", {
        defaultValue: 3,
        minimum: 1,
        maximum: 5
    });

    return {
        import: await importDateRange({
            startDate,
            endDate,
            dryRun,
            concurrency
        })
    };
}

async function handleStatus() {
    return {
        service: "sports-edge-mlb-intelligence",
        status: "ready",
        checkedAt: new Date().toISOString(),
        health: await checkDatabaseHealth()
    };
}

async function handleAudit() {
    return {
        service: "sports-edge-mlb-intelligence",
        checkedAt: new Date().toISOString(),
        audit: await callRpc("sports_edge_mlb_audit", {})
    };
}

async function handleEnvironments(body) {
    return {
        environments: await rebuildEnvironments({
            startDate: String(body.startDate || "").trim(),
            endDate: String(body.endDate || body.startDate || "").trim()
        })
    };
}

async function handleQuery(body) {
    return {
        intelligence: await sportsEdgeQueryEngine.query(body.criteria || body)
    };
}

async function handleEvidence(body, isPublic) {
    const criteria = body.criteria || {};

    if (isPublic && !criteria.teamAbbreviation && !criteria.teamId) {
        throw createHttpError(
            "A team is required for customer evidence requests.",
            400
        );
    }

    const minimumSample = requireInteger(body.minimumSample, "minimumSample", {
        defaultValue: 10,
        minimum: isPublic ? 3 : 1,
        maximum: isPublic ? 100 : 500
    });
    const maximumVariants = requireInteger(body.maximumVariants, "maximumVariants", {
        defaultValue: isPublic ? 6 : 8,
        minimum: 1,
        maximum: isPublic ? 8 : 12
    });
    const limit = requireInteger(body.limit, "limit", {
        defaultValue: 50,
        minimum: isPublic ? 5 : 1,
        maximum: isPublic ? 100 : 500
    });

    const report = await sportsEdgeEvidenceEngine.report(criteria, {
        minimumSample,
        maximumVariants,
        limit
    });

    return isPublic
        ? { report, visibility: "CUSTOMER_READ_ONLY" }
        : { report };
}


async function handleCustomerIntelligence(body) {
    const criteria = body.criteria || body.pick || body;
    const minimumSample = requireInteger(body.minimumSample, "minimumSample", {
        defaultValue: 10, minimum: 3, maximum: 100
    });
    const maximumVariants = requireInteger(body.maximumVariants, "maximumVariants", {
        defaultValue: 6, minimum: 1, maximum: 8
    });
    const limit = requireInteger(body.limit, "limit", {
        defaultValue: 50, minimum: 5, maximum: 100
    });

    return {
        customerIntelligence: await sportsEdgeCustomerIntelligence.report(criteria, {
            minimumSample, maximumVariants, limit
        }),
        visibility: "CUSTOMER_READ_ONLY"
    };
}

async function handleReleaseAAudit(request) {
    const startDate = requireIsoDate(
        getQueryValue(request, "startDate"),
        "startDate"
    );
    const endDate = requireIsoDate(
        getQueryValue(request, "endDate") || startDate,
        "endDate"
    );

    return {
        release: "A",
        startDate,
        endDate,
        audit: await callRpc("sports_edge_mlb_release_a_audit", {
            p_start_date: startDate,
            p_end_date: endDate
        })
    };
}

async function handleReleaseATest(body) {
    const date = requireIsoDate(String(body.date || "").trim(), "date");
    const concurrency = requireInteger(body.concurrency, "concurrency", {
        defaultValue: 3,
        minimum: 1,
        maximum: 5
    });

    const audit = () => callRpc("sports_edge_mlb_release_a_audit", {
        p_start_date: date,
        p_end_date: date
    });

    const before = await audit();
    const firstImport = await importDateRange({
        startDate: date,
        endDate: date,
        dryRun: false,
        concurrency
    });
    const afterFirst = await audit();
    const secondImport = await importDateRange({
        startDate: date,
        endDate: date,
        dryRun: false,
        concurrency
    });
    const afterSecond = await audit();

    const checks = {
        gamesDiscovered: Number(firstImport?.counters?.discovered || 0) > 0,
        firstImportNoGameFailures: Number(firstImport?.counters?.failed || 0) === 0,
        gamesStored: countGames(afterFirst) > 0,
        completedGamesFound: Number(afterSecond?.finalGames || 0) > 0,
        completedScoresStored:
            Number(afterSecond?.gamesWithFinalScores || 0) ===
            Number(afterSecond?.finalGames || 0),
        eligibleF5GamesComplete: Number(afterSecond?.fiveInningGamesMissingF5 || 0) === 0,
        duplicateGamePksZero: Number(afterSecond?.duplicateGamePks || 0) === 0,
        secondImportDidNotIncreaseCount: countGames(afterSecond) === countGames(afterFirst),
        secondImportNoNewInserts: Number(secondImport?.counters?.inserted || 0) === 0,
        secondImportNoGameFailures: Number(secondImport?.counters?.failed || 0) === 0,
        inningsStored: Number(afterSecond?.gamesWithInnings || 0) > 0,
        startersStored: Number(afterSecond?.gamesWithStarters || 0) > 0
    };

    const passed = Object.values(checks).every(Boolean);

    return {
        statusCode: passed ? 200 : 422,
        payload: {
            release: "A",
            passed,
            date,
            checks,
            before,
            firstImport,
            afterFirst,
            secondImport,
            afterSecond
        }
    };
}

export default async function handler(request, response) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        const method = String(request?.method || "").toUpperCase();
        const body = method === "POST" ? parseJsonBody(request) : {};
        const action = getAction(request, body);
        const config = ACTIONS[action];

        requireMethod(request, config.method);

        if (config.admin) {
            requireAdmin(request);
        }

        let result;

        switch (action) {
            case "import":
                result = await handleImport(body);
                break;
            case "status":
                result = await handleStatus();
                break;
            case "audit":
                result = await handleAudit();
                break;
            case "environments":
                result = await handleEnvironments(body);
                break;
            case "query":
                result = await handleQuery(body);
                break;
            case "evidence":
                result = await handleEvidence(body, false);
                break;
            case "publicCustomerIntelligence":
                result = await handleCustomerIntelligence(body);
                break;
            case "publicEvidence":
                result = await handleEvidence(body, true);
                break;
            case "releaseAAudit":
                result = await handleReleaseAAudit(request);
                break;
            case "releaseATest":
                result = await handleReleaseATest(body);
                break;
            default:
                throw createHttpError("Unsupported MLB API action.", 400);
        }

        if (result?.statusCode && result?.payload) {
            sendSuccess(response, result.payload, result.statusCode);
            return;
        }

        sendSuccess(response, result);
    } catch (error) {
        sendError(response, error);
    }
}

export { ACTIONS, getAction };
