import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const liveGames = pgTable("live_games", {
  id: serial().primaryKey(),
  gamePk: text("game_pk").notNull().unique(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  status: text("status").default("Preview"),
  inning: integer("inning").default(0),
  inningHalf: text("inning_half").default(""),
  gameDate: text("game_date").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const oddsLines = pgTable("odds_lines", {
  id: serial().primaryKey(),
  eventId: text("event_id").notNull().unique(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  commenceTime: timestamp("commence_time"),
  oddsJson: jsonb("odds_json"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const boxScores = pgTable("box_scores", {
  id: serial().primaryKey(),
  gamePk: text("game_pk").notNull(),
  boxScoreJson: jsonb("box_score_json"),
  capturedAt: timestamp("captured_at").defaultNow(),
});
