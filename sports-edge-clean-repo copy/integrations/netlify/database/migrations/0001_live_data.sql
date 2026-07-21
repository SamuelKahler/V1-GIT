CREATE TABLE "box_scores" (
	"id" serial PRIMARY KEY,
	"game_pk" text NOT NULL,
	"box_score_json" jsonb,
	"captured_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "live_games" (
	"id" serial PRIMARY KEY,
	"game_pk" text NOT NULL UNIQUE,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"home_score" integer DEFAULT 0,
	"away_score" integer DEFAULT 0,
	"status" text DEFAULT 'Preview',
	"inning" integer DEFAULT 0,
	"inning_half" text DEFAULT '',
	"game_date" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "odds_lines" (
	"id" serial PRIMARY KEY,
	"event_id" text NOT NULL UNIQUE,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"commence_time" timestamp,
	"odds_json" jsonb,
	"updated_at" timestamp DEFAULT now()
);
