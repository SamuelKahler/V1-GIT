/**
 * Sports Edge MLB Intelligence
 * Protected database and import status endpoint
 */

import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    handleOptions,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import { checkDatabaseHealth } from "../../lib/mlb/supabase.js";

export default async function handler(request, response) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        requireMethod(request, "GET");
        requireAdmin(request);

        const health = await checkDatabaseHealth();

        sendSuccess(response, {
            service: "sports-edge-mlb-intelligence",
            status: "ready",
            checkedAt: new Date().toISOString(),
            health
        });
    } catch (error) {
        sendError(response, error);
    }
}
