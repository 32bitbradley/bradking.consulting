# SaltedHash Labs Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `bradking.consulting` as a single static page rebranded around SaltedHash Labs — consultancy-first, with a SaaS-labs teaser — replacing the old jQuery "Namari" template.

**Architecture:** One page (`index.html`) with anchored `<section>`s, one stylesheet (`css/main.css`) driven by CSS custom-property design tokens, one vanilla-JS file (`js/main.js`) exposing `initNav()`, `initReveal()`, `initLightbox()` called on `DOMContentLoaded`. No framework, no build step. Scroll-reveal uses native `IntersectionObserver`; the only third-party runtime dependency is GLightbox (gallery only), loaded from CDN alongside the existing Font Awesome and Google Fonts links.

**Tech Stack:** HTML5, CSS3 (custom properties, grid/flex, `clamp()`), vanilla ES2015 JS, GLightbox 3.x (CDN), Font Awesome 6.4.2 (CDN), Google Fonts (Inter + JetBrains Mono).

## Global Constraints

Every task's requirements implicitly include this section.

- **Pure static, no build step, no framework, no bundler.** Files are served as-is.
- **All site files live under `bradking.consulting/`.** The CircleCI job syncs that directory to `s3://bradking.consulting`. Do **not** touch `.circleci/config.yml`.
- **The three source files are exactly:** `bradking.consulting/index.html`, `bradking.consulting/css/main.css`, `bradking.consulting/js/main.js`.
- **Allowed external dependencies (only these):** Font Awesome `6.4.2` (existing CDN link), Google Fonts (Inter + JetBrains Mono), GLightbox `3.3.0` (CDN). Add no other runtime dependency.
- **Remove entirely:** all workshop copy, all numeric/currency pricing, the "free workshops for start-ups" hero line, the HoneypotDB mention, the "Theme by ShapingRain" credit, and all old jQuery/WOW/featherlight/enllax/scrollup/stickyNavbar/read-smore scripts.
- **Keep verbatim:** the two client testimonials (Jess Rowley; Chinyelu Philomena Karibi-Whyte), the tech/skills logo grid, the three gallery images.
- **Fixed links/copy values (use exactly):**
  - Booking CTA: `https://cal.com/brad-king-hpdb`
  - Email: `consulting@bradking.co.uk`
  - LinkedIn: `https://www.linkedin.com/in/brad-k-376516127/`
  - Footer copyright: `© 2026 SaltedHash Labs`
- **Accessibility (required, never simplified away):** semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), visible `:focus-visible` states, `prefers-reduced-motion: reduce` disables all scroll-reveal and CSS animation, mobile-first responsive layout, fluid type via `clamp()`, all `<img>` have meaningful `alt`.
- **Design tokens (defined in Task 1 `:root`, referenced everywhere — never hard-code these values elsewhere):**
  - `--color-bg: #ffffff` · `--color-ink: #14161a` · `--color-muted: #5b6470` · `--color-line: #e6e8ec`
  - `--color-dark: #0b0f16` · `--color-dark-2: #111827` · `--color-dark-ink: #e6edf3` · `--color-dark-muted: #9aa4b2`
  - `--color-accent: #4f7cff` · `--color-accent-2: #7c5cff` · `--color-labs: #2dd4bf`
  - `--font-sans: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
  - `--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`
  - `--maxw: 1120px` · `--radius: 14px` · `--nav-h: 68px`
  - Spacing scale: `--space-1: .5rem` · `--space-2: 1rem` · `--space-3: 1.5rem` · `--space-4: 2.5rem` · `--space-5: 4rem` · `--space-6: 6rem`
- **CSS naming convention:** section wrappers use `.section` + a modifier (`.section--dark`, `.section--labs`); an inner `.container` centers content at `--maxw`. Component classes are short and semantic (`.nav`, `.hero`, `.card`, `.tech`, `.gallery`, `.quote`, `.avatar`). No utility framework.
- **JS convention:** all behavior in `js/main.js`, wrapped so each feature is a named function (`initNav`, `initReveal`, `initLightbox`) invoked from a single `DOMContentLoaded` handler. Guard every `querySelector` result before use (fail silently if an element is absent).
- **Verification approach:** no unit tests (no logic to unit-test). Each task's gate is: serve locally with `python3 -m http.server 8000` from `bradking.consulting/`, open `http://localhost:8000`, confirm the listed outcomes, and confirm the browser console shows **zero** errors. Structural `grep` assertions are added where they cheaply catch regressions.

---

### Task 1: Foundation — new files, document head, base tokens & reset

Replace the template's markup shell and stylesheet references with a clean, valid, empty-bodied page wired to the three new files. The page loads blank-but-styled with correct fonts and no console errors.

**Files:**
- Modify (full rewrite): `bradking.consulting/index.html`
- Create: `bradking.consulting/css/main.css`
- Create: `bradking.consulting/js/main.js`

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `css/main.css` `:root` exposes every design token in Global Constraints.
  - `css/main.css` defines `.section`, `.section--dark`, `.container`, `.btn`, `.btn--primary`, `.btn--ghost`, `.eyebrow`, `.h2`, `.lede` base styles for later tasks to reuse.
  - `index.html` body contains named insertion anchors (HTML comments) that later tasks target: `<!-- nav -->`, `<!-- hero -->`, inside `<main>`: `<!-- services -->`, `<!-- approach -->`, `<!-- skills -->`, `<!-- gallery -->`, `<!-- labs -->`, `<!-- testimonials -->`, `<!-- contact -->`, and after `</main>`: `<!-- footer -->`.
  - `js/main.js` defines empty `initNav()`, `initReveal()`, `initLightbox()` and calls all three on `DOMContentLoaded`.

- [ ] **Step 1: Write `index.html` (full replacement)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaltedHash Labs — Infrastructure &amp; DevOps Consultancy</title>
    <meta name="description" content="SaltedHash Labs is an infrastructure and DevOps consultancy — from the studio that also builds its own SaaS. Automation-first, secure by design.">
    <meta name="keywords" content="DevOps consultancy, infrastructure, automation, Kubernetes, Terraform, Ansible, AWS, cyber security">

    <link rel="shortcut icon" href="images/favicon.png" title="Favicon">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer">

    <!-- GLightbox (gallery only) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/css/glightbox.min.css">

    <!-- Site CSS -->
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

    <!-- nav -->

    <!-- hero -->

    <main id="content">
        <!-- services -->
        <!-- approach -->
        <!-- skills -->
        <!-- gallery -->
        <!-- labs -->
        <!-- testimonials -->
        <!-- contact -->
    </main>

    <!-- footer -->

    <script src="https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/js/glightbox.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `css/main.css` (tokens, reset, base components)**

