# MubarmiJ persona — copywriting spec for auto-imported case studies

Use this when generating a `<slug>.config.json` for a project import. The goal: write the
project's copy the way MubarmiJ writes, from just the live website.

## Who MubarmiJ is
One technical partner for a business: **Process Automation + Professional Web + Mobile Apps**.
Positioning: senior developers who ship production systems tied to business outcomes — not feature
wishlists. Tagline energy: *"Systems That Work So You Don't Have To."*, *"Websites That Bring You
Clients."*

## Voice
- **Outcome-first, concrete, calm.** Lead with what the product lets people *do* or the result it
  drives (find, book, buy, save time, capture leads) — not adjectives.
- **Plain and confident.** Short sentences. No hype, no buzzword soup, no "cutting-edge/revolutionary".
- **Specific to the real site.** Only describe what the site actually shows. Never invent features,
  UI, brands, or metrics.
- **Bilingual EN + AR.** Arabic is natural, modern, lightly Egyptian — not stiff MSA. Mirror the
  English meaning, don't translate word-for-word.

## How to fill each field
Read the live site first (hero, nav, sections, product/service pages). Then:

- **name / slug** — brand name from the site; slug = kebab-case.
- **industry** — pick ONE from: `automotive, ecommerce, hospitality, fnb, healthcare, real-estate,
  education, logistics, retail, services, other`. Use `other` + `industryCustom` only if none fit.
- **services** — what MubarmiJ-style work the site represents, from: `web, mobile, automation,
  maintenance, consulting`. Most sites → `["web"]`; add `mobile` if there's an app, `automation` if
  it's workflow/ops software.
- **tagline** {en, ar} — one outcome line, ≤ ~70 chars. e.g. "Auto-care e-commerce with smart product
  discovery."
- **shortDescription** {en, ar} — ≤ 240 chars. Who it's for + what they can do + the standout value.
- **description** {en, ar} — 3–4 sentences: the experience, the key journeys/sections, the outcomes
  it highlights. Grounded in real sections only.
- **techStack** — 4–6 capability tags (Title Case), e.g. "E-commerce", "Lens Selector", "Bilingual
  UX", "WhatsApp Commerce". Capabilities the site clearly demonstrates — not a guessed framework list.
- **metrics** — 2–3 `{label, value}` **qualitative** proof points (e.g. label "Shopping journey",
  value "Smart finder"). **Never invent numbers.** Only use real figures if the site states them.
- **reelPages** — 6–8 `{path, label}` covering the site's journey (home → key category/feature →
  product/detail → proof/CTA). Use real, existing paths.
- **reelReason / reelBrief** {en, ar} — why a reel fits + a short shot list of the pages, in brand voice.

## Hard rules
- Preserve the real product exactly; do not rewrite the client's brand or claims.
- No fabricated metrics, testimonials, UI, or capabilities.
- Keep it factual and verifiable from the site. When unsure, say less.
- Match the calm, outcome-focused register of the examples in `examples/` (deepa, optics).
