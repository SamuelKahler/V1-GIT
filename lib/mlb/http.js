/**
 * Sports Edge MLB Intelligence
 * Shared HTTP helpers for Vercel serverless endpoints
 */

function createHttpError(message, statusCode = 500, details = null) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
}

function setCommonHeaders(response) {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store, max-age=0");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
}

function sendJson(response, statusCode, payload) {
    setCommonHeaders(response);
    response.status(statusCode).json(payload);
}

function sendSuccess(response, payload = {}, statusCode = 200) {
    sendJson(response, statusCode, {
        ok: true,
        ...payload
    });
}

function normalizeError(error) {
    const statusCode =
        Number.isInteger(error?.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode <= 599
            ? error.statusCode
            : 500;

    const message =
        error instanceof Error
            ? error.message
            : String(error || "Unknown server error.");

    return {
        statusCode,
        body: {
            ok: false,
            error: message,
            details:
                error?.details &&
                statusCode < 500
                    ? error.details
                    : undefined
        }
    };
}

function sendError(response, error) {
    const normalized = normalizeError(error);

    if (normalized.statusCode >= 500) {
        console.error("Sports Edge MLB API error:", error);
    }

    sendJson(
        response,
        normalized.statusCode,
        normalized.body
    );
}

function requireMethod(request, allowedMethods) {
    const allowed = Array.isArray(allowedMethods)
        ? allowedMethods.map((method) =>
              String(method).toUpperCase()
          )
        : [String(allowedMethods).toUpperCase()];

    const actual = String(
        request?.method || ""
    ).toUpperCase();

    if (!allowed.includes(actual)) {
        const error = createHttpError(
            `Method ${actual || "UNKNOWN"} is not allowed.`,
            405,
            {
                allowedMethods: allowed
            }
        );

        error.allowedMethods = allowed;
        throw error;
    }

    return actual;
}

function parseJsonBody(request) {
    const body = request?.body;

    if (body === undefined || body === null || body === "") {
        return {};
    }

    if (
        typeof body === "object" &&
        !Buffer.isBuffer(body)
    ) {
        return body;
    }

    try {
        return JSON.parse(
            Buffer.isBuffer(body)
                ? body.toString("utf8")
                : String(body)
        );
    } catch {
        throw createHttpError(
            "Request body must contain valid JSON.",
            400
        );
    }
}

function getQueryValue(request, name) {
    const value = request?.query?.[name];

    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
}

function requireBoolean(value, fieldName, defaultValue = false) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return defaultValue;
    }

    if (typeof value === "boolean") {
        return value;
    }

    const normalized = String(value).trim().toLowerCase();

    if (normalized === "true") {
        return true;
    }

    if (normalized === "false") {
        return false;
    }

    throw createHttpError(
        `${fieldName} must be true or false.`,
        400
    );
}

function requireInteger(
    value,
    fieldName,
    {
        defaultValue = null,
        minimum = null,
        maximum = null
    } = {}
) {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return defaultValue;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
        throw createHttpError(
            `${fieldName} must be an integer.`,
            400
        );
    }

    if (
        minimum !== null &&
        parsed < minimum
    ) {
        throw createHttpError(
            `${fieldName} must be at least ${minimum}.`,
            400
        );
    }

    if (
        maximum !== null &&
        parsed > maximum
    ) {
        throw createHttpError(
            `${fieldName} must be no greater than ${maximum}.`,
            400
        );
    }

    return parsed;
}

function handleOptions(request, response) {
    if (
        String(request?.method || "").toUpperCase() !==
        "OPTIONS"
    ) {
        return false;
    }

    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS"
    );

    response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,x-sports-edge-admin-token"
    );

    response.status(204).end();

    return true;
}

export {
    createHttpError,
    getQueryValue,
    handleOptions,
    normalizeError,
    parseJsonBody,
    requireBoolean,
    requireInteger,
    requireMethod,
    sendError,
    sendJson,
    sendSuccess,
    setCommonHeaders
};
