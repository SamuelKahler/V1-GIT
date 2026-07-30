/**
 * Sports Edge MLB Intelligence
 * Official MLB game transformer
 *
 * Converts raw MLB Stats API schedule and game-feed responses into one
 * deterministic database payload. This module never invents missing data.
 */

const FINAL_STATUS_PATTERN =
    /final|game over|completed early|completed/i;

function toFiniteNumber(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}

function toPositiveInteger(value) {
    const number = toFiniteNumber(value);

    return Number.isInteger(number) && number > 0
        ? number
        : null;
}

function cleanText(value) {
    if (value === null || value === undefined) {
        return null;
    }

    const text = String(value).trim();

    return text || null;
}

function isFinalStatus(status) {
    return FINAL_STATUS_PATTERN.test(
        String(status || "")
    );
}

function normalizeInnings(linescore) {
    const source = Array.isArray(linescore?.innings)
        ? linescore.innings
        : [];

    return source
        .map((inning) => {
            const number = toPositiveInteger(inning?.num);

            if (!number) {
                return null;
            }

            return {
                number,
                ordinal:
                    cleanText(inning?.ordinalNum) ||
                    cleanText(inning?.ordinal),
                awayRuns: toFiniteNumber(
                    inning?.away?.runs
                ),
                homeRuns: toFiniteNumber(
                    inning?.home?.runs
                ),
                awayHits: toFiniteNumber(
                    inning?.away?.hits
                ),
                homeHits: toFiniteNumber(
                    inning?.home?.hits
                ),
                awayErrors: toFiniteNumber(
                    inning?.away?.errors
                ),
                homeErrors: toFiniteNumber(
                    inning?.home?.errors
                )
            };
        })
        .filter(Boolean)
        .sort((left, right) => {
            return left.number - right.number;
        });
}

/**
 * A first-five result is only valid when innings 1 through 5 each contain
 * verified home and away run values.
 */
export function calculateFirstFive(innings = []) {
    const byNumber = new Map();

    for (const inning of innings) {
        const number = toPositiveInteger(
            inning?.number
        );

        if (number) {
            byNumber.set(number, inning);
        }
    }

    for (let number = 1; number <= 5; number += 1) {
        const inning = byNumber.get(number);

        if (
            !inning ||
            inning.awayRuns === null ||
            inning.awayRuns === undefined ||
            inning.homeRuns === null ||
            inning.homeRuns === undefined
        ) {
            return {
                available: false,
                away: null,
                home: null
            };
        }
    }

    let away = 0;
    let home = 0;

    for (let number = 1; number <= 5; number += 1) {
        const inning = byNumber.get(number);

        away += Number(inning.awayRuns);
        home += Number(inning.homeRuns);
    }

    return {
        available: true,
        away,
        home
    };
}

function normalizeTeam(scheduleSide, gameDataTeam) {
    const scheduleTeam = scheduleSide?.team || {};
    const source = gameDataTeam || scheduleTeam;

    return {
        id:
            toPositiveInteger(source?.id) ||
            toPositiveInteger(scheduleTeam?.id),

        abbreviation:
            cleanText(source?.abbreviation) ||
            cleanText(scheduleTeam?.abbreviation),

        name:
            cleanText(source?.name) ||
            cleanText(scheduleTeam?.name),

        teamName:
            cleanText(source?.teamName),

        clubName:
            cleanText(source?.clubName),

        locationName:
            cleanText(source?.locationName),

        shortName:
            cleanText(source?.shortName),

        leagueId:
            toPositiveInteger(source?.league?.id),

        leagueName:
            cleanText(source?.league?.name),

        divisionId:
            toPositiveInteger(source?.division?.id),

        divisionName:
            cleanText(source?.division?.name),

        sportId:
            toPositiveInteger(source?.sport?.id),

        active:
            typeof source?.active === "boolean"
                ? source.active
                : null
    };
}

function getBoxscorePlayer(liveData, side, playerId) {
    if (!playerId) {
        return null;
    }

    const players =
        liveData?.boxscore?.teams?.[side]?.players || {};

    return (
        players[`ID${playerId}`] ||
        players[String(playerId)] ||
        null
    );
}

function getConfirmedStarter(liveData, side) {
    const sideBox =
        liveData?.boxscore?.teams?.[side] || {};

    const pitchers = Array.isArray(sideBox.pitchers)
        ? sideBox.pitchers
        : [];

    const starterId = toPositiveInteger(
        pitchers[0]
    );

    if (!starterId) {
        return null;
    }

    const player = getBoxscorePlayer(
        liveData,
        side,
        starterId
    );

    const person = player?.person;

    if (!person?.id) {
        return {
            id: starterId,
            fullName: null,
            pitchHand: null
        };
    }

    return {
        ...person,
        pitchHand:
            person?.pitchHand ||
            player?.pitchHand ||
            null
    };
}

