# MubarmiJ — Next.js Rebuild

Production rebuild of mubarmijonline.com — Next.js 14 (App Router), TypeScript, Tailwind, next-intl (EN default + AR/RTL).

## Quick start

```bash
cp .env.local.example .env.local
npm install
npm run dev
# open http://localhost:3000  (English)
# open http://localhost:3000/ar  (Arabic, RTL)
```

## Project structure

```
src/
  app/
    layout.tsx                 # Root passthrough
    [locale]/
      layout.tsx               # html/body, fonts, i18n provider, header/footer/whatsapp
      page.tsx                 # Homepage (11 sections)
      services/automation/page.tsx
    api/lead/route.ts          # Single CRM endpoint (all forms)
    sitemap.ts
    robots.ts
    globals.css
  components/
    layout/   Header Footer WhatsAppFloat LangToggle AnalyticsScripts
    sections/ Hero LogoBar Problem Solutions Process PricingSnapshot Testimonials LeadMagnet FAQ FinalCTA CaseStudiesFeatured
    automation/ AutomationChecklist ROICalculator
    ui/       Container Section CTAButton
  i18n/       config.ts request.ts
  lib/        site.ts utils.ts
  middleware.ts
messages/     en.json ar.json
public/
  images/ logos/ case-studies/ resources/
docs/         SPEC.md DECISIONS.md MetaPixel.txt
```

## Status (per `docs/SPEC.md` roadmap)

- [x] STEP 0 — Bootstrap (Next 14 + deps)
- [x] Phase 2.1 — Tailwind brand tokens, fonts, animations
- [x] Phase 2.2 — `[locale]/layout.tsx` + i18n + GTM/GA4/Pixel/Clarity scripts
- [x] Phase 2.3 — Header / Footer / WhatsAppFloat / LangToggle / CTAButton / Section / Container
- [x] Phase 2.4 — Homepage (11 sections; Testimonials & FeaturedCases render `null` until real data per spec)
- [x] Phase 2.5 — `/services/automation` (Hero, checklist, types, ROI calculator, process, tech logos, FAQ, CTA)
- [x] Phase 2.6 — `messages/en.json` and `messages/ar.json` with locked copy verbatim
- [ ] Phase 2.7 — Payload CMS init (deferred — see `docs/DECISIONS.md` ADR-003)
- [ ] Phase 3 — Service pages, Case Studies, Pricing, Book Call
- [ ] Phase 4 — Lead Generation
- [ ] Phase 5 — Content & SEO
- [ ] Phase 6 — Polish & Launch

## Hard constraints (do not violate)

- English default at `/`, Arabic at `/ar` with `dir="rtl"`. Test in both.
- Locked Arabic copy in `messages/ar.json` is verbatim from `docs/SPEC.md`. Do not paraphrase.
- Never display zero-prefixed metrics. Omit instead.
- Forbidden phrases anywhere: "We Are Expert", "Innovative Software Solutions", "Cutting-edge technologies", "99.9% uptime" (without proof).
- WhatsApp number hard-coded: `+201200588803`.
- All forms → `/api/lead`. No standalone form handlers.

See `docs/SPEC.md` for the full spec and `docs/DECISIONS.md` for architecture decisions.
