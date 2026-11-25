# Osama Mughal: Portfolio Website

Static site (HTML/CSS/JS). No build step needed.

## Files
- `index.html`: page content
- `styles.css`: styling
- `script.js`: logo wall (filters, search), counters and animations
- `logos-data.js`: **the brand list**. To add a brand, put the image in `assets/logos/` and add an entry (n=name, s=sector, f=file, b=tile background, m="c")
- `assets/photo.jpg`, `assets/banner.jpg`: your picture and banner

## Preview locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy: GitHub → Vercel
1. Create a new empty repo on GitHub (e.g. `portfolio`).
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new, sign in with GitHub, import the `portfolio` repo.
4. Framework Preset: **Other**. Leave build command and output directory empty. Click **Deploy**.
5. Your site goes live at `https://<project-name>.vercel.app`. Every `git push` to `main` redeploys automatically.

Custom domain: Vercel project → Settings → Domains.
