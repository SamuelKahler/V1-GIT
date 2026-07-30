/**
 * Sports Edge MLB Intelligence
 * Phase 2A deterministic validation suite
 *
 * This script does not require:
 * - Supabase
 * - Vercel
 * - MLB network access
 *
 * Run with:
 * npm run validate:phase2a
 */

import assert from "node:assert/strict";

import {
    calculateFirstFive,
    transformGame
} from "../lib/mlb/transform.js";

import {
    extractScheduleGames,
    mapWithConcurrency,
    validateImportRange
} from "../lib/mlb/importer.js";

import {
    requireIsoDate,
    requirePositiveInteger,
    buildUrl
} from "../lib/mlb/stats-api-client.js";

import {
    safeEqual
} from "../lib/mlb/auth.js";

import {
    validateRpcName
} from "../lib/mlb/supabase.js";

function test(name, callback) {
    try {
        const result = callback();

        if (
            result &&
            typeof result.then === "function"
        ) {
            return result
                .then(() => {
                    console.log(`PASS: ${name}`);
                })
                .catch((error) => {
                    console.error(`FAIL: ${name}`);
                    throw error;
                });
        }

        console.log(`PASS: ${name}`);
        return Promise.resolve();
    } catch (error) {
        console.error(`FAIL: ${name}`);
        return Promise.reject(error);
    }
}

function expectThrow(callback, messagePattern) {
    let thrown = null;

    try {
        callback();
    } catch (error) {
        thrown = error;
    }

    assert.ok(
        thrown,
        "Expected the callback to throw."
    );

    if (messagePattern) {
        assert.match(
            String(thrown.message),
            messagePattern
        );
    }
}

function buildCompleteInnings() {
    return [
        {
            number: 1,
            awayRuns: 1,
            homeRuns: 0
        },
        {
            number: 2,
            awayRuns: 0,
            homeRuns: 2
        },
        {
            number: 3,
            awayRuns: 1,
            homeRuns: 0
        },
        {
            number: 4,
            awayRuns: 0,
            homeRuns: 1
        },
        {
            number: 5,
            awayRuns: 2,
            homeRuns: 0
        },
        {
            number: 6,
            awayRuns: 5,
            homeRuns: 5
        }
    ];
}

function buildScheduleGame() {
    return {
        gamePk: 777001,
        season: "2026",
        gameDate: "2026-07-29T23:10:00Z",
        officialDate: "2026-07-29",
        gameType: "R",
        dayNight: "night",
        doubleHeader: "N",
        gameNumber: 1,
        seriesDescription: "Regular Season",
        seriesGameNumber: 2,
        gamesInSeries: 3,
        venue: {
            id: 10,
            name: "Sports Edge Test Park"
        },
        status: {
            abstractGameState: "Final",
            detailedState: "Final",
            codedGameState: "F",
            statusCode: "F"
        },
        teams: {
            away: {
                score: 4,
                team: {
                    id: 101,
                    name: "Away Test Club",
                    abbreviation: "AWY"
                },
                probablePitcher: {
                    id: 5001,
                    fullName: "Away Probable",
                    pitchHand: {
                        code: "R",
                        description: "Right"
                    }
                }
            },
            home: {
                score: 3,
                team: {
                    id: 102,
                    name: "Home Test Club",
                    abbreviation: "HME"
                },
                probablePitcher: {
                    id: 5002,
                    fullName: "Home Probable",
                    pitchHand: {
                        code: "L",
                        description: "Left"
                    }
                }
            }
        }
    };
}

