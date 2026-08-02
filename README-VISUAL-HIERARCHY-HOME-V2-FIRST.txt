SPORTS EDGE — VISUAL HIERARCHY + HOME DIRECTORY V2

INSTALL
1. Upload the complete repository contents to branch phase-2-mlb-database.
2. Commit: Install Visual Hierarchy and Home Directory V2
3. Push origin and wait for the v1-git Preview deployment.
4. No Supabase migration is required.

CUSTOMER-FACING CHANGES
- Removes all known white-on-white heading treatments from MLB evidence and pitcher history.
- Converts selected-team and opponent trends into separate, bordered dropdown groups.
- Gives every trend its own card with clear label, hit rate, record, and sample.
- Removes generic selected-team F5 line trends and Opponent F5 +0.5/-0.5 trends.
- Preserves exact-environment F5 evidence and Official Sports Edge F5 Performance.
- Rebuilds the home page as an equal sport directory rather than an MLB-focused landing page.
- Removes the Research Journal hero button and the customer-facing implementation paragraph.
- Removes the MLB-only home preview while retaining the existing internal element IDs.

PREVIEW CHECK
- Open F5 HOU -0.5 and expand Decision Evidence.
- HOU trends should be a distinct blue group; TEX trends should be a separate orange group.
- No Opponent F5 +0.5 trend should appear.
- Open Starting Pitchers / K Prop History; all headings must be dark and readable.
- Open Home; all sports should appear as complete directory cards with visible titles and descriptions.
