import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// College players known to be drafted - DQ them
const DRAFTED_COLLEGE_PLAYERS = new Set([
  'Ryan Williams',      // Alabama WR
  'Noah Fifita',        // Arizona QB
  'Raleek Brown',       // Texas RB
  'Jaylen Raynor',      // Arkansas State QB
  'Jeremiah Smith',     // Ohio State WR
  'Jayden Maiava'       // USC QB
]);

const CFB_DATA = [
  { position: 'WR', school: 'ALABAMA', player_name: 'Ryan Williams', prop_type: 'ANYT TD', line: null, odds_or_spread: 175, result: 'MISS', year: 2025 },
  { position: 'WR', school: 'ALABAMA', player_name: 'Ryan Williams', prop_type: 'ANYT TD', line: null, odds_or_spread: 120, result: 'MISS', year: 2025 },
  { position: 'WR', school: 'ALABAMA', player_name: 'Ryan Williams', prop_type: 'ANYT TD', line: null, odds_or_spread: 120, result: 'MISS', year: 2025 },
  { position: 'WR', school: 'ALABAMA', player_name: 'Ryan Williams', prop_type: 'ANYT TD', line: null, odds_or_spread: 110, result: 'HIT', year: 2025 },
  { position: 'WR', school: 'ALABAMA', player_name: 'Ryan Williams', prop_type: 'OVER RECEIVING YARDS', line: 65.5, odds_or_spread: null, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'ARIZONA', player_name: 'Noah Fifita', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 102, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'ARIZONA', player_name: 'Noah Fifita', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 158, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'ARIZONA', player_name: 'Noah Fifita', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 114, result: 'HIT', year: 2025 },
  { position: 'QB', school: 'ARIZONA', player_name: 'Noah Fifita', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 165, result: 'HIT', year: 2025 },
  { position: 'QB', school: 'LSU', player_name: 'Sam Leavitt', prop_type: 'OVER RUSHING YARDS', line: null, odds_or_spread: null, result: 'PENDING', year: 2025 },
  { position: 'RB', school: 'TEXAS', player_name: 'Raleek Brown', prop_type: 'OVER RUSHING YARDS', line: 57.5, odds_or_spread: null, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'ARKANSAS STATE', player_name: 'Jaylen Raynor', prop_type: 'OVER PASSING YARDS', line: null, odds_or_spread: null, result: 'PENDING', year: 2025 },
  { position: 'QB', school: 'ARKANSAS STATE', player_name: 'Jaylen Raynor', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: null, result: 'PENDING', year: 2025 },
  { position: 'WR', school: 'ARKANSAS', player_name: "O'Mega Blake", prop_type: 'ANYT TD', line: null, odds_or_spread: 125, result: 'MISS', year: 2025 },
  { position: 'WR', school: 'ARKANSAS', player_name: "O'Mega Blake", prop_type: 'OVER RECEIVING YARDS', line: 71.5, odds_or_spread: null, result: 'HIT', year: 2025 },
  { position: 'QB', school: 'UNLV', player_name: 'Jackson Arnold', prop_type: 'OVER RUSHING YARDS', line: 34.5, odds_or_spread: null, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'UNLV', player_name: 'Jackson Arnold', prop_type: 'OVER RUSHING YARDS', line: 43.5, odds_or_spread: null, result: 'MISS', year: 2025 },
  { position: 'RB', school: 'AUBURN', player_name: 'Jeremiah Cobb', prop_type: 'OVER RUSHING YARDS', line: 59.5, odds_or_spread: null, result: 'HIT', year: 2025 },
  { position: 'RB', school: 'AUBURN', player_name: 'Jeremiah Cobb', prop_type: 'OVER RUSHING YARDS', line: 51.5, odds_or_spread: null, result: 'MISS', year: 2025 },
  { position: 'WR', school: 'OHIO STATE', player_name: 'Jeremiah Smith', prop_type: 'ANYT TD', line: null, odds_or_spread: 127, result: 'HIT', year: 2025 },
  { position: 'WR', school: 'OHIO STATE', player_name: 'Jeremiah Smith', prop_type: 'ANYT TD', line: null, odds_or_spread: 179, result: 'HIT', year: 2025 },
  { position: 'WR', school: 'OHIO STATE', player_name: 'Jeremiah Smith', prop_type: 'ANYT TD', line: null, odds_or_spread: 195, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'USC', player_name: 'Jayden Maiava', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 115, result: 'MISS', year: 2025 },
  { position: 'QB', school: 'USC', player_name: 'Jayden Maiava', prop_type: 'OVER PASSING TDs', line: null, odds_or_spread: 162, result: 'MISS', year: 2025 },
];

