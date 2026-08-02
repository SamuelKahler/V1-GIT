SPORTS EDGE MLB DEVELOPER CONSOLE

INSTALL
1. Upload this repository to GitHub branch phase-2-mlb-database.
2. Commit: Add MLB Developer Console
3. Wait for the v1-git Vercel Preview deployment to show Ready.
4. Open the Preview URL and add /developer.html.
5. Unlock with the exact private value stored in Vercel as MLB_IMPORT_ADMIN_TOKEN.

SECURITY REALITY
A browser cannot securely read a Vercel secret automatically. The console therefore asks for the token once and stores it only in sessionStorage by default. “Remember on this device” uses localStorage and should only be used on a private computer.

FIRST TEST
1. Open /developer.html.
2. Unlock.
3. Click Refresh Health.
4. Select a completed date at least two days old.
5. Click Run Release A Test.
6. Do not start a season backfill until Release A passes.

NO DATABASE MIGRATION IS REQUIRED FOR THIS RELEASE.
