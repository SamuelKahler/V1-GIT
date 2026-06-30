# Sports Edge Netlify Patch V8

Updated Today's Picks with the June 13-19 tracked bet/result archive supplied in chat.

## Result Logic
- ✅ = SUCCESS
- ✕ = LOSS
- LIVE = live pick
- — / PENDING = no result provided yet

## Updated Files
- data.js: adds `trackedPickResults` and prepends them to `dailyPicks`
- app.js: supports pick records without model score, displays result icons, units, and status summaries
- styles.css: adds result status colors

Upload this folder or ZIP contents to Netlify to update the live site.
