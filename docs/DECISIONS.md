# Architecture Decisions Log

## ADR-001 — Framework
- **Decision:** Next.js 14 (App Router, TypeScript, src/ dir).
- **Reason:** Locked in `START_HERE.md` §2.

## ADR-002 — i18n
- **Decision:** `next-intl` v4 with `localePrefix: "as-needed"`.
- **Effect:** English at `/`, Arabic at `/ar`, RTL on `<html dir="rtl">`.
- **Locked copy:** Arabic strings are pasted verbatim in `messages/ar.json` from `docs/SPEC.md`. Do not paraphrase.

## ADR-003 — CMS
- **Decision:** Payload CMS v3.84 in sibling folder `cms/` with **MongoDB** (`mongodb://127.0.0.1:27017/mubarmij_cms`).
- **Why MongoDB instead of PostgreSQL:** No PostgreSQL is installed on the production host; MongoDB and MySQL are. Payload v3 supports both. MongoDB chosen for schema flexibility, no migrations, and zero-friction local dev.
- **CMS stack:** Next.js 16.2 + Payload 3.84 + `@payloadcms/db-mongodb` + Lexical rich-text editor + Sharp for images.
- **Runtime:** Node 22 (installed via nvm; user-scoped). The marketing site continues to support Node 18.20+/20+.
- **Layout:** `cms/` is a separate Next.js app on port `3001`. Marketing site (port `3000`) consumes Payload's REST/GraphQL APIs across the network. This isolates admin auth and avoids forcing the marketing site onto Next 16.
- **Collections:** `Users`, `Media`, `CaseStudies`, `BlogPosts`, `Testimonials`, `ClientLogos`, `Resources`. All content collections that need bilingual content use Payload's `localized: true` field option, with locales `en` and `ar` (RTL) registered in `payload.config.ts`.
- **Access:** `CaseStudies` and `BlogPosts` apply a `status: 'published'` filter for unauthenticated reads. `Testimonials`, `ClientLogos`, `Resources`, and `Media` are public-read.
- **Verified:** `npm run build` passes; admin reachable at `/admin`; REST API responds; Mongo DB `mubarmij_cms` is created and seeded with the Payload internal collections (`payload-locked-documents`, `payload-kvs`, plus the user collections on first write).

## ADR-004 — Forms
- **Decision:** All forms POST to `/api/lead`. Provider-specific logic (HubSpot/Pipedrive, Brevo, reCAPTCHA) lives behind that single endpoint.
- **Current state:** Endpoint validates payload only. Provider integrations to be wired in Phase 4.

## ADR-005 — Testimonials & Case Studies "zero-state"
- **Rule:** Per spec, never display zero metrics or anonymous testimonials.
- **Implementation:** `Testimonials.tsx` and `CaseStudiesFeatured.tsx` render `null` until real data with photo + company / CMS entries exist.

## ADR-006 — Fonts
- **EN:** Inter (body) + Poppins (display) via `next/font/google`.
- **AR:** Cairo (body) + Tajawal (display).
- All loaded with `display: "swap"` to protect LCP.

## ADR-007 — Security headers
- Set in `next.config.mjs`. CSP intentionally deferred until all third-party origins (GTM, FB Pixel, Calendly, Clarity) are finalized.

## ADR-008 — Fonts (supersedes ADR-006)
- **Decision:** Four families, down from six. **Poppins** (display/headings/buttons), **DM Sans** (Latin body), **JetBrains Mono** (eyebrows, chips, labels, URLs), **Cairo** (every Arabic role).
- **Dropped:** Inter (DM Sans replaces it), IBM Plex Mono (JetBrains replaces it), IBM Plex Sans Arabic and Tajawal.
- **Why one Arabic family:** Cairo covers Arabic + Latin at the three weights the site actually uses. A second Arabic family cost roughly six extra woff2 files for a distinction that is not perceptible at these sizes.
- **Fallback rule:** the Latin `sans` and `display` stacks chain to Cairo before `system-ui`, so a component that misses its font class still renders Arabic correctly.
- **`.mono` vs `font-mono`:** `.mono` is *semantic* mono and swaps to Cairo under `[dir="rtl"]`, dropping the letter-spacing and uppercase that break connected script. Tailwind's `font-mono` is *literal* monospace and stays JetBrains in both directions.

## ADR-009 — Light-first design system with surface scopes
- **Decision:** The site moves from the dark navy/gold "Flagship" system to a light-first editorial language: white page, hairline-rule grids, numbered mono eyebrows, gold as an accent only, with deliberately dark full-bleed bands for rhythm.
- **Mechanism:** three scope classes in `globals.css` — `.surf-light`, `.surf-subtle`, `.surf-dark` — set CSS custom properties only. `tailwind.config.ts` maps those to colour names (`text-fg`, `border-hair`, `bg-well`, `text-accent`, …). A primitive is written once and inverts automatically inside a dark band. No `dark:` variants, no per-component tone props.
- **Constraint:** never use Tailwind opacity modifiers on the scoped colours (`text-fg/60`). The dark scope stores `rgba()` values, and the modifier silently does nothing. That is why the foreground tints are four separate variables.
- **RTL:** the hairline grid uses logical borders (`border-e`/`border-s`) plus negative logical margins (`-me-px`/`-mb-px`) on the wrapper, so it flips with no direction-specific CSS. Physical utilities (`pl-`, `mr-`, `text-left`, `border-r`, …) are banned in `src/components/system` and `src/components/home`.
- **Removed:** the v1 `.btn-*`/`ui/Section` layer, the v2 `sections/*` tree, `gsap`, `lenis`, `framer-motion`, `zustand`, `lottie-react` and `@vercel/analytics`. In-view reveals now run on a plain IntersectionObserver (`system/Reveal.tsx`), whose hidden state is gated behind `@media (scripting: enabled)` so a no-JS visitor still gets the content.

## ADR-010 — Qualitative metrics in a numeric layout
- **Problem:** the design draws case-study stats as large numbers, but the CMS `results` field holds qualitative phrases ("Browse to bag", "Egypt & Gulf") on most clients, and numeric figures on none.
- **Decision:** `system/StatCell.tsx` detects a leading digit. Numeric values get the design's 30px display treatment; non-numeric values drop to a 17px display-weight phrase. Empty, `0` and `null` render nothing at all, and a row left with fewer than two cells drops its internal hairline.
- **Why it is a layout rule, not a style preference:** a phrase set at 30px overflows its cell below roughly 360px wide and tears the hairline grid apart.
- **Related:** the mockup's invented proof (`+38%`, `2.1×`, `4.8★`, `61% D30`, `80h`, `1.4s`, `100%`) and its two "client name to confirm" testimonials were not shipped. The Proof band renders the real `about.stats` figures, and the quote column appears only once the testimonials collection has rows.