function buildGameFeed() {
    return {
        metaData: {
            timeStamp: "20260730_120000"
        },
        gameData: {
            game: {
                pk: 777001,
                season: "2026",
                type: "R",
                scheduledInnings: 9,
                doubleHeader: "N",
                gameNumber: 1,
                seriesDescription: "Regular Season",
                seriesGameNumber: 2,
                gamesInSeries: 3
            },
            datetime: {
                officialDate: "2026-07-29",
                dateTime: "2026-07-29T23:10:00Z",
                dayNight: "night"
            },
            status: {
                abstractGameState: "Final",
                detailedState: "Final",
                codedGameState: "F",
                statusCode: "F"
            },
            teams: {
                away: {
                    id: 101,
                    name: "Away Test Club",
                    teamName: "Away",
                    clubName: "Test Club",
                    locationName: "Away City",
                    abbreviation: "AWY",
                    league: {
                        id: 103,
                        name: "American League"
                    },
                    division: {
                        id: 200,
                        name: "Test Division"
                    },
                    sport: {
                        id: 1
                    },
                    active: true
                },
                home: {
                    id: 102,
                    name: "Home Test Club",
                    teamName: "Home",
                    clubName: "Test Club",
                    locationName: "Home City",
                    abbreviation: "HME",
                    league: {
                        id: 104,
                        name: "National League"
                    },
                    division: {
                        id: 201,
                        name: "Test Division"
                    },
                    sport: {
                        id: 1
                    },
                    active: true
                }
            },
            venue: {
                id: 10,
                name: "Sports Edge Test Park",
                location: {
                    city: "Test City",
                    stateAbbrev: "CA",
                    country: "USA",
                    defaultCoordinates: {
                        latitude: 32.7,
                        longitude: -117.2
                    }
                },
                timeZone: {
                    id: "America/Los_Angeles",
                    offset: -7
                }
            },
            probablePitchers: {
                away: {
                    id: 5001,
                    fullName: "Away Probable",
                    pitchHand: {
                        code: "R",
                        description: "Right"
                    }
                },
                home: {
                    id: 5002,
                    fullName: "Home Probable",
                    pitchHand: {
                        code: "L",
                        description: "Left"
                    }
                }
            },
            weather: {
                condition: "Clear",
                temp: 72,
                wind: "8 mph, Out To RF"
            }
        },
        liveData: {
            linescore: {
                scheduledInnings: 9,
                teams: {
                    away: {
                        runs: 4
                    },
                    home: {
                        runs: 3
                    }
                },
                innings: [
                    {
                        num: 1,
                        ordinalNum: "1st",
                        away: {
                            runs: 1,
                            hits: 2,
                            errors: 0
                        },
                        home: {
                            runs: 0,
                            hits: 1,
                            errors: 0
                        }
                    },
                    {
                        num: 2,
                        ordinalNum: "2nd",
                        away: {
                            runs: 0,
                            hits: 0,
                            errors: 0
                        },
                        home: {
                            runs: 2,
                            hits: 3,
                            errors: 0
                        }
                    },
                    {
                        num: 3,
                        ordinalNum: "3rd",
                        away: {
                            runs: 1,
                            hits: 1,
                            errors: 0
                        },
                        home: {
                            runs: 0,
                            hits: 0,
                            errors: 0
                        }
                    },
                    {
                        num: 4,
                        ordinalNum: "4th",
                        away: {
                            runs: 0,
                            hits: 0,
                            errors: 0
                        },
                        home: {
                            runs: 1,
                            hits: 2,
                            errors: 0
                        }
                    },
                    {
                        num: 5,
                        ordinalNum: "5th",
                        away: {
                            runs: 2,
                            hits: 2,
                            errors: 0
                        },
                        home: {
                            runs: 0,
                            hits: 0,
                            errors: 0
                        }
                    }
                ]
            },
            boxscore: {
                info: [
                    {
                        label: "Weather",
                        value: "72 degrees, Clear"
                    },
                    {
                        label: "Wind",
                        value: "8 mph, Out To RF"
                    }
                ],
                teams: {
                    away: {
                        pitchers: [5001],
                        players: {
                            ID5001: {
                                person: {
                                    id: 5001,
                                    fullName: "Away Starter",
                                    firstName: "Away",
                                    lastName: "Starter",
                                    pitchHand: {
                                        code: "R",
                                        description: "Right"
                                    }
                                }
                            }
                        }
                    },
                    home: {
                        pitchers: [5002],
                        players: {
                            ID5002: {
                                person: {
                                    id: 5002,
                                    fullName: "Home Starter",
                                    firstName: "Home",
                                    lastName: "Starter",
                                    pitchHand: {
                                        code: "L",
                                        description: "Left"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

const tests = [];

tests.push(
    test(
        "calculateFirstFive totals exactly innings 1 through 5",
        () => {
            const result = calculateFirstFive(
                buildCompleteInnings()
            );

            assert.deepEqual(result, {
                available: true,
                away: 4,
                home: 3
            });
        }
    )
);

tests.push(
    test(
        "calculateFirstFive rejects incomplete innings",
        () => {
            const innings = buildCompleteInnings()
                .filter((inning) => inning.number !== 4);

            const result =
                calculateFirstFive(innings);

            assert.deepEqual(result, {
                available: false,
                away: null,
                home: null
            });
        }
    )
);

tests.push(
    test(
        "calculateFirstFive does not count extra innings",
        () => {
            const result = calculateFirstFive(
                buildCompleteInnings()
            );

            assert.equal(result.away, 4);
            assert.equal(result.home, 3);
        }
    )
);

tests.push(
    test(
        "transformGame creates the canonical game package",
        () => {
            const transformed = transformGame(
                buildScheduleGame(),
                buildGameFeed()
            );

            assert.equal(
                transformed.gamePk,
                777001
            );

            assert.equal(
                transformed.officialDate,
                "2026-07-29"
            );

            assert.equal(
                transformed.awayTeam.id,
                101
            );

            assert.equal(
                transformed.homeTeam.id,
                102
            );

            assert.deepEqual(
                transformed.finalScore,
                {
                    away: 4,
                    home: 3
                }
            );

            assert.deepEqual(
                transformed.firstFive,
                {
                    available: true,
                    away: 4,
                    home: 3
                }
            );

            assert.equal(
                transformed.innings.length,
                5
            );

            assert.equal(
                transformed.weather.temperatureF,
                72
            );

            assert.equal(
                transformed.weather.windSpeedMph,
                8
            );

            assert.equal(
                transformed.status.isFinal,
                true
            );

            assert.ok(
                transformed.rawSchedule
            );

            assert.ok(
                transformed.rawFeed
            );
        }
    )
);

tests.push(
    test(
        "transformGame retains probable and confirmed starters",
        () => {
            const transformed = transformGame(
                buildScheduleGame(),
                buildGameFeed()
            );

            const roles = transformed.pitchers.map(
                (pitcher) => {
                    return [
                        pitcher.side,
                        pitcher.role,
                        pitcher.pitchHandCode
                    ].join(":");
                }
            );

            assert.ok(
                roles.includes(
                    "away:probable_starter:R"
                )
            );

            assert.ok(
                roles.includes(
                    "home:probable_starter:L"
                )
            );

            assert.ok(
                roles.includes(
                    "away:confirmed_starter:R"
                )
            );

            assert.ok(
                roles.includes(
                    "home:confirmed_starter:L"
                )
            );
        }
    )
);

tests.push(
    test(
        "validateImportRange accepts an inclusive seven-day range",
        () => {
            const result = validateImportRange(
                "2026-07-01",
                "2026-07-07"
            );

            assert.equal(result.dayCount, 7);
        }
    )
);

tests.push(
    test(
        "validateImportRange rejects ranges longer than seven days",
        () => {
            expectThrow(
                () => {
                    validateImportRange(
                        "2026-07-01",
                        "2026-07-08"
                    );
                },
                /limited to 7 calendar days/i
            );
        }
    )
);

tests.push(
    test(
        "extractScheduleGames deduplicates by official gamePk",
        () => {
            const games = extractScheduleGames({
                dates: [
                    {
                        games: [
                            {
                                gamePk: 1001
                            },
                            {
                                gamePk: 1002
                            }
                        ]
                    },
                    {
                        games: [
                            {
                                gamePk: 1001
                            },
                            {
                                gamePk: null
                            }
                        ]
                    }
                ]
            });

            assert.equal(games.length, 2);

            assert.deepEqual(
                games.map((game) => game.gamePk),
                [1001, 1002]
            );
        }
    )
);

tests.push(
    test(
        "mapWithConcurrency preserves result order",
        async () => {
            const values = [3, 1, 2];

            const results =
                await mapWithConcurrency(
                    values,
                    2,
                    async (value) => {
                        await new Promise(
                            (resolve) => {
                                setTimeout(
                                    resolve,
                                    value * 5
                                );
                            }
                        );

                        return value * 10;
                    }
                );

            assert.deepEqual(
                results,
                [30, 10, 20]
            );
        }
    )
);

tests.push(
    test(
        "safeEqual accepts equal tokens",
        () => {
            assert.equal(
                safeEqual(
                    "abcdefghijklmnopqrstuvwxyz123456",
                    "abcdefghijklmnopqrstuvwxyz123456"
                ),
                true
            );
        }
    )
);

tests.push(
    test(
        "safeEqual rejects unequal tokens",
        () => {
            assert.equal(
                safeEqual(
                    "abcdefghijklmnopqrstuvwxyz123456",
                    "abcdefghijklmnopqrstuvwxyz123457"
                ),
                false
            );
        }
    )
);

tests.push(
    test(
        "requireIsoDate validates real calendar dates",
        () => {
            assert.equal(
                requireIsoDate(
                    "2026-07-30",
                    "date"
                ),
                "2026-07-30"
            );

            expectThrow(
                () => {
                    requireIsoDate(
                        "2026-02-30",
                        "date"
                    );
                },
                /valid calendar date/i
            );
        }
    )
);

tests.push(
    test(
        "requirePositiveInteger rejects invalid identifiers",
        () => {
            assert.equal(
                requirePositiveInteger(
                    123,
                    "gamePk"
                ),
                123
            );

            expectThrow(
                () => {
                    requirePositiveInteger(
                        0,
                        "gamePk"
                    );
                },
                /positive integer/i
            );
        }
    )
);

tests.push(
    test(
        "buildUrl encodes MLB request parameters",
        () => {
            const url = buildUrl(
                "https://statsapi.mlb.com/api/v1",
                "/schedule",
                {
                    startDate: "2026-07-29",
                    hydrate: "team,venue"
                }
            );

            const parsed = new URL(url);

            assert.equal(
                parsed.pathname,
                "/api/v1/schedule"
            );

            assert.equal(
                parsed.searchParams.get(
                    "startDate"
                ),
                "2026-07-29"
            );

            assert.equal(
                parsed.searchParams.get(
                    "hydrate"
                ),
                "team,venue"
            );
        }
    )
);

tests.push(
    test(
        "validateRpcName permits expected RPC names",
        () => {
            assert.equal(
                validateRpcName(
                    "sports_edge_mlb_upsert_game"
                ),
                "sports_edge_mlb_upsert_game"
            );
        }
    )
);

tests.push(
    test(
        "validateRpcName rejects unsafe names",
        () => {
            expectThrow(
                () => {
                    validateRpcName(
                        "sports_edge_mlb_status; drop table"
                    );
                },
                /invalid/i
            );
        }
    )
);

try {
    await Promise.all(tests);

    console.log("");
    console.log(
        "PHASE_2A_VALIDATION_PASSED"
    );
} catch (error) {
    console.error("");
    console.error(
        "PHASE_2A_VALIDATION_FAILED"
    );
    console.error(error);
    process.exitCode = 1;
}
