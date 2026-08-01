import { requireAdmin } from "../../lib/mlb/auth.js";
import {
    handleOptions,
    parseJsonBody,
    requireInteger,
    requireMethod,
    sendError,
    sendSuccess
} from "../../lib/mlb/http.js";
import sportsEdgeEvidenceEngine from "../../lib/mlb/evidence-engine.js";

export default async function handler(request, response) {
    if (handleOptions(request, response)) return;

    try {
        requireMethod(request, "POST");
        requireAdmin(request);
        const body = parseJsonBody(request);
        const minimumSample = requireInteger(body.minimumSample, "minimumSample", {
            defaultValue: 10,
            minimum: 1,
            maximum: 500
        });
        const maximumVariants = requireInteger(body.maximumVariants, "maximumVariants", {
            defaultValue: 8,
            minimum: 1,
            maximum: 12
        });
        const report = await sportsEdgeEvidenceEngine.report(body.criteria || {}, {
            minimumSample,
            maximumVariants,
            limit: body.limit
        });
        sendSuccess(response, { report });
    } catch (error) {
        sendError(response, error);
    }
}
