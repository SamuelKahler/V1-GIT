SPORTS EDGE — CUSTOM F5 MODEL ENGINE V1B

WHAT THIS RELEASE DOES
- Fixes V1A sliders so they can be dragged continuously from 0% to 100%.
- Removes the one-step drag bug caused by rebuilding slider DOM on every input event.
- Keeps total weight at 100% automatically by proportionally rebalancing the other factors.
- Adds direct numeric weight entry and +/- 5% controls.
- Adds Balanced, Pitching Heavy, Form + Offense, and Market Aware presets.
- Persists the customer's weights in this browser.
- Adds a persistent Model Lab sidebar that can be opened from any Sports Edge page.
- Runs the same verified backend F5 model from the sidebar or full Model Center.
- Shows the current top model edges inside the sidebar.

INSTALL
1. Use the entire repository folder in this package.
2. Create/use feature branch: custom-f5-model-v1b
3. Commit: Install Custom F5 Model Engine V1B
4. Push and test Vercel Preview.
5. NO SUPABASE MIGRATION IS REQUIRED for V1B.

ACCEPTANCE TEST
1. Open MLB > Model Center and unlock demo access.
2. Drag Starting Pitcher History from 25% to 50% in one continuous motion.
3. Confirm the other factors rebalance and the total remains 100%.
4. Drag it back down. It must move freely, not one percentage point at a time.
5. Type a number directly into any weight field and confirm the model updates the other weights.
6. Use +/- buttons and presets.
7. Click Run My F5 Model and record the ranking/edges.
8. Change weights materially and run again. Results must recalculate.
9. Navigate to Home, Today's Picks, Performance, or another page and click the floating Model Lab button.
10. Confirm the sidebar uses the same saved weights and can run the model without leaving the page.
11. Refresh the browser and confirm the custom weights persist.
12. Confirm Official Sports Edge F5 Performance is unchanged by Model Lab experiments.
