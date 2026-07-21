# AI Update Workflow

Use this workflow when asking AI to update Sports Edge.

## Daily Data Update

Ask for:

```text
Format this as a data.js update only. Do not change app.js, styles.css, or index.html.
```

AI should return:

- exact object/array entries to add or replace in `data.js`
- a short changelog entry for `docs/releases/`

## Feature Update

Ask for:

```text
Tell me which files must change before writing code.
```

Expected files:

- `app.js` for behavior/rendering
- `styles.css` for design
- `index.html` only if page shell changes
- `data.js` only if data schema changes

## Safety Rule

Do not accept a feature update that rewrites unrelated sections. Every update should state:

- files changed
- sections changed
- sections intentionally untouched
