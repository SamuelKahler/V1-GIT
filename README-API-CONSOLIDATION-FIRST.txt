SPORTS EDGE MLB API CONSOLIDATION

Purpose:
Keep the Vercel Hobby deployment below the 12 Serverless Function limit.

Installation:
1. Upload this repository package to phase-2-mlb-database.
2. Replace matching files and commit: Consolidate MLB API for Vercel Hobby plan
3. No Supabase migration is required.
4. Wait for the v1-git Preview deployment to become Ready.
5. Open /release-a-admin.html and run the Release A acceptance test.

New API:
POST /api/mlb with an action in the JSON body.
GET /api/mlb?action=status for GET actions.

The underlying logic remains separated in lib/mlb modules.
