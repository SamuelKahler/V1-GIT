# Release A rollback

Code rollback:

1. Revert the GitHub commit that installed Release A.
2. Redeploy the previous Preview deployment.

Database rollback is normally unnecessary because the added columns are backward compatible. To remove only the Release A callable functions:

```sql
drop function if exists public.sports_edge_mlb_release_a_audit(date,date);
```

Do not drop MLB tables or imported games. The added inning/weather columns may safely remain unused by older code.