```css
/* ===== Design tokens ===== */
:root {
    --color-bg: #ffffff;
    --color-ink: #14161a;
    --color-muted: #5b6470;
    --color-line: #e6e8ec;
    --color-dark: #0b0f16;
    --color-dark-2: #111827;
    --color-dark-ink: #e6edf3;
    --color-dark-muted: #9aa4b2;
    --color-accent: #4f7cff;
    --color-accent-2: #7c5cff;
    --color-labs: #2dd4bf;

    --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

    --maxw: 1120px;
    --radius: 14px;
    --nav-h: 68px;

    --space-1: .5rem;
    --space-2: 1rem;
    --space-3: 1.5rem;
    --space-4: 2.5rem;
    --space-5: 4rem;
    --space-6: 6rem;
}

/* ===== Reset / base ===== */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: var(--nav-h); }
body {
    margin: 0;
    font-family: var(--font-sans);
    color: var(--color-ink);
    background: var(--color-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: var(--color-accent); text-decoration: none; }
h1, h2, h3, h4 { line-height: 1.15; margin: 0 0 var(--space-2); font-weight: 800; letter-spacing: -0.02em; }
p { margin: 0 0 var(--space-2); }

:focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
}

/* ===== Layout primitives ===== */
.section { padding: var(--space-6) var(--space-3); }
.section--dark { background: var(--color-dark); color: var(--color-dark-ink); }
.container { max-width: var(--maxw); margin: 0 auto; }

.eyebrow {
    font-family: var(--font-mono);
    font-size: .8rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 0 0 var(--space-1);
}
.section--dark .eyebrow { color: var(--color-labs); }
.h2 { font-size: clamp(1.8rem, 4vw, 2.6rem); }
.lede { font-size: clamp(1rem, 2.2vw, 1.15rem); color: var(--color-muted); max-width: 46ch; }
.section--dark .lede { color: var(--color-dark-muted); }

/* ===== Buttons ===== */
.btn {
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    padding: .8rem 1.4rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: .98rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
    color: #fff;
    box-shadow: 0 8px 24px rgba(79, 124, 255, .35);
}
.btn--ghost {
    background: transparent;
    color: inherit;
    border-color: currentColor;
}
```

- [ ] **Step 3: Write `js/main.js` (skeleton)**

```javascript
'use strict';

function initNav() {}
function initReveal() {}
function initLightbox() {}

document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initLightbox();
});
```

- [ ] **Step 4: Serve and verify the shell**

Run:
```bash
cd bradking.consulting && python3 -m http.server 8000
```
Open `http://localhost:8000`. Expected:
- Page loads white/blank with **no** console errors and **no** 404s in the Network tab (favicon, Font Awesome, GLightbox CSS/JS, both Google Fonts, `css/main.css`, `js/main.js` all resolve).
- In the console, `getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()` returns `#4f7cff`.

- [ ] **Step 5: Structural assertion**

Run (from `bradking.consulting/`):
```bash
grep -c 'jquery\|wow.min\|featherlight\|enllax\|stickyNavbar\|read-smore\|namari-color\|css/style.css\|css/animate.css' index.html
```
Expected output: `0` (no legacy dependency survives the rewrite).

- [ ] **Step 6: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css bradking.consulting/js/main.js
git commit -m "feat: scaffold SaltedHash rebuild — new head, tokens, base CSS/JS"
```

---

### Task 2: Sticky nav + SaltedHash wordmark + mobile menu

A sticky top nav with a CSS text logotype, anchor links, a LinkedIn icon, and a working hamburger toggle on mobile.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- nav -->`)
- Modify: `bradking.consulting/css/main.css` (append nav styles)
- Modify: `bradking.consulting/js/main.js` (implement `initNav()`)

**Interfaces:**
- Consumes: `.container`, focus/token styles from Task 1.
- Produces:
  - Nav markup with `id="site-nav"`, toggle button `id="nav-toggle"` (`aria-expanded`, `aria-controls="nav-menu"`), and menu `id="nav-menu"`. Menu links target `#services`, `#approach`, `#labs`, `#testimonials`, `#contact`.
  - `initNav()` toggles `.is-open` on `#nav-menu`, syncs `aria-expanded`, and closes the menu when any menu link is clicked.

- [ ] **Step 1: Insert nav markup (replace the `<!-- nav -->` line)**

```html
    <header class="nav-header">
        <nav id="site-nav" class="nav container" aria-label="Primary">
            <a class="wordmark" href="#top" aria-label="SaltedHash Labs home">
                <span class="wordmark__hash">#</span><span class="wordmark__name">saltedhash</span><span class="wordmark__labs">Labs</span>
            </a>
            <button id="nav-toggle" class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-menu">
                <span></span><span></span><span></span>
            </button>
            <ul id="nav-menu" class="nav-menu">
                <li><a href="#services">Services</a></li>
                <li><a href="#approach">Approach</a></li>
                <li><a href="#labs">Labs</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#contact">About</a></li>
                <li><a class="nav-linkedin" href="https://www.linkedin.com/in/brad-k-376516127/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a></li>
            </ul>
        </nav>
    </header>
```

Also add `id="top"` to `<body>` by changing `<body>` to `<body id="top">`.

- [ ] **Step 2: Append nav styles to `css/main.css`**

