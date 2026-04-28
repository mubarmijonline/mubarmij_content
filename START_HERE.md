# START HERE — Mubarmij Online (Next.js Rebuild)

> **For the next Copilot session:** Open `/projects/mubarmij_site/_next_rewrite/` as the workspace root, then paste this entire file as the first message. Begin executing **STEP 0** below.

---

## 1. Project context

You are building the production rebuild of **Mubarmij Online** (mubarmijonline.com), a marketing + lead-generation site for an Egyptian software services company. The previous version is a Flask + Jinja site at `/projects/mubarmij_site/` (kept running until this rewrite is launched).

- **Default language: English.** Arabic available at `/ar` (RTL).
- **Locked Arabic copy** must be used verbatim where Arabic appears (see `docs/SPEC.md`).
- All assets, brand identity, pixel ID, and WhatsApp number are already prepared in this folder.

**Read `docs/SPEC.md` in full before writing code.** It is the authoritative spec — site map, page-by-page sections, locked copy, design tokens, performance budgets, SEO/security/a11y requirements, and the 6-phase roadmap.

---

## 2. Tech stack (locked — do not substitute)

| Layer | Choice |
|---|---|
| Framework | **Next.js 14+ (App Router, TypeScript)** |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion + Lottie |
| Forms | React Hook Form + Zod |
| State | Zustand or React Context |
| Icons | Lucide React |
| CMS | Payload CMS (preferred) or Sanity |
| DB | PostgreSQL (Payload) |
| Hosting | Vercel |
| CDN/DNS | Cloudflare |
| Email | Brevo (transactional + automation) |
| CRM | HubSpot Free or Pipedrive |
| Booking | Calendly embed |
| Anti-spam | reCAPTCHA v3 |
| i18n | `next-intl` or `next-i18next` (separate `en.json` / `ar.json`) |
| Analytics | GA4 + GTM + Microsoft Clarity + Meta Pixel + LinkedIn Insight |

---

## 3. Hard constraints (re-check before every commit)

- **English default**, Arabic at `/ar` with `dir="rtl"`. Test every component in both directions.
- **Never display zero-prefixed metrics** (`0 Years`, `0+ Projects`, etc.). Omit the metric until real data exists.
- **No auto-translation.** Translations are manual JSON only.
- **Forbidden phrases anywhere on site:** `We Are Expert`, `Innovative Software Solutions`, `Cutting-edge technologies`, `99.9% uptime` (without proof).
- **Performance budgets are hard limits**: PageSpeed Mobile ≥ 90, Desktop ≥ 95, LCP < 2.5s, FID < 100ms, CLS < 0.1, page weight < 2 MB.
- **WhatsApp number hard-coded:** `+201200588803`. Floating button on every page.
- **All forms POST to one CRM endpoint.** No standalone form handlers.
- Brand colors: navy `#1E3A5F`, navy-deep `#0A1628`, gold `#D4A24C`, whatsapp-green `#25D366`, bg-light `#F8FAFC`.

---

## 4. Pre-staged assets (already in this folder)

```
_next_rewrite/
├── docs/
│   ├── SPEC.md            ← FULL project spec (read first)
│   └── MetaPixel.txt      ← Meta Pixel snippet (ID 26702056632740424)
└── public/
    ├── images/            ← All client logos + brand logos copied from old site
    ├── logos/             ← (empty — for new client logos)
    ├── case-studies/      ← (empty — for case-study screenshots)
    └── resources/         ← (empty — for lead-magnet PDFs etc.)
```

**Available logos in `public/images/`:**
`Mubarmij Logo.jpg`, `Mubarmij_logo_white_background.jpg`, `mubarmij_logo_clean.png`, `mubarmij_logo_transparent.png`, `mubarmij new logo.jpg`, `almal3ab.jpeg`, `amwally_logo.png`, `eltime_logo.jpg`, `fantazia_logo.png`, `masargp_logo.png`, `menus_logo.png`, `ogs_hub.png`, `padel_swift_logo.jpg`, `ramyrafaat_logo.png`.

> **Action item before launch:** rename to kebab-case and convert to WebP. Track this in the build plan.

---

## 5. Required environment variables (`.env.local`)

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://mubarmijonline.com
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=201200588803
NEXT_PUBLIC_CONTACT_EMAIL=info@mubarmijonline.com
NEXT_PUBLIC_CONTACT_PHONE=+201200588803

# Analytics & Pixels
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=26702056632740424
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=

# Calendly
NEXT_PUBLIC_CALENDLY_URL=

# CMS (Payload)
DATABASE_URL=
PAYLOAD_SECRET=
PAYLOAD_PUBLIC_SERVER_URL=

# Email (Brevo)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=info@mubarmijonline.com
BREVO_TEAM_NOTIFY_EMAIL=

