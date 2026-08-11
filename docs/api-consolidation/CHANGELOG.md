# MLB API Consolidation

- Replaced ten `api/mlb/*.js` Vercel functions with one `api/mlb.js` gateway.
- Preserved modular importer, environment, query, evidence, authentication, HTTP and database layers.
- Updated customer evidence client and Release A admin page.
- Reduced total Vercel serverless functions from 13 to 5.
- Added deterministic consolidation validation.
