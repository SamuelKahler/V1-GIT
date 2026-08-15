SPORTS EDGE — ADMIN PICK ENTRY V1

Purpose
- Removes daily repository edits for routine MLB pick publishing.
- Adds a private Today's Picks Publisher inside /developer.
- Stores published picks in Supabase as the canonical source for those dates.
- Immediately attempts official MLB grading after publish.
- Keeps daily-import.js as a safe historical fallback for dates not yet migrated into Supabase.

Install
1. Run supabase/migrations/014_admin_pick_entry_v1.sql in Supabase SQL Editor.
2. Deploy this repository on a feature branch and test /developer.
3. Unlock /developer with MLB_IMPORT_ADMIN_TOKEN.
4. Paste one or more dated pick slates.
5. Click Preview Picks. Confirm every row, odds, units, and Official/Research designation.
6. Click Publish These Dates.
7. Reload the customer MLB page. The published dates should appear without editing daily-import.js or redeploying.
8. For past dates, publishing also runs the grader immediately. Future/live games stay pending and the existing scheduled grader revisits them automatically.

Publishing semantics
- Every date present in the pasted input is replaced atomically at the logical date level: prior admin-published rows for that date are removed, then the previewed slate is stored.
- Dates not included in the pasted input are untouched.
- Explicit unit size => Official eligibility. No explicit unit => Research.
- DISREGARD/VOID remains VOID.
- daily-import.js remains fallback history only; admin-published dates override it.

Audit
select public.sports_edge_pick_entry_audit();
