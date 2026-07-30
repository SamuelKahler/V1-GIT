SPORTS EDGE MLB INTELLIGENCE DATABASE V2 - PHASE 2A

Start here: docs/phase-2a/INSTALL.md

This release adds a separate MLB Intelligence database foundation and importer.
It does not modify the customer-facing UI, existing tabs, Sports Edge grading,
or public.pick_observations.

Required before import:
1. Create a Supabase project.
2. Run supabase/migrations/002_mlb_intelligence_foundation.sql once.
3. Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and MLB_IMPORT_ADMIN_TOKEN to Vercel.
4. Deploy to Preview.
5. Run a one-day dry run, then a one-day real import.
