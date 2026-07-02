# bradking.consulting

Source for [https://bradking.consulting](https://bradking.consulting) — the SaltedHash Labs
site (infrastructure & DevOps consultancy, plus a teaser for the studio's own SaaS).

## Stack

Plain static **HTML / CSS / JS** — no framework, no build step. The whole site is three files
under `bradking.consulting/`:

- `index.html` — single-page, anchored sections
- `css/main.css` — design-token-driven styles
- `js/main.js` — vanilla JS (nav toggle, scroll-reveal, GLightbox init)

External dependencies are CDN-loaded: Font Awesome (icons), Google Fonts (Inter + JetBrains
Mono), and GLightbox (gallery lightbox).

## Local preview

```bash
cd bradking.consulting
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) publishes the `bradking.consulting/`
directory to GitHub Pages on every push to `main`. No build step runs.
