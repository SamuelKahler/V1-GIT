import fs from 'node:fs';
import { buildGameBundle } from '../lib/mlb/transform.js';
import { dayCount, parseDate } from '../lib/mlb/importer.js';

const required = [
  'supabase/migrations/002_mlb_intelligence_foundation.sql',
  'api/mlb/import.js', 'api/mlb/status.js', 'api/mlb/audit.js',
  'lib/mlb/auth.js', 'lib/mlb/http.js', 'lib/mlb/importer.js',
  'lib/mlb/supabase.js', 'lib/mlb/transform.js'
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`MISSING_FILE: ${file}`);
}
parseDate('2026-07-01');
if (dayCount('2026-07-01', '2026-07-07') !== 7) throw new Error('DATE_COUNT_FAILED');
const mockSchedule = { gamePk: 1, officialDate: '2026-07-01', season: '2026', teams: { home: { team: { id: 1, name: 'Home' } }, away: { team: { id: 2, name: 'Away' } } }, venue: { id: 10, name: 'Park' } };
const mockFeed = { gameData: { game: { pk: 1, season: '2026' }, datetime: { officialDate: '2026-07-01' }, teams: { home: { id: 1, name: 'Home' }, away: { id: 2, name: 'Away' } }, venue: { id: 10, name: 'Park' }, status: { statusCode: 'F', detailedState: 'Final' } }, liveData: { linescore: { teams: { home: { runs: 5 }, away: { runs: 3 } }, innings: [1,2,3,4,5].map(num => ({ num, home: { runs: 1 }, away: { runs: num <= 3 ? 1 : 0 } })) } } };
const bundle = buildGameBundle(mockSchedule, mockFeed);
if (!bundle.game.f5_complete || bundle.game.home_f5_runs !== 5 || bundle.game.away_f5_runs !== 3) throw new Error('F5_TRANSFORM_FAILED');
console.log('PHASE_2A_VALIDATION_PASSED');
