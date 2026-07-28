// Build a short vertical portfolio reel (1080x1920) from a project's pages.
// Captures each page, frames it with the MubarmiJ treatment, and assembles a
// ken-burns + crossfade montage with intro/outro cards via ffmpeg.
//
//   PI_URL=https://optics.mubarmijonline.com/en/ PI_SLUG=optics \
//   PI_BRAND=OPTICS PI_TAGLINE="See the world in finer detail" \
//   PI_PAGES='[{"path":"/en/","label":"Home"},{"path":"/en/eyeglasses","label":"Eyeglasses"}]' \
//   node build-reel.mjs
//
// Output: <enhanced>/reel.mp4  (picked up automatically by run-import.mjs)
// Requires: playwright + chromium, ffmpeg on PATH.
import { createRequire } from 'module'
import { chromium } from 'playwright'
import { mkdirSync, existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
const require = createRequire(path.join(process.cwd(), 'node_modules/'))
let sharp
try { sharp = require('sharp') } catch { sharp = createRequire(path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'), 'node_modules/'))('sharp') }

const FULL = process.env.PI_URL
const SLUG = process.env.PI_SLUG
if (!FULL || !SLUG) { console.error('Set PI_URL and PI_SLUG'); process.exit(1) }
const ORIGIN = new URL(FULL).origin
const BRAND = process.env.PI_BRAND || SLUG.toUpperCase()
const TAGLINE = process.env.PI_TAGLINE || ''
const CMS = path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'))
const BASE = process.env.PI_DIR || path.join(CMS, 'tmp', 'project-imports', SLUG)
const RDIR = `${BASE}/reel`, PAGES_DIR = `${RDIR}/pages`, FRAMES_DIR = `${RDIR}/frames`
const OUT = process.env.PI_OUT || `${BASE}/enhanced/reel.mp4`
mkdirSync(PAGES_DIR, { recursive: true }); mkdirSync(FRAMES_DIR, { recursive: true }); mkdirSync(path.dirname(OUT), { recursive: true })
// Reuse a logged-in session saved by login.mjs, when present.
const AUTH = `${BASE}/auth.json`
const ctxOpts = existsSync(AUTH) ? { storageState: AUTH } : {}

const PAGES = JSON.parse(process.env.PI_PAGES || '[{"path":"/","label":"Home"}]')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function wrap(text, max) {
  const words = String(text).split(/\s+/); const lines = []; let cur = ''
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur.trim()); cur = w } else cur += ' ' + w }
  if (cur.trim()) lines.push(cur.trim()); return lines
}

// ---- Palette / layout ----
const NAVY = '#0A1628', NAVY_SOFT = '#0E1C30', GOLD = '#D4A24C', CREAM = '#F4EFE6'
const W = 1080, H = 1920
const P = { x: 70, y: 360, w: W - 140, h: 1180, r: 30 }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function bgSvg(extra = '') {
  return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g opacity="0.9">
      <path d="M ${W / 2 - 9} ${H - 150} l 9 -15 l 9 15 l -9 15 z" fill="${GOLD}"/>
    </g>
    <text x="${W / 2}" y="${H - 96}" font-family="Georgia, serif" font-size="34" fill="${GOLD}" text-anchor="middle" letter-spacing="2">MubarmiJ</text>
    <text x="${W / 2}" y="${H - 60}" font-family="Menlo, monospace" font-size="20" fill="#5C7191" text-anchor="middle" letter-spacing="3">mubarmijonline.com</text>
    ${extra}`
}
const defs = `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1930"/><stop offset="1" stop-color="${NAVY}"/></linearGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="20" stdDeviation="30" flood-color="#000" flood-opacity="0.55"/></filter>
  <clipPath id="pc"><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="${P.r}" ry="${P.r}"/></clipPath>
</defs>`

async function pageFrame(shotPath, label, idx, total) {
  const inner = await sharp(shotPath).resize(P.w, P.h, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(`<svg width="${P.w}" height="${P.h}"><rect width="${P.w}" height="${P.h}" rx="${P.r}" ry="${P.r}" fill="#fff"/></svg>`), blend: 'dest-in' }])
    .png().toBuffer()
  const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${defs}
    ${bgSvg()}
    <text x="${W / 2}" y="150" font-family="Menlo, monospace" font-size="24" fill="${GOLD}" text-anchor="middle" letter-spacing="6">${esc(BRAND)} · CASE STUDY</text>
    <text x="${W / 2}" y="248" font-family="Georgia, serif" font-size="60" fill="${CREAM}" text-anchor="middle">${esc(label)}</text>
    <text x="${W / 2}" y="300" font-family="Menlo, monospace" font-size="22" fill="#7C93B4" text-anchor="middle" letter-spacing="2">${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}</text>
    <g filter="url(#sh)"><rect x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="${P.r}" ry="${P.r}" fill="${NAVY_SOFT}"/></g>
    <rect x="${P.x + 0.5}" y="${P.y + 0.5}" width="${P.w - 1}" height="${P.h - 1}" rx="${P.r}" ry="${P.r}" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1.5"/>
  </svg>`)
  const out = `${FRAMES_DIR}/frame-${String(idx).padStart(2, '0')}.png`
  await sharp(svg).composite([{ input: inner, left: P.x, top: P.y }]).png().toFile(out)
  return out
}

