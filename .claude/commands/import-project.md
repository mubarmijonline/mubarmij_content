---
description: Import a website into the MubarmiJ portfolio — auto-writes on-brand copy, builds enhanced screenshots + a reel, previews, then publishes.
---

Run the MubarmiJ portfolio import automation for the website in `$ARGUMENTS`.

You give me: a **URL**, how many **photos** (gallery screenshots) and **videos** (0 or 1 reel), and
**login credentials if the site needs them**. I browse the site, write the case study in MubarmiJ's
voice, build the assets, show you a preview, and publish on your approval.

## Inputs (parse from `$ARGUMENTS`; ask for anything missing)
- **url** (required) — the website to import.
- **photos** — gallery screenshots. Default **6**, max 12.
- **videos** — **0 or 1**. Default **1** (build a reel).
- **login** (optional) — if the site needs auth: login URL + username + password (+ optional CSS
  selectors for the user/password/submit fields). **Handle credentials in the runtime env only —
  never write them to the config, a file, or a commit, and never echo them back.**
- **order** — default `0`. Use a negative number (e.g. `-1`) only if the user wants it featured / #1.

## Environment
- Scripts: `cms/scripts/project-import/`. Persona spec: `cms/scripts/project-import/PERSONA.md` (read it).
- Live CMS API: `http://localhost:3001` (`PROJECT_IMPORT_API_KEY` / `PROJECT_IMPORT_AGENT_KEY`; dev fallbacks exist).
- One-time prereq: `cd cms && npm i -D playwright && npx playwright install --with-deps chromium`.

## Steps
1. **Recon.** Open the site (log in first if creds were given). Read the hero, nav, and key pages.
   Note the brand name, industry, services, and the journey pages to feature in the reel.
2. **Write config** `cms/scripts/project-import/<slug>.config.json` following **PERSONA.md**: name,
   brand, slug, websiteUrl, address, `order`, industry, services, EN/AR tagline + shortDescription +
   description, techStack, metrics, reelReason/reelBrief, `reelPages`, `photos`, `videos`. Set
   `"publishStatus": "draft"` for now. Non-secret login hints go under `login` (`url`, `userSel`,
   `passSel`, `submitSel`) — **never credentials**.
3. **Build assets (no publish).** From `cms/scripts/project-import/`:
   ```bash
   BUILD_ONLY=1 PI_LOGIN_USER='…' PI_LOGIN_PASS='…' node run-import.mjs <slug>.config.json
   ```
   (drop the `PI_LOGIN_*` vars if there's no login). This logs in, captures `photos` screenshots,
   enhances them (navy/gold frame, site logo in the title tab, 2× resolution), and builds the reel —
   without touching the CMS.
4. **Preview for approval.** Show the user the generated copy (EN + AR tagline/description), 2–3
   enhanced screenshots, and the reel (view the poster; give the mp4 path). Iterate on the copy/config
   until they approve. **Nothing is public yet.**
5. **Publish on approval.** Set `"publishStatus": "published"` (and `order` if #1) in the config, then
   submit to the live CMS, reusing the built assets:
   ```bash
   SKIP_CAPTURE=1 SKIP_ENHANCE=1 SKIP_REEL=1 CMS=http://localhost:3001 node run-import.mjs <slug>.config.json
   ```
   A new project is **data** — it appears on the live site via the API/ISR (~5 min) with no rebuild.
   (Rebuild + service restart is only needed for code changes, not new imports.)
6. **Verify.** Open `https://<public-origin>/case-studies/<slug>` (+ `/ar`), confirm it renders and the
   reel plays, and report the live URL.

## Rules
- All copy follows **PERSONA.md** — outcome-focused, bilingual, grounded in the real site. No invented
  metrics, UI, testimonials, or capabilities.
- **Draft-first:** nothing goes live until the user approves at step 4.
- **Secrets:** credentials live only in the runtime env for that run; never in the config, logs, or git.