```css
/* ===== Nav ===== */
.nav-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255, 255, 255, .82);
    backdrop-filter: saturate(150%) blur(10px);
    border-bottom: 1px solid var(--color-line);
}
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--nav-h);
    padding: 0 var(--space-3);
}
.wordmark { display: inline-flex; align-items: baseline; font-weight: 800; font-size: 1.15rem; color: var(--color-ink); letter-spacing: -0.02em; }
.wordmark__hash { font-family: var(--font-mono); color: var(--color-accent); margin-right: .1em; }
.wordmark__labs { color: var(--color-accent); }
.nav-menu { list-style: none; display: flex; align-items: center; gap: var(--space-3); margin: 0; padding: 0; }
.nav-menu a { color: var(--color-ink); font-weight: 500; font-size: .95rem; }
.nav-menu a:hover { color: var(--color-accent); }
.nav-linkedin { font-size: 1.2rem; }
.nav-toggle { display: none; flex-direction: column; gap: 5px; width: 40px; height: 40px; padding: 9px 8px; background: none; border: 0; cursor: pointer; }
.nav-toggle span { height: 2px; background: var(--color-ink); border-radius: 2px; transition: .2s; }

@media (max-width: 760px) {
    .nav-toggle { display: flex; }
    .nav-menu {
        position: absolute;
        top: var(--nav-h);
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 0;
        background: #fff;
        border-bottom: 1px solid var(--color-line);
        max-height: 0;
        overflow: hidden;
        transition: max-height .25s ease;
    }
    .nav-menu.is-open { max-height: 22rem; }
    .nav-menu li { width: 100%; text-align: center; }
    .nav-menu a { display: block; padding: var(--space-2); border-top: 1px solid var(--color-line); }
}
```

- [ ] **Step 3: Implement `initNav()` in `js/main.js`**

```javascript
function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) { return; }

    toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}
```

- [ ] **Step 4: Serve and verify**

Reload `http://localhost:8000`. Expected:
- **Desktop width (>760px):** wordmark left (`#saltedhash` with a colored `#` and `Labs`), horizontal link row + LinkedIn icon right, nav stays pinned to the top while scrolling.
- **Mobile width (≤760px, use devtools responsive mode):** links collapse; a hamburger appears. Clicking it slides the menu open and sets `aria-expanded="true"`; clicking a link closes it and returns `aria-expanded="false"`.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css bradking.consulting/js/main.js
git commit -m "feat: sticky nav with wordmark and mobile menu"
```

---

### Task 3: Hero (dark) with CSS mesh background + CTAs

Dark hero: brand statement, consultancy sub-headline, primary CTA to cal.com, secondary CTA scrolling to Labs. Background is CSS-only gradient/mesh — no image.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- hero -->`)
- Modify: `bradking.consulting/css/main.css` (append hero styles)

**Interfaces:**
- Consumes: `.btn`, `.btn--primary`, `.btn--ghost`, `.eyebrow`, dark tokens.
- Produces: `<section id="top-hero">` (not an anchor target itself; nav "home" uses `#top`). Secondary CTA href is `#labs`.

- [ ] **Step 1: Insert hero markup (replace the `<!-- hero -->` line)**

```html
    <section id="top-hero" class="hero">
        <div class="hero__bg" aria-hidden="true"></div>
        <div class="container hero__inner">
            <p class="eyebrow">SaltedHash&nbsp;Labs</p>
            <h1 class="hero__title">Infrastructure &amp; DevOps consultancy — built to last.</h1>
            <p class="hero__sub">We architect, automate, and secure the infrastructure behind your product. From the studio that also builds its own SaaS.</p>
            <div class="hero__cta">
                <a class="btn btn--primary" href="https://cal.com/brad-king-hpdb" target="_blank" rel="noopener">Book a chat <i class="fa-solid fa-arrow-right"></i></a>
                <a class="btn btn--ghost" href="#labs">See what we build</a>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Append hero styles to `css/main.css`**

```css
/* ===== Hero ===== */
.hero {
    position: relative;
    overflow: hidden;
    background: var(--color-dark);
    color: var(--color-dark-ink);
    padding: calc(var(--nav-h) + var(--space-6)) var(--space-3) var(--space-6);
}
.hero__bg {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(40rem 30rem at 15% 10%, rgba(79, 124, 255, .35), transparent 60%),
        radial-gradient(35rem 28rem at 85% 20%, rgba(124, 92, 255, .30), transparent 60%),
        radial-gradient(30rem 30rem at 60% 100%, rgba(45, 212, 191, .18), transparent 60%);
    filter: saturate(120%);
}
.hero__inner { position: relative; }
.hero__title { font-size: clamp(2.2rem, 6vw, 3.8rem); max-width: 18ch; }
.hero__sub { font-size: clamp(1.05rem, 2.4vw, 1.3rem); color: var(--color-dark-muted); max-width: 52ch; margin-bottom: var(--space-4); }
.hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-2); }
```

- [ ] **Step 3: Serve and verify**

Reload. Expected:
- Full-width dark hero with a soft multi-color gradient glow (blue/violet/teal), no image request in the Network tab for the background.
- Headline, sub-headline, two buttons. "Book a chat" opens cal.com in a new tab; "See what we build" is present (its scroll target arrives in Task 8 — clicking now jumps to page bottom harmlessly).
- Type scales smoothly as you resize (no fixed pixel jumps).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: dark hero with CSS mesh background and CTAs"
```

---

### Task 4: Services section (light) — five cards

Replace all workshop content with five service cards.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- services -->`)
- Modify: `bradking.consulting/css/main.css` (append card + grid styles)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, `.h2`, `.lede`.
- Produces: `<section id="services">`; reusable `.card-grid` + `.card` classes (reused by Task 5).

- [ ] **Step 1: Insert services markup (replace the `<!-- services -->` line)**

```html
        <section id="services" class="section">
            <div class="container">
                <p class="eyebrow">What we do</p>
                <h2 class="h2">Services</h2>
                <p class="lede">Practical, senior infrastructure work — scoped to your stage, delivered with automation, documentation, and security baked in from day one.</p>
                <div class="card-grid">
                    <article class="card">
                        <div class="card__icon"><i class="fa-solid fa-sitemap"></i></div>
                        <h3>Infrastructure Architecture</h3>
                        <p>Design and review of resilient, cost-aware infrastructure — from greenfield to untangling what already runs in production.</p>
                    </article>
                    <article class="card">
                        <div class="card__icon"><i class="fa-solid fa-gears"></i></div>
                        <h3>DevOps &amp; Automation</h3>
                        <p>CI/CD pipelines, infrastructure as code, and the automation that removes toil and makes deployments boring — in a good way.</p>
                    </article>
                    <article class="card">
                        <div class="card__icon"><i class="fa-solid fa-cloud"></i></div>
                        <h3>Cloud &amp; Kubernetes</h3>
                        <p>Container platforms and cloud environments architected for scale, observability, and sane operations.</p>
                    </article>
                    <article class="card">
                        <div class="card__icon"><i class="fa-solid fa-shield-halved"></i></div>
                        <h3>Cyber Security Guidance</h3>
                        <p>Security reviews and hardening informed by real threat intelligence — pragmatic controls that fit how your team actually works.</p>
                    </article>
                    <article class="card">
                        <div class="card__icon"><i class="fa-solid fa-book-open"></i></div>
                        <h3>Documentation &amp; Enablement</h3>
                        <p>Clear, current documentation of how your systems work — so your team can operate and extend them with confidence.</p>
                    </article>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append card styles to `css/main.css`**

