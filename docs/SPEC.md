# MubarmiJ — Copilot Project Prompt

> How to use this file: This is the canonical project spec. Copilot, Cursor, and Claude Code will use it as project context. Paste any section directly into Copilot Chat when working on that section.

---

## ROLE

You are the senior full-stack developer building **MubarmiJ** (mubarmijonline.com) — a bilingual (English-default / Arabic) marketing and lead-generation website for an Egyptian software services company specializing in **Process Automation, Web Development, and Mobile Apps**.

Your job is to implement the requirements in this document precisely. Do not add scope. Do not change copy. When in doubt, default to: **fast, accessible, conversion-optimized, English-first (with full Arabic RTL support), SEO-ready**.

---

## CRITICAL CONSTRAINTS (read first — do not violate these)

- **English is the default language.** Arabic is available at `/ar` with full RTL layout. Every component must be tested in both `dir="ltr"` (default) and `dir="rtl"` (Arabic).
- The supplied **Arabic copy is locked**. Do not paraphrase, summarize, or "improve" Arabic headlines, sub-headlines, CTAs, or button text. Use the exact strings provided.
- **Never display zero metrics.** Strings like "0 Years Experience", "0+ Completed Projects", "0+ Happy Customers" are forbidden anywhere on the site. If real numbers are not yet provided, omit the metric entirely — do not show a placeholder.
- **Performance budgets are hard requirements**, not goals. Mobile PageSpeed ≥ 90, Desktop ≥ 95, LCP < 2.5s, FID < 100ms, CLS < 0.1, total page weight < 2MB per page. If a feature blocks these, the feature gets reworked, not the budget.
- **Do not auto-translate Arabic ↔ English.** Translations are manual and pre-approved. Use i18next JSON files; do not call any auto-translation API at build or runtime.
- **Technical terms stay in English** even in Arabic UI: Automation, CRM, Dashboard, API, etc. Do not transliterate.
- **Forms route to one CRM.** Every form on the site must POST to the same CRM endpoint (HubSpot Free or Brevo). No standalone form handlers.
- **WhatsApp number: +201200588803.** Hard-code this. Floating button on every page.

---

## TECH STACK (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion + Lottie (for illustrations only) |
| Forms | React Hook Form + Zod validation |
| State | Zustand (simple) or React Context |
| Icons | Lucide React + custom SVGs |
| CMS | Payload CMS (preferred) or Sanity |
| Database | PostgreSQL (if Payload) or MongoDB |
| Hosting | Vercel |
| CDN / DNS / DDoS | Cloudflare (free tier) |
| Email transactional | Resend or Brevo |
| Email automation | Brevo (Arabic support, cheaper) |
| CRM | HubSpot Free or Pipedrive |
| Calls | Calendly (embed at `/book-call`) |
| Spam | reCAPTCHA v3 (invisible) |
| i18n | next-i18next with separate `ar.json` / `en.json` |
| Analytics | GA4 + GTM + Microsoft Clarity |
| Ad pixels | Meta Pixel + LinkedIn Insight Tag |

---

## SITE MAP

```
/                                       (Homepage — English default)
/ar                                     (Homepage — Arabic, RTL)

/services/automation                    (PRIMARY service — most important)
/services/web-development
/services/mobile-apps
/services/maintenance

/case-studies
/case-studies/[slug]                    (CMS-driven)

/pricing
/resources
/resources/website-mistakes-guide
/resources/automation-roi-calculator
/resources/webinars

/blog
/blog/[slug]                            (CMS-driven)

/about
/contact
/book-call                              (Calendly embed)
/thank-you                              (post-conversion confirmation)
/privacy-policy
/terms-of-service
```

- Pages explicitly **removed** from old site: standalone Cloud Solutions, Custom Software, UI/UX, API Development. These become capabilities listed inside the 3 main service pages, not standalone pages.
- `/services` itself is **NOT** a standalone page — it is a mega menu in the navbar, opening on hover, listing the 4 sub-services.

---

## NAVIGATION (header)

Order in Arabic (right-to-left visual order):

