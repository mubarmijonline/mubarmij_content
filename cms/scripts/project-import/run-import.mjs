#!/usr/bin/env node
// One-command portfolio import. Runs the whole pipeline end-to-end:
//   create job -> capture -> prepare logo -> enhance -> write metadata -> submit -> verify
//
//   node run-import.mjs <config.json>
//
// The config file IS the metadata (see examples/deepa.config.json) plus an optional
// "address" (text for the frame address bar). Required keys: name, slug, websiteUrl, industry.
//
// Env (all optional):
//   CMS=http://localhost:3001            import-capable CMS base
//   PUBLIC_URL=http://localhost:3000     public site (for the printed verify links)
//   PROJECT_IMPORT_API_KEY / PROJECT_IMPORT_AGENT_KEY   (fallback to dev-* keys)
//   MEDIA_DEST=/…/cms/media              copy new media here (worktree dev → main CMS)
//   SKIP_CAPTURE=1 / SKIP_ENHANCE=1      reuse existing files under tmp/…/<slug>
//   IDEMPOTENCY_KEY=<slug>-import-1      override the job idempotency key
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, copyFileSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CMS_DIR = path.resolve(HERE, '..', '..')                 // cms/
const CMS = (process.env.CMS || 'http://localhost:3001').replace(/\/$/, '')
const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/$/, '')
const API_KEY = process.env.PROJECT_IMPORT_API_KEY || 'dev-project-import-key'
const AGENT_KEY = process.env.PROJECT_IMPORT_AGENT_KEY || 'dev-project-agent-key'

const cfgPath = process.argv[2]
if (!cfgPath) { console.error('Usage: node run-import.mjs <config.json>'); process.exit(1) }
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
for (const k of ['name', 'slug', 'websiteUrl', 'industry']) {
  if (!cfg[k]) { console.error(`config missing required key: ${k}`); process.exit(1) }
}
const SLUG = cfg.slug
const URL_ = cfg.websiteUrl
const ADDRESS = cfg.address || (() => { try { const u = new URL(URL_); return u.host + (u.pathname === '/' ? '' : u.pathname) } catch { return SLUG } })()
const DIR = path.join(CMS_DIR, 'tmp', 'project-imports', SLUG)
const ENH = path.join(DIR, 'enhanced')
mkdirSync(ENH, { recursive: true })

const step = (n, m) => console.log(`\n▶ [${n}] ${m}`)
function run(script, extraEnv) {
  const r = spawnSync('node', [path.join(HERE, script)], {
    stdio: 'inherit',
    env: { ...process.env, PI_URL: URL_, PI_SLUG: SLUG, PI_ADDRESS: ADDRESS, PI_DIR: DIR, PI_CMS_DIR: CMS_DIR, ...extraEnv },
  })
  if (r.status !== 0) { console.error(`✗ ${script} failed (exit ${r.status})`); process.exit(1) }
}
async function api(method, url, { headers = {}, body } = {}) {
  const res = await fetch(url, { method, headers, body })
  const text = await res.text()
  let json; try { json = JSON.parse(text) } catch { json = { raw: text } }
  return { ok: res.ok, status: res.status, json }
}

// 1) Create (or reuse) the import job
step(1, 'Create import job')
const idem = process.env.IDEMPOTENCY_KEY || `${SLUG}-import-1`
const create = await api('POST', `${CMS}/api/v1/project-imports`, {
  headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idem },
  body: JSON.stringify({
    url: URL_, name: cfg.name, industry: cfg.industry, services: cfg.services || ['web'],
    important: cfg.important !== false, publish: cfg.publishStatus ? cfg.publishStatus === 'published' : true,
    galleryCount: 6, notes: cfg.notes || 'Imported via run-import.mjs',
  }),
})
if (!create.ok) { console.error('create failed', create.status, create.json); process.exit(1) }
const jobId = create.json?.data?.jobId
console.log(`  jobId=${jobId} (${create.json?.data?.idempotent ? 'reused' : 'new'})`)

// 2) Capture
if (process.env.SKIP_CAPTURE === '1') step(2, 'Capture — SKIPPED')
else { step(2, 'Capture screenshots'); run('capture.mjs') }

// 3) Logo
step(3, 'Prepare logo'); run('prepare-logo.mjs')

// 4) Enhance
if (process.env.SKIP_ENHANCE === '1') step(4, 'Enhance — SKIPPED')
else { step(4, 'Enhance (MubarmiJ frame + logo tab)'); run('enhance.mjs') }