const NFL_DATA = [
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 25.5, odds_or_spread: null, result: 'MISS', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'CIN' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 23.5, odds_or_spread: null, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'NYG' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 22.5, odds_or_spread: null, result: 'HIT', environment: 'HOME UNDERDOG', year: 2025, week: 15, opponent: 'BUF' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 22.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY UNDERDOG', year: 2025, week: 16, opponent: 'BAL' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 20, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 17, opponent: 'NYJ' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'RUSH YARDS', line: 18.5, odds_or_spread: null, result: 'HIT', environment: 'HOME FAVORITE', year: 2025, week: 18, opponent: 'MIA' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'YARDS', line: 255.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'CIN' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'YARDS', line: 243.5, odds_or_spread: null, result: 'HIT', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'NYG' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'YARDS', line: 235.5, odds_or_spread: null, result: 'MISS', environment: 'HOME UNDERDOG', year: 2025, week: 15, opponent: 'BUF' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'YARDS', line: 246.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY UNDERDOG', year: 2025, week: 16, opponent: 'BAL' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'TDs', line: 1.5, odds_or_spread: -186, result: 'MISS', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'CIN' },
  { player_name: 'Drake Maye', position: 'QB', team: 'NE', prop_type: 'TDs', line: 1.5, odds_or_spread: -174, result: 'HIT', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'NYG' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'RUSH YARDS', line: 2, odds_or_spread: null, result: 'MISS', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'TEN' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'RUSH YARDS', line: 3, odds_or_spread: null, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'MIN' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'RUSH YARDS', line: 1.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 14, opponent: 'ATL' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'YARDS', line: 241.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'TEN' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'YARDS', line: 234, odds_or_spread: null, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'MIN' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'YARDS', line: 234, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 14, opponent: 'ATL' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'TDs', line: 1.5, odds_or_spread: -135, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'TEN' },
  { player_name: 'Sam Darnold', position: 'QB', team: 'SEA', prop_type: 'TDs', line: 1.5, odds_or_spread: -130, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'MIN' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'YARDS', line: 60.5, odds_or_spread: null, result: 'HIT', environment: 'NEW TEAM', year: 2025, week: 7, opponent: 'MIN' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'YARDS', line: 56.5, odds_or_spread: null, result: 'MISS', environment: 'NEW TEAM', year: 2025, week: 10, opponent: 'GB' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'YARDS', line: 63.5, odds_or_spread: null, result: 'MISS', environment: 'NEW TEAM', year: 2025, week: 11, opponent: 'DET' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'YARDS', line: 59.5, odds_or_spread: null, result: 'HIT', environment: 'NEW TEAM', year: 2025, week: 12, opponent: 'DAL' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'YARDS', line: 57.5, odds_or_spread: null, result: 'HIT', environment: 'NEW TEAM', year: 2025, week: 13, opponent: 'CHI' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'RECEPTIONS', line: 4.5, odds_or_spread: -120, result: 'MISS', environment: 'NEW TEAM', year: 2025, week: 7, opponent: 'MIN' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'RECEPTIONS', line: 4.5, odds_or_spread: 100, result: 'MISS', environment: 'NEW TEAM', year: 2025, week: 10, opponent: 'GB' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'RECEPTIONS', line: 4.5, odds_or_spread: -115, result: 'HIT', environment: 'NEW TEAM', year: 2025, week: 11, opponent: 'DET' },
  { player_name: 'A.J. Brown', position: 'WR', team: 'PHI', prop_type: 'RECEPTIONS', line: 4.5, odds_or_spread: -129, result: 'HIT', environment: 'NEW TEAM', year: 2025, week: 12, opponent: 'DAL' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'YARDS', line: 96.5, odds_or_spread: null, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'TEN' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'YARDS', line: 98, odds_or_spread: null, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'MIN' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'YARDS', line: 93.5, odds_or_spread: null, result: 'MISS', environment: 'AWAY FAVORITE', year: 2025, week: 14, opponent: 'ATL' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'RECEPTIONS', line: 6.5, odds_or_spread: -146, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 12, opponent: 'TEN' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'RECEPTIONS', line: 6.5, odds_or_spread: -129, result: 'MISS', environment: 'HOME FAVORITE', year: 2025, week: 13, opponent: 'MIN' },
  { player_name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', prop_type: 'RECEPTIONS', line: 6.5, odds_or_spread: -117, result: 'HIT', environment: 'AWAY FAVORITE', year: 2025, week: 14, opponent: 'ATL' },
];