1. الرئيسية (Home)
2. الخدمات (Services) — mega menu on hover, shows the 4 sub-services
3. شغلنا (Case Studies)
4. الأسعار (Pricing)
5. موارد (Resources)
6. المدونة (Blog)
7. عن الشركة (About)
8. **CTA Button:** احجز استشارة — gold `#D4A24C`, prominent
9. **Language Toggle:** AR / EN

---

## DESIGN TOKENS

```css
/* Colors */
--brand-navy: #1E3A5F;
--brand-navy-deep: #0A1628;
--brand-gold: #D4A24C;
--brand-whatsapp: #25D366;
--bg-light: #F8FAFC;

/* Hero gradient */
background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%);

/* CTAs */
.cta-primary    { background: #D4A24C; color: #0A1628; }   /* Gold */
.cta-secondary  { background: transparent; border: 1px solid #D4A24C; color: #D4A24C; }
.cta-whatsapp   { background: #25D366; color: white; }
.cta-leadmagnet { background: #1E3A5F; color: white; }
```

---

## LOCKED COPY (do not change a single word)

### Hero — Arabic (default)

**Headline:**
> بنبني أنظمة بتشتغل مكانك ومواقع بتجيبلك عملاء — شريك تقني واحد لشركتك: أتمتة العمليات + موقع احترافي + تطبيقات موبايل، كله في مكان واحد، بفريق واحد، بمسؤولية واحدة.

**Sub-headline:**
> بنشتغل مع شركات من 10 لـ 100 موظف اللي تعبت من الـ Excel، اللي بتضيع leads، واللي عايزة تكبر من غير ما توظف ناس أكتر.

### Hero — English

**Headline:**
> Systems That Work So You Don't Have To. Websites That Bring You Clients. One technical partner for your business: Process Automation + Professional Web + Mobile Apps — one team, one accountability.

### Tagline (footer + social)

> بنبني تكنولوجيا بتخلي شركتك تشتغل أحسن.
> Technology that makes your business work better.

### CTAs (locked strings)

| Type | Arabic | English | Color |
|---|---|---|---|
| Primary | احجز استشارة مجانية | Book Free Consultation | Gold `#D4A24C` |
| Secondary | شوف شغلنا | View Our Work | Transparent w/ gold border |
| WhatsApp Float | كلمنا واتساب | WhatsApp Us | Green `#25D366` |
| Lead Magnet | حمّل الدليل مجاناً | Get The Free Guide | Navy `#1E3A5F` |

### Forbidden phrases (must never appear anywhere)

- "We Are Expert" or any vague variant
- "Innovative Software Solutions"
- "Cutting-edge technologies"
- "99.9% uptime" without proof
- ANY zero-prefixed metric

---

## HOMEPAGE — SECTION-BY-SECTION SPEC

### Section 1 — Hero
- Height: 80–100% viewport
- Top badge: `🔥 +50 شركة وفّرت وقتها معانا` (gold on transparent)
- Headline + sub-headline (locked copy above)
- Two CTAs: Primary (`احجز استشارة مجانية`) + Secondary (`شوف شغلنا`)
- Right side (LTR) / Left side (RTL): animated dashboard mockup OR notification panel — numbers ticking, notifications sliding in
- Background: gradient `#0A1628 → #1E3A5F` + subtle SVG grid overlay
- Animation: Lottie OR Framer Motion OR pure CSS (no GIF, no video)
- Mobile: animation moves below headline
- **Forbidden:** the old "Scroll Down" indicator; the old "Web Development / Mobile Apps / Cloud Solutions" pills under the headline

### Section 2 — Logo Bar (Trust Strip)
- Background: `#F8FAFC`
- Centered text above row: `بثقة شركات زي:`
- 8–10 client logos, greyscale by default, color on hover
- If fewer than 6 logos: infinite horizontal scroll animation
- Mobile: 3–4 logos per row max

### Section 3 — Problem Agitation
**Headline:** `شركتك بتعاني من واحدة من دول؟`

Three equal cards. Use simple line icons.