```css
/* ===== Card grid (services, approach) ===== */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--space-3);
    margin-top: var(--space-4);
}
.card {
    background: #fff;
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
    padding: var(--space-3);
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(20, 22, 26, .08); border-color: transparent; }
.card__icon {
    width: 46px; height: 46px;
    display: grid; place-items: center;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(79,124,255,.14), rgba(124,92,255,.14));
    color: var(--color-accent);
    font-size: 1.2rem;
    margin-bottom: var(--space-2);
}
.card h3 { font-size: 1.15rem; }
.card p { color: var(--color-muted); margin: 0; }
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to Services. Expected:
- Five cards in a responsive grid (multi-column on desktop, single column on narrow mobile), each with a gradient-tile icon, title, and body.
- Hover lifts a card. **No** occurrence of the words "workshop", "£", or a price anywhere on the page yet.
- Nav "Services" link scrolls here with the sticky nav not covering the heading (thanks to `scroll-padding-top`).

- [ ] **Step 4: Assert no workshop/pricing language**

Run (from `bradking.consulting/`):
```bash
grep -ci 'workshop\|£\|per hour\|per 3 hour\|pricing-block' index.html
```
Expected output: `0`.

- [ ] **Step 5: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: services section with five cards, workshop content removed"
```

---

### Task 5: Approach section (light) — value-prop strip

Four-point value proposition replacing the old testimonial-only "About".

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- approach -->`)
- Modify: `bradking.consulting/css/main.css` (append approach styles)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, `.h2`, `.card-grid` (reused).
- Produces: `<section id="approach">`; `.approach-item` class.

- [ ] **Step 1: Insert approach markup (replace the `<!-- approach -->` line)**

```html
        <section id="approach" class="section approach">
            <div class="container">
                <p class="eyebrow">How we work</p>
                <h2 class="h2">Our approach</h2>
                <div class="card-grid">
                    <div class="approach-item">
                        <span class="approach-item__num">01</span>
                        <h3>Automation-first</h3>
                        <p>If it's done twice, it gets automated. Repeatable infrastructure means fewer surprises and faster delivery.</p>
                    </div>
                    <div class="approach-item">
                        <span class="approach-item__num">02</span>
                        <h3>Security by design</h3>
                        <p>Security isn't a phase at the end — it's built into the architecture from the first decision onward.</p>
                    </div>
                    <div class="approach-item">
                        <span class="approach-item__num">03</span>
                        <h3>Clear documentation</h3>
                        <p>Every system we touch leaves behind documentation your team can actually use and maintain.</p>
                    </div>
                    <div class="approach-item">
                        <span class="approach-item__num">04</span>
                        <h3>Best-practice foundations</h3>
                        <p>Proven patterns over clever hacks — solid groundwork that scales with your product instead of fighting it.</p>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append approach styles to `css/main.css`**

```css
/* ===== Approach ===== */
.approach { background: #f7f8fa; }
.approach-item { padding: var(--space-2) 0; }
.approach-item__num {
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--color-accent);
    font-size: 1.05rem;
}
.approach-item h3 { font-size: 1.1rem; margin-top: var(--space-1); }
.approach-item p { color: var(--color-muted); margin: 0; }
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to Approach. Expected:
- Light-grey band, "Our approach" heading, four numbered points in a responsive grid.
- Nav "Approach" scrolls here correctly.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: approach value-proposition section"
```

---

### Task 6: Skills / tech grid (light) with hover overlay

Restyle the existing logo grid; keep the hover overlay behavior. Drop logos not in the spec's list.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- skills -->`)
- Modify: `bradking.consulting/css/main.css` (append tech-grid styles)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, `.h2`, `.lede`.
- Produces: `<section id="skills">`; `.tech-grid`, `.tech`, `.tech__overlay` classes.

Spec tech list: Ansible, Terraform, AWS, Kubernetes, Python, Helm, Elastic, OVHCloud. (Existing "CI/CD Pipelines" tile used `chemical.png`; drop it — not in the spec list.)

- [ ] **Step 1: Insert skills markup (replace the `<!-- skills -->` line)**

