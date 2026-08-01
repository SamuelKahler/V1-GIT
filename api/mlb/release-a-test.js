/**
 * Sports Edge MLB Intelligence
 * Release A one-date acceptance test.
 *
 * Runs the same real import twice and proves idempotency, coverage and audit.
 */
import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    handleOptions,
    parseJsonBody,
    requireInteger,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import { importDateRange } from "../../lib/mlb/importer.js";
import { callRpc } from "../../lib/mlb/supabase.js";
import { requireIsoDate } from "../../lib/mlb/stats-api-client.js";

function countGames(audit) {
    return Number(audit?.games || 0);
}

export default async function handler(request, response) {
    if (handleOptions(request, response)) return;

    try {
        requireMethod(request, "POST");
        requireAdmin(request);

        const body = parseJsonBody(request);
        const date = requireIsoDate(String(body.date || "").trim(), "date");
        const concurrency = requireInteger(body.concurrency, "concurrency", {
            defaultValue: 3,
            minimum: 1,
            maximum: 5
        });

        const before = await callRpc("sports_edge_mlb_release_a_audit", {
            p_start_date: date,
            p_end_date: date
        });

        const firstImport = await importDateRange({
            startDate: date,
            endDate: date,
            dryRun: false,
            concurrency
        });

        const afterFirst = await callRpc("sports_edge_mlb_release_a_audit", {
            p_start_date: date,
            p_end_date: date
        });

        const secondImport = await importDateRange({
            startDate: date,
            endDate: date,
            dryRun: false,
            concurrency
        });

        const afterSecond = await callRpc("sports_edge_mlb_release_a_audit", {
            p_start_date: date,
            p_end_date: date
        });

        const checks = {
            gamesDiscovered: Number(firstImport?.counters?.discovered || 0) > 0,
            firstImportNoGameFailures: Number(firstImport?.counters?.failed || 0) === 0,
            gamesStored: countGames(afterFirst) > 0,
            completedGamesFound: Number(afterSecond?.finalGames || 0) > 0,
            completedScoresStored: Number(afterSecond?.gamesWithFinalScores || 0) === Number(afterSecond?.finalGames || 0),
            eligibleF5GamesComplete: Number(afterSecond?.fiveInningGamesMissingF5 || 0) === 0,
            duplicateGamePksZero: Number(afterSecond?.duplicateGamePks || 0) === 0,
            secondImportDidNotIncreaseCount: countGames(afterSecond) === countGames(afterFirst),
            secondImportNoNewInserts: Number(secondImport?.counters?.inserted || 0) === 0,
            secondImportNoGameFailures: Number(secondImport?.counters?.failed || 0) === 0,
            inningsStored: Number(afterSecond?.gamesWithInnings || 0) > 0,
            startersStored: Number(afterSecond?.gamesWithStarters || 0) > 0
        };

        const passed = Object.values(checks).every(Boolean);

        sendSuccess(response, {
            release: "A",
            passed,
            date,
            checks,
            before,
            firstImport,
            afterFirst,
            secondImport,
            afterSecond
        }, passed ? 200 : 422);
    } catch (error) {
        sendError(response, error);
    }
}
