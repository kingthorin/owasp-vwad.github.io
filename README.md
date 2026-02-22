# OWASP VWAD — GitHub Pages

Standalone GitHub Pages site for the [OWASP Vulnerable Web Applications Directory](https://owasp.org/www-project-vulnerable-web-applications-directory/) (VWAD). Static HTML/CSS, no build step, easy to maintain and test locally.

## Test locally

From this directory, run any of:

```bash
# Option 1: npx (Node)
npx serve .

# Option 2: Python 3
python3 -m http.server 8000

# Option 3: Python 2
python -m SimpleHTTPServer 8000
```

Then open [http://localhost:3000](http://localhost:3000) (serve) or [http://localhost:8000](http://localhost:8000) (Python).

You can also open `index.html` directly in a browser, but relative links and assets work best when served over HTTP.

## Create the new GitHub repo and publish

1. **Create a new repository on GitHub**
   - Name it e.g. `vwad-pages` or `owasp-vwad-pages`.
   - Do **not** add a README, .gitignore, or license (this folder already has content).

2. **Initialise and push from the `vwad-pages` folder**
   ```bash
   cd vwad-pages
   git init
   git add .
   git commit -m "Initial GitHub Pages site for OWASP VWAD"
   git branch -M main
   git remote add origin https://github.com/YOUR_ORG/vwad-pages.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Repo → **Settings** → **Pages**.
   - Source: **Deploy from a branch**.
   - Branch: **main** (or **master**), folder **/ (root)**.
   - Save. The site will be at `https://YOUR_ORG.github.io/vwad-pages/`.

## Structure

- `index.html` — Homepage with browse-all and search (by name, author, technology, notes, collection).
- `app.html` — App detail page; use `app.html#<slug>` for a specific app (e.g. `app.html#dot-net-goat`). Each app has a unique URL with full details (collections, technology, author, notes, references, stars).
- `data/collection.json` — Copy of the directory data from the main project; update from `_data/collection.json` when needed.
- `js/app.js` — Loads collection, assigns unique slugs, search/filter API.
- `js/home.js` — Browse table and search UI.
- `js/app-viewer.js` — Renders a single app on `app.html` (and on `404.html` when GitHub Pages serves `/app/<slug>`).
- `css/site.css` — Standalone styles (OWASP-inspired, dark theme).
- No build tools; add more `.html` and assets as needed.

## Relationship to the main project

Content and data live in the main project repo:  
[https://github.com/OWASP/www-project-vulnerable-web-applications-directory](https://github.com/OWASP/www-project-vulnerable-web-applications-directory).

This repo is only the standalone site for GitHub Pages. You can later pull in data (e.g. from the main repo’s `_data/collection.json`) via copy, CI, or a static build if you add one.
