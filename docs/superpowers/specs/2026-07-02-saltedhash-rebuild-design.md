# SaltedHash Labs Website Rebuild — Design

## Context

`bradking.consulting` currently runs an old jQuery-based single-page template
("Namari") pitching Brad King as a solo DevOps/automation consultant doing
paid workshops for start-ups. The business is pivoting:

- The consultancy continues, but workshops are discontinued.
- Brad now builds and sells several SaaS products under a new umbrella brand,
  **SaltedHash Labs**, which owns both the consultancy and the SaaS products.
- The site needs a full rebuild reflecting this, while staying pure static
  HTML/CSS/JS so the existing CircleCI → S3 → Cloudflare deploy keeps working
  unchanged.

## Goals

- Rebrand the site around SaltedHash Labs as the parent company.
- Lead with consultancy/contract services (primary revenue).
- Give the SaaS Labs side a credibility-building teaser section — no named
  products yet.
- Remove all workshop content and numeric pricing (move to "contact for a
  quote").
- Sleek, modern, professional dark-hero / light-body aesthetic.
- No framework, no build step. Minimal external dependencies.

## Non-goals

- No CMS, no build tooling, no multi-page routing.
- No named SaaS product pages/links (teaser only, per current business
  status).
- No redesign of the deploy pipeline (`.circleci/config.yml` stays as-is,
  syncing `bradking.consulting/` to the S3 bucket).

## Technical foundation

- Single page: `index.html`, `css/main.css`, `js/main.js` inside
  `bradking.consulting/` (replacing the current Namari template files:
  `css/style.css`, `css/namari-color.css`, `css/animate.css`, `js/site.js`).
- No JS framework. Vanilla JS for nav toggle, smooth scroll, and scroll-reveal
  via native `IntersectionObserver`.
- One external dependency: **GLightbox** (CSS+JS via CDN) for the gallery
  lightbox only — chosen over hand-rolling a touch/keyboard-accessible
  lightbox, and over pulling in AOS for scroll-reveal (that's native-coverable
  in ~15 lines).
- Font Awesome kept via existing CDN link for icons.
- Google Fonts: keep/upgrade the existing Open Sans pairing or a similarly
  modern pairing (finalized during implementation, not a design-level
  decision).
- Reuse existing image assets (`images/gallery-images/*`,
  `images/company-images/*`); drop unused ones (`dancer.jpg`, `user-*.jpg`
  placeholders, hotlinked LinkedIn testimonial photos).
- `README.md` corrected — it currently claims Hugo; the site is (and will
  remain) plain static HTML/CSS/JS.

## Brand

- **SaltedHash Labs** is the umbrella brand and the primary nav wordmark.
- Wordmark: CSS/text logotype (no image asset), e.g. styled text combining a
  monospace/hash motif with a bold sans wordmark. Easy to swap for a real
  logo file later without restructuring markup.
- Brad King appears as the founder, in the About/Contact section — not as
  the top-level brand.
- Tagline direction: consultancy-first framing with a nod to the product
  side, e.g. "Infrastructure & DevOps consultancy — from the studio that
  also builds its own SaaS." (exact copy finalized during implementation).

## Page structure (single page, anchored sections)

1. **Sticky nav** — SaltedHash Labs wordmark; links to Services, Approach,
   Labs, Testimonials, About/Contact; LinkedIn icon; mobile hamburger menu.
2. **Hero (dark)** — SaltedHash Labs brand statement + consultancy
   sub-headline. Primary CTA → cal.com booking link (existing:
   `https://cal.com/brad-king-hpdb`). Secondary CTA → scrolls to the Labs
   teaser section. CSS-only gradient/mesh background, no image.
3. **Services (light)** — Cards for: Infrastructure Architecture, DevOps &
   Automation, Cloud & Kubernetes, Cyber Security Guidance, Documentation &
   Enablement. Workshops content fully removed.
4. **Approach (light)** — Short value-proposition strip (3-4 points):
   automation-first, security baked in from the start, clear documentation,
   best-practice foundations. Replaces the old testimonial-quote-only "About"
   section.
5. **Skills / tech grid (light)** — Existing logo grid (Ansible, Terraform,
   AWS, Kubernetes, Python, Helm, Elastic, OVHCloud), restyled, hover overlay
   kept.
6. **Gallery (light)** — Existing 3 images (`dish_mcr.jpg`,
   `mcr_tech_festival.jpg`, `dish_bee.jpg`) via GLightbox.
7. **SaltedHash Labs teaser (dark/accent band)** — "We build our own
   products too" messaging. Generic, no named products, no specific CTA
   required (optionally a soft "stay in touch" mailto link). Distinct visual
   treatment (e.g. subtle hash/terminal motif) to differentiate from the
   consultancy sections.
8. **Testimonials (light)** — Existing two testimonials (Jess Rowley,
   Chinyelu Karibi-Whyte) kept verbatim. Photos replaced with CSS
   initials-avatar badges (e.g. "JR", "CK") instead of hotlinked LinkedIn CDN
   URLs, removing a future breakage risk.
9. **About / Contact (dark)** — Short founder bio (Brad King, SaltedHash
   Labs founder). Replaces the old numeric pricing section: no rates shown,
   copy instead frames engagement types (hourly / day-rate / project) with a
   "get in touch for a quote" CTA. CTAs: cal.com booking, mailto
   (`consulting@bradking.co.uk`), LinkedIn.
10. **Footer** — "© 2026 SaltedHash Labs", LinkedIn icon. Theme credit
    ("Theme by ShapingRain") removed.

## Content changes summary

- Remove: all workshop copy/pricing, "free workshops for start-ups" hero
  line, HoneypotDB-specific mention (superseded by the generic Labs teaser —
  product-specific mentions can return once product branding is finalized).
- Keep: both existing testimonials, tech/skills logo grid, gallery images,
  cal.com link, contact email, LinkedIn.
- Add: SaltedHash Labs brand identity throughout, Labs teaser section,
  Approach section, engagement-types contact framing.

## Accessibility & performance

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`),
  visible focus states, `prefers-reduced-motion` respected for scroll-reveal
  and any CSS animation.
- Mobile-first responsive layout, fluid type via `clamp()`.
- No render-blocking non-essential JS; GLightbox loaded but only initialized
  against the gallery.

## Testing / verification

- No backend logic, so no unit tests. Verification is manual: load the page
  locally (e.g. `python3 -m http.server` from `bradking.consulting/`), check
  each section renders, nav links scroll correctly, mobile menu works,
  gallery lightbox opens/closes/keyboard-navigates, and `prefers-reduced-motion`
  disables scroll-reveal animation. Run through at both mobile and desktop
  widths before considering the work done.

## Deployment

- No changes to `.circleci/config.yml` or the S3 sync target. The rebuild
  replaces files inside `bradking.consulting/` only.
