# Canonical Grade Hydration V1

- Added canonical Supabase grade view to collapse duplicate source rows at read time.
- Fixed customer UI grade hydration when backend source IDs differ from frontend source IDs.
- Refreshes the live pick array after persisted grades arrive.
- Prevents public browser sessions from persisting duplicate grade rows.
- Protects persisted POST grading behind admin authorization.
- Keeps scheduled server grading and Admin Pick Entry grading as the canonical write paths.
