import { callRpc } from "./supabase.js";
import { requireIsoDate } from "./stats-api-client.js";

const MAX_ENVIRONMENT_DAYS = 367;

function createEnvironmentError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function validateEnvironmentRange(startDate, endDate) {
    const start = requireIsoDate(startDate, "startDate");
    const end = requireIsoDate(endDate, "endDate");
    const startTime = new Date(`${start}T00:00:00.000Z`).getTime();
    const endTime = new Date(`${end}T00:00:00.000Z`).getTime();

    if (startTime > endTime) {
        throw createEnvironmentError("startDate cannot be after endDate.");
    }

    const dayCount = Math.floor((endTime - startTime) / 86_400_000) + 1;

    if (dayCount > MAX_ENVIRONMENT_DAYS) {
        throw createEnvironmentError(
            `Environment rebuilds are limited to ${MAX_ENVIRONMENT_DAYS} inclusive days per request.`
        );
    }

    return { startDate: start, endDate: end, dayCount };
}

async function rebuildEnvironments({ startDate, endDate }) {
    const range = validateEnvironmentRange(startDate, endDate);
    const database = await callRpc("sports_edge_mlb_rebuild_environments", {
        p_start_date: range.startDate,
        p_end_date: range.endDate
    });

    return { ...range, database };
}

export {
    MAX_ENVIRONMENT_DAYS,
    rebuildEnvironments,
    validateEnvironmentRange
};