```html
        <section id="skills" class="section">
            <div class="container">
                <p class="eyebrow">Toolbox</p>
                <h2 class="h2">Skills &amp; proficiencies</h2>
                <p class="lede">Comfortable across infrastructure as code, automation, containers, and the platforms that run them.</p>
                <div class="tech-grid">
                    <div class="tech"><img src="images/company-images/ansible_logo.png" alt="Ansible"><span class="tech__overlay">Ansible</span></div>
                    <div class="tech"><img src="images/company-images/terraform.png" alt="Terraform"><span class="tech__overlay">Terraform</span></div>
                    <div class="tech"><img src="images/company-images/aws.png" alt="AWS"><span class="tech__overlay">AWS</span></div>
                    <div class="tech"><img src="images/company-images/k8s.png" alt="Kubernetes"><span class="tech__overlay">Kubernetes</span></div>
                    <div class="tech"><img src="images/company-images/python-logo-black-and-white.png" alt="Python"><span class="tech__overlay">Python</span></div>
                    <div class="tech"><img src="images/company-images/helm.png" alt="Helm"><span class="tech__overlay">Helm</span></div>
                    <div class="tech"><img src="images/company-images/elastic-elasticsearch-logo-black-and-white.png" alt="Elastic"><span class="tech__overlay">Elastic</span></div>
                    <div class="tech"><img src="images/company-images/ovh.png" alt="OVHcloud"><span class="tech__overlay">OVHcloud</span></div>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append tech-grid styles to `css/main.css`**

```css
/* ===== Tech grid ===== */
.tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-2);
    margin-top: var(--space-4);
}
.tech {
    position: relative;
    aspect-ratio: 3 / 2;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
    padding: var(--space-3);
    overflow: hidden;
}
.tech img { max-height: 46px; width: auto; object-fit: contain; opacity: .8; transition: opacity .2s; }
.tech:hover img { opacity: 0; }
.tech__overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-weight: 700;
    color: var(--color-accent);
    background: linear-gradient(135deg, rgba(79,124,255,.10), rgba(124,92,255,.10));
    opacity: 0;
    transition: opacity .2s;
}
.tech:hover .tech__overlay { opacity: 1; }
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to Skills. Expected:
- Eight logo tiles in a responsive grid. On hover, the logo fades out and a monospace label (e.g. "Terraform") fades in over a subtle gradient.
- All eight images load (no 404 in Network tab).
- No `chemical.png` / "CI/CD Pipelines" tile present.

- [ ] **Step 4: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: restyled tech/skills grid with hover overlay"
```

---

### Task 7: Gallery (light) with GLightbox

Three existing images in a grid, opening in a GLightbox lightbox. Wire `initLightbox()` to init GLightbox against the gallery only.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- gallery -->`)
- Modify: `bradking.consulting/css/main.css` (append gallery styles)
- Modify: `bradking.consulting/js/main.js` (implement `initLightbox()`)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, `.h2`; global `GLightbox` from the CDN script loaded in Task 1.
- Produces: `<section id="gallery">`; anchors with `class="glightbox"` and a shared `data-gallery="site"`. `initLightbox()` calls `GLightbox({ selector: '.glightbox' })`.

- [ ] **Step 1: Insert gallery markup (replace the `<!-- gallery -->` line)**

```html
        <section id="gallery" class="section gallery-section">
            <div class="container">
                <p class="eyebrow">In the field</p>
                <h2 class="h2">Gallery</h2>
                <div class="gallery">
                    <a class="glightbox" href="images/gallery-images/dish_mcr.jpg" data-gallery="site"><img src="images/gallery-images/dish_mcr.jpg" alt="Satellite dish array in Manchester"></a>
                    <a class="glightbox" href="images/gallery-images/mcr_tech_festival.jpg" data-gallery="site"><img src="images/gallery-images/mcr_tech_festival.jpg" alt="Manchester tech festival talk"></a>
                    <a class="glightbox" href="images/gallery-images/dish_bee.jpg" data-gallery="site"><img src="images/gallery-images/dish_bee.jpg" alt="Manchester worker-bee dish detail"></a>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append gallery styles to `css/main.css`**

```css
/* ===== Gallery ===== */
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: var(--space-2);
    margin-top: var(--space-4);
}
.gallery a { display: block; border-radius: var(--radius); overflow: hidden; }
.gallery img { aspect-ratio: 4 / 3; object-fit: cover; width: 100%; transition: transform .3s ease; }
.gallery a:hover img { transform: scale(1.05); }
```

- [ ] **Step 3: Implement `initLightbox()` in `js/main.js`**

```javascript
function initLightbox() {
    if (typeof GLightbox === 'undefined') { return; }
    if (!document.querySelector('.glightbox')) { return; }
    GLightbox({ selector: '.glightbox' });
}
```

- [ ] **Step 4: Serve and verify**

Reload, scroll to Gallery. Expected:
- Three images in a responsive grid; hover zooms slightly.
- Clicking an image opens the GLightbox overlay. Arrow keys move between the three; `Esc` closes; the close button works.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css bradking.consulting/js/main.js
git commit -m "feat: gallery with GLightbox lightbox"
```

---

### Task 8: SaltedHash Labs teaser (dark/accent band)

"We build our own products too" — generic, no named products. Distinct visual treatment (terminal/hash motif) and it is the secondary-CTA scroll target from the hero.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- labs -->`)
- Modify: `bradking.consulting/css/main.css` (append labs styles)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, dark tokens, `--color-labs`, `.btn--ghost`.
- Produces: `<section id="labs">` (the hero's `#labs` target). Optional soft mailto to the contact email.

- [ ] **Step 1: Insert labs markup (replace the `<!-- labs -->` line)**

```html
        <section id="labs" class="section section--labs">
            <div class="container labs">
                <div class="labs__copy">
                    <p class="eyebrow">SaltedHash Labs</p>
                    <h2 class="h2">We build our own products, too.</h2>
                    <p class="labs__lede">Beyond client work, SaltedHash Labs designs and ships its own SaaS. Living with the same infrastructure, automation, and security decisions we recommend keeps our advice honest — and battle-tested.</p>
                    <a class="btn btn--ghost" href="mailto:consulting@bradking.co.uk?subject=SaltedHash%20Labs%20updates">Stay in touch <i class="fa-solid fa-envelope"></i></a>
                </div>
                <pre class="labs__terminal" aria-hidden="true"><span class="labs__prompt">saltedhash<span class="labs__c">:</span>~$</span> ./ship --secure --automated
<span class="labs__ok">✓</span> infrastructure as code
<span class="labs__ok">✓</span> security baked in
<span class="labs__ok">✓</span> shipping soon<span class="labs__cursor">▊</span></pre>
            </div>
        </section>
```

- [ ] **Step 2: Append labs styles to `css/main.css`**