async function cardFrame(name, lines) {
  const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${defs}
    ${bgSvg()}
    <text x="${W / 2}" y="150" font-family="Menlo, monospace" font-size="24" fill="${GOLD}" text-anchor="middle" letter-spacing="6">MUBARMIJ · CASE STUDY</text>
    ${lines.map((l) => `<text x="${W / 2}" y="${l.y}" font-family="${l.font || 'Georgia, serif'}" font-size="${l.size}" fill="${l.fill || CREAM}" text-anchor="middle" letter-spacing="${l.ls || 0}">${esc(l.t)}</text>`).join('\n')}
  </svg>`)
  const out = `${FRAMES_DIR}/frame-${name}.png`
  await sharp(svg).toFile(out)
  return out
}

// ---- Capture (reuse existing shots when present) ----
const shots = []
const allPresent = PAGES.every((_, i) => existsSync(`${PAGES_DIR}/page-${String(i + 1).padStart(2, '0')}.png`))
if (allPresent && process.env.PI_REEL_RECAPTURE !== '1') {
  PAGES.forEach((p, i) => shots.push({ file: `${PAGES_DIR}/page-${String(i + 1).padStart(2, '0')}.png`, label: p.label }))
  console.log(`reusing ${shots.length} existing page captures`)
} else {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  try {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 2, locale: 'en-US', ...ctxOpts })
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i]
      const page = await ctx.newPage()
      const url = ORIGIN + p.path
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }))
        await page.keyboard.press('Escape').catch(() => {})
        await page.evaluate(() => window.scrollTo(0, 0)); await sleep(900)
        const f = `${PAGES_DIR}/page-${String(i + 1).padStart(2, '0')}.png`
        await page.screenshot({ path: f, fullPage: false })
        shots.push({ file: f, label: p.label }); console.log(`captured ${p.label} (${url})`)
      } catch (e) { console.log(`skip ${url}: ${e.message}`) }
      await page.close()
    }
    await ctx.close()
  } finally { await browser.close() }
}
if (!shots.length) { console.error('no pages captured'); process.exit(1) }

// ---- Frames ----
const frames = []
const introTag = TAGLINE ? wrap(TAGLINE, 30) : []
frames.push(await cardFrame('intro', [
  { t: BRAND, y: 780, size: 150, ls: 4 },
  ...introTag.map((t, i) => ({ t, y: 880 + i * 54, size: 40, fill: GOLD, font: 'Georgia, serif' })),
  { t: 'A MubarmiJ project', y: 880 + introTag.length * 54 + 44, size: 30, fill: '#7C93B4', font: 'Menlo, monospace', ls: 2 },
]))
for (let i = 0; i < shots.length; i++) frames.push(await pageFrame(shots[i].file, shots[i].label, i + 1, shots.length))
frames.push(await cardFrame('outro', [
  { t: 'Designed & built by', y: 830, size: 40, fill: '#7C93B4', font: 'Menlo, monospace', ls: 1 },
  { t: 'MubarmiJ', y: 940, size: 120, fill: GOLD },
  { t: 'Let’s build yours.', y: 1030, size: 38, fill: CREAM, font: 'Georgia, serif' },
]))
console.log(`built ${frames.length} frames`)

// Portrait 9:16 poster for the reel card/thumbnail (first page frame, or intro).
const posterSrc = frames[1] || frames[0]
await sharp(posterSrc).webp({ quality: 90 }).toFile(`${path.dirname(OUT)}/reel-poster.webp`)
console.log(`poster -> ${path.dirname(OUT)}/reel-poster.webp`)

// ---- ffmpeg assemble (ken-burns + crossfade) ----
const FPS = 30, DUR = 2.6, XFD = 0.5, DFR = Math.round(DUR * FPS)
const N = frames.length
const inputs = []
// Single-frame image inputs: zoompan (d=DFR) expands each into a DUR-second clip.
// (Using `-loop 1 -t` here makes zoompan emit d frames PER input frame → wrong length.)
for (const f of frames) inputs.push('-i', f)
let fc = ''
// Supersample before zoompan so the pan/zoom position rounds at 1/3 of an output
// pixel instead of a whole one — this removes the classic zoompan "vibration".
// Gentle zoom, then downscale to 1080x1920 with lanczos for a smooth result.
// Deterministic zoom as a function of the output frame index `on` (not the
// self-accumulating `zoom+inc`, whose per-frame rounding feedback stutters).
// Large zoompan INPUT (precision) but small OUTPUT s=1080x1920 (speed): the pan
// position rounds in the big input space → sub-output-pixel → smooth, no vibration.
const SS = 3, ZRATE = 0.0007
for (let i = 0; i < N; i++) {
  fc += `[${i}:v]scale=${1080 * SS}:${1920 * SS}:flags=lanczos,zoompan=z='min(1+${ZRATE}*on,1.10)':d=${DFR}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${FPS},format=yuv420p,setpts=PTS-STARTPTS[c${i}];`
}
let prev = 'c0'
for (let i = 1; i < N; i++) {
  const off = (i * (DUR - XFD)).toFixed(3)
  const lbl = i === N - 1 ? 'vout' : `x${i}`
  fc += `[${prev}][c${i}]xfade=transition=fade:duration=${XFD}:offset=${off}[${lbl}];`
  prev = lbl
}
fc = fc.replace(/;$/, '')
const args = [...inputs, '-filter_complex', fc, '-map', '[vout]', '-r', String(FPS),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', OUT]
console.log('ffmpeg assembling…')
const r = spawnSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] })
if (r.status !== 0) { console.error('ffmpeg failed'); process.exit(1) }
const kb = Math.round(readFileSync(OUT).length / 1024)
console.log(`REEL DONE -> ${OUT} (${kb} KB, ${(N * (DUR - XFD) + XFD).toFixed(1)}s)`)
