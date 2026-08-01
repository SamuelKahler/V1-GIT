import {
    handleOptions,
    parseJsonBody,
    requireInteger,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import sportsEdgeEvidenceEngine from "../../lib/mlb/evidence-engine.js";

/**
 * Customer-safe, read-only MLB evidence endpoint.
 *
 * This endpoint never accepts database credentials, never performs writes,
 * and caps query breadth so the customer interface cannot request an
 * unbounded game history.
 */
export default async function handler(request, response) {
    if (handleOptions(request, response)) return;

    try {
        requireMethod(request, "POST");
        const body = parseJsonBody(request);
        const criteria = body.criteria || {};

        if (!criteria.teamAbbreviation && !criteria.teamId) {
            const error = new Error("A team is required for customer evidence requests.");
            error.statusCode = 400;
            throw error;
        }

        const minimumSample = requireInteger(body.minimumSample, "minimumSample", {
            defaultValue: 10,
            minimum: 3,
            maximum: 100
        });
        const maximumVariants = requireInteger(body.maximumVariants, "maximumVariants", {
            defaultValue: 6,
            minimum: 1,
            maximum: 8
        });
        const limit = requireInteger(body.limit, "limit", {
            defaultValue: 50,
            minimum: 5,
            maximum: 100
        });

        const report = await sportsEdgeEvidenceEngine.report(criteria, {
            minimumSample,
            maximumVariants,
            limit
        });

        sendSuccess(response, {
            report,
            visibility: "CUSTOMER_READ_ONLY"
        });
    } catch (error) {
        sendError(response, error);
    }
}
