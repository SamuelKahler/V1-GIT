import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { liveGames, oddsLines } from "../../db/schema.js";
import { eq, desc, asc } from "drizzle-orm";

export default async () => {
  const today = new Date().toISOString().split("T")[0];

  const [games, odds] = await Promise.all([
    db.select().from(liveGames).where(eq(liveGames.gameDate, today)).orderBy(asc(liveGames.gameTime)),
    db.select().from(oddsLines).orderBy(asc(oddsLines.commenceTime), desc(oddsLines.updatedAt)).limit(50),
  ]);

  return Response.json(
    { games, odds, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const config: Config = { path: "/api/live-data" };
