import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calculateFirstFive, transformGame } from '../lib/mlb/transform.js';

const f5 = calculateFirstFive([
  { number: 1, awayRuns: 1, homeRuns: 0 },
  { number: 2, awayRuns: 0, homeRuns: 2 },
  { number: 3, awayRuns: 2, homeRuns: 0 },
  { number: 4, awayRuns: 0, homeRuns: 1 },
  { number: 5, awayRuns: 1, homeRuns: 0 }
]);
assert.deepEqual(f5, { available: true, away: 4, home: 3 });
assert.equal(calculateFirstFive([{ number: 1, awayRuns: 0, homeRuns: 0 }]).available, false);

const schedule = {
  gamePk: 999,
  officialDate: '2026-07-29',
  gameDate: '2026-07-29T20:00:00Z',
  teams: {
    away: { team: { id: 1, name: 'Away' } },
    home: { team: { id: 2, name: 'Home' } }
  },
  venue: { id: 10, name: 'Park' }
};

const feed = {
  gameData: {
    game: { pk: 999, type: 'R' },
    datetime: { officialDate: '2026-07-29', dateTime: '2026-07-29T20:00:00Z' },
    status: { abstractGameState: 'Final', detailedState: 'Final' },
    teams: {
      away: { id: 1, name: 'Away', abbreviation: 'AWY' },
      home: { id: 2, name: 'Home', abbreviation: 'HME' }
    },
    venue: { id: 10, name: 'Park' }
  },
  liveData: {
    linescore: {
      teams: { away: { runs: 4 }, home: { runs: 3 } },
      innings: [1, 2, 3, 4, 5].map((num, i) => ({
        num,
        ordinalNum: String(num),
        away: { runs: [1, 0, 2, 0, 1][i] },
        home: { runs: [0, 2, 0, 1, 0][i] }
      }))
    }
  }
};

const transformed = transformGame(schedule, feed);
assert.equal(transformed.gamePk, 999);
assert.equal(transformed.firstFive.away, 4);
assert.equal(transformed.firstFive.home, 3);
assert.equal(transformed.status.isFinal, true);

for (const file of [
  'supabase/migrations/002_mlb_intelligence_foundation.sql',
  'api/mlb/import.js',
  'api/mlb/status.js',
  'api/mlb/audit.js'
]) {
  assert.equal(fs.existsSync(file), true, `${file} missing`);
}

console.log('PHASE_2A_VALIDATION_PASSED');
