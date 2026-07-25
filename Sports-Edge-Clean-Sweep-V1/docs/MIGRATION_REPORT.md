# Clean Sweep Migration Report

## Preserved

- Current customer-facing page structure and styling
- MLB picks, trends, official history, F5 history, series data, and model inputs
- MLB application behavior
- MLB master-ledger foundation
- MLB Vercel APIs for live data, grading, and odds
- NFL application and all NFL data modules

## Removed

- All Netlify functions, migrations, configuration, and dependencies
- Drizzle/database scaffolding that was not connected to the live application
- Duplicate SQL migration copies
- Legacy patch scripts
- Legacy release-note archive
- Contaminated text before and between duplicate HTML documents
- Duplicate HTML document
- `.DS_Store` files
- The standalone legacy V41 engine outside the active repository
- Unused `api/daily-import.js` endpoint

## Corrected

- `index.html` now contains exactly one HTML document
- Every active script is loaded exactly once
- Corrupted sport-symbol pseudo-elements were removed from CSS
- Package dependencies were reduced to zero runtime packages
- Repository is Vercel-only

## Deferred by design

This clean sweep establishes a reliable baseline. It does not fabricate grades or silently merge unresolved conflicting wagers. The next milestone is to connect every MLB view to the normalized master ledger and then reconcile official grades.
