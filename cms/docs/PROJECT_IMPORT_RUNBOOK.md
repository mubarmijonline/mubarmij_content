# Portfolio Project Import — Runbook

Step-by-step procedure to import an external website as a **published, featured portfolio
project** on the MubarmiJ site, using the project-import API. Follow the steps in order.

A portfolio project is a `client-logos` document. It renders at `/case-studies` (list) and
`/case-studies/<slug>` (detail, with the interactive thumbnail gallery). The `case-studies`
collection is **legacy** — do not use it.

Helper scripts live in `cms/scripts/project-import/`:
`run-import.mjs` (orchestrator), `login.mjs`, `capture.mjs`, `prepare-logo.mjs`, `enhance.mjs`,
`build-reel.mjs`. Brand voice for auto-generated copy: `PERSONA.md`.

---

## Fully automated — `/import-project`

The easiest path: run the **`/import-project`** slash command (`.claude/commands/import-project.md`).
You give a **URL**, how many **photos** (gallery screenshots) and **videos** (0/1 reel), and **login
credentials if needed**; Claude reads the site, writes the case study in MubarmiJ's voice (per
`PERSONA.md`), builds the enhanced screenshots + reel, shows you a **preview**, and **publishes on your
approval** (draft-first). New projects are data — they appear on the live site with no rebuild.

Under the hood it's still the pipeline below, with three additions:
- **Login** (`login.mjs`): standard form login saves a session (`auth.json`) that `capture.mjs` and
  `build-reel.mjs` reuse. Credentials come from env (`PI_LOGIN_USER`/`PI_LOGIN_PASS`) — never a file.
- **Counts**: `photos` → `PI_GALLERY_COUNT` (1–12 gallery shots); `videos` → 0/1 (build a reel or not).
- **Preview gate**: `BUILD_ONLY=1 run-import.mjs <config>` builds all assets without touching the CMS;
  approve, then publish by re-running with `SKIP_CAPTURE=1 SKIP_ENHANCE=1 SKIP_REEL=1`.

Prereq (once, on the box that runs captures): `cd cms && npm i` (installs the `playwright` devDep) and
`npx playwright install --with-deps chromium`.

---

## TL;DR — one command

1. Copy `cms/scripts/project-import/examples/deepa.config.json` to `<slug>.config.json` and edit it
   (name, slug, websiteUrl, industry, EN/AR copy, techStack, metrics, reel). It's the `metadata.json`
   plus an optional `"address"` for the frame's address bar.
2. Run:
   ```bash
   cd cms/scripts/project-import
   CMS=http://localhost:3001 node run-import.mjs <slug>.config.json
   ```
   This does everything in order: create job → capture → logo → enhance → write metadata → submit →
   sync media → verify, and prints the public URLs.

**Reel (optional):** add a `reelPages` array to the config (`[{"path":"/en/","label":"Home"}, …]`)
and the orchestrator builds a short vertical reel (`build-reel.mjs`: framed page montage, ken-burns +
crossfades, MubarmiJ intro/outro) and attaches it — the Media→Reels hook auto-links it to the project,
so it shows in the detail page's reel row. Skip with `SKIP_REEL=1`. To pin a project to the top of the
case-studies list, set a low `order` (e.g. `-1`; the list sorts by `order` ascending).