| # | Icon | Title | Body |
|---|---|---|---|
| 1 | Excel sheet with red ✗ | فريقك بيضيع ساعات في Excel | بدل ما يبيع، بيدخل بيانات. بدل ما يخدم العميل، بيكتب reports يدوي. |
| 2 | Funnel with leads leaking | بتدفع إعلانات والـ leads بتضيع | بتصرف على ماركتنج بس مفيش CRM يجمع العملاء، ومفيش follow-up أوتوماتيك. |
| 3 | Phone with loading spinner | موقعك مش بيجيبلك عملاء | بطيء، مش mobile-friendly، ومفيش حد بيكلمك منه. مجرد brochure رقمي. |

Below cards: large CTA `لو ده وضعك، احجز استشارة مجانية ←`

### Section 4 — Solutions (3 service cards)
**Headline:** `3 خدمات بتشتغل مع بعض كنظام واحد`

Card 1 (AUTOMATION) is **20% larger** than the other two — visually prominent.

**Card 1: AUTOMATED SYSTEMS**
- Badge: `أعلى ROI` (gold)
- Icon: animated gear or robot
- Title: `أنظمة آلية بتشتغل مكانك`
- 5 bullet list: WhatsApp Bots / CRM متصل / Lead Management / Workflow Automation / Integrations
- Result chip: `✓ عميل وفّر 80 ساعة شغل في الشهر`
- CTA → `/services/automation`

**Card 2: WEB DEVELOPMENT**
- Title: `مواقع بتجيب عملاء، مش مجرد brochure`
- 5 bullets: Landing Pages / مواقع شركات / E-commerce / لوحات تحكم Custom / SEO
- Price chip: `🏷️ يبدأ من 15,000 ج`
- CTA → `/pricing`

**Card 3: MOBILE APPS**
- Title: `تطبيقات بتكبر بيزنسك`
- 5 bullets: iOS + Android / Flutter / Backend متكامل / Admin Dashboard / App Store deployment
- Eligibility chip: `للشركات اللي عندها budget جدي`
- CTA opens Calendly directly (not a page navigation)

### Section 5 — Featured Case Studies
- Headline: `نتايج حقيقية لشركات حقيقية`
- Carousel/slider, auto-play every 6s, pauses on hover
- Each slide shows: client logo / mini-headline (`شركة [القطاع] في [المدينة]`) / Before-After row / 3 bullet solutions / one big result number / CTA → `/case-studies/[slug]`
- Desktop: dots + arrows (arrows on hover only)
- Mobile: swipe + dots only

### Section 6 — Process
- Headline: `من أول مكالمة لتسليم المشروع — كل خطوة شفافة`
- Horizontal timeline (vertical on mobile), 4 steps:
  1. Discovery Call (مجاني — 30 دقيقة)
  2. Proposal تفصيلي (3 أيام عمل)
  3. Build (2–8 أسابيع)
  4. Launch + 3 شهور دعم
- Each step: distinctive icon + large number in transparent background

### Section 7 — Pricing Snapshot
- Headline: `باقات شفافة. بدون مفاجآت.`
- 3 cards:
  - WEB STARTER — `يبدأ من 15,000 ج`
  - WEB BUSINESS — `يبدأ من 25,000 ج` — badge: `الأكثر طلباً`
  - AUTOMATION + WEB — `يبدأ من 45,000 ج` — badge: `الأفضل قيمة ⭐`
- Each card → `/pricing`
- Below cards: `محتاج باقة مخصصة؟ احكي معانا` + WhatsApp button

### Section 8 — Testimonials
- 3 cards: 1 video (if available) + 2 written
- Each card: quote (italic, large) / circular photo 80×80 / name + role + company + logo / 5-star rating gold
- **Hard rule:** any testimonial without photo OR without company name = remove entirely. No anonymous testimonials.