export async function ingestPropTrends() {
  try {
    console.log('🚀 Starting prop trends ingestion...\n');

    // 1. Ingest CFB Data
    console.log('📚 Ingesting College Football props...');
    const cfb_rows = CFB_DATA.map(row => ({
      ...row,
      drafted: DRAFTED_COLLEGE_PLAYERS.has(row.player_name)
    }));
    
    const { data: cfb_inserted, error: cfb_error } = await supabase
      .from('cfb.prop_trends')
      .insert(cfb_rows);
    
    if (cfb_error) {
      console.error('❌ CFB Error:', cfb_error);
      throw cfb_error;
    }
    
    console.log(`✅ CFB Props Ingested: ${cfb_rows.length} rows`);
    console.log(`   - Drafted (DQ'd): ${cfb_rows.filter(r => r.drafted).length}`);
    console.log(`   - Active: ${cfb_rows.filter(r => !r.drafted).length}\n`);

    // 2. Ingest NFL Data
    console.log('🏈 Ingesting NFL props...');
    const { data: nfl_inserted, error: nfl_error } = await supabase
      .from('nfl.prop_trends')
      .insert(NFL_DATA);
    
    if (nfl_error) {
      console.error('❌ NFL Error:', nfl_error);
      throw nfl_error;
    }
    
    console.log(`✅ NFL Props Ingested: ${NFL_DATA.length} rows\n`);

    // 3. Calculate CFB Trends (non-drafted only)
    console.log('📊 CFB Trends (Drafted Players Excluded):');
    const { data: cfb_trends, error: cfb_trend_error } = await supabase
      .from('cfb.prop_trends')
      .select('player_name, prop_type, result, drafted')
      .eq('drafted', false);
    
    if (!cfb_trend_error && cfb_trends) {
      const cfb_summary = {};
      cfb_trends.forEach(row => {
        const key = `${row.player_name} - ${row.prop_type}`;
        if (!cfb_summary[key]) cfb_summary[key] = { hits: 0, total: 0 };
        cfb_summary[key].total += 1;
        if (row.result === 'HIT') cfb_summary[key].hits += 1;
      });
      
      Object.entries(cfb_summary)
        .sort((a, b) => (b[1].hits / b[1].total) - (a[1].hits / a[1].total))
        .slice(0, 10)
        .forEach(([key, stats]) => {
          const hitRate = ((stats.hits / stats.total) * 100).toFixed(0);
          console.log(`   ${key}: ${stats.hits}/${stats.total} (${hitRate}%)`);
        });
    }
    console.log('');

    // 4. Calculate NFL Trends by Environment
    console.log('📊 NFL Trends (Top by Hit Rate):');
    const { data: nfl_trends, error: nfl_trend_error } = await supabase
      .from('nfl.prop_trends')
      .select('player_name, prop_type, environment, result');
    
    if (!nfl_trend_error && nfl_trends) {
      const nfl_summary = {};
      nfl_trends.forEach(row => {
        const key = `${row.player_name} - ${row.prop_type}${row.environment ? ` (${row.environment})` : ''}`;
        if (!nfl_summary[key]) nfl_summary[key] = { hits: 0, total: 0 };
        nfl_summary[key].total += 1;
        if (row.result === 'HIT') nfl_summary[key].hits += 1;
      });
      
      Object.entries(nfl_summary)
        .sort((a, b) => (b[1].hits / b[1].total) - (a[1].hits / a[1].total))
        .slice(0, 15)
        .forEach(([key, stats]) => {
          const hitRate = ((stats.hits / stats.total) * 100).toFixed(0);
          console.log(`   ${key}: ${stats.hits}/${stats.total} (${hitRate}%)`);
        });
    }
    console.log('');

    return {
      success: true,
      cfb_inserted: cfb_rows.length,
      nfl_inserted: NFL_DATA.length,
      cfb_active: cfb_rows.filter(r => !r.drafted).length,
      cfb_drafted_excluded: cfb_rows.filter(r => r.drafted).length
    };

  } catch (error) {
    console.error('💥 Ingestion failed:', error);
    throw error;
  }
}
