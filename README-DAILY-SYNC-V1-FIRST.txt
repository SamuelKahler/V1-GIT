SPORTS EDGE DAILY SYNC V1

1. Adds picks from Aug 3 through Aug 11, 2026 to the canonical daily-import workflow.
2. All imported picks are automatically checked against official MLB final results on app load.
3. F5 Performance continues to accept only explicit unit-sized F5 plays.
4. Adds protected syncRange action to the consolidated /api/mlb function.
5. Adds a production Vercel Cron that refreshes the previous three MLB dates daily.
6. Adds Supabase freshness audit migration 012.
7. Adds retries for transient customer-evidence fetch failures.

Required Vercel variable before enabling production cron:
CRON_SECRET = a private random value of at least 32 characters.