# CRM
CRM_PROVIDER=hubspot              # or 'pipedrive'
HUBSPOT_API_KEY=
HUBSPOT_PORTAL_ID=
HUBSPOT_FORM_ID_CONTACT=
HUBSPOT_FORM_ID_LEADMAGNET=

# Anti-spam
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

---

## 6. Meta Pixel (already provisioned — ID `26702056632740424`)

Wire in via `app/layout.tsx` (or via GTM). Snippet for reference is in `docs/MetaPixel.txt`. Use a `<Script strategy="afterInteractive">` component, never inline `<script>`. Include the `<noscript>` fallback `<img>` inside `<body>`.

---

## 7. STEP 0 — Bootstrap (do this first)

Run, in order:

```bash
cd /projects/mubarmij_site/_next_rewrite

npx create-next-app@latest . \
  --typescript --tailwind --app --src-dir \
  --eslint --import-alias "@/*" --no-turbopack

# Move pre-staged public/ into Next.js public/ (the create-next-app may overwrite — back up first)
# After create-next-app finishes, restore /public from the staging.
```

If `create-next-app` complains the directory is not empty, run it in a temp folder and rsync the result in, **preserving** the existing `public/` and `docs/`.

Then install required deps:

```bash
npm install \
  framer-motion lottie-react \
  react-hook-form @hookform/resolvers zod \
  zustand \
  lucide-react \
  next-intl \
  @vercel/analytics
npx shadcn@latest init
```

Initialize Payload CMS in a sibling folder (`/projects/mubarmij_site/_next_rewrite/cms/`) per the official Payload monorepo guide, OR use Sanity CLI — choose one and document the choice in `docs/DECISIONS.md`.

Commit immediately after bootstrap.

---

## 8. Build order (follow `docs/SPEC.md` Phase 2 → Phase 6)

Use the todo list tool to track progress. Mark items in-progress one at a time.

### Phase 2 — Foundation
1. Tailwind config: brand colors, fonts (Poppins + Inter for EN, Cairo + Tajawal for AR), animations.
2. `app/[locale]/layout.tsx` with i18n provider, `dir` switching, GTM/GA4/Pixel/Clarity scripts.
3. Shared components: `Header` (mega menu), `Footer`, `WhatsAppFloat`, `LangToggle`, `CTAButton`, `Section`, `Container`.
4. Homepage (`app/[locale]/page.tsx`) — all 11 sections from spec.
5. `app/[locale]/services/automation/page.tsx` — full spec (most important page).
6. i18n: `messages/en.json`, `messages/ar.json` — populate from locked copy.
7. Payload CMS init: collections for `CaseStudies`, `BlogPosts`, `Testimonials`, `ClientLogos`, `Resources`.

### Phase 3 — Service Pages + Case Studies
- `/services/web-development`, `/services/mobile-apps`, `/services/maintenance`
- `/case-studies` (index with filter) and `/case-studies/[slug]` (CMS-driven)
- `/pricing` with tabs
- `/book-call` with Calendly embed

### Phase 4 — Lead Generation
- `/resources` hub + modal forms
- Lead magnet PDF delivery (Brevo email + 5-email sequence)
- Exit-intent popup (desktop only, cookie-gated)
- Single CRM endpoint at `app/api/lead/route.ts` with reCAPTCHA v3 verification + rate limiting
- All forms route through that endpoint

### Phase 5 — Content & SEO
- `/blog` (CMS-driven) + first 4–6 articles
- `/about`, `/contact` (advanced qualification form)
- Schema markup helpers: `LocalBusiness`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`, `AggregateRating`
- `app/sitemap.ts`, `app/robots.ts`, `hreflang` in metadata
- Per-page custom titles, descriptions, OG images

### Phase 6 — Polish & Launch
- Lighthouse audits per page (must hit budgets)
- Cross-browser + cross-device QA matrix
- WCAG 2.1 AA audit (axe-core CI)
- Security headers in `next.config.js` (CSP, HSTS, X-Frame-Options, etc.)
- Backup automation for Payload DB + uploads
- Deploy to Vercel + Cloudflare proxy

---

## 9. Acceptance criteria (from spec)

The site is **not done** until every checkbox in `docs/SPEC.md` § "ACCEPTANCE CRITERIA" passes. Do not mark a phase complete without verifying its criteria.

---

## 10. Closing directive (re-read every session)

1. Read the relevant section of `docs/SPEC.md` first. Do not improvise.
2. Preserve the locked Arabic copy verbatim.
3. Test in both LTR (default English) and RTL (Arabic) before claiming done.
4. Run Lighthouse before claiming a page is done.
5. Never introduce a third-party library not listed in §2 without explicit approval.
6. If a requirement seems contradictory, surface it — do not silently resolve it.
7. Every component should be reusable, typed (TypeScript), accessible, and responsive.
