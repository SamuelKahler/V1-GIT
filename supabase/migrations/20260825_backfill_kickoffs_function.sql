-- NFL Game Kickoff Backfill via Supabase
-- Run directly in Supabase SQL Editor to backfill Week 1 2025 kickoff times

CREATE OR REPLACE FUNCTION sports_edge_nfl_fetch_and_backfill_kickoffs(
  p_season INT DEFAULT 2025,
  p_week INT DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_response JSONB;
  v_events JSONB;
  v_event JSONB;
  v_away_team TEXT;
  v_home_team TEXT;
  v_kickoff_at TIMESTAMP WITH TIME ZONE;
  v_updated_count INT := 0;
  v_total_events INT := 0;
  v_parsed_count INT := 0;
BEGIN
  -- Fetch from ESPN NFL Stats API
  -- Using http extension (must be enabled in Supabase)
  
  -- Build the ESPN API URL
  DECLARE
    v_url TEXT := 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?season=' || p_season || '&week=' || p_week;
  BEGIN
    -- Fetch the schedule
    SELECT 
      (http_get(v_url)).content::JSONB INTO v_response;
    
    IF v_response IS NULL OR v_response->>'events' IS NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Failed to fetch ESPN schedule or no events found',
        'url', v_url
      );
    END IF;
    
    -- Extract events array
    v_events := v_response->'events';
    v_total_events := jsonb_array_length(v_events);
    
    -- Process each event
    FOR v_event IN SELECT jsonb_array_elements(v_events)
    LOOP
      -- Extract away team from competitors[1]
      v_away_team := CASE
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Cardinals%' THEN 'ARI'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Falcons%' THEN 'ATL'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Ravens%' THEN 'BAL'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Bills%' THEN 'BUF'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Panthers%' THEN 'CAR'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Bears%' THEN 'CHI'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Bengals%' THEN 'CIN'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Browns%' THEN 'CLE'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Cowboys%' THEN 'DAL'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Broncos%' THEN 'DEN'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Lions%' THEN 'DET'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Packers%' THEN 'GB'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Texans%' THEN 'HOU'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Colts%' THEN 'IND'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Jaguars%' THEN 'JAX'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Chiefs%' THEN 'KC'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Chargers%' THEN 'LAC'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Rams%' THEN 'LAR'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Raiders%' THEN 'LV'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Dolphins%' THEN 'MIA'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Vikings%' THEN 'MIN'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Patriots%' THEN 'NE'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Saints%' THEN 'NO'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Giants%' THEN 'NYG'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Jets%' THEN 'NYJ'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Eagles%' THEN 'PHI'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Steelers%' THEN 'PIT'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Seahawks%' THEN 'SEA'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%49ers%' THEN 'SF'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Buccaneers%' THEN 'TB'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Titans%' THEN 'TEN'
        WHEN v_event->'competitions'->0->'competitors'->1->'team'->>'name' LIKE '%Commanders%' THEN 'WAS'
        ELSE NULL
      END;
      
      -- Extract home team from competitors[0]
      v_home_team := CASE
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Cardinals%' THEN 'ARI'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Falcons%' THEN 'ATL'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Ravens%' THEN 'BAL'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Bills%' THEN 'BUF'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Panthers%' THEN 'CAR'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Bears%' THEN 'CHI'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Bengals%' THEN 'CIN'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Browns%' THEN 'CLE'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Cowboys%' THEN 'DAL'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Broncos%' THEN 'DEN'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Lions%' THEN 'DET'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Packers%' THEN 'GB'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Texans%' THEN 'HOU'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Colts%' THEN 'IND'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Jaguars%' THEN 'JAX'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Chiefs%' THEN 'KC'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Chargers%' THEN 'LAC'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Rams%' THEN 'LAR'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Raiders%' THEN 'LV'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Dolphins%' THEN 'MIA'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Vikings%' THEN 'MIN'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Patriots%' THEN 'NE'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Saints%' THEN 'NO'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Giants%' THEN 'NYG'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Jets%' THEN 'NYJ'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Eagles%' THEN 'PHI'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Steelers%' THEN 'PIT'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Seahawks%' THEN 'SEA'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%49ers%' THEN 'SF'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Buccaneers%' THEN 'TB'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Titans%' THEN 'TEN'
        WHEN v_event->'competitions'->0->'competitors'->0->'team'->>'name' LIKE '%Commanders%' THEN 'WAS'
        ELSE NULL
      END;
      
      -- Parse kickoff time
      v_kickoff_at := (v_event->>'date')::TIMESTAMP WITH TIME ZONE;
      
      -- Only update if we have all required data
      IF v_away_team IS NOT NULL AND v_home_team IS NOT NULL AND v_kickoff_at IS NOT NULL THEN
        v_parsed_count := v_parsed_count + 1;
        
        -- Update the game
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
        END IF;
      END IF;
    END LOOP;
    
    RETURN jsonb_build_object(
      'success', true,
      'espnEventsFound', v_total_events,
      'parsedGames', v_parsed_count,
      'updatedGames', v_updated_count,
      'season', p_season,
      'week', p_week,
      'completedAt', NOW()
    );
  END;
END;
$$;

-- Enable http extension if not already enabled
-- Run this first if http extension is not available:
-- CREATE EXTENSION IF NOT EXISTS http;
