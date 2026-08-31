# Sports Edge Recovery Audit V1

## Purpose
Restore the repository to the last verified Sports Edge release lineage after Copilot experimentation and make MLB Today's Picks resilient to loss of the admin-published pick table.

## Audit findings
- Repository fallback daily picks ended at August 11, 2026.
- Later MLB picks were expected to hydrate from Supabase rather than repository text.
- If `sports_edge_picks` was empty/unavailable, the customer UI silently fell back to August 11 even when canonical graded pick observations still existed.
- Copilot-only files/migrations were present that were not part of the verified Sports Edge release lineage.
- `lib/nfl/prop-line-ingestion.js` had been changed from the last verified historical-event-match release and its validator/package script had been removed.

## Recovery changes
- Added August 15 and August 16 known picks to the repository fallback.
- Added observation-backed pick recovery using `sports_edge_pick_grade_canonical` as a secondary canonical source.
- Canonical source priority is now: Admin Pick Entry -> graded observation recovery -> repository fallback.
- Added an admin-only Pick Pipeline Audit to `/developer` showing latest dates and row counts by source.
- Restored the verified NFL historical event-match implementation and validator.
- Removed Copilot-only CFB/trend/kickoff experiment files from the repository lineage. No destructive database SQL is included.

## Deployment
No Supabase migration is required for this recovery release.