function normalizePitcher({
    person,
    side,
    role,
    source
}) {
    const id = toPositiveInteger(person?.id);

    if (!id) {
        return null;
    }

    return {
        id,

        fullName:
            cleanText(person?.fullName) ||
            cleanText(person?.nameFirstLast),

        firstName:
            cleanText(person?.firstName),

        lastName:
            cleanText(person?.lastName),

        pitchHandCode:
            cleanText(person?.pitchHand?.code),

        pitchHandDescription:
            cleanText(
                person?.pitchHand?.description
            ),

        side,

        role,

        source
    };
}

function deduplicatePitchers(pitchers) {
    const unique = new Map();

    for (const pitcher of pitchers.filter(Boolean)) {
        const key = [
            pitcher.id,
            pitcher.side,
            pitcher.role
        ].join(":");

        unique.set(key, pitcher);
    }

    return [...unique.values()];
}

function parseTemperature(value) {
    const match = String(value || "").match(
        /(-?\d+(?:\.\d+)?)\s*(?:degrees|deg|°)?/i
    );

    return match
        ? toFiniteNumber(match[1])
        : null;
}

function parseWindSpeed(value) {
    const match = String(value || "").match(
        /(\d+(?:\.\d+)?)\s*mph/i
    );

    return match
        ? toFiniteNumber(match[1])
        : null;
}

function normalizeWeather(gameData, liveData) {
    const officialWeather = gameData?.weather || null;

    const boxscoreInfo = Array.isArray(
        liveData?.boxscore?.info
    )
        ? liveData.boxscore.info
        : [];

    const info = {};

    for (const row of boxscoreInfo) {
        const label = cleanText(row?.label);

        if (label) {
            info[label.toLowerCase()] =
                cleanText(row?.value);
        }
    }

    const boxscoreWeather =
        info.weather || null;

    const wind =
        cleanText(officialWeather?.wind) ||
        info.wind ||
        null;

    const temperature =
        toFiniteNumber(officialWeather?.temp) ??
        parseTemperature(boxscoreWeather);

    const condition =
        cleanText(officialWeather?.condition) ||
        boxscoreWeather ||
        null;

    if (
        !condition &&
        temperature === null &&
        !wind
    ) {
        return null;
    }

    return {
        condition,
        temperatureF: temperature,
        wind,
        windSpeedMph: parseWindSpeed(wind),
        source:
            officialWeather
                ? "gameData.weather"
                : "liveData.boxscore.info"
    };
}

function normalizeVenue(scheduleGame, gameData) {
    const source =
        gameData?.venue ||
        scheduleGame?.venue ||
        null;

    if (!source?.id) {
        return null;
    }

    return {
        id: toPositiveInteger(source.id),
        name: cleanText(source.name),

        city:
            cleanText(source?.location?.city),

        state:
            cleanText(
                source?.location?.stateAbbrev
            ) ||
            cleanText(source?.location?.state),

        country:
            cleanText(source?.location?.country),

        timeZone:
            cleanText(source?.timeZone?.id),

        timeZoneOffset:
            toFiniteNumber(
                source?.timeZone?.offset
            ),

        latitude:
            toFiniteNumber(
                source?.location?.defaultCoordinates
                    ?.latitude
            ),

        longitude:
            toFiniteNumber(
                source?.location?.defaultCoordinates
                    ?.longitude
            )
    };
}

function normalizeStatus(scheduleGame, gameData) {
    const scheduleStatus =
        scheduleGame?.status || {};

    const gameStatus =
        gameData?.status || {};

    const detailed =
        cleanText(gameStatus?.detailedState) ||
        cleanText(scheduleStatus?.detailedState);

    return {
        abstract:
            cleanText(
                gameStatus?.abstractGameState
            ) ||
            cleanText(
                scheduleStatus?.abstractGameState
            ),

        detailed,

        code:
            cleanText(gameStatus?.codedGameState) ||
            cleanText(
                scheduleStatus?.codedGameState
            ),

        statusCode:
            cleanText(gameStatus?.statusCode) ||
            cleanText(scheduleStatus?.statusCode),

        reason:
            cleanText(gameStatus?.reason) ||
            cleanText(scheduleStatus?.reason),

        isFinal: isFinalStatus(detailed)
    };
}

function normalizeFinalScore(
    scheduleGame,
    linescore
) {
    return {
        away:
            toFiniteNumber(
                linescore?.teams?.away?.runs
            ) ??
            toFiniteNumber(
                scheduleGame?.teams?.away?.score
            ),

        home:
            toFiniteNumber(
                linescore?.teams?.home?.runs
            ) ??
            toFiniteNumber(
                scheduleGame?.teams?.home?.score
            )
    };
}

function validateTransformedGame(payload) {
    if (!toPositiveInteger(payload.gamePk)) {
        throw new Error(
            "Transformed game is missing a valid gamePk."
        );
    }

    if (!payload.officialDate) {
        throw new Error(
            `Game ${payload.gamePk} is missing officialDate.`
        );
    }

    if (!payload.awayTeam?.id) {
        throw new Error(
            `Game ${payload.gamePk} is missing the away-team ID.`
        );
    }

    if (!payload.homeTeam?.id) {
        throw new Error(
            `Game ${payload.gamePk} is missing the home-team ID.`
        );
    }

    if (
        payload.awayTeam.id === payload.homeTeam.id
    ) {
        throw new Error(
            `Game ${payload.gamePk} has the same home and away team.`
        );
    }

    if (
        payload.firstFive.available &&
        (
            payload.firstFive.away === null ||
            payload.firstFive.home === null
        )
    ) {
        throw new Error(
            `Game ${payload.gamePk} has an invalid first-five result.`
        );
    }

    return payload;
}

