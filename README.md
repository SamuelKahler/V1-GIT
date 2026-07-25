# Sports Edge

Clean Vercel-only baseline for the Sports Edge betting intelligence platform.

## Runtime

- Static browser application served from `index.html`
- Vercel functions in `api/`
- MLB source data in `sports/mlb/mlb-data.js`
- MLB normalized ledger in `sports/mlb/core/master-ledger.js`
- NFL modules in `sports/nfl/`

## Validate locally

```bash
npm run check
```

## Deployment

Deploy the repository root to Vercel. Set `ODDS_API_KEY` in Vercel Environment Variables if the odds endpoint is used.