### Section 9 — Lead Magnet
- Background: gold/navy gradient + 3D-angled PDF mockup
- Eyebrow: `📘 احصل مجاناً`
- Headline: `دليل أصحاب الشركات: 10 أخطاء بتضيع عليك نص عملائك من غير ما تحس`
- Sub: `دليل PDF (24 صفحة) + Checklist عملي. بيوصلك على الإيميل خلال دقيقتين.`
- Form: 3 fields only — الاسم / الإيميل / رقم الموبايل
- CTA: `حمّل الدليل مجاناً ←` (large gold button)
- Below form: `✓ بدون spam   ✓ ممكن تلغي الاشتراك في أي وقت`
- On submit: redirect to `/thank-you` + email PDF + push to CRM + enroll in 5-email sequence

### Section 10 — FAQ
Accordion, click to expand, 10–15 questions:

1. إيه الفرق بين موقع وتطبيق؟ وإمتى أحتاج كل واحد؟
2. ليه أسعاركو أعلى من الفريلانسرز؟
3. بتاخدوا كام مدة لتطوير موقع متكامل؟
4. هل بتقدموا صيانة بعد التسليم؟ وبكم؟
5. إزاي بتتم الدفعات؟
6. بتشتغلوا مع شركات في مدن تانية أو دول؟
7. إيه هي الـ Automation وإمتى أحتاجها؟
8. ممكن أشوف شغل سابق ليكم؟
9. بتستخدموا أنهي تكنولوجيات؟
10. لو مش عاجبني الشغل، إيه السياسة؟
11. هل بتساعدوا في hosting و domain؟
12. هل بتعملوا training بعد التسليم؟

**Mandatory:** add `FAQPage` Schema markup (JSON-LD) for Google rich results.

### Section 11 — Final CTA + Contact
- Big headline: `خلاصة الكلام: لو شركتك بتكبر، محتاجة شريك تقني بيفهم.`
- Two large buttons: `احجز استشارتك المجانية ←` / `كلمنا واتساب`
- Quick info: `📞 +20 12 00588803` / `📧 info@mubarmijonline.com` / `📍 [العنوان]` / social icons (Facebook, Instagram, LinkedIn, YouTube)

### Footer
4 columns + bottom strip:
- **Col 1:** Logo + tagline + phone + email + address
- **Col 2:** Quick Links (Home, About, Services, Contact, Pricing, Blog)
- **Col 3:** Services Links (Automation, Web Dev, Mobile Apps, Maintenance)
- **Col 4:** Newsletter signup (email only) + social icons
- **Bottom strip:** `Copyright © 2026 Mubarmij` / Privacy Policy / Terms of Service

---

## /services/automation — DETAILED SPEC (most important page)

| # | Section | Spec |
|---|---|---|
| 1 | Hero | Headline: `أنظمة بتشتغل مكان فريقك. 24 ساعة. 7 أيام. بدون أجازات.` Sub: `بنبني automation شغّال يوفّرلك ساعات شغل ويحوّل عملياتك من فوضى لنظام.` Visual: animated diagram, data in → reports out |
| 2 | Who needs automation? | Interactive checklist, 6–7 items. If user checks 3+, fire popup: `إنت محتاج الأتمتة فعلاً. احجز استشارة.` |
| 3 | Automation types | 4 cards: WhatsApp Bot for sales / CRM integrated with site + ads / Workflow Automation (custom Zapier-style) / System Integrations. Each card: icon + title + 3–4 use cases + CTA `اطلب demo` |
| 4 | ROI Calculator | Inputs: # employees, daily hours on repetitive tasks, avg salary. Output: `إنت بتخسر X جنيه سنوياً. الأتمتة هتوفرلك Y جنيه.` After result → form for emailed report + book call |
| 5 | Automation case studies | 3 cases, automation-only |
| 6 | Process | Automation-specific |
| 7 | Tech logos | n8n, Make.com, Zapier, Twilio, OpenAI API, Google Workspace |
| 8 | FAQ | Automation-specific |
| 9 | Pricing | Starter 15–30K / Pro 50–100K / Enterprise 100–200K EGP |
| 10 | Final CTA | Standard |

---

## /services/web-development — SPEC

