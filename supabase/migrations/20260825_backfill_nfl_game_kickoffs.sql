-- NFL Game Kickoff Backfill Migration
-- Backfills missing kickoff_at timestamps for 2025 NFL games from ESPN schedule
-- Safe: Only updates NULL kickoff_at values, never overwrites existing data

CREATE OR REPLACE FUNCTION sports_edge_nfl_backfill_game_kickoffs(
  p_season INT,
  p_week INT,
  p_updates JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_update JSONB;
  v_away_team TEXT;
  v_home_team TEXT;
  v_kickoff_at TIMESTAMP WITH TIME ZONE;
  v_updated_count INT := 0;
  v_skipped_count INT := 0;
  v_null_to_timestamp INT := 0;
  v_result JSONB;
BEGIN
  -- Iterate through each update
  FOR v_update IN SELECT jsonb_array_elements(p_updates)
  LOOP
    v_away_team := v_update->>'awayTeam';
    v_home_team := v_update->>'homeTeam';
    v_kickoff_at := (v_update->>'kickoffAt')::TIMESTAMP WITH TIME ZONE;

    -- Validate
    IF v_away_team IS NULL OR v_home_team IS NULL OR v_kickoff_at IS NULL THEN
      v_skipped_count := v_skipped_count + 1;
      CONTINUE;
    END IF;

    -- Update only if kickoff_at is currently NULL
    UPDATE nfl.games
    SET
      kickoff_at = v_kickoff_at,
      updated_at = NOW()
    WHERE
      season = p_season
      AND week = p_week
      AND away_team = v_away_team
      AND home_team = v_home_team
      AND kickoff_at IS NULL;

    IF FOUND THEN
      v_updated_count := v_updated_count + 1;
      v_null_to_timestamp := v_null_to_timestamp + 1;
    ELSE
      v_skipped_count := v_skipped_count + 1;
    END IF;
  END LOOP;

  v_result := jsonb_build_object(
    'season', p_season,
    'week', p_week,
    'updated', v_updated_count,
    'skipped', v_skipped_count,
    'nullToTimestamp', v_null_to_timestamp,
    'executedAt', NOW()
  );

  RETURN v_result;
END;
$$;

-- Verify the migration
-- Run this query after migration to check results:
-- SELECT 
--   COUNT(*) as total_games,
--   COUNT(CASE WHEN kickoff_at IS NOT NULL THEN 1 END) as with_kickoff,
--   COUNT(CASE WHEN kickoff_at IS NULL THEN 1 END) as without_kickoff
-- FROM nfl.games
-- WHERE season = 2025 AND week = 1;
