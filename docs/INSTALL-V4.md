# Exact installation

This package is a complete repository replacement.

1. Make a backup copy of the current repository folder.
2. Unzip this package.
3. Open the extracted `Sports-Edge-Intelligence-V4` folder.
4. Copy every item inside that folder into the root of the GitHub-connected repository.
5. Choose **Replace** when prompted. Do not place the folder itself inside the repository.
6. Confirm the repository root directly contains `index.html`, `styles.css`, `api`, and `sports`.
7. In GitHub Desktop, review the changes. The important new file is `sports/mlb/core/intelligence-engine.js`.
8. Commit with: `Build graded intelligence evidence engine V4`
9. Push origin.
10. Wait for Vercel to report Ready, then hard-refresh the site.

## Browser verification

Open Developer Tools, select Console, and enter:

`SportsEdgeIntelligence.audit`

The object should display counts for observations, graded records, records counted in hit rates, pending records, and environments.