```css
/* ===== Labs band ===== */
.section--labs {
    background:
        radial-gradient(40rem 30rem at 90% 10%, rgba(45, 212, 191, .16), transparent 60%),
        var(--color-dark-2);
    color: var(--color-dark-ink);
}
.labs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    align-items: center;
}
.labs__lede { color: var(--color-dark-muted); max-width: 46ch; margin-bottom: var(--space-3); }
.labs__terminal {
    font-family: var(--font-mono);
    font-size: .9rem;
    line-height: 1.9;
    color: var(--color-dark-ink);
    background: #060a10;
    border: 1px solid rgba(45, 212, 191, .25);
    border-radius: var(--radius);
    padding: var(--space-3);
    overflow-x: auto;
    margin: 0;
}
.labs__prompt { color: var(--color-labs); }
.labs__c { color: var(--color-dark-muted); }
.labs__ok { color: var(--color-labs); }
.labs__cursor { color: var(--color-labs); animation: labs-blink 1.1s steps(1) infinite; }
@keyframes labs-blink { 50% { opacity: 0; } }

@media (max-width: 760px) {
    .labs { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Serve and verify**

Reload. Click the hero's "See what we build" — it now scrolls to the Labs band. Expected:
- Dark band with a teal glow, headline, copy, "Stay in touch" mailto button, and a terminal-style block with a blinking cursor.
- Nav "Labs" link scrolls here too.
- No named product appears anywhere.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: SaltedHash Labs teaser band"
```

---

### Task 9: Testimonials (light) with CSS initials avatars

Keep both testimonials verbatim; replace hotlinked LinkedIn photos with CSS initials badges.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- testimonials -->`)
- Modify: `bradking.consulting/css/main.css` (append testimonial styles)

**Interfaces:**
- Consumes: `.section`, `.container`, `.eyebrow`, `.h2`.
- Produces: `<section id="testimonials">`; `.quotes`, `.quote`, `.avatar` classes.

Testimonial text is copied **verbatim** from the current `index.html` (lines 313–336). Do not paraphrase.

- [ ] **Step 1: Insert testimonials markup (replace the `<!-- testimonials -->` line)**

```html
        <section id="testimonials" class="section testimonials">
            <div class="container">
                <p class="eyebrow">Feedback from clients and peers</p>
                <h2 class="h2">Testimonials</h2>
                <div class="quotes">
                    <blockquote class="quote">
                        <p>Brad is a highly skilled engineer who excels at taking a concept from idea to execution. I've worked on a number of projects where Brad has been able to optimise the design and produce quality well tested code to achieve the target even including plans on how we can take it further.</p>
                        <p>With his background in security, he's provided valuable insite into how we can improve and follow standards better and the real life impact on the work needed. I'd highly recommend Bradley to anyone who needs a DevSecOps engineer.</p>
                        <footer class="quote__by">
                            <span class="avatar" aria-hidden="true">JR</span>
                            <span>Jess Rowley — DevOps Engineer
                                <a href="https://www.linkedin.com/in/jessrowley/" target="_blank" rel="noopener" aria-label="Jess Rowley on LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                            </span>
                        </footer>
                    </blockquote>
                    <blockquote class="quote">
                        <p>I had the great opportunity to consult with Brad King on my product development, and his guidance has been invaluable. Brad’s expertise extends far beyond basic recommendations; he offered actionable advice that has significantly impacted the direction and quality of my product.</p>
                        <p>One standout moment was when he pointed me to a tool that not only improved my product but also added an extra layer of reliability. His well-rounded perspective has been a game-changer for my business.</p>
                        <p>Having Brad King in your corner is an asset, to say the least. His guidance is insightful, his advice is always on point, and his support has been instrumental in helping me navigate the complexities of product development.</p>
                        <p>If you’re in need of expert guidance to propel your business to the next level, I can’t recommend Brad King highly enough.</p>
                        <footer class="quote__by">
                            <span class="avatar" aria-hidden="true">CK</span>
                            <span>Chinyelu Philomena Karibi-Whyte — Cyber Security Consultant
                                <a href="https://www.linkedin.com/in/chinyelu-philomena-karibi-whyte/" target="_blank" rel="noopener" aria-label="Chinyelu Philomena Karibi-Whyte on LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                            </span>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append testimonial styles to `css/main.css`**

```css
/* ===== Testimonials ===== */
.testimonials { background: #f7f8fa; }
.quotes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
    gap: var(--space-3);
    margin-top: var(--space-4);
}
.quote {
    margin: 0;
    background: #fff;
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
    padding: var(--space-4);
}
.quote p { color: var(--color-ink); }
.quote__by {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-3);
    font-size: .92rem;
    color: var(--color-muted);
    font-weight: 500;
}
.avatar {
    flex: 0 0 auto;
    width: 46px; height: 46px;
    display: grid; place-items: center;
    border-radius: 50%;
    font-family: var(--font-mono);
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
}
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to Testimonials. Expected:
- Two testimonial cards, both shown in full (no "read more" truncation).
- Each footer shows a gradient circular badge with initials (`JR`, `CK`) and a working LinkedIn link.
- Network tab shows **no** request to `media.licdn.com`.
- Nav "Testimonials" scrolls here.

- [ ] **Step 4: Assert no hotlinked LinkedIn images**

Run (from `bradking.consulting/`):
```bash
grep -c 'media.licdn.com' index.html
```
Expected output: `0`.

- [ ] **Step 5: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: testimonials with CSS initials avatars, no hotlinked photos"
```

---

### Task 10: About / Contact (dark) — engagement framing, no rates

Founder bio for Brad King; engagement types (hourly / day-rate / project) with a "get in touch for a quote" framing — **no numeric pricing**. CTAs: cal.com, mailto, LinkedIn.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- contact -->`)
- Modify: `bradking.consulting/css/main.css` (append contact styles)

**Interfaces:**
- Consumes: `.section--dark`, `.container`, `.eyebrow`, `.h2`, `.btn` variants, dark tokens.
- Produces: `<section id="contact" class="section section--dark">` (nav "About" target).

- [ ] **Step 1: Insert contact markup (replace the `<!-- contact -->` line)**

```html
        <section id="contact" class="section section--dark">
            <div class="container contact">
                <div class="contact__bio">
                    <p class="eyebrow">About &amp; contact</p>
                    <h2 class="h2">Founded by Brad King</h2>
                    <p class="lede">Brad is the founder of SaltedHash Labs — an engineer with a passion for big data, infrastructure design, and cyber security. He works hands-on with clients to architect infrastructure, solve hard technical problems, run health checks, and provide practical security guidance, while building the studio's own SaaS.</p>
                    <p class="contact__engage">Engagements are flexible — <strong>hourly</strong>, <strong>day-rate</strong>, or <strong>project-based</strong>. Every scope is different, so get in touch for a quote tailored to what you need.</p>
                    <div class="hero__cta">
                        <a class="btn btn--primary" href="https://cal.com/brad-king-hpdb" target="_blank" rel="noopener">Book a chat <i class="fa-solid fa-arrow-right"></i></a>
                        <a class="btn btn--ghost" href="mailto:consulting@bradking.co.uk?subject=Consulting%20enquiry">Email for a quote <i class="fa-solid fa-envelope"></i></a>
                        <a class="btn btn--ghost" href="https://www.linkedin.com/in/brad-k-376516127/" target="_blank" rel="noopener">LinkedIn <i class="fa-brands fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Step 2: Append contact styles to `css/main.css`**

