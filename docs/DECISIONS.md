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
