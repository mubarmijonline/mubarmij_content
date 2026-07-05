# ALL PAGES + DESIGN — Single Build Prompt (Mubarmij Online)

> **One prompt to build every page.** Paste this as a single message in the new session (alongside `START_HERE.md`). It defines the **design system** once, then specifies **every page** with its layout and design treatment. For locked copy strings (Arabic + English headlines/CTAs), read `docs/SPEC.md` — do not duplicate or paraphrase them.

---

## 0. How to use this prompt

- Build in **Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui**.
- **English is default** (`/`), **Arabic is `/ar`** with `dir="rtl"`. Every component must work in both directions.
- The **design system in §1–§3 applies to all pages**. Each page section (§4+) only describes what is unique to that page.
- Reuse shared components everywhere — do not re-implement headers, cards, or buttons per page.
- Reference `docs/SPEC.md` for: locked copy, performance budgets, SEO/a11y/security requirements, CMS rules, and acceptance criteria.

---

## 1. Design System — Tokens

### Colors (re-skinned brand — navy + gold)
```css
--brand-navy:       #1E3A5F;   /* primary surfaces, headings on light */
--brand-navy-deep:  #0A1628;   /* hero gradient end, footer bg */
--brand-gold:       #D4A24C;   /* primary CTA, accents, highlights */
--brand-gold-soft:  #E5BE7B;   /* hover/light gold */
--whatsapp:         #25D366;   /* whatsapp only */
--bg-light:         #F8FAFC;   /* alternating section bg */
--card-bg:          #FFFFFF;
--text-dark:        #1E293B;
--text-muted:       #64748B;
--border:           #E2E8F0;
```

### Gradients
```css
--hero-gradient:   linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%);
--gold-gradient:   linear-gradient(135deg, #D4A24C 0%, #E5BE7B 100%);
--text-gradient:   linear-gradient(135deg, #D4A24C 0%, #E5BE7B 100%); /* for .gradient-text accents */
```

### Typography
- **English:** `Poppins` (headings 600–800) + `Inter` (body 300–500).
- **Arabic:** `Cairo` (headings) + `Tajawal` (body). Load via `next/font`.
- Section title: `clamp(32px, 5vw, 48px)`, weight 700, line-height 1.2.
- Hero title: `clamp(40px, 6vw, 64px)`, weight 800, line-height 1.1.
- Body: 16–18px, line-height 1.7–1.8.
- `font-display: swap` for all (perf budget).

### Shape & depth
- Radius: cards `20px`, buttons `50px` (pill), inputs `12px`, chips `9999px`.
- Shadows: card `0 10px 40px rgba(10,22,40,.08)`; hover `0 20px 50px rgba(10,22,40,.18)`.
- Section padding: `100px 0` desktop, `64px 0` mobile.
- Container: `max-width: 1280px`, side padding `20px`.

---

## 2. Design System — Animation & Motion

Use **Framer Motion** (replace the old AOS library) with these reusable variants:
- **Reveal on scroll:** fade + 30px up, `whileInView`, `once: true`, stagger children 0.1s. (Replaces `data-aos="fade-up"`.)
- **Slide-in:** fade + 50px from side (`fade-right`/`fade-left` equivalents).
- **Float:** infinite y `0 → -20px → 0` over 6s for decorative blobs and floating cards.
- **Hover lift:** buttons/cards translateY(-3px) + shadow grow, 0.3s.
- **Counter:** count-up when stat enters viewport (never start at 0 visually — see SPEC: no zero metrics).
- **Preloader:** full-screen `--hero-gradient`, centered spinning ring, fades out on load.
- Respect `prefers-reduced-motion`: disable float/counter, keep instant reveals.

---

## 3. Design System — Shared Components (build once in `src/components/`)

### `Header` (sticky, blur)
- Fixed, `bg-white/95 backdrop-blur` + shadow. Height 80px.
- Logo left (LTR) / right (RTL): `mubarmij_logo_transparent.png` on a navy rounded chip for white-logo visibility.
- Nav order (EN): Home · **Services ▾** · Case Studies · Pricing · Resources · Blog · About.
- **Services = mega menu** on hover (not a page): 4 cards → Automation / Web Development / Mobile Apps / Maintenance, each with icon + 1-line desc.
- Right cluster: **`LangToggle` (AR/EN)** + gold pill CTA **"Book Free Consultation"** (`احجز استشارة` in AR).
- Active link: gold underline that grows from start side.
- Mobile: hamburger → full-screen overlay menu, social row at bottom.