Flags: `SKIP_CAPTURE=1` / `SKIP_ENHANCE=1` / `SKIP_REEL=1` (reuse existing files on a re-run),
`MEDIA_DEST=/…/cms/media` (copy new media to another CMS's media dir — needed in worktree dev mode),
`PUBLIC_URL=…`. Keys come from `PROJECT_IMPORT_API_KEY` / `PROJECT_IMPORT_AGENT_KEY` (fallback `dev-*`).

Prerequisite for capture: `npm i -D playwright && npx playwright install --with-deps chromium`
(run once). The manual steps below explain each stage if you need to run or debug them individually.

---

## What the API does

| Endpoint | Auth (Bearer) | Purpose |
|---|---|---|
| `POST /api/v1/project-imports` | `PROJECT_IMPORT_API_KEY` | Create a job. Honors `Idempotency-Key` header → returns the same job on retry. |
| `GET /api/v1/project-imports/:jobId` | `PROJECT_IMPORT_API_KEY` | Job status / projectSlug / publicUrl / reelRecommended. |
| `POST /api/v1/agent/project-imports/:jobId/result` | `PROJECT_IMPORT_AGENT_KEY` | `multipart/form-data`: `metadata` (JSON) + images `logo,desktop,tablet,mobile,gallery_1..6`. Uploads media, upserts a **published** `client-logos` doc, completes the job. |

Upsert is **by slug** — re-submitting the same slug updates the existing project (and replaces its
screenshots), so the flow is safely repeatable.

---

## Prerequisites (once)

1. **Env keys** in `cms/.env` (server-side only; never in client code):
   ```
   PROJECT_IMPORT_API_KEY=<key>
   PROJECT_IMPORT_AGENT_KEY=<key>
   HIGGSFIELD_ENABLED=false        # local Sharp enhancement (default path)
   ```
2. **Screenshot tooling** (Playwright + Chromium + OS libs):
   ```bash
   npm i -D playwright && npx playwright install --with-deps chromium
   ```
3. **`sharp`** — already a CMS dependency (used by Payload). The scripts resolve it from `cms/node_modules`.

---

## Step 0 — Set variables for this project

```bash
export CMS=http://localhost:3001                       # import-capable CMS base (see "Running the API" below)
export PI_URL="https://deepa-eg.com/en"
export PI_SLUG="deepa"
export PI_NAME="Deepa"
export PI_INDUSTRY="ecommerce"                          # see Field Reference
export PI_ADDRESS="deepa-eg.com/en"                     # text shown in the frame address bar
export API_KEY=dev-project-import-key                   # = PROJECT_IMPORT_API_KEY
export AGENT_KEY=dev-project-agent-key                  # = PROJECT_IMPORT_AGENT_KEY
export D="$PWD/cms/tmp/project-imports/$PI_SLUG"        # working dir (run from repo root)
```

## Step 1 — Create the import job

```bash
curl -s -X POST "$CMS/api/v1/project-imports" \
  -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -H "Idempotency-Key: ${PI_SLUG}-import-1" \
  -d "{\"url\":\"$PI_URL\",\"important\":true,\"publish\":true,\"name\":\"$PI_NAME\",
       \"services\":[\"web\"],\"industry\":\"$PI_INDUSTRY\",\"galleryCount\":6,
       \"notes\":\"Imported via project-import runbook.\"}"
# → {"data":{"jobId":"...","status":"pending"}}
export JOB_ID=<jobId from response>
```

## Step 2 — Capture screenshots

```bash
cd cms/scripts/project-import
PI_URL="$PI_URL" PI_SLUG="$PI_SLUG" node capture.mjs
cd -
```
Produces under `$D/originals/`: `desktop/tablet/mobile.png`, `gallery-1..6.png`, and a best-effort
`logo-src.png`. **Verify** the originals look right (real content, no cookie banner covering the hero).

## Step 3 — Prepare the logo

```bash
cd cms/scripts/project-import
PI_SLUG="$PI_SLUG" node prepare-logo.mjs
cd -
```
Produces `$D/enhanced/logo.webp` (CMS logo field) and `$D/enhanced/logo-embed.png` (title tab).
If the logo crop is off, either re-run with tuned fractions
(`PI_LOGO_X/PI_LOGO_Y/PI_LOGO_W/PI_LOGO_H`, values are 0–1 of the desktop capture) or drop a clean
logo PNG at `$D/originals/logo-src.png` and re-run.

## Step 4 — Enhance (MubarmiJ frame + logo tab)

```bash
cd cms/scripts/project-import
PI_SLUG="$PI_SLUG" PI_ADDRESS="$PI_ADDRESS" node enhance.mjs
cd -
```
Produces `$D/enhanced/{desktop,tablet,mobile,gallery-1..6}.webp`. **Open one** and confirm: navy
backdrop, browser frame with the gold accent line, the site logo in the white title tab, MubarmiJ
watermark, and the original UI still readable.

## Step 5 — Write `metadata.json`

Create `$D/metadata.json` from the template in [Appendix A](#appendix-a--metadatajson-template).
Fill EN + AR copy, `industry`, `services`, `techStack`, `metrics`, and the reel fields. Reel is
**text only — no video is generated**.

## Step 6 — Submit the result

```bash
curl -s -X POST "$CMS/api/v1/agent/project-imports/$JOB_ID/result" \
  -H "Authorization: Bearer $AGENT_KEY" \
  -F "metadata=@$D/metadata.json;type=application/json" \
  -F "logo=@$D/enhanced/logo.webp;type=image/webp" \
  -F "desktop=@$D/enhanced/desktop.webp;type=image/webp" \
  -F "tablet=@$D/enhanced/tablet.webp;type=image/webp" \
  -F "mobile=@$D/enhanced/mobile.webp;type=image/webp" \
  -F "gallery_1=@$D/enhanced/gallery-1.webp;type=image/webp" \
  -F "gallery_2=@$D/enhanced/gallery-2.webp;type=image/webp" \
  -F "gallery_3=@$D/enhanced/gallery-3.webp;type=image/webp" \
  -F "gallery_4=@$D/enhanced/gallery-4.webp;type=image/webp" \
  -F "gallery_5=@$D/enhanced/gallery-5.webp;type=image/webp" \
  -F "gallery_6=@$D/enhanced/gallery-6.webp;type=image/webp"
# → {"data":{"status":"completed","projectSlug":"...","galleryCount":6,...}}
```

## Step 7 — Confirm the job

```bash
curl -s "$CMS/api/v1/project-imports/$JOB_ID" -H "Authorization: Bearer $API_KEY"
# expect: status=completed, projectSlug=<slug>, reelRecommended=true, error=null
```

## Step 8 — Verify

```bash
# API (data): category label, gallery count, reel, tech stack, metric labels
curl -s "$CMS/api/v1/clients/$PI_SLUG" -H "Accept-Language: en" | jq \
  '{category_label, gallery: (.gallery|length), featured, reel, tech_stack, results}'

# Public pages
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/case-studies/$PI_SLUG
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ar/case-studies/$PI_SLUG
```
Checklist: project appears in `/case-studies`, is featured, hero renders, 6 thumbnails render and
clicking one swaps the main image, mobile layout is usable, reel fields present in the API response.

---

## Running the API — two modes

- **Deployed / normal:** the CMS on **`http://localhost:3001`** already includes this API → set
  `CMS=http://localhost:3001` and you're done. Media is served by that same CMS.
- **Dev from a feature branch (worktree):** the `:3001` CMS is a **systemd service pinned to the main
  working tree** and auto-restarts when killed — do **not** hijack it. Instead run the branch CMS on a
  spare port against the **same MongoDB**:
  ```bash
  cd <worktree>/cms
  cp /projects/mubarmij_site/_next_rewrite/cms/.env .env    # same DATABASE_URI + PAYLOAD_SECRET
  # add PROJECT_IMPORT_* keys + HIGGSFIELD_ENABLED=false if missing
  npx next dev -p 3005                                       # set CMS=http://localhost:3005
  ```
  Then, so the public site (`:3000`, which reads `:3001`) can serve the new images, copy them over:
  ```bash
  cp -n <worktree>/cms/media/* /projects/mubarmij_site/_next_rewrite/cms/media/
  ```
  (If the worktree has no `node_modules`, populate it with `cp -al` from the main repo — a symlink is
  rejected by Turbopack as "outside the filesystem root".)

---

## Gotchas (learned the hard way)

- **`logo` is required** on `client-logos`. Always send the `logo` part (Step 3). The endpoint falls
  back to the desktop hero if omitted, but a real logo looks far better.
- **Localized metric labels.** `metrics.label` is localized; the endpoint writes metrics **only** in the
  English base write and lets `fallbackLocale:"en"` cover Arabic. Do not re-send `metrics` in a second
  (ar) write — it recreates the rows and wipes the English labels.
- **Media filesystem split.** Each CMS instance stores uploads under its own `cms/media/`. When running
  the branch CMS on `:3005`, copy new files into the main `cms/media/` so `:3001`/the public site serve
  them (see above). `cms/media/` is gitignored.
- **No local `/api/media` proxy on `:3000`.** The public app rewrites media to same-origin expecting
  nginx in prod; locally `:3000/api/media/*` 404s for **all** case studies. To screenshot the public
  page in a headless browser, intercept `**/api/media/**` and re-fetch from `http://localhost:3001`.
- **ISR caching.** Detail/list pages use `revalidate = 300` (5 min). After an import the public page can
  show stale data for up to 5 min; the first request after expiry serves stale **and** triggers
  regeneration, so request again to see fresh content.
- **Category label prettiness** (`Automotive`, `E-Commerce`, …) comes from the updated `clients.ts`
  label map — it only shows once **this branch is deployed**. Until then the live site shows the raw
  value (e.g. `ECOMMERCE`). The stored `industry` is correct regardless.

---

## Field Reference

**`industry`** (select): `automotive`, `ecommerce`, `hospitality`, `fnb`, `healthcare`, `real-estate`,
`education`, `logistics`, `retail`, `services`, `other` (with `industryCustom`).

**`services`** (multi-select): `automation`, `web`, `mobile`, `maintenance`, `consulting`.

**Flags:** `important`/`featured` → the project's `featured` flag (homepage/importance). `publish:true`
or `publishStatus:"published"` → live. `reelRecommended` + `reelPriority`(`low|medium|high`) +
`reelReason` + `reelBrief` are **text-only** recommendation fields (no video is produced).

---

## Appendix A — `metadata.json` template

```json
{
  "name": "Deepa",
  "slug": "deepa",
  "websiteUrl": "https://deepa-eg.com/en",
  "sourceUrl": "https://deepa-eg.com/en",
  "tagline": { "en": "...", "ar": "..." },
  "shortDescription": { "en": "...", "ar": "..." },
  "description": { "en": "...", "ar": "..." },
  "services": ["web"],
  "industry": "ecommerce",
  "techStack": ["E-commerce", "Smart Product Finder", "Product Catalog"],
  "metrics": [
    { "label": "Shopping journey", "value": "Smart finder" },
    { "label": "Service model", "value": "Same-day install" }
  ],
  "important": true,
  "featured": true,
  "displayOnHomepage": true,
  "publishStatus": "published",
  "importedBy": "claude_code",
  "enhancement": "sharp",
  "reelRecommended": true,
  "reelPriority": "high",
  "reelReason": { "en": "...", "ar": "..." },
  "reelBrief": { "en": "...", "ar": "..." }
}
```

`metrics[].label` is localized but the import sets one label per metric (English), which Arabic falls
back to. `techStack` accepts strings or `{label}` objects.
