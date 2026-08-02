import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync('index.html', 'utf8');
const homeCss = fs.readFileSync('styles.css', 'utf8');
const mlbCss = fs.readFileSync('sports/mlb/mlb.css', 'utf8');
const app = fs.readFileSync('sports/mlb/mlb-app.js', 'utf8');
const intelligence = fs.readFileSync('lib/mlb/customer-intelligence.js', 'utf8');

assert.match(index, /Choose your sport\. Find your edge\./);
assert.match(index, /Explore every league/);
assert.doesNotMatch(index, /Your betting dashboard starts here/);
assert.doesNotMatch(index, /Research Journal\s*<\/button>/);
assert.match(index, /home-preview-hidden/);
assert.match(homeCss, /VISUAL HIERARCHY \+ HOME DIRECTORY RELEASE/);
assert.match(homeCss, /sport-directory-grid/);
assert.match(mlbCss, /VISUAL HIERARCHY REFINEMENT/);
assert.match(mlbCss, /prop-history-bucket h4/);
assert.match(mlbCss, /trend-dropdown/);
assert.match(app, /verified trend/);
assert.match(app, /Opponent F5\\b/);
assert.ok(app.includes("if(/^F5\\s*[+-]/i.test(label)) return false;"));
assert.doesNotMatch(intelligence, /add\(`Opponent F5/);
assert.doesNotMatch(intelligence, /add\(`F5 \$\{/);
console.log('VISUAL_HIERARCHY_HOME_V2_VALIDATION_PASSED');
