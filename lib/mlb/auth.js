/**
 * Sports Edge MLB Intelligence
 * Server-side admin authorization
 *
 * Protects internal MLB import, audit, and status endpoints.
 */

const ADMIN_TOKEN_HEADER = "x-sports-edge-admin-token";
const MINIMUM_TOKEN_LENGTH = 32;

function createAuthError(
    message,
    statusCode = 401
) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function getConfiguredAdminToken() {
    const token = String(
        process.env.MLB_IMPORT_ADMIN_TOKEN || ""
    ).trim();

    if (!token) {
        throw createAuthError(
            "MLB_IMPORT_ADMIN_TOKEN is not configured in Vercel.",
            503
        );
    }

    if (token.length < MINIMUM_TOKEN_LENGTH) {
        throw createAuthError(
            `MLB_IMPORT_ADMIN_TOKEN must contain at least ${MINIMUM_TOKEN_LENGTH} characters.`,
            503
        );
    }

    return token;
}

function getHeaderValue(request, headerName) {
    if (!request?.headers) {
        return null;
    }

    if (typeof request.headers.get === "function") {
        return request.headers.get(headerName);
    }

    const lowerName = headerName.toLowerCase();

    for (const [key, value] of Object.entries(
        request.headers
    )) {
        if (String(key).toLowerCase() === lowerName) {
            if (Array.isArray(value)) {
                return value[0] || null;
            }

            return value || null;
        }
    }

    return null;
}

function safeEqual(left, right) {
    const leftText = String(left || "");
    const rightText = String(right || "");

    if (leftText.length !== rightText.length) {
        return false;
    }

    let difference = 0;

    for (
        let index = 0;
        index < leftText.length;
        index += 1
    ) {
        difference |=
            leftText.charCodeAt(index) ^
            rightText.charCodeAt(index);
    }

    return difference === 0;
}

export function requireAdmin(request) {
    const configuredToken =
        getConfiguredAdminToken();

    const suppliedToken = String(
        getHeaderValue(
            request,
            ADMIN_TOKEN_HEADER
        ) || ""
    ).trim();

    if (!suppliedToken) {
        throw createAuthError(
            `Missing ${ADMIN_TOKEN_HEADER} header.`,
            401
        );
    }

    if (
        !safeEqual(
            suppliedToken,
            configuredToken
        )
    ) {
        throw createAuthError(
            "Invalid MLB import administrator token.",
            403
        );
    }

    return true;
}

export {
    ADMIN_TOKEN_HEADER,
    MINIMUM_TOKEN_LENGTH,
    createAuthError,
    getConfiguredAdminToken,
    getHeaderValue,
    safeEqual
};
