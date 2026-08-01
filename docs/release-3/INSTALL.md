# Release 3 installation and Preview test

## Deployment
Upload the repository contents to `phase-2-mlb-database`, commit, and allow Vercel to create the Preview deployment. No SQL migration is required.

## Prerequisite
The database must contain imported completed MLB games. An empty database will correctly return a sample size of zero.

## Test the evidence endpoint
Replace the Preview domain and private token:

```bash
curl -X POST "https://YOUR-PREVIEW-DOMAIN.vercel.app/api/mlb/evidence" \
  -H "Content-Type: application/json" \
  -H "x-sports-edge-admin-token: YOUR_PRIVATE_TOKEN" \
  -d '{"criteria":{"teamAbbreviation":"MIL","role":"HOME","favorite":true,"limit":100},"minimumSample":10}'
```

The response separates `exactMatch` from `bestQualified`. A qualified match always lists every relaxed condition. Supporting games come from `mlb.games`; Sports Edge picks are not used.

## Browser integration hook
The customer app now loads `sports/mlb/core/mlb-intelligence-client.js`. It exposes:

```js
await window.SportsEdgeMLBIntelligence.evidence(criteria, options)
await window.SportsEdgeMLBIntelligence.query(criteria, options)
```

The token is stored in session storage only when `setAdminToken()` is explicitly called. This release does not expose the admin token in customer code and does not change visible UI.
