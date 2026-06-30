# Vercel Deploy Steps

1. Go to Vercel.
2. Click **Add New Project**.
3. Import the GitHub repository.
4. Framework preset: **Other** or **Static**.
5. Build command: leave blank.
6. Output directory: leave blank or use `.`.
7. Deploy.

Because this app uses `index.html`, `app.js`, `data.js`, and `styles.css` at the root, Vercel can serve it as a static site.

## After Deployment

Every GitHub commit to `main` will redeploy the live website automatically.
