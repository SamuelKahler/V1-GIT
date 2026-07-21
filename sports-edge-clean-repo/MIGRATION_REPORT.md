# V1 to Multi-Sport Module Migration

## Preserved
- Current visual shell and navigation
- MLB pages, data, filters, grading, performance, series board, models, and API behavior
- Vercel configuration and API routes
- Existing CSS, with NFL styles appended rather than replacing the design

## Reorganized
- `app.js` moved to `sports/mlb/mlb-app.js`
- `data.js` moved to `sports/mlb/mlb-data.js`
- `index.html` script paths updated accordingly

## Added
- NFL Command Center with Overview, Prop Lab, System Lab, Performance, and Update Guide
- 89 historical NFL prop records
- Full supplied historical NFL systems dataset
- Dedicated current-week NFL game file
- Architecture and update documentation

## Truth and safety behavior
- No sample NFL bet is displayed as a current recommendation
- System rows are shown as qualifications/counts because the supplied system data did not include graded outcomes
- Performance calculations use only HIT/MISS prop records
