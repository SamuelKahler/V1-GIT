# V40 Infrastructure Cleanup

This release does not change the user-facing app.

## What Changed

- Cleaned repository structure.
- Moved historical version notes to `docs/releases/`.
- Moved roadmaps to `docs/roadmap/`.
- Moved SQL migrations to `sql/`.
- Preserved Netlify legacy files under `integrations/netlify/`.
- Preserved patch scripts under `scripts/legacy-patches/`.
- Added GitHub and Vercel workflow docs.
- Added update rules to prevent accidental regressions.

## App Files Preserved

- `index.html`
- `styles.css`
- `app.js`
- `data.js`

## Purpose

Make Sports Edge easier to update through GitHub/Vercel and safer to maintain with AI-assisted changes.
