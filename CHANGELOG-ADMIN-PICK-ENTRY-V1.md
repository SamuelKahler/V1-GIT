# Admin Pick Entry V1

- Added `public.sports_edge_picks` as the Supabase canonical pick-entry table.
- Added owner-only `/api/admin-picks` preview, publish, list, and public canonical-text modes.
- Added a private Today's Picks Publisher to `/developer` with parser preview and Official/Research classification.
- Publishing replaces only the dates included in the pasted slate.
- Publishing immediately attempts official MLB grading and persistence for completed games.
- Daily operations now read admin-published picks first and repository fallback picks only for dates not yet published through the admin tool.
- Customer app bootstrap waits for the canonical pick API before initializing MLB views, so newly published picks appear without a repository commit or Vercel redeploy.
- Added deterministic pick IDs so persisted grades remain attached after subsequent publishes.
- Re-publishing a date removes persisted grades belonging to the superseded admin-published rows for that date before inserting the corrected slate, preventing stale performance records.