// 4b) Optional reel from the project's pages
if (process.env.SKIP_REEL !== '1' && Array.isArray(cfg.reelPages) && cfg.reelPages.length) {
  step('4b', `Build reel from ${cfg.reelPages.length} pages`)
  run('build-reel.mjs', {
    PI_PAGES: JSON.stringify(cfg.reelPages),
    PI_BRAND: cfg.brand || String(cfg.name || SLUG).toUpperCase(),
    PI_TAGLINE: (cfg.tagline && cfg.tagline.en) || '',
  })
} else if (Array.isArray(cfg.reelPages)) { step('4b', 'Reel — SKIPPED') }

// 5) Write metadata.json (config minus orchestration-only keys)
step(5, 'Write metadata.json')
const metadata = { ...cfg }
delete metadata.address; delete metadata.notes; delete metadata.reelPages; delete metadata.brand
if (metadata.enhancement === undefined) metadata.enhancement = 'sharp'
const metaPath = path.join(DIR, 'metadata.json')
writeFileSync(metaPath, JSON.stringify(metadata, null, 2))
console.log(`  ${metaPath}`)

// 6) Submit multipart result
step(6, 'Submit result')
const parts = [
  ['logo', 'logo.webp'], ['desktop', 'desktop.webp'], ['tablet', 'tablet.webp'], ['mobile', 'mobile.webp'],
  ['gallery_1', 'gallery-1.webp'], ['gallery_2', 'gallery-2.webp'], ['gallery_3', 'gallery-3.webp'],
  ['gallery_4', 'gallery-4.webp'], ['gallery_5', 'gallery-5.webp'], ['gallery_6', 'gallery-6.webp'],
]
const fd = new FormData()
fd.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }), 'metadata.json')
for (const [field, file] of parts) {
  const p = path.join(ENH, file)
  if (!existsSync(p)) { console.error(`  missing enhanced file: ${file}`); process.exit(1) }
  fd.append(field, new Blob([readFileSync(p)], { type: 'image/webp' }), file)
}
// Optional reel video (built by build-reel.mjs). Auto-links to the project via the Media→Reels hook.
const reelPath = process.env.PI_REEL || path.join(ENH, 'reel.mp4')
if (existsSync(reelPath)) {
  fd.append('reel', new Blob([readFileSync(reelPath)], { type: 'video/mp4' }), `${SLUG}-reel.mp4`)
  console.log(`  + reel: ${reelPath}`)
  const posterPath = path.join(ENH, 'reel-poster.webp')
  if (existsSync(posterPath)) {
    fd.append('reelPoster', new Blob([readFileSync(posterPath)], { type: 'image/webp' }), `${SLUG}-reel-poster.webp`)
    console.log(`  + reel poster: ${posterPath}`)
  }
}
const submit = await api('POST', `${CMS}/api/v1/agent/project-imports/${jobId}/result`, {
  headers: { 'Authorization': `Bearer ${AGENT_KEY}` }, body: fd,
})
if (!submit.ok) { console.error('submit failed', submit.status, submit.json); process.exit(1) }
console.log('  ' + JSON.stringify(submit.json.data))

// 7) Optional: sync media so a second CMS/public origin can serve the new files
if (process.env.MEDIA_DEST) {
  step(7, `Sync media -> ${process.env.MEDIA_DEST}`)
  const srcDir = path.join(CMS_DIR, 'media')
  let n = 0
  for (const f of readdirSync(srcDir)) {
    const src = path.join(srcDir, f)
    const dest = path.join(process.env.MEDIA_DEST, f)
    // Copy new files, and overwrite when the size differs (e.g. a rebuilt reel
    // reuses the same filename). Stat-based so we don't re-copy identical files.
    let copy = !existsSync(dest)
    if (!copy) { try { copy = statSync(src).size !== statSync(dest).size } catch { copy = true } }
    if (copy) { try { copyFileSync(src, dest); n++ } catch {} }
  }
  console.log(`  synced ${n} file(s)`)
}

// 8) Confirm + verify links
step(8, 'Confirm job')
const job = await api('GET', `${CMS}/api/v1/project-imports/${jobId}`, { headers: { 'Authorization': `Bearer ${API_KEY}` } })
console.log('  ' + JSON.stringify(job.json.data))
const detail = await api('GET', `${CMS}/api/v1/clients/${SLUG}`, { headers: { 'Accept-Language': 'en' } })
const d = detail.json?.data || {}
console.log(`\n✔ Import complete for "${cfg.name}"`)
console.log(`  category:   ${d.category_label}`)
console.log(`  gallery:    ${(d.gallery || []).length} images`)
console.log(`  featured:   ${d.featured}`)
console.log(`  reel:       ${d.reel?.recommended ? d.reel.priority : 'no'}`)
console.log(`  verify:     ${PUBLIC_URL}/case-studies/${SLUG}`)
console.log(`              ${PUBLIC_URL}/ar/case-studies/${SLUG}`)