- Hero: `موقعك مش brochure رقمي — موقعك أهم Salesman في فريقك.` / `بنبني مواقع بتحوّل الزوار لعملاء، بتتفهرس في جوجل، وبتشتغل بسرعة على كل الأجهزة.`
- 4 website types cards: Landing Page / موقع شركة / E-commerce / Custom Web App
- "Why are we better than 6,000 EGP sites?" comparison: Speed, SEO, Security, Mobile, Maintenance
- Tech Stack: React/Next.js, Node.js, PostgreSQL, AWS/Cloudflare
- Process: brief → delivery in 6–8 weeks
- 2–3 case studies with before/after screenshots
- Detailed pricing
- FAQ
- Final CTA

**Pricing tiers (must appear on `/pricing` page):**
- **Starter:** 12,000 – 18,000 EGP — 5–7 page brochure + hosting (1 yr) + basic SEO
- **Business:** 25,000 – 40,000 EGP — full site + dashboard + advanced SEO + Blog
- **E-commerce:** 45,000 – 75,000 EGP — store + payment gateway + inventory + customer app
- **Enterprise:** 80,000+ EGP — custom site + internal systems + integrations

---

## /services/mobile-apps — SPEC

> **Strategic note:** Mobile is an upsell service, not lead-gen. Build the page fully but do not run paid ads to it for the first 90 days.

- Hero: `تطبيقك مش مشروع تكنولوجي — هو امتداد لبيزنسك.`
- "When do you actually need an app?" decision matrix
- App types: Native iOS / Native Android / Cross-platform (Flutter)
- Mockups for previous apps: Al Mal3ab, Amwally, OG's HUB
- Tech Stack detailed
- Process: 12–16 weeks typically
- Pricing: MVP from 80K EGP, Full from 150K–300K EGP
- FAQ + Final CTA

---

## /case-studies — STRUCTURE

### Index page `/case-studies`
- Filter header (by service: Automation / Web / Mobile)
- Grid: 3 cols desktop, 1 col mobile
- Card: image + client name + sector + big result number + 1-line summary
- Click → `/case-studies/[slug]`

### Single case `/case-studies/[slug]` — REQUIRED structure
1. Hero: client name + sector + service + main result (huge font)
2. Client Profile: 3–4 sentence intro + logo + location
3. The Challenge: 3–5 bullet points (state before us)
4. The Solution: with screenshots
5. Tech Stack
6. Timeline
7. The Results: 4–6 metrics with numbers
8. Testimonial from client (with photo + name)
9. Visual gallery: 3–5 screenshots/mockups
10. Related Case Studies: 3 cards at bottom
11. Final CTA: `عايز نتايج زي دي لشركتك؟ احجز استشارة.`

> **Mandatory:** Case studies must be CMS-driven, not hardcoded. Admin must add new ones from CMS dashboard. Use Payload CMS or Sanity.

---

## /pricing — SPEC

- Hero: `باقات شفافة مبنية على القيمة، مش على المنافسة.`
- Tabs: Web Development / Automation / Mobile Apps / Bundles
- 3–4 pricing cards per tab
- Middle card (most popular) is 10% larger and has gold border
- Each card: name + price (with `يبدأ من`) + 5–7 features (✓ or ✗ in grey) + CTA
- Detailed comparison table below cards
- Pricing-specific FAQ
- Final CTA

> **Strategic intent:** This page is a lead filter. Anyone seeing 15,000 EGP minimum and bouncing = not the target customer. This is the desired filtering effect.

---

## /resources — LEAD MAGNETS HUB

Required resources for v1:
- **PDF:** `دليل أصحاب الشركات: 10 أخطاء بتضيع عليك نص عملائك` — 24 pages
- **ROI Calculator:** automation savings calculator
- **Checklist:** `15 سؤال لازم تسألهم لأي شركة تطوير قبل ما تتعاقد معاهم`
- **Template:** `بريف موقع جاهز للاستخدام` (Word + Google Doc)
- **Webinar (recorded):** `كيف توفر 20 ساعة شغل أسبوعياً بالأتمتة` (45 minutes)

