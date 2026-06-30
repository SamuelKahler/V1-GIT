# Sports Edge App

Sports Edge is a multi-sport betting intelligence platform. The current production app is a static frontend powered by `index.html`, `styles.css`, `app.js`, and `data.js`.

## Current Status

- MLB platform is active.
- College Football prop database has started.
- NFL, NBA, and NHL sport pages are reserved for future expansion.
- Performance, Research Journal, Series Board, Trend Database, and Model Center are part of the app shell.

## Files You Usually Edit

| File | Purpose | Edit Frequency |
| --- | --- | --- |
| `data.js` | Picks, trends, research logs, series board data, NCAA prop data | Daily |
| `app.js` | App logic, rendering, filters, details panels | Only for feature changes |
| `styles.css` | Visual design and layout | Only for design changes |
| `index.html` | Page shell and script/style links | Rarely |

## Recommended Workflow

1. Add daily picks/trends to `data.js`.
2. Commit the change to GitHub.
3. Vercel redeploys automatically.
4. Only touch `app.js` or `styles.css` when a feature or design change is requested.

## Folder Map

```text
sports-edge-app/
├── index.html
├── styles.css
├── app.js
├── data.js
├── docs/
│   ├── roadmap/
│   ├── releases/
│   ├── development/
│   └── ideas/
├── sql/
├── db/
├── integrations/
│   └── netlify/
├── scripts/
│   └── legacy-patches/
└── data/
```

## Deployment

This repo is ready for Vercel as a static site. Import the GitHub repo into Vercel and deploy from the root folder.

## Important Rule

Stable sections should not be changed unless explicitly requested. Daily updates should primarily modify `data.js`.