```css
/* ===== Contact ===== */
.contact__bio { max-width: 62ch; }
.contact__engage { color: var(--color-dark-ink); margin: var(--space-3) 0 var(--space-4); }
.contact__engage strong { color: var(--color-labs); }
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to About/Contact (nav "About"). Expected:
- Dark section: founder bio, an engagement-types line (hourly/day-rate/project) with **no** currency symbols or numbers, three working CTAs (cal.com new tab, mailto opens compose, LinkedIn new tab).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: about/contact with engagement framing, no rates"
```

---

### Task 11: Footer

`© 2026 SaltedHash Labs` + LinkedIn icon. No theme credit.

**Files:**
- Modify: `bradking.consulting/index.html` (replace `<!-- footer -->`)
- Modify: `bradking.consulting/css/main.css` (append footer styles)

**Interfaces:**
- Consumes: `.container`, dark tokens.
- Produces: `<footer class="site-footer">`.

- [ ] **Step 1: Insert footer markup (replace the `<!-- footer -->` line)**

```html
    <footer class="site-footer">
        <div class="container site-footer__inner">
            <p>© 2026 SaltedHash Labs</p>
            <a href="https://www.linkedin.com/in/brad-k-376516127/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
        </div>
    </footer>
```

- [ ] **Step 2: Append footer styles to `css/main.css`**

```css
/* ===== Footer ===== */
.site-footer {
    background: var(--color-dark);
    color: var(--color-dark-muted);
    padding: var(--space-3);
}
.site-footer__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
}
.site-footer p { margin: 0; }
.site-footer a { color: var(--color-dark-ink); font-size: 1.3rem; }
.site-footer a:hover { color: var(--color-labs); }
```

- [ ] **Step 3: Serve and verify**

Reload, scroll to bottom. Expected:
- Dark footer: "© 2026 SaltedHash Labs" left, LinkedIn icon right.
- No "ShapingRain" / "Theme by" anywhere.

- [ ] **Step 4: Assert no theme credit**

Run (from `bradking.consulting/`):
```bash
grep -ci 'shapingrain\|theme by' index.html
```
Expected output: `0`.

- [ ] **Step 5: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css
git commit -m "feat: footer with SaltedHash copyright"
```

---

### Task 12: Scroll-reveal via IntersectionObserver + reduced-motion

Native scroll-reveal animation on section content, fully disabled under `prefers-reduced-motion: reduce`.

**Files:**
- Modify: `bradking.consulting/js/main.js` (implement `initReveal()`)
- Modify: `bradking.consulting/css/main.css` (append reveal styles)
- Modify: `bradking.consulting/index.html` (add `data-reveal` to section inner containers)

**Interfaces:**
- Consumes: sections built in Tasks 3–11.
- Produces: `initReveal()` adds `.is-visible` to `[data-reveal]` elements as they enter the viewport; skips observing entirely when reduced motion is requested.

- [ ] **Step 1: Add `data-reveal` to the primary inner container of each animated block**

Add the attribute `data-reveal` to these existing elements (edit each opening tag in `index.html`):
- Hero: `<div class="container hero__inner" data-reveal>`
- Services: the `<div class="container">` inside `#services` → `<div class="container" data-reveal>`
- Approach: the `<div class="container">` inside `#approach` → `<div class="container" data-reveal>`
- Skills: the `<div class="container">` inside `#skills` → `<div class="container" data-reveal>`
- Gallery: the `<div class="container">` inside `#gallery` → `<div class="container" data-reveal>`
- Labs: `<div class="container labs" data-reveal>`
- Testimonials: the `<div class="container">` inside `#testimonials` → `<div class="container" data-reveal>`
- Contact: `<div class="container contact" data-reveal>`

- [ ] **Step 2: Append reveal styles to `css/main.css`**

```css
/* ===== Scroll reveal ===== */
[data-reveal] {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .6s ease, transform .6s ease;
    will-change: opacity, transform;
}
[data-reveal].is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1; transform: none; transition: none; }
    html { scroll-behavior: auto; }
    .labs__cursor { animation: none; }
    * { transition-duration: .001ms !important; animation-duration: .001ms !important; }
}
```

- [ ] **Step 3: Implement `initReveal()` in `js/main.js`**

```javascript
function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) { return; }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { observer.observe(el); });
}
```

- [ ] **Step 4: Serve and verify (motion on)**

Reload with normal motion settings. Expected:
- As you scroll, each section's content fades/slides up once and stays visible (no re-hiding on scroll up).
- No content is permanently invisible (if JS failed, `initReveal` would have added `.is-visible` as fallback — confirm nothing stays at opacity 0).

- [ ] **Step 5: Verify reduced-motion**

In devtools, emulate `prefers-reduced-motion: reduce` (Rendering panel), then hard-reload. Expected:
- All content is immediately visible with no fade/slide; the Labs terminal cursor does not blink; smooth-scroll is off. No console errors.

- [ ] **Step 6: Commit**

```bash
git add bradking.consulting/index.html bradking.consulting/css/main.css bradking.consulting/js/main.js
git commit -m "feat: IntersectionObserver scroll-reveal with reduced-motion support"
```

---

### Task 13: Asset cleanup, legacy-file removal, README fix, final pass

Delete unused assets and the old template files, correct the README, and do a full-page verification sweep at mobile and desktop widths.

