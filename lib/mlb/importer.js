/**
 * ============================================================
 * Sports Edge MLB Intelligence
 * Date Range Import Coordinator
 * ============================================================
 *
 * Responsibilities:
 * - Validate requested import ranges
 * - Open and close import audit runs
 * - Retrieve schedules through the MLB Stats API client
 * - Retrieve each official game feed
 * - Transform each game into the canonical database payload
 * - Upsert games idempotently through Supabase RPC functions
 * - Record individual game failures without stopping the batch
 *
 * This module does not:
 * - Calculate betting trends
 * - Grade Sports Edge picks
 * - Invent missing environments
 * - Import odds
 */

import { callRpc } from "./supabase.js";
import {
    getSchedule,
    getGame
} from "./stats-api-client.js";
import { transformGame } from "./transform.js";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 86_400_000;
const MAX_IMPORT_DAYS = 7;
const DEFAULT_CONCURRENCY = 3;

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseIsoDate(value, fieldName) {
    if (!ISO_DATE_PATTERN.test(value || "")) {
        throw createHttpError(
            `${fieldName} must use YYYY-MM-DD format.`,
            400
        );
    }

    const parsedDate = new Date(`${value}T00:00:00.000Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== value
    ) {
        throw createHttpError(
            `${fieldName} is not a valid calendar date.`,
            400
        );
    }

    return parsedDate;
}

function validateImportRange(startDate, endDate) {
    const parsedStart = parseIsoDate(startDate, "startDate");
    const parsedEnd = parseIsoDate(endDate, "endDate");

    if (parsedStart.getTime() > parsedEnd.getTime()) {
        throw createHttpError(
            "startDate cannot be after endDate.",
            400
        );
    }

    const dayCount =
        Math.floor(
            (parsedEnd.getTime() - parsedStart.getTime()) /
                MILLISECONDS_PER_DAY
        ) + 1;

    if (dayCount > MAX_IMPORT_DAYS) {
        throw createHttpError(
            `Imports are currently limited to ${MAX_IMPORT_DAYS} calendar days per request.`,
            400
        );
    }

    return {
        parsedStart,
        parsedEnd,
        dayCount
    };
}

function extractScheduleGames(schedulePayload) {
    if (!schedulePayload || !Array.isArray(schedulePayload.dates)) {
        return [];
    }

    const games = schedulePayload.dates.flatMap((dateEntry) => {
        return Array.isArray(dateEntry?.games)
            ? dateEntry.games
            : [];
    });

    const uniqueGames = new Map();

    for (const game of games) {
        const gamePk = Number(game?.gamePk);

        if (!Number.isInteger(gamePk) || gamePk <= 0) {
            continue;
        }

        /*
         * The official MLB gamePk is the natural unique game key.
         * If a schedule response unexpectedly contains the same game
         * more than once, only one representation enters the importer.
         */
        uniqueGames.set(gamePk, game);
    }

    return [...uniqueGames.values()];
}

async function mapWithConcurrency(items, concurrency, worker) {
    if (!Array.isArray(items) || items.length === 0) {
        return [];
    }

    const safeConcurrency = Math.max(
        1,
        Math.min(
            Number.isInteger(concurrency)
                ? concurrency
                : DEFAULT_CONCURRENCY,
            items.length
        )
    );

    const results = new Array(items.length);
    let nextIndex = 0;

    async function runWorker() {
        while (nextIndex < items.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;

            results[currentIndex] = await worker(
                items[currentIndex],
                currentIndex
            );
        }
    }

    await Promise.all(
        Array.from(
            { length: safeConcurrency },
            () => runWorker()
        )
    );

    return results;
}

function normalizeRpcUpsertResult(result) {
    if (typeof result === "string") {
        return result.toLowerCase();
    }

    if (Array.isArray(result) && result.length > 0) {
        return normalizeRpcUpsertResult(result[0]);
    }

    if (result && typeof result === "object") {
        const candidate =
            result.action ||
            result.result ||
            result.status ||
            result.operation;

        if (typeof candidate === "string") {
            return candidate.toLowerCase();
        }
    }

    return "updated";
}

async function safelyLogImportError({
    runId,
    gamePk,
    stage,
    error,
    details
}) {
    if (!runId) {
        return;
    }

    try {
        await callRpc("sports_edge_mlb_log_error", {
            p_import_run_id: runId,
            p_game_pk: gamePk,
            p_stage: stage,
            p_error_message:
                error instanceof Error
                    ? error.message
                    : String(error),
            p_details: details || {}
        });
    } catch (loggingError) {
        console.error(
            "Sports Edge could not write the import error audit:",
            loggingError
        );
    }
}

async function importSingleGame({
    scheduleGame,
    runId,
    dryRun
}) {
    const gamePk = Number(scheduleGame?.gamePk);

    if (!Number.isInteger(gamePk) || gamePk <= 0) {
        throw new Error("Schedule game is missing a valid gamePk.");
    }

    const feed = await getGame(gamePk);
    const payload = transformGame(scheduleGame, feed);

    if (Number(payload.gamePk) !== gamePk) {
        throw new Error(
            `Transformed gamePk mismatch for game ${gamePk}.`
        );
    }

    if (dryRun) {
        return {
            gamePk,
            action: "dry_run",
            payload
        };
    }

    const rpcResult = await callRpc(
        "sports_edge_mlb_upsert_game",
        {
            p_payload: payload
        }
    );

    return {
        gamePk,
        action: normalizeRpcUpsertResult(rpcResult),
        payload: null
    };
}

export async function importDateRange({
    startDate,
    endDate,
    dryRun = false,
    concurrency = DEFAULT_CONCURRENCY
}) {
    const range = validateImportRange(
        startDate,
        endDate
    );

    const normalizedDryRun = dryRun === true;

    const counters = {
        discovered: 0,
        attempted: 0,
        inserted: 0,
        updated: 0,
        failed: 0,
        dryRun: 0
    };

    const errors = [];
    const successfulGamePks = [];

    let runId = null;

    if (!normalizedDryRun) {
        runId = await callRpc(
            "sports_edge_mlb_start_import",
            {
                p_start_date: startDate,
                p_end_date: endDate,
                p_dry_run: false
            }
        );
    }

    try {
        const schedulePayload = await getSchedule({
            startDate,
            endDate,
            sportId: 1
        });

        const games = extractScheduleGames(
            schedulePayload
        );

        counters.discovered = games.length;

        await mapWithConcurrency(
            games,
            concurrency,
            async (scheduleGame) => {
                const gamePk =
                    Number(scheduleGame?.gamePk) || null;

                counters.attempted += 1;

                try {
                    const result = await importSingleGame({
                        scheduleGame,
                        runId,
                        dryRun: normalizedDryRun
                    });

                    successfulGamePks.push(result.gamePk);

                    if (result.action === "inserted") {
                        counters.inserted += 1;
                    } else if (result.action === "dry_run") {
                        counters.dryRun += 1;
                    } else {
                        counters.updated += 1;
                    }

                    return {
                        gamePk: result.gamePk,
                        action: result.action,
                        success: true
                    };
                } catch (error) {
                    counters.failed += 1;

                    const errorRecord = {
                        gamePk,
                        stage: "GAME_IMPORT",
                        message:
                            error instanceof Error
                                ? error.message
                                : String(error)
                    };

                    errors.push(errorRecord);

                    await safelyLogImportError({
                        runId,
                        gamePk,
                        stage: "GAME_IMPORT",
                        error,
                        details: errorRecord
                    });

                    return {
                        gamePk,
                        action: "failed",
                        success: false,
                        error: errorRecord.message
                    };
                }
            }
        );

        const finalStatus =
            counters.failed === 0
                ? "SUCCESS"
                : counters.failed === counters.discovered
                    ? "FAILED"
                    : "PARTIAL";

        if (runId) {
            await callRpc(
                "sports_edge_mlb_finish_import",
                {
                    p_import_run_id: runId,
                    p_status: finalStatus,
                    p_discovered: counters.discovered,
                    p_inserted: counters.inserted,
                    p_updated: counters.updated,
                    p_failed: counters.failed,
                    p_message:
                        counters.failed > 0
                            ? `${counters.failed} game import(s) failed.`
                            : null,
                    p_audit: {
                        requestedDays: range.dayCount,
                        attempted: counters.attempted,
                        successfulGamePks,
                        errors
                    }
                }
            );
        }

        return {
            runId,
            startDate,
            endDate,
            dayCount: range.dayCount,
            dryRun: normalizedDryRun,
            status: finalStatus,
            counters,
            successfulGamePks,
            errors
        };
    } catch (error) {
        if (runId) {
            try {
                await callRpc(
                    "sports_edge_mlb_finish_import",
                    {
                        p_import_run_id: runId,
                        p_status: "FAILED",
                        p_discovered: counters.discovered,
                        p_inserted: counters.inserted,
                        p_updated: counters.updated,
                        p_failed: counters.failed,
                        p_message:
                            error instanceof Error
                                ? error.message
                                : String(error),
                        p_audit: {
                            requestedDays: range.dayCount,
                            attempted: counters.attempted,
                            successfulGamePks,
                            errors
                        }
                    }
                );
            } catch (finishError) {
                console.error(
                    "Sports Edge could not finalize the failed import run:",
                    finishError
                );
            }
        }

        throw error;
    }
}

export {
    extractScheduleGames,
    validateImportRange,
    mapWithConcurrency
};
