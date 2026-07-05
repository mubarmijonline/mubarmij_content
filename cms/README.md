# Mubarmij CMS

Payload CMS v3 admin for the MubarmiJ site.

## Stack
- Next.js 16.2 + Payload 3.84
- MongoDB via `@payloadcms/db-mongodb`
- Lexical rich-text editor
- Sharp for image processing
- TypeScript, ESM (`"type": "module"`)

## Locales
- English (`en`, default)
- Arabic (`ar`, RTL)

Configured in `src/payload.config.ts` via Payload's `localization` block. Fields marked `localized: true` are translatable per-locale at the document level.

## Collections
| Slug | Purpose |
|---|---|
| `users` | Admin auth |
| `media` | Image / PDF uploads |
| `case-studies` | Bilingual case studies, draft/published |
| `blog-posts` | Bilingual blog posts, draft/published |
| `testimonials` | Customer quotes |
| `client-logos` | Trusted-by logos |
| `resources` | Lead-magnet PDFs / checklists |

## Local dev
```bash
# 1) Make sure MongoDB is running on 127.0.0.1:27017
# 2) From this folder:
nvm use 22  # Payload requires Node >= 20.9; Node 22 avoids an undici bug
npm install
npm run dev          # http://localhost:3001/admin
```

First boot will redirect you to a one-time admin user creation page.

## Environment
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URI` — MongoDB connection string. Default points at the local Mongo on this machine.
- `PAYLOAD_SECRET` — long random string used to sign JWTs. **Required**, must be kept secret.
- `NEXT_PUBLIC_SITE_URL` — public URL of the marketing site. Used for CORS/CSRF.
- `PAYLOAD_PUBLIC_SERVER_URL` — public URL of this CMS.

## Scripts
- `npm run dev` — start Next dev server on port 3001.
- `npm run build` — production build (Turbopack).
- `npm run start` — production server on port 3001.
- `npm run generate:types` — regenerate `src/payload-types.ts` from the config.
- `npm run generate:importmap` — regenerate `src/app/(payload)/admin/importMap.js` (run after adding new admin custom components).
