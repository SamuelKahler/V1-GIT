/**
 * Sports Edge MLB Intelligence
 * Supabase transport layer
 *
 * Responsibilities:
 * - Validate secure server-side Supabase configuration
 * - Call PostgreSQL RPC functions through PostgREST
 * - Apply request timeouts
 * - Retry temporary failures
 * - Normalize Supabase/PostgREST errors
 *
 * This file must only be imported by server-side code.
 */

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_ATTEMPTS = 3;

function createSupabaseError(
    message,
    statusCode = 502,
    details = null
) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
}

function configuration() {
    const url = String(
        process.env.SUPABASE_URL || ""
    )
        .trim()
        .replace(/\/+$/, "");

    const key = String(
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    ).trim();

    if (!url || !key) {
        throw createSupabaseError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in Vercel.",
            503
        );
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw createSupabaseError(
            "SUPABASE_URL is not a valid URL.",
            503
        );
    }

    if (parsedUrl.protocol !== "https:") {
        throw createSupabaseError(
            "SUPABASE_URL must use HTTPS.",
            503
        );
    }

    return {
        url,
        key
    };
}

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function parseResponsePayload(text) {
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getSupabaseMessage(payload) {
    if (typeof payload === "string") {
        return payload;
    }

    if (!payload || typeof payload !== "object") {
        return "Unknown Supabase error";
    }

    return (
        payload.message ||
        payload.error_description ||
        payload.error ||
        payload.details ||
        "Unknown Supabase error"
    );
}

function isRetryableStatus(status) {
    return (
        status === 408 ||
        status === 425 ||
        status === 429 ||
        status >= 500
    );
}

async function requestSupabase(
    path,
    {
        method = "GET",
        body,
        timeoutMs = DEFAULT_TIMEOUT_MS,
        attempts = DEFAULT_ATTEMPTS,
        headers = {}
    } = {}
) {
    const { url, key } = configuration();

    const endpoint = `${url}${path}`;
    let finalError = null;

    for (
        let attempt = 1;
        attempt <= attempts;
        attempt += 1
    ) {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, timeoutMs);

        try {
            const response = await fetch(endpoint, {
                method,
                signal: controller.signal,
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...headers
                },
                body:
                    body === undefined
                        ? undefined
                        : JSON.stringify(body)
            });

            const text = await response.text();
            const payload =
                parseResponsePayload(text);

            if (!response.ok) {
                const error = createSupabaseError(
                    `Supabase request failed (${response.status}): ${getSupabaseMessage(payload)}`,
                    response.status >= 500
                        ? 502
                        : response.status,
                    {
                        endpoint: path,
                        payload
                    }
                );

                if (
                    isRetryableStatus(response.status) &&
                    attempt < attempts
                ) {
                    finalError = error;
                    await sleep(500 * attempt);
                    continue;
                }

                throw error;
            }

            return payload;
        } catch (error) {
            finalError = error;

            const retryable =
                error?.name === "AbortError" ||
                !error?.statusCode ||
                Number(error.statusCode) >= 500;

            if (
                !retryable ||
                attempt === attempts
            ) {
                break;
            }

            await sleep(500 * attempt);
        } finally {
            clearTimeout(timeout);
        }
    }

    if (finalError?.name === "AbortError") {
        throw createSupabaseError(
            `Supabase request timed out after ${timeoutMs} milliseconds.`,
            504
        );
    }

    throw finalError || createSupabaseError(
        "Unknown Supabase request failure.",
        502
    );
}

function validateRpcName(functionName) {
    const name = String(
        functionName || ""
    ).trim();

    if (
        !/^[a-z][a-z0-9_]*$/i.test(name)
    ) {
        throw createSupabaseError(
            "Supabase RPC function name is invalid.",
            500,
            {
                functionName
            }
        );
    }

    return name;
}

export async function callRpc(
    functionName,
    body = {},
    options = {}
) {
    const name = validateRpcName(
        functionName
    );

    if (
        body === null ||
        Array.isArray(body) ||
        typeof body !== "object"
    ) {
        throw createSupabaseError(
            `RPC body for ${name} must be an object.`,
            500
        );
    }

    return requestSupabase(
        `/rest/v1/rpc/${encodeURIComponent(name)}`,
        {
            method: "POST",
            body,
            ...options
        }
    );
}

/**
 * Confirms that:
 * - Supabase environment variables exist
 * - PostgREST is reachable
 * - The MLB migration has been installed
 */
export async function checkDatabaseHealth() {
    const startedAt = Date.now();

    const status = await callRpc(
        "sports_edge_mlb_status",
        {}
    );

    return {
        ok: true,
        latencyMs: Date.now() - startedAt,
        database: status
    };
}

export {
    configuration,
    createSupabaseError,
    getSupabaseMessage,
    parseResponsePayload,
    requestSupabase,
    validateRpcName
};
