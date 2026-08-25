import fs from 'node:fs';

const mustContain = (file, tokens) => {
  const text = fs.readFileSync(file, 'utf8');
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${file} missing ${token}`);
  }
};

mustContain('supabase/migrations/024_nfl_real_line_prop_ledger_v1.sql', [
  'nfl.player_prop_lines',
  'sports_edge_nfl_real_line_prop_board',
  'sports_edge_nfl_player_real_line_history',
  'sports_edge_nfl_real_line_prop_audit',
  "season>=2025"
]);
mustContain('lib/nfl/prop-line-ingestion.js', [
  'player_pass_yds',
  'player_pass_completions',
  'player_reception_yds',
  'estimatedHistoricalEventOddsCredits',
  'CLOSING'
]);
mustContain('api/nfl.js', ['importPropLines', 'realLinePropBoard', 'playerRealLineHistory', 'realLinePropAudit']);
mustContain('sports/nfl/nfl-app.js', ['REAL-LINE PROP INTELLIGENCE', 'actual sportsbook line', 'realLinePropBoard', 'playerRealLineHistory']);
mustContain('developer.html', ['NFL Real-Line Prop Ledger', 'Preview Line Import + Cost', 'Real-Line Audit']);

console.log('NFL_REAL_LINE_PROP_LEDGER_V1_VALIDATION_PASSED');
