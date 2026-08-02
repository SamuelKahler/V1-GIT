import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('developer.html', 'utf8');
const js = fs.readFileSync('developer-console.js', 'utf8');
const api = fs.readFileSync('api/mlb.js', 'utf8');

assert.match(html, /Sports Edge Developer Console/);
assert.match(html, /Import Yesterday/);
assert.match(html, /Current-season backfill/);
assert.match(html, /Release A Test/);
assert.match(js, /action, \.\.\.payload/);
assert.match(js, /request\('releaseATest'/);
assert.match(js, /request\('environments'/);
assert.match(js, /request\('import'/);
assert.match(js, /sessionStorage/);
assert.match(api, /releaseATest/);
assert.match(api, /environments/);

const apiFiles = fs.readdirSync('api').filter((name) => name.endsWith('.js'));
assert.ok(apiFiles.length <= 12, `Expected <=12 Vercel functions, found ${apiFiles.length}`);

console.log('DEVELOPER_CONSOLE_VALIDATION_PASSED');
