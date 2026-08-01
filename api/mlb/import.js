/**
 * Sports Edge MLB Intelligence
 * Protected MLB import endpoint
 */

import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    handleOptions,
    parseJsonBody,
    requireBoolean,
    requireInteger,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import { importDateRange } from "../../lib/mlb/importer.js";

export default async function handler(request, response) {
    if (handleOptions(request, response)) {
        return;
    }

    try {
        requireMethod(request, "POST");
        requireAdmin(request);

        const body = parseJsonBody(request);

        const startDate = String(
            body.startDate || ""
        ).trim();

        const endDate = String(
            body.endDate || body.startDate || ""
        ).trim();

        const dryRun = requireBoolean(
            body.dryRun,
            "dryRun",
            false
        );

        const concurrency = requireInteger(
            body.concurrency,
            "concurrency",
            {
                defaultValue: 3,
                minimum: 1,
                maximum: 5
            }
        );

        const result = await importDateRange({
            startDate,
            endDate,
            dryRun,
            concurrency
        });

        sendSuccess(response, {
            import: result
        });
    } catch (error) {
        sendError(response, error);
    }
}