Layout: Grid of cards. Each = thumbnail + title + 1-line desc + `حمّل مجاناً` button. Click opens modal with form (name + email + phone). On submit: email resource + redirect to `/thank-you` + push to CRM + enroll in 5-email sequence over 2 weeks.

---

## /blog, /about, /contact — SPEC

### /blog
- List view with cards: image + title + date + reading time + tags
- Filters by category: Automation / Web / Mobile / Business Tips
- Search bar
- Pagination
- Single post: header + featured image + body + author bio + related posts + CTA box
- CMS-driven (same CMS as case studies)
- Comments: skip in v1, add Disqus later if needed

### /about
- Hero: `بنشتغل مع الشركات اللي عايزة تكبر بجد.`
- Company story (3–4 paragraphs, honest, no fluff)
- Team: real photos + names + roles + LinkedIn (3–4 core members if team is small)
- 4 values with icons: Quality, Transparency, Partnership, Speed
- Achievements with real numbers (not zeros)
- Certifications/partnerships if available
- Office photos if office exists
- Final CTA

### /contact
- Hero: `خلينا نتكلم.`
- Advanced contact form (qualification, not generic):
  - الاسم
  - الإيميل
  - رقم الموبايل (with country code dropdown)
  - اسم الشركة
  - عدد الموظفين (dropdown: 1-10 / 10-50 / 50-100 / 100+)
  - الخدمة المطلوبة (multi-select: Automation / Web / Mobile / Maintenance)
  - الميزانية التقريبية (dropdown: <15K / 15-50K / 50-150K / 150K+)
  - الموعد المثالي للبدء (dropdown)
  - نبذة عن المشروع (textarea)
- Quick contact info (phone + email + WhatsApp + address)
- Calendly embed as alternative to form
- Google Maps embed (if office)
- Operating hours
- Social media links

---

## TECHNICAL FEATURES (must implement all)

### 1. Floating WhatsApp Button
- Position: left side in Arabic (`dir=rtl`), right side in English (`dir=ltr`)
- Pulse animation every 3 seconds (subtle)
- Click: opens WhatsApp with prefilled message: `السلام عليكم، عايز استشارة عن خدماتكم.`
- Mobile: bottom-right, high z-index
- Desktop: tooltip on hover: `كلمنا واتساب`
- Number: **+201200588803**

### 2. Smart Exit-Intent Popup (Desktop only)
- Trigger: mouse moves toward tab close
- Show once per visitor (cookie-based)
- Content: `مستني! خد الدليل المجاني (10 أخطاء بتضيع عليك العملاء)` + email field + button
- Suppress if visitor already submitted any form

### 3. Calendly Integration
- `/book-call` page = Calendly embed
- 30-minute slots
- Pre-call qualification: company name, employee count, budget, project type
- Auto-add to team Google Calendar
- Reminders: 24h and 1h before
- Webhook → CRM on booking

### 4. Live Chat (Phase 2 only)
- Tool: Tawk.to (free) or Crisp
- Hours: 9 AM – 9 PM
- Outside hours: auto-redirect to WhatsApp
- Greeting: `أهلاً! إزاي نقدر نساعدك؟`

### 5. Forms & Lead Capture System
- All forms POST to one CRM endpoint
- Auto email confirmation to user
- Auto email notification to team
- reCAPTCHA v3 (invisible) on all forms
- Real-time validation (email format, phone format)
- Success message inline (no redirect — better UX)

### 6. Email Automation (Brevo)
Sequences required:
- **Lead Magnet sequence** — 5 emails over 2 weeks
- **Discovery Call follow-up** — 3 emails after the call
- **Newsletter** — weekly to subscribers
- **Re-engagement** — for cold leads after 1 month

### 7. Multi-language (EN / AR)
- **Default: English.** URL: `/`
- Arabic. URL: `/ar`
- Toggle saves choice in cookie
- First visit: detect via `Accept-Language` header, then cookie thereafter
- Use `next-intl` (or `next-i18next`) with separate `en.json` and `ar.json` files
- `dir="rtl"` on `<html>` when Arabic
- `hreflang` tags on every page

