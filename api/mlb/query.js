import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    handleOptions,
    parseJsonBody,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import sportsEdgeQueryEngine from "../../lib/mlb/query-engine.js";

export default async function handler(request, response) {
    if (handleOptions(request, response)) return;

    try {
        requireMethod(request, "POST");
        requireAdmin(request);
        const body = parseJsonBody(request);
        const intelligence = await sportsEdgeQueryEngine.query(body.criteria || body);
        sendSuccess(response, { intelligence });
    } catch (error) {
        sendError(response, error);
    }
}
