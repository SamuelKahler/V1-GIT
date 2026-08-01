/**
 * Sports Edge MLB Intelligence
 * Official MLB Stats API client
 *
 * This is the only module that should make direct requests to MLB.
 */

const MLB_API_V1 = "https://statsapi.mlb.com/api/v1";
const MLB_GAME_FEED = "https://statsapi.mlb.com/api/v1.1/game";

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_ATTEMPTS = 3;

const DEFAULT_HEADERS = Object.freeze({
    Accept: "application/json",
    "User-Agent": "Sports-Edge-MLB-Intelligence/2.0"
});

function createClientError(message, statusCode = 502, details = null) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
}

function requirePositiveInteger(value, fieldName) {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw createClientError(
            `${fieldName} must be a positive integer.`,
            400
        );
    }

    return parsed;
}

function requireIsoDate(value, fieldName) {
    const text = String(value || "");
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(text)) {
        throw createClientError(
            `${fieldName} must use YYYY-MM-DD format.`,
            400
        );
    }

    const parsed = new Date(`${text}T00:00:00.000Z`);

    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== text
    ) {
        throw createClientError(
            `${fieldName} is not a valid calendar date.`,
            400
        );
    }

    return text;
}

function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function fetchJson(
    url,
    {
        attempts = DEFAULT_ATTEMPTS,
        timeoutMs = DEFAULT_TIMEOUT_MS
    } = {}
) {
    let finalError = null;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, timeoutMs);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: DEFAULT_HEADERS,
                signal: controller.signal
            });

            const responseText = await response.text();

            let payload = null;

            try {
                payload = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                throw createClientError(
                    `MLB returned invalid JSON for ${url}.`,
                    502,
                    {
                        responseText: responseText.slice(0, 500)
                    }
                );
            }

            if (!response.ok) {
                throw createClientError(
                    `MLB request failed (${response.status}) for ${url}.`,
                    response.status >= 500 ? 502 : response.status,
                    payload
                );
            }

            return payload;
        } catch (error) {
            finalError = error;

            const retryable =
                error?.name === "AbortError" ||
                !error?.statusCode ||
                Number(error.statusCode) >= 500;

            if (!retryable || attempt === attempts) {
                break;
            }

            await sleep(500 * attempt);
        } finally {
            clearTimeout(timeout);
        }
    }

    if (finalError?.name === "AbortError") {
        throw createClientError(
            `MLB request timed out after ${timeoutMs} milliseconds.`,
            504
        );
    }

    throw finalError || createClientError(
        "Unknown MLB API request failure.",
        502
    );
}

function buildUrl(baseUrl, path = "", parameters = {}) {
    const url = new URL(`${baseUrl}${path}`);

    for (const [name, value] of Object.entries(parameters)) {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            url.searchParams.set(name, String(value));
        }
    }

    return url.toString();
}

/**
 * Retrieve all MLB games scheduled inside an inclusive date range.
 *
 * Returns the original official MLB schedule response. The importer and
 * transform layer remain responsible for selecting and normalizing games.
 */
export async function getSchedule({
    startDate,
    endDate,
    sportId = 1
}) {
    const normalizedStart = requireIsoDate(
        startDate,
        "startDate"
    );

    const normalizedEnd = requireIsoDate(
        endDate,
        "endDate"
    );

    const normalizedSportId = requirePositiveInteger(
        sportId,
        "sportId"
    );

    if (
        new Date(`${normalizedStart}T00:00:00.000Z`) >
        new Date(`${normalizedEnd}T00:00:00.000Z`)
    ) {
        throw createClientError(
            "startDate cannot be after endDate.",
            400
        );
    }

    const url = buildUrl(
        MLB_API_V1,
        "/schedule",
        {
            sportId: normalizedSportId,
            startDate: normalizedStart,
            endDate: normalizedEnd,

            /*
             * These hydrated objects reduce extra requests while preserving
             * the raw official schedule object for transformGame().
             */
            hydrate: [
                "team",
                "venue",
                "probablePitcher",
                "linescore"
            ].join(",")
        }
    );

    const schedule = await fetchJson(url);

    if (
        !schedule ||
        !Array.isArray(schedule.dates)
    ) {
        throw createClientError(
            "MLB schedule response did not contain a dates array.",
            502,
            schedule
        );
    }

    return schedule;
}

/**
 * Retrieve the complete official live-data feed for one MLB game.
 *
 * Completed games retain their final linescore, innings, boxscore,
 * probable pitchers, confirmed pitching participation, venue and status.
 */
export async function getGame(gamePk) {
    const normalizedGamePk = requirePositiveInteger(
        gamePk,
        "gamePk"
    );

    const url = buildUrl(
        MLB_GAME_FEED,
        `/${normalizedGamePk}/feed/live`
    );

    const feed = await fetchJson(url);

    if (!feed?.gameData || !feed?.liveData) {
        throw createClientError(
            `MLB game ${normalizedGamePk} did not contain gameData and liveData.`,
            502,
            feed
        );
    }

    const returnedGamePk = Number(feed?.gameData?.game?.pk);

    if (
        Number.isInteger(returnedGamePk) &&
        returnedGamePk !== normalizedGamePk
    ) {
        throw createClientError(
            `MLB returned gamePk ${returnedGamePk} while ${normalizedGamePk} was requested.`,
            502
        );
    }

    return feed;
}

/**
 * Retrieve official MLB team metadata.
 */
export async function getTeam(teamId) {
    const normalizedTeamId = requirePositiveInteger(
        teamId,
        "teamId"
    );

    const url = buildUrl(
        MLB_API_V1,
        `/teams/${normalizedTeamId}`,
        {
            hydrate: "league,division,venue"
        }
    );

    return fetchJson(url);
}

/**
 * Retrieve official MLB person/player metadata.
 */
export async function getPerson(personId) {
    const normalizedPersonId = requirePositiveInteger(
        personId,
        "personId"
    );

    const url = buildUrl(
        MLB_API_V1,
        `/people/${normalizedPersonId}`,
        {
            hydrate: "currentTeam"
        }
    );

    return fetchJson(url);
}

/**
 * Retrieve official MLB venue metadata.
 */
export async function getVenue(venueId) {
    const normalizedVenueId = requirePositiveInteger(
        venueId,
        "venueId"
    );

    const url = buildUrl(
        MLB_API_V1,
        `/venues/${normalizedVenueId}`
    );

    return fetchJson(url);
}

export {
    buildUrl,
    fetchJson,
    requireIsoDate,
    requirePositiveInteger
};
