/** Protected date-range Release A audit. */
import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    getQueryValue,
    handleOptions,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import { callRpc } from "../../lib/mlb/supabase.js";
import { requireIsoDate } from "../../lib/mlb/stats-api-client.js";

export default async function handler(request, response) {
    if (handleOptions(request, response)) return;

    try {
        requireMethod(request, "GET");
        requireAdmin(request);
        const startDate = requireIsoDate(getQueryValue(request, "startDate"), "startDate");
        const endDate = requireIsoDate(getQueryValue(request, "endDate") || startDate, "endDate");
        const audit = await callRpc("sports_edge_mlb_release_a_audit", {
            p_start_date: startDate,
            p_end_date: endDate
        });
        sendSuccess(response, { release: "A", startDate, endDate, audit });
    } catch (error) {
        sendError(response, error);
    }
}
