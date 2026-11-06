# Refreshing showcase work from Google Drive

The portfolio is a static GitHub Pages site, so it cannot securely read the connected Google Drive account from a visitor’s browser. New Drive files therefore need to be copied into the static data and thumbnail assets before they can appear on the live site.

From the project root, with the connected Google Workspace account active, run:

```bash
npm run sync-drive
```

The script inventories the five showcase folders inside the configured Drive folder, updates `public/drive-work-data.js`, downloads available thumbnails into `public/assets/drive-work/`, and preserves a category fallback image when Drive does not provide a thumbnail.

Review the generated changes, then publish them normally:

```bash
git add public/drive-work-data.js public/assets/drive-work
git commit -m "Refresh Drive showcase work"
git push origin main
```

GitHub Actions will deploy the updated static site after the push. Do not put Google OAuth tokens or Workspace credentials in the repository or in frontend code.

The current Build page uses verified public links from the GitHub account: the live portfolio URL and the DIVERSMINDS Therapy source project. A GitHub Pages URL that is still building or returns 404 is intentionally not presented as a working live website.
