# Architecture Decisions Log

## ADR-001 — Framework
- **Decision:** Next.js 14 (App Router, TypeScript, src/ dir).
- **Reason:** Locked in `START_HERE.md` §2.

## ADR-002 — i18n
- **Decision:** `next-intl` v4 with `localePrefix: "as-needed"`.
- **Effect:** English at `/`, Arabic at `/ar`, RTL on `<html dir="rtl">`.
- **Locked copy:** Arabic strings are pasted verbatim in `messages/ar.json` from `docs/SPEC.md`. Do not paraphrase.

## ADR-003 — CMS
- **Decision (provisional):** Payload CMS in a sibling folder `cms/` with PostgreSQL.
- **Status:** Deferred. Not initialized during foundation phase to avoid blocking Phase 2 on DB provisioning. Will be initialized at the start of Phase 2.7 once `DATABASE_URL` is provided.
- **Collections planned:** `CaseStudies`, `BlogPosts`, `Testimonials`, `ClientLogos`, `Resources`.

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
