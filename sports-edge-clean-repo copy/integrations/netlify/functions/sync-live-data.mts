import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { liveGames, oddsLines, boxScores } from "../../db/schema.js";

export default async () => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const scheduleRes = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=linescore,probablePitcher`
    );
    const schedule = await scheduleRes.json();
    const games = schedule.dates?.[0]?.games ?? [];

    for (const game of games) {
      const homePitcher = game.teams?.home?.probablePitcher?.fullName || "TBD";
      const awayPitcher = game.teams?.away?.probablePitcher?.fullName || "TBD";
      await db
        .insert(liveGames)
        .values({
          gamePk: String(game.gamePk),
          homeTeam: game.teams.home.team.abbreviation,
          awayTeam: game.teams.away.team.abbreviation,
          homeTeamName: game.teams.home.team.name,
          awayTeamName: game.teams.away.team.name,
          homePitcher,
          awayPitcher,
          gameTime: game.gameDate,
          homeScore: game.linescore?.teams?.home?.runs ?? 0,
          awayScore: game.linescore?.teams?.away?.runs ?? 0,
          status: game.status.abstractGameState,
          inning: game.linescore?.currentInning ?? 0,
          inningHalf: game.linescore?.inningHalf ?? "",
          gameDate: today,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: liveGames.gamePk,
          set: {
            homeTeam: game.teams.home.team.abbreviation,
            awayTeam: game.teams.away.team.abbreviation,
            homeTeamName: game.teams.home.team.name,
            awayTeamName: game.teams.away.team.name,
            homePitcher,
            awayPitcher,
            gameTime: game.gameDate,
            homeScore: game.linescore?.teams?.home?.runs ?? 0,
            awayScore: game.linescore?.teams?.away?.runs ?? 0,
            status: game.status.abstractGameState,
            inning: game.linescore?.currentInning ?? 0,
            inningHalf: game.linescore?.inningHalf ?? "",
            updatedAt: new Date(),
          },
        });
    }

    const liveGamePks = games.filter((g: any) => g.status.abstractGameState === "Live").map((g: any) => g.gamePk);
    for (const pk of liveGamePks) {
      const boxRes = await fetch(`https://statsapi.mlb.com/api/v1/game/${pk}/boxscore`);
      const boxData = await boxRes.json();
      await db.insert(boxScores).values({ gamePk: String(pk), boxScoreJson: boxData, capturedAt: new Date() });
    }
  } catch (err) {
    console.error("MLB Stats API fetch failed:", err);
  }

  const oddsKey = Netlify.env.get("ODDS_API_KEY");
  if (oddsKey) {
    try {
      const oddsRes = await fetch(
        `https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=${oddsKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`
      );
      if (oddsRes.ok) {
        const oddsData = await oddsRes.json();
        for (const event of oddsData) {
          await db
            .insert(oddsLines)
            .values({
              eventId: event.id,
              homeTeam: event.home_team,
              awayTeam: event.away_team,
              commenceTime: new Date(event.commence_time),
              oddsJson: event.bookmakers,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({ target: oddsLines.eventId, set: { oddsJson: event.bookmakers, updatedAt: new Date() } });
        }
        console.log(`Odds updated: ${oddsData.length} events`);
      } else {
        console.error("Odds API error:", oddsRes.status, await oddsRes.text());
      }
    } catch (err) {
      console.error("Odds API fetch failed:", err);
    }
  } else {
    console.log("ODDS_API_KEY not set — skipping odds sync");
  }
};

export const config: Config = { schedule: "*/3 * * * *" };
