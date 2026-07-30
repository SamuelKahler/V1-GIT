/**
 * ============================================================
 * Sports Edge MLB Intelligence
 * Official MLB Stats API Client
 * ============================================================
 */

const MLB_API_V1 = "https://statsapi.mlb.com/api/v1";
const MLB_GAME_FEED = "https://statsapi.mlb.com/api/v1.1/game";

const DEFAULT_HEADERS = {
    "User-Agent": "SportsEdge/2.0",
    "Accept": "application/json"
};

async function request(path, params = {}) {

    const url = new URL(`${MLB_API_V1}${path}`);

    Object.entries(params).forEach(([key, value]) => {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            url.searchParams.set(key, value);
        }

    });

    const response = await fetch(url, {
        headers: DEFAULT_HEADERS
    });

    if (!response.ok) {

        throw new Error(
            `MLB API ${response.status}: ${response.statusText}`
        );

    }

    return response.json();

}

/* ============================================================
   Schedule
============================================================ */

export async function getSchedule({

    startDate,
    endDate,
    sportId = 1

}) {

    return request("/schedule", {

        sportId,

        startDate,

        endDate,

        hydrate:
            "probablePitcher," +
            "team," +
            "venue," +
            "weather," +
            "linescore"

    });

}

/* ============================================================
   Single Game Feed
============================================================ */

export async function getGame(gamePk) {
    const parsedGamePk = Number(gamePk);

    if (!Number.isInteger(parsedGamePk) || parsedGamePk <= 0) {
        throw new TypeError("gamePk must be a positive integer.");
    }

    const response = await fetch(
        `${MLB_GAME_FEED}/${parsedGamePk}/feed/live`,
        {
            headers: DEFAULT_HEADERS
        }
    );

    if (!response.ok) {
        throw new Error(
            `MLB game feed request failed (${response.status}): ${response.statusText}`
        );
    }

    return response.json();
}



/* ============================================================
   Venue
============================================================ */

export async function getVenue(venueId) {

    return request(`/venues/${venueId}`);

}

/* ============================================================
   Player
============================================================ */

export async function getPlayer(playerId) {

    return request(`/people/${playerId}`);

}

/* ============================================================
   Normalize Schedule Game
============================================================ */

export function normalizeScheduleGame(game) {

    return {

        gamePk: game.gamePk,

        gameDate: game.gameDate,

        season: Number(game.season),

        gameType: game.gameType,

        status:

            game.status?.detailedState ||

            game.status?.abstractGameState ||

            null,

        venueId:

            game.venue?.id ||

            null,

        venueName:

            game.venue?.name ||

            null,

        dayNight:

            game.dayNight ||

            null,

        seriesGameNumber:

            game.seriesGameNumber ||

            null,

        gamesInSeries:

            game.gamesInSeries ||

            null,

        doubleHeader:

            game.doubleHeader ||

            null,

        homeTeamId:

            game.teams?.home?.team?.id ||

            null,

        homeTeamName:

            game.teams?.home?.team?.name ||

            null,

        awayTeamId:

            game.teams?.away?.team?.id ||

            null,

        awayTeamName:

            game.teams?.away?.team?.name ||

            null,

        probableHomePitcher:

            game.teams?.home?.probablePitcher ||

            null,

        probableAwayPitcher:

            game.teams?.away?.probablePitcher ||

            null

    };

}

/* ============================================================
   Normalize Live Feed
============================================================ */

export function normalizeGameFeed(feed) {

    const game = feed.gameData;

    const live = feed.liveData;

    const box = live.boxscore;

    const linescore = live.linescore;

    const innings = linescore?.innings || [];

    let f5Home = 0;
    let f5Away = 0;

    innings
        .filter(i => i.num <= 5)
        .forEach(i => {

            f5Away += i.away?.runs || 0;

            f5Home += i.home?.runs || 0;

        });

    return {

        gamePk: game.game.pk,

        officialDate: game.datetime.originalDate,

        venueId: game.venue?.id,

        venueName: game.venue?.name,

        weather: game.weather || null,

        attendance:

            box?.info?.find(
                x => x.label === "Att"
            )?.value || null,

        homeScore:

            linescore?.teams?.home?.runs ?? null,

        awayScore:

            linescore?.teams?.away?.runs ?? null,

        innings,

        f5Home,

        f5Away,

        currentInning:

            linescore?.currentInning ||

            null,

        scheduledInnings:

            linescore?.scheduledInnings ||

            9,

        homePitchers:

            Object.values(
                box?.teams?.home?.players || {}
            ),

        awayPitchers:

            Object.values(
                box?.teams?.away?.players || {}
            )

    };

}

/* ============================================================
   Helpers
============================================================ */

export function calculateF5(innings = []) {

    let home = 0;

    let away = 0;

    innings
        .filter(i => i.num <= 5)
        .forEach(i => {

            home += i.home?.runs || 0;

            away += i.away?.runs || 0;

        });

    return {

        home,

        away

    };

}

export default {

    getSchedule,

    getGame,

    getTeam,

    getVenue,

    getPlayer,

    normalizeScheduleGame,

    normalizeGameFeed,

    calculateF5

};
