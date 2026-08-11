# Release 4 Rollback

Release 4 has no database migration.

To roll back:

1. In GitHub, revert the commit `Install MLB Intelligence Release 4` on the feature branch.
2. Wait for Vercel to create a new Preview deployment.
3. Confirm the prior pick-detail interface is restored.

No Supabase tables, data, functions, or environment variables need to be removed.