export function transformGame(
    scheduleGame,
    feed
) {
    const gamePk = toPositiveInteger(
        scheduleGame?.gamePk ||
        feed?.gameData?.game?.pk
    );

    if (!gamePk) {
        throw new Error(
            "Game is missing a valid official MLB gamePk."
        );
    }

    const gameData = feed?.gameData || {};
    const liveData = feed?.liveData || {};
    const linescore = liveData?.linescore || {};

    const officialDate =
        cleanText(gameData?.datetime?.officialDate) ||
        cleanText(scheduleGame?.officialDate);

    if (!officialDate) {
        throw new Error(
            `Game ${gamePk} is missing officialDate.`
        );
    }

    const innings = normalizeInnings(linescore);
    const firstFive = calculateFirstFive(
        innings
    );

    const awayTeam = normalizeTeam(
        scheduleGame?.teams?.away,
        gameData?.teams?.away
    );

    const homeTeam = normalizeTeam(
        scheduleGame?.teams?.home,
        gameData?.teams?.home
    );

    const probableAway =
        gameData?.probablePitchers?.away ||
        scheduleGame?.teams?.away
            ?.probablePitcher ||
        null;

    const probableHome =
        gameData?.probablePitchers?.home ||
        scheduleGame?.teams?.home
            ?.probablePitcher ||
        null;

    const confirmedAway =
        getConfirmedStarter(
            liveData,
            "away"
        );

    const confirmedHome =
        getConfirmedStarter(
            liveData,
            "home"
        );

    const pitchers = deduplicatePitchers([
        normalizePitcher({
            person: probableAway,
            side: "away",
            role: "probable_starter",
            source:
                "gameData.probablePitchers"
        }),

        normalizePitcher({
            person: probableHome,
            side: "home",
            role: "probable_starter",
            source:
                "gameData.probablePitchers"
        }),

        normalizePitcher({
            person: confirmedAway,
            side: "away",
            role: "confirmed_starter",
            source:
                "liveData.boxscore"
        }),

        normalizePitcher({
            person: confirmedHome,
            side: "home",
            role: "confirmed_starter",
            source:
                "liveData.boxscore"
        })
    ]);

    const payload = {
        gamePk,

        officialDate,

        season:
            toPositiveInteger(gameData?.game?.season) ||
            toPositiveInteger(
                scheduleGame?.season
            ) ||
            Number(officialDate.slice(0, 4)),

        gameDate:
            cleanText(
                gameData?.datetime?.dateTime
            ) ||
            cleanText(scheduleGame?.gameDate),

        gameType:
            cleanText(gameData?.game?.type) ||
            cleanText(scheduleGame?.gameType),

        status: normalizeStatus(
            scheduleGame,
            gameData
        ),

        awayTeam,

        homeTeam,

        venue: normalizeVenue(
            scheduleGame,
            gameData
        ),

        dayNight:
            cleanText(
                gameData?.datetime?.dayNight
            ) ||
            cleanText(scheduleGame?.dayNight),

        scheduledInnings:
            toPositiveInteger(
                gameData?.game?.scheduledInnings
            ) ||
            toPositiveInteger(
                scheduleGame?.scheduledInnings
            ),

        doubleHeader:
            cleanText(
                gameData?.game?.doubleHeader
            ) ||
            cleanText(
                scheduleGame?.doubleHeader
            ),

        gameNumber:
            toPositiveInteger(
                gameData?.game?.gameNumber
            ) ||
            toPositiveInteger(
                scheduleGame?.gameNumber
            ),

        seriesDescription:
            cleanText(
                gameData?.game?.seriesDescription
            ) ||
            cleanText(
                scheduleGame?.seriesDescription
            ),

        seriesGameNumber:
            toPositiveInteger(
                gameData?.game?.seriesGameNumber
            ) ||
            toPositiveInteger(
                scheduleGame?.seriesGameNumber
            ),

        gamesInSeries:
            toPositiveInteger(
                gameData?.game?.gamesInSeries
            ) ||
            toPositiveInteger(
                scheduleGame?.gamesInSeries
            ),

        finalScore: normalizeFinalScore(
            scheduleGame,
            linescore
        ),

        firstFive,

        innings,

        pitchers,

        weather: normalizeWeather(
            gameData,
            liveData
        ),

        sourceUpdatedAt:
            cleanText(feed?.metaData?.timeStamp),

        source: {
            scheduleEndpoint:
                "/api/v1/schedule",
            gameFeedEndpoint:
                `/api/v1.1/game/${gamePk}/feed/live`
        },

        rawSchedule: scheduleGame,

        rawFeed: feed
    };

    return validateTransformedGame(payload);
}

export {
    isFinalStatus,
    normalizeInnings,
    normalizeTeam,
    normalizeWeather,
    validateTransformedGame
};
