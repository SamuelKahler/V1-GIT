# Live Data + Auto-Grading Roadmap

This file keeps the guaranteed live-data plan in the project without changing the current static prototype.

## Goal
Every completed pick should become Win, Loss, Push, or Pending automatically.

## Required Data Feeds
1. Scores, inning linescores, player box scores, schedules, probable pitchers.
2. Odds and prop-line snapshots.

## Recommended Stack
- Frontend/deploy: Vercel
- Database: Supabase Postgres
- Scores/stats provider: SportsDataIO or Sportradar
- Odds/props provider: The Odds API
- Scheduler: Vercel Cron or Supabase scheduled functions

## Core Tables
- games
- game_linescores
- team_box_scores
- player_box_scores
- odds_snapshots
- picks
- series_results
- grading_audit

## Grading Rules
- ML: selected team final score greater than opponent final score.
- F5 -0.5: selected team leading after 5 innings.
- F5 +0.5: selected team tied or leading after 5 innings.
- Over: final total runs greater than listed total.
- Under: final total runs less than listed total.
- Push: final total equals whole-number total line.
- Pitcher K Over: pitcher strikeouts greater than prop line.
- Pitcher K Under: pitcher strikeouts less than prop line.
- Series ML: team wins the listed series.

## Audit Requirement
Every graded bet should show the rule used, source feed, score/stat used, and timestamp.
