Sports Edge Canonical Grade Hydration V1

Purpose
- Fixes the case where completed picks are correctly graded in Supabase but still appear pending on the customer website.
- Deduplicates legacy grading sources at read time without deleting historical rows.
- Makes Supabase-published picks and their persisted grades hydrate into the live customer UI reliably.

Run this migration in Supabase:
  supabase/migrations/016_canonical_grade_hydration_v1.sql

Then verify:
  select public.sports_edge_grade_hydration_audit();

No destructive cleanup is required.
