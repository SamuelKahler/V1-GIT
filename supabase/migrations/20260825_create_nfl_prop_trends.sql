-- NFL Prop Trends Table
-- Stores historical player prop performance for NFL
-- Separate from college data - no cross-pollination

CREATE TABLE IF NOT EXISTS nfl.prop_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  position TEXT,
  team TEXT NOT NULL,
  prop_type TEXT NOT NULL,
  line DECIMAL(10, 1),
  result TEXT NOT NULL CHECK (result IN ('HIT', 'MISS', 'PENDING')),
  environment TEXT,
  year INT NOT NULL,
  week INT,
  odds_or_spread DECIMAL(10, 1),
  opponent TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for trend queries
CREATE INDEX IF NOT EXISTS idx_nfl_prop_trends_player_prop ON nfl.prop_trends(player_name, prop_type);
CREATE INDEX IF NOT EXISTS idx_nfl_prop_trends_team_year ON nfl.prop_trends(team, year);
CREATE INDEX IF NOT EXISTS idx_nfl_prop_trends_environment ON nfl.prop_trends(environment);
CREATE INDEX IF NOT EXISTS idx_nfl_prop_trends_year_week ON nfl.prop_trends(year, week);

-- Verify migration
-- SELECT COUNT(*) FROM nfl.prop_trends;
