# Sports Module Structure

## Purpose
The production site remains a plain HTML/CSS/JavaScript application. This reorganization does not change frameworks or alter the working MLB experience.

## File ownership

### Shared shell
- `index.html` — navigation and page containers for every sport.
- `styles.css` — shared visual system plus isolated sport sections.
- `api/`, `db/`, `integrations/` — server and live-data infrastructure.

### MLB
- `sports/mlb/mlb-data.js` — the complete existing MLB datasets.
- `sports/mlb/mlb-app.js` — the complete existing MLB rendering and behavior.

These files were moved, not rewritten. Existing globals and script order are preserved.

### NFL
- `sports/nfl/data/nfl-props.js` — historical player props.
- `sports/nfl/data/nfl-systems.js` — historical situational system rows.
- `sports/nfl/data/nfl-games.js` — current-week opportunities only.
- `sports/nfl/nfl-app.js` — NFL filters, performance summaries, consumer summaries, and rendering.

## Non-negotiable update rule
Never put NFL records into the MLB file, and never put MLB records into an NFL file.
