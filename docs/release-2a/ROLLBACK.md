# Release 2A Rollback

1. Revert the GitHub commit that installed Release 2A.
2. Redeploy the previous Preview commit.
3. Database rollback is normally unnecessary because the migration only adds nullable columns, indexes and replaceable functions.
4. To disable Release 2A database functions explicitly, revoke service-role execution on:
   - `public.sports_edge_mlb_rebuild_environments(date,date)`
   - `public.sports_edge_mlb_query_game_logs(jsonb)`
5. Do not delete imported MLB games when rolling back application code.