---

## RTL REQUIREMENTS (read carefully)

- Set `dir="rtl"` on `<html>` for Arabic.
- Tailwind: use `rtl:` prefix utilities, OR set up `tailwindcss-rtl` plugin.
- All directional icons (arrows, chevrons) must flip: ← becomes → in RTL.
- Forms: label above input. Checkboxes on the right side of label in RTL.
- Carousels and sliders: scroll direction reverses in RTL (right-to-left).
- Test every component in both directions before merging.
- **Forbidden:** truncated/cropped text caused by language length differences. Layouts must accommodate both.

---

## SEO REQUIREMENTS (all mandatory)

- Custom `<title>` and `<meta description>` per page (manually written, not auto-generated)
- Open Graph tags + custom OG image per page
- Twitter Card tags
- Canonical URLs
- `sitemap.xml` auto-generated and updated
- Correct `robots.txt`
- Schema markup (JSON-LD):
  - `LocalBusiness` site-wide
  - `Service` schema per service page
  - `Article` schema per blog post
  - `FAQPage` schema on pages with FAQ
  - `Review` / `AggregateRating` if testimonials exist
  - `BreadcrumbList`
- `hreflang` tags on every page (AR/EN)
- Descriptive alt tags on every image (no `image1.jpg`)
- Internal linking: every page has at least 3–5 internal links
- Clean URL structure: `/services/automation`, never `/page?id=5`

---

## PERFORMANCE BUDGETS (hard limits)

| Metric | Limit |
|---|---|
| PageSpeed Mobile | ≥ 90 |
| PageSpeed Desktop | ≥ 95 |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Total page weight | < 2MB |

**Implementation:**
- Images: WebP + lazy loading + responsive `srcset`
- Fonts: WOFF2 + `font-display: swap`
- CSS: minified + critical CSS inline
- JS: code splitting + tree shaking + minified
- CDN: Cloudflare
- Caching: long for static assets, short for HTML

---

## TRACKING & ANALYTICS

Install all of:
- Google Analytics 4 (GA4)
- Google Tag Manager (GTM) — manage all pixels through GTM
- Google Search Console
- Meta Pixel (Facebook + Instagram)
- LinkedIn Insight Tag
- Microsoft Clarity (free) — heatmaps + session recordings
- TikTok Pixel (placeholder, activate later)

Conversion events to track (via GTM):
- `page_view` (auto)
- `scroll_depth` at 25%, 50%, 75%, 100%
- `click_whatsapp_float`
- `click_whatsapp_section`
- `form_submit_contact`
- `form_submit_lead_magnet`
- `form_submit_newsletter`
- `calendly_booking_complete`
- `video_play`
- `pricing_page_view`
- `case_study_view`
- `download_resource`

Build a **Looker Studio dashboard** showing: visitors (daily/weekly/monthly), top traffic sources, top pages, conversion rates per CTA, lead sources, cost per lead.

---

## ACCESSIBILITY (WCAG 2.1 AA)

- Keyboard navigation works everywhere
- Screen reader compatibility
- Contrast ratios: 4.5:1 normal text, 3:1 large text
- Skip-to-content link
- Visible focus indicators
- Form labels associated with inputs
- ARIA where needed for custom controls

---

## SECURITY

- HTTPS enforced (HTTP → HTTPS redirect)
- Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security
- All forms protected by reCAPTCHA v3
- Rate limiting on form endpoints
- CMS access protected by 2FA
- Automated backups (daily for CMS DB, weekly for media)

---

## IMPLEMENTATION ROADMAP (work in this exact order)

### Phase 1 — Quick Wins (Week 1) — patch the OLD site first
- Remove all `0` metrics immediately
- Update Hero copy to new locked Arabic copy
- Install Floating WhatsApp button
- Add client logo bar
- Remove Cloud / Custom Software / UI/UX / API as standalone pages
- Install Microsoft Clarity

