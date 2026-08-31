-- CFB Prop Trends Table (College Football)
-- Stores historical player prop performance for college football
-- Players who enter NFL draft are flagged as irrelevant

CREATE TABLE IF NOT EXISTS cfb.prop_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  position TEXT,
  school TEXT NOT NULL,
  prop_type TEXT NOT NULL,
  line DECIMAL(10, 1),
  result TEXT NOT NULL CHECK (result IN ('HIT', 'MISS', 'PENDING')),
  context TEXT,
  year INT NOT NULL,
  week_or_game INT,
  odds_or_spread DECIMAL(10, 1),
  drafted BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster trend queries
CREATE INDEX IF NOT EXISTS idx_cfb_prop_trends_player_prop ON cfb.prop_trends(player_name, prop_type, drafted);
CREATE INDEX IF NOT EXISTS idx_cfb_prop_trends_school_year ON cfb.prop_trends(school, year);
CREATE INDEX IF NOT EXISTS idx_cfb_prop_trends_drafted ON cfb.prop_trends(drafted);

-- Verify migration
-- SELECT COUNT(*) FROM cfb.prop_trends;
