ALTER TABLE "live_games" ADD COLUMN IF NOT EXISTS "home_team_name" text DEFAULT '';
ALTER TABLE "live_games" ADD COLUMN IF NOT EXISTS "away_team_name" text DEFAULT '';
ALTER TABLE "live_games" ADD COLUMN IF NOT EXISTS "home_pitcher" text DEFAULT 'TBD';
ALTER TABLE "live_games" ADD COLUMN IF NOT EXISTS "away_pitcher" text DEFAULT 'TBD';
ALTER TABLE "live_games" ADD COLUMN IF NOT EXISTS "game_time" text DEFAULT '';