### Phase 2 — Foundation (Weeks 2–3)
- Set up new project: Next.js 14 + Tailwind + Payload/Sanity
- Implement design system (colors, typography, components)
- Build new Homepage with all 11 sections
- Build `/services/automation`
- Set up i18n (AR/EN)
- Set up CMS and seed initial data

### Phase 3 — Service Pages + Case Studies (Weeks 4–5)
- Build `/services/web-development`
- Build `/services/mobile-apps`
- Build `/case-studies` index + 3 detailed case studies
- Build `/pricing`
- Set up Calendly integration

### Phase 4 — Lead Generation (Week 6)
- Build `/resources` hub
- Set up Lead Magnet (PDF + landing page + delivery)
- Implement Exit-intent popup
- Set up email automation sequences in Brevo
- Implement all forms with reCAPTCHA
- Set up CRM integration

### Phase 5 — Content & SEO (Weeks 7–8)
- Build `/blog` + first 4–6 articles
- Build `/about` with team photos
- Build advanced `/contact`
- Implement complete Schema markup
- Set up Google Search Console + Bing Webmaster
- Submit sitemap

### Phase 6 — Polish & Launch (Week 9)
- Performance optimization (hit 90+ targets)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile testing (iPhone, Android, multiple sizes)
- Accessibility audit (WCAG AA)
- Security audit
- Backup and monitoring setup
- Final QA + UAT
- Soft launch (5 days)
- Public launch

---

## ACCEPTANCE CRITERIA (the site is NOT done until all pass)

### Functional
- [ ] Every page in sitemap exists and works
- [ ] Every CTA goes to the right destination
- [ ] Every form posts to the CRM, sends user confirmation, sends team notification
- [ ] Floating WhatsApp present on every page and works
- [ ] Calendly integration works, reminders fire correctly
- [ ] AR/EN toggle works with correct RTL/LTR
- [ ] Blog search works
- [ ] Case studies filter works
- [ ] Lead magnet system works end-to-end (download + email + sequence)
- [ ] Exit-intent popup fires correctly on desktop

### Performance
- [ ] PageSpeed Mobile ≥ 90 on Homepage and every service page
- [ ] PageSpeed Desktop ≥ 95
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Total page weight < 2MB on every page

### SEO
- [ ] Custom title + meta description per page
- [ ] Open Graph + Twitter Cards on every page
- [ ] Valid `sitemap.xml` + `robots.txt`
- [ ] Schema markup live on relevant pages
- [ ] `hreflang` tags on every page
- [ ] Correct canonical URLs
- [ ] Descriptive alt tags on every image

### Browser & Device
- [ ] Chrome, Firefox, Safari, Edge (latest 2 versions each)
- [ ] iOS Safari (iPhone 12+)
- [ ] Android (Samsung, Xiaomi)
- [ ] iPad and Android tablets
- [ ] Responsive 320px → 4K

### Accessibility
- [ ] WCAG 2.1 AA passing
- [ ] Keyboard nav full coverage
- [ ] Screen reader tested
- [ ] Contrast ratios verified
- [ ] Skip-to-content link
- [ ] Focus indicators

### Security
- [ ] HTTPS enforced
- [ ] Security headers in place
- [ ] reCAPTCHA on all forms
- [ ] Rate limiting active
- [ ] CMS 2FA enabled
- [ ] Backup automation running

### Documentation
- [ ] `README.md` with setup instructions
- [ ] CMS user guide for the admin (PDF or Notion)
- [ ] Deployment documentation
- [ ] All env variables documented
- [ ] Recovery/backup procedure documented

---

## CLOSING DIRECTIVE TO COPILOT

When implementing any feature in this project:

1. Read the relevant section of this file first. Do not improvise.
2. Preserve the locked Arabic copy verbatim.
3. Test in both RTL and LTR before considering work complete.
4. Run Lighthouse before claiming a page is done.
5. Never introduce a third-party library not listed in the tech stack without explicit approval.
6. If a requirement seems contradictory, surface it — do not silently resolve it.
7. Every component should be reusable, typed (TypeScript), accessible, and responsive.