### `Footer` (navy `#0A1628`)
- Top **wave SVG** divider (keep from current design).
- 4 columns: (1) logo + tagline + phone + email + address; (2) Quick Links; (3) Services links; (4) Newsletter email input + social icons.
- Social icons: square rounded, gold-gradient on hover, lift.
- Bottom strip: `© 2026 Mubarmij` · Privacy Policy · Terms of Service.

### `WhatsAppFloat`
- Fixed, **left in RTL / right in LTR**, bottom. Green `#25D366` circle, whatsapp icon, subtle ping pulse every 3s.
- Tooltip on hover (desktop): "WhatsApp Us" / "كلمنا واتساب".
- Link: `https://wa.me/201200588803?text=…` with prefilled message (EN/AR per locale).

### `BackToTop`
- Gold pill circle, appears after 400px scroll, smooth scroll up.

### Buttons (`CTAButton` variants)
- **primary:** gold bg `#D4A24C`, navy text `#0A1628`, pill, hover lift + slightly darker.
- **secondary:** transparent, gold border + gold text, fills gold on hover.
- **whatsapp:** green bg, white text + icon.
- **leadmagnet:** navy bg, white text.
- All: pill radius, arrow icon nudges on hover.

### `SectionHeader`
- Eyebrow: short uppercase label with a 40px gold line before it (centered variant has line both sides).
- Title with optional `.gradient-text` gold accent span.
- Optional description (muted, max 600px, centered).

### `PageHeader` (inner pages)
- Compact hero (~40vh) with `--hero-gradient` bg + 3 floating translucent blobs.
- Eyebrow + big title (gold accent on last word) + one-line description.
- **Breadcrumb:** Home › [Current] with chevron (chevron flips in RTL).

### Cards
- `ServiceCard`, `PortfolioCard`, `PricingCard`, `TestimonialCard`, `FaqAccordionItem`, `ResourceCard`, `BlogCard`, `CaseStudyCard`, `ProcessStep`, `StatCounter`, `ProblemCard` — white, radius 20, hover lift, gold icon chip. Defined once, reused.

### Forms
- Inputs: radius 12, border `#E2E8F0`, gold focus ring, label above (a11y `htmlFor`).
- Phone field = country-code `<select>` (keep the full country list from current `contact.html`) + tel input.
- All forms use **React Hook Form + Zod**, invisible **reCAPTCHA v3**, and POST to the single CRM endpoint `app/api/lead/route.ts`. Inline success message (no redirect) except lead magnets (→ `/thank-you`).

---

## 4. PAGE — Home (`/` and `/ar`)

Full 11-section layout (locked copy in SPEC §"HOMEPAGE"). Design treatment per section:

1. **Hero** — `--hero-gradient` + floating blobs + faint SVG grid. Left: gold eyebrow badge `🔥 50+ Companies Saved Time With Us`, big white headline (gold accent), muted sub, two CTAs (primary gold + secondary outline-gold). Right: animated dashboard/notification mockup (Framer Motion — numbers ticking, cards sliding). Mobile: mockup below text. **No "Scroll Down", no old service pills.**
2. **Trust Strip** — `--bg-light`. Centered "Trusted by companies like:" + greyscale logo row (color on hover). Use logos in `public/images/`. <6 logos → infinite marquee.
3. **Problem Agitation** — 3 white cards, line icons, hover lift. Big secondary CTA below.
4. **Solutions** — 3 service cards; **Automation card 20% larger** with gold "Highest ROI" badge + result chip. Cards: gold icon chip, 5-bullet list, CTA.
5. **Featured Case Studies** — auto-play carousel (6s, pause on hover), before/after row, big gold result number. Arrows on hover (desktop), dots+swipe (mobile). CMS-driven.
6. **Process** — 4-step horizontal timeline (vertical on mobile), large translucent step numbers + gold icons.
7. **Pricing Snapshot** — 3 cards, middle "Most Requested" badge, gold value badge on bundle. → `/pricing`.
8. **Testimonials** — 3 cards (1 video + 2 written), circular 80px photo, 5 gold stars. **Hide any testimonial missing photo or company name.**
9. **Lead Magnet** — gold/navy gradient band + 3D-angled PDF mockup. 3-field form → `/thank-you`. Navy CTA.
10. **FAQ** — accordion (10–15 Q from SPEC). Emit **FAQPage JSON-LD**.
11. **Final CTA + Contact** — navy band, two big buttons (gold consult + green whatsapp), quick contact line + social icons.

---

## 5. PAGE — `/services/automation` (PRIMARY)