**Files:**
- Delete: `bradking.consulting/css/style.css`, `bradking.consulting/css/namari-color.css`, `bradking.consulting/css/animate.css`, `bradking.consulting/js/site.js`
- Delete: `bradking.consulting/images/dancer.jpg`, `bradking.consulting/images/user-images/user-1.jpg`, `user-2.jpg`, `user-3.jpg`
- Delete unused company/gallery images not referenced by `index.html` (see Step 2)
- Modify: `README.md`

**Interfaces:**
- Consumes: the finished `index.html` (single source of truth for which assets are referenced).
- Produces: a repo containing only referenced assets; corrected README.

- [ ] **Step 1: Confirm no legacy file is still referenced, then delete legacy source files**

Run (from `bradking.consulting/`):
```bash
grep -c 'css/style.css\|namari-color\|animate.css\|js/site.js' index.html
```
Expected: `0`. Then:
```bash
cd /home/bradmin/Projects/bradking.consulting/bradking.consulting
git rm css/style.css css/namari-color.css css/animate.css js/site.js
git rm images/dancer.jpg images/user-images/user-1.jpg images/user-images/user-2.jpg images/user-images/user-3.jpg
```

- [ ] **Step 2: Delete company/gallery images not referenced by index.html**

Identify unreferenced images and remove them. Run (from `bradking.consulting/`):
```bash
for f in images/company-images/* images/gallery-images/*; do
  name=$(basename "$f")
  grep -q "$name" index.html || echo "UNREFERENCED: $f"
done
```
For each printed `UNREFERENCED:` path, `git rm` it. Based on the current markup this will include at least: `images/company-images/chemical.png`, `cloud_iconscout.png`, `cogs_iconscout.png`, `openstack.png`, `shield.png`, `wazuh.png`, and `images/gallery-images/gallery-image-3.jpg`, `mcr_drone.jpg`. Keep `images/favicon.png` and `images/logo.png` (favicon is referenced; retain `logo.png` for a future real logo swap). Do **not** delete anything the loop did not flag.

- [ ] **Step 3: Rewrite `README.md`**

```markdown
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

CircleCI (`.circleci/config.yml`) syncs the `bradking.consulting/` directory to the
`s3://bradking.consulting` bucket on push; Cloudflare serves it. No build step runs.
```

- [ ] **Step 4: Full verification sweep**

Serve and confirm across the whole page:
```bash
cd bradking.consulting && python3 -m http.server 8000
```
- **Zero** console errors and **zero** 404s in the Network tab across the full page.
- Every nav link (Services, Approach, Labs, Testimonials, About) scrolls to the right section, uncovered by the sticky nav.
- Both CTAs to cal.com open `https://cal.com/brad-king-hpdb`; mailto links target `consulting@bradking.co.uk`.
- Mobile width (≤760px): hamburger opens/closes; all sections stack cleanly; no horizontal page scroll.
- Desktop width: grids are multi-column; hero, labs band, and contact render dark; body sections render light.
- Gallery lightbox opens/keyboard-navigates/closes.
- Reduced-motion (emulated) disables reveal + cursor blink.

- [ ] **Step 5: Assert cleanup complete**

Run from repo root:
```bash
cd /home/bradmin/Projects/bradking.consulting
test ! -e bradking.consulting/css/style.css && test ! -e bradking.consulting/js/site.js && echo "LEGACY REMOVED"
grep -qi 'hugo' README.md && echo "README STILL WRONG" || echo "README OK"
```
Expected: `LEGACY REMOVED` and `README OK`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy template files and unused assets, fix README"
```

---

## Self-Review

**Spec coverage:**
- Rebrand around SaltedHash Labs → Tasks 2 (wordmark), 3 (hero), 8 (labs), 11 (footer). ✓
- Consultancy-first → Tasks 3, 4, 5, 10 lead; Labs is a single teaser band (Task 8). ✓
- Labs teaser, no named products → Task 8 (asserted "no named product" in verify). ✓
- Remove workshops + numeric pricing → Task 4 (grep asserts `0` for workshop/£/pricing-block); Task 10 replaces pricing with engagement framing. ✓
- Dark-hero/light-body aesthetic → tokens (Task 1), dark hero (3), dark labs (8), dark contact (10), dark footer (11); light services/approach/skills/gallery/testimonials. ✓
- No framework/build step; only Font Awesome + Google Fonts + GLightbox → Task 1 head; Global Constraints; Task 13 removes jQuery stack. ✓
- Three files under `bradking.consulting/` → Tasks 1–12. ✓
- Native IntersectionObserver reveal, ~15 lines → Task 12. ✓
- GLightbox gallery-only → Task 7 (`selector: '.glightbox'`). ✓
- Reuse gallery + company images; drop dancer/user placeholders → Tasks 6, 7, 13. ✓
- README corrected (was Hugo) → Task 13 (grep asserts no "hugo"). ✓
- Wordmark as CSS text logotype → Task 2. ✓
- Brad King as founder in About/Contact → Task 10. ✓
- Page structure sections 1–10 → nav(2), hero(3), services(4), approach(5), skills(6), gallery(7), labs(8), testimonials(9), contact(10), footer(11). ✓
- Remove HoneypotDB mention → not reintroduced anywhere (old About copy replaced in Task 10). ✓
- Keep both testimonials verbatim → Task 9 (copied verbatim, grep asserts no licdn hotlink). ✓
- CSS initials avatars → Task 9. ✓
- Accessibility: landmarks, focus, reduced-motion, mobile-first, clamp() → Task 1 base + Task 12 + throughout. ✓
- No change to `.circleci/config.yml` → stated in Global Constraints; never edited. ✓
- Manual verification via `python3 -m http.server` → every task's verify step. ✓

**Placeholder scan:** No "TBD"/"add appropriate…"/"similar to Task N". All copy is concrete; all code blocks are complete. ✓

**Type/name consistency:** Token names, `.section--dark`/`.container`/`.btn*`/`.eyebrow`/`.h2`/`.lede`, `.card-grid`/`.card` (Tasks 4→5), `.glightbox` selector (Task 7 markup ↔ `initLightbox`), `data-reveal`/`.is-visible` (Task 12 CSS↔JS↔HTML), and the three JS init function names (declared Task 1, implemented Tasks 2/7/12) are consistent across tasks. The hero secondary CTA `#labs` matches the Task 8 section id. ✓

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-02-saltedhash-rebuild.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