Design = `PageHeader` + alternating light/white sections. Sections (SPEC "/services/automation"):
1. Hero with animated **data-in → reports-out** diagram (Framer Motion / Lottie).
2. **"Who needs automation?"** interactive checklist (6–7 items); checking 3+ fires a gold popup CTA.
3. **Automation types** — 4 cards (WhatsApp Bot / CRM / Workflow / Integrations), each icon + title + 3–4 use cases + "Request demo".
4. **ROI Calculator** — inputs (employees, daily repetitive hours, avg salary) → animated result ("You lose X / Automation saves Y") → email-report form.
5. Automation **case studies** (3, CMS-filtered to automation).
6. **Process** (automation-specific) — timeline.
7. **Tech logos** strip: n8n, Make.com, Zapier, Twilio, OpenAI API, Google Workspace (greyscale → color).
8. **FAQ** (automation) + FAQPage JSON-LD.
9. **Pricing** mini-cards (Starter/Pro/Enterprise).
10. Final CTA.
Emit **Service** + **BreadcrumbList** JSON-LD.

---

## 6. PAGE — `/services/web-development`

`PageHeader` + sections (SPEC "/services/web-development"):
- Hero (locked copy).
- **4 website-type cards:** Landing Page / Company Site / E-commerce / Custom Web App.
- **"Why better than cheap 6,000 EGP sites?"** comparison block: Speed · SEO · Security · Mobile · Maintenance (✓/✗ table, gold ✓).
- Tech stack chips: React/Next.js, Node.js, PostgreSQL, AWS/Cloudflare.
- Process (brief → 6–8 weeks).
- 2–3 case studies w/ before-after screenshots.
- Pricing tiers (Starter/Business/E-commerce/Enterprise — SPEC numbers).
- FAQ + Final CTA. Service + Breadcrumb JSON-LD.

---

## 7. PAGE — `/services/mobile-apps`

`PageHeader` + sections (SPEC "/services/mobile-apps"). Note: upsell page, no paid ads 90 days (no UI impact).
- Hero (locked copy).
- **"When do you actually need an app?"** decision matrix.
- App types: Native iOS / Native Android / Cross-platform (React Native, Flutter).
- **Phone-mockup gallery** for previous apps: Al Mal3ab, Amwally, OG's HUB (use `almal3ab.jpeg`, `amwally_logo.png`, `ogs_hub.png`).
- Tech stack + Process (12–16 weeks).
- Pricing (MVP from 80K, Full 150K–300K EGP).
- FAQ + Final CTA. Service + Breadcrumb JSON-LD.

---

## 8. PAGE — `/services/maintenance`

`PageHeader` + standard service layout (mirrors others):
- Hero: ongoing maintenance/monitoring/support value prop.
- Capability cards: Performance Monitoring · Security Updates · Bug Fixes & Improvements · Hosting & DevOps.
- Tech chips: AWS, Cloudflare, Docker, Sentry.
- Simple tiered retainer pricing.
- FAQ + Final CTA. Service + Breadcrumb JSON-LD.

---

## 9. PAGE — `/case-studies` (index) + `/case-studies/[slug]`

**CMS-driven (Payload).** Do not hardcode.
- **Index:** `PageHeader` + filter pills (All / Automation / Web / Mobile, gold active) + responsive grid (3 col desktop / 1 mobile). `CaseStudyCard`: image + client + sector + big gold result number + 1-line summary.
- **Detail `[slug]`:** hero (client + sector + service + huge result number) → Client Profile (logo + location) → Challenge (bullets) → Solution (screenshots) → Tech Stack chips → Timeline → Results (4–6 metric tiles) → Testimonial (photo + name) → Visual gallery (3–5) → 3 Related cards → Final CTA.
- Emit **Article/CreativeWork** + **BreadcrumbList** JSON-LD; **AggregateRating** if testimonials exist.

---

## 10. PAGE — `/pricing`

`PageHeader` + sections (SPEC "/pricing"):
- **Tabs:** Web Development / Automation / Mobile Apps / Bundles (gold active tab).
- 3–4 `PricingCard` per tab; **middle card 10% larger + gold border + "Most Popular"**.
- Card: name + price ("starting from") + 5–7 features (✓ gold / ✗ grey) + CTA.
- Detailed **comparison table** below cards.
- Pricing FAQ + Final CTA.
- Strategic note: page is a lead filter (no UI change).

---

## 11. PAGE — `/resources` + children

- **`/resources` hub:** `PageHeader` + `ResourceCard` grid (thumbnail + title + 1-line + "Get Free" button). Click → modal form (name + email + phone) → email resource + `/thank-you` + CRM + 5-email sequence.
- **`/resources/website-mistakes-guide`:** landing page for the 24-page PDF lead magnet (gold/navy band, 3D PDF mockup, 3-field form).
- **`/resources/automation-roi-calculator`:** standalone ROI calculator (same component as automation page) + email-report form.
- **`/resources/webinars`:** recorded webinar cards (thumbnail + duration + gated form).

---

## 12. PAGE — `/blog` + `/blog/[slug]`

**CMS-driven.**
- **List:** `PageHeader` + search bar + category filters (Automation / Web / Mobile / Business Tips) + `BlogCard` grid (image + title + date + reading time + tags) + pagination.
- **Post `[slug]`:** header + featured image + rich body + author bio + related posts + CTA box.
- Emit **Article** + **BreadcrumbList** JSON-LD. (Comments: skip v1.)

---

## 13. PAGE — `/about`

`PageHeader` + sections (SPEC "/about"):
- Hero/story (3–4 honest paragraphs, no fluff/forbidden phrases).
- Team grid: real photo + name + role + LinkedIn (3–4 members).
- **4 values** cards w/ gold icons: Quality · Transparency · Partnership · Speed.
- Achievements with **real numbers only** (never zeros; omit if unknown).
- Optional certifications / office photos.
- Final CTA. **LocalBusiness** JSON-LD lives site-wide; add **BreadcrumbList**.

---

## 14. PAGE — `/contact`

`PageHeader` + two-column layout (keep current design pattern):
- **Left:** contact info cards (Email / Call / WhatsApp — green card) + social row.
- **Right:** advanced qualification form (SPEC fields): name, email, phone (country-code select — reuse full list from current `contact.html`), company, **employee count** (1-10/10-50/50-100/100+), **service** (multi-select: Automation/Web/Mobile/Maintenance), **budget** (<15K/15-50K/50-150K/150K+), **ideal start**, project notes (textarea). Submit → CRM endpoint, inline success.
- Below: Calendly embed alternative + Google Maps (if office) + operating hours.
- Quick WhatsApp CTA band at bottom (keep current).

---

## 15. PAGE — `/book-call`

- `PageHeader` + full **Calendly embed** (30-min slots) via `NEXT_PUBLIC_CALENDLY_URL`.
- Pre-call qualification fields passed to Calendly. Webhook → CRM on booking (server route).
- Lazy-load Calendly script (perf budget).

---

## 16. PAGE — `/thank-you`

- Centered confirmation: gold check animation + "Thank you" headline + next-steps (check email / book a call) + secondary links (Home, Resources).
- Fire conversion events (GTM): form/lead-magnet complete. `noindex`.

---

## 17. PAGES — `/privacy-policy` + `/terms-of-service`

- `PageHeader` + clean long-form legal typography (max-width prose, anchored headings, last-updated date). Port/adapt existing `privacy_policy.html` content. Linked from footer. `BreadcrumbList` JSON-LD.

---

## 18. Global / cross-page

- **Floating WhatsApp**, **BackToTop**, **Preloader** on every page.
- **Exit-intent popup** (desktop only, cookie-gated, suppressed after any form submit) — lead-magnet offer.
- **Meta Pixel** (ID `26702056632740424`) + GA4 + GTM + Clarity via `<Script afterInteractive>` in root layout; `<noscript>` pixel fallback in `<body>`.
- **i18n:** `messages/en.json` + `messages/ar.json`; `dir` + lang on `<html>`; `hreflang` alternates on every page; cookie-persisted toggle; first-visit `Accept-Language` detection (default EN).
- **SEO:** per-page custom title/description, OG + Twitter cards, canonical, `app/sitemap.ts`, `app/robots.ts`.
- **A11y:** skip-to-content link, visible gold focus rings, keyboard nav, labeled inputs, ARIA on menus/accordions/carousels.
- **Perf:** `next/image` (WebP + responsive), code splitting, lazy embeds (Calendly/Maps/video), keep every page < 2MB.

---

## 19. Definition of done (per page)

A page is done only when: locked copy verbatim ✓ · works LTR + RTL ✓ · responsive 320px→4K ✓ · no zero metrics / no forbidden phrases ✓ · required JSON-LD present ✓ · Lighthouse meets budgets ✓ · forms (if any) hit the single CRM endpoint with reCAPTCHA ✓. See `docs/SPEC.md` § ACCEPTANCE CRITERIA for the full checklist.
