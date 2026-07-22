// Apply the MubarmiJ portfolio treatment to captured screenshots (local Sharp;
// no external service). Navy backdrop, browser frame with a gold accent line and
// a white title tab showing the site's own logo, soft shadow, MubarmiJ watermark,
// 16:10 WebP. Original UI is preserved and readable.
//
//   PI_SLUG=example PI_ADDRESS=example.com/en node enhance.mjs
//
// Reads  <enhanced>/logo-embed.png (from prepare-logo.mjs) for the title tab.
// Writes <enhanced>/{desktop,tablet,mobile,gallery-1..6}.webp
import { createRequire } from 'module'
import { mkdirSync, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
const require = createRequire(path.join(process.cwd(), 'node_modules/'))
let sharp
try { sharp = require('sharp') } catch { sharp = createRequire(path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'), 'node_modules/'))('sharp') }

const SLUG = process.env.PI_SLUG
if (!SLUG) { console.error('Set PI_SLUG'); process.exit(1) }
const CMS = path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'))
const BASE = process.env.PI_DIR || path.join(CMS, 'tmp', 'project-imports', SLUG)
const SRC = `${BASE}/originals`, OUT = `${BASE}/enhanced`
mkdirSync(OUT, { recursive: true })
const ADDRESS = process.env.PI_ADDRESS || (process.env.PI_URL ? new URL(process.env.PI_URL).host : SLUG)

// Optional site logo for the title tab.
let LOGO_B64 = null, LOGO_W = 0, LOGO_H = 0
const embed = `${OUT}/logo-embed.png`
if (existsSync(embed)) { const m = await sharp(embed).metadata(); LOGO_W = m.width; LOGO_H = m.height; LOGO_B64 = readFileSync(embed).toString('base64') }

// Brand palette + canvas. Design space is 1600x1000; output is rendered at
// PI_SCALE× (default 2 → 3200x2000) so the vector frame stays crisp and the
// screenshots keep near-native detail. Bump PI_SCALE / PI_WEBP_QUALITY for more.
const NAVY = '#0A1628', NAVY_SOFT = '#0E1C30', CHROME = '#122540', GOLD = '#D4A24C'
const S = Math.max(1, Number(process.env.PI_SCALE || 2))
const QUALITY = Math.min(100, Number(process.env.PI_WEBP_QUALITY || 92))
const W = 1600, H = 1000, M = 78, CHROME_H = 46, RADIUS = 18
const panelX = M, panelY = 64, panelW = W - M * 2, panelH = H - panelY - 72
const contentW = panelW, contentH = panelH - CHROME_H
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function frameSvg() {
  const logoH = 20, logoW = LOGO_W ? Math.round(logoH * (LOGO_W / LOGO_H)) : 0
  const tabW = logoW ? logoW + 40 : 0
  const addrX = panelX + 94 + (tabW ? tabW + 16 : 0)
  const addrW = (panelX + panelW - 40) - addrX
  const tab = LOGO_B64 ? `
    <rect x="${panelX + 94}" y="${panelY + 8}" width="${tabW}" height="${CHROME_H - 8}" rx="9" ry="9" fill="#FFFFFF"/>
    <image href="data:image/png;base64,${LOGO_B64}" x="${panelX + 112}" y="${panelY + (CHROME_H - logoH) / 2 + 1}"
           width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet"/>` : ''
  return Buffer.from(`<svg width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="26" stdDeviation="34" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1930"/><stop offset="1" stop-color="${NAVY}"/></linearGradient>
    <clipPath id="panelClip"><rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="${RADIUS}" ry="${RADIUS}"/></clipPath>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#bg)"/>
  <g filter="url(#shadow)"><rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="${RADIUS}" ry="${RADIUS}" fill="${NAVY_SOFT}"/></g>
  <g clip-path="url(#panelClip)">
    <rect x="${panelX}" y="${panelY}" width="${panelW}" height="${CHROME_H}" fill="${CHROME}"/>
    <circle cx="${panelX + 26}" cy="${panelY + CHROME_H / 2}" r="6.5" fill="#FF5F57"/>
    <circle cx="${panelX + 48}" cy="${panelY + CHROME_H / 2}" r="6.5" fill="#FEBC2E"/>
    <circle cx="${panelX + 70}" cy="${panelY + CHROME_H / 2}" r="6.5" fill="#28C840"/>${tab}
    <rect x="${addrX}" y="${panelY + 10}" width="${addrW}" height="${CHROME_H - 20}" rx="13" ry="13" fill="#0A1628"/>
    <text x="${addrX + addrW / 2}" y="${panelY + CHROME_H / 2 + 4}" font-family="Menlo, monospace" font-size="15" fill="#9DB2CE" text-anchor="middle">${esc(ADDRESS)}</text>
    <rect x="${panelX}" y="${panelY + CHROME_H - 2}" width="${panelW}" height="3" fill="${GOLD}"/>
  </g>
  <rect x="${panelX + 0.5}" y="${panelY + 0.5}" width="${panelW - 1}" height="${panelH - 1}" rx="${RADIUS}" ry="${RADIUS}" fill="none" stroke="${GOLD}" stroke-opacity="0.30" stroke-width="1"/>
  <g opacity="0.92">
    <path d="M ${W - 196} ${H - 34} l 9 -15 l 9 15 l -9 15 z" fill="${GOLD}"/>
    <text x="${W - 168}" y="${H - 24}" font-family="Georgia, serif" font-size="22" fill="${GOLD}" letter-spacing="1.5">MubarmiJ</text>
  </g>
  <text x="${M}" y="${H - 24}" font-family="Menlo, monospace" font-size="13" fill="#5C7191" letter-spacing="1">CASE STUDY · ${esc(SLUG.toUpperCase())}</text>
</svg>`)
}

function roundedMaskSvg(w, h, tl, tr, br, bl) {
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><path d="M ${tl},0 H ${w - tr} A ${tr},${tr} 0 0 1 ${w},${tr} V ${h - br} A ${br},${br} 0 0 1 ${w - br},${h} H ${bl} A ${bl},${bl} 0 0 1 0,${h - bl} V ${tl} A ${tl},${tl} 0 0 1 ${tl},0 Z" fill="#fff"/></svg>`)
}

async function enhance(name) {
  const inFile = `${SRC}/${name}.png`
  if (!existsSync(inFile)) { console.log(`skip (missing): ${name}`); return false }
  const cw = Math.round(contentW * S), ch = Math.round(contentH * S)
  const shot = await sharp(inFile).resize(cw, ch, { fit: 'contain', background: NAVY_SOFT }).toBuffer()
  const rounded = await sharp(shot).composite([{ input: roundedMaskSvg(cw, ch, 0, 0, Math.round(RADIUS * S), Math.round(RADIUS * S)), blend: 'dest-in' }]).png().toBuffer()
  await sharp(frameSvg())
    .composite([{ input: rounded, left: Math.round(panelX * S), top: Math.round((panelY + CHROME_H) * S) }])
    .webp({ quality: QUALITY })
    .toFile(`${OUT}/${name}.webp`)
  console.log(`enhanced ${name}`); return true
}

const GALLERY_COUNT = Number(process.env.PI_GALLERY_COUNT || 6)
const NAMES = ['desktop', 'tablet', 'mobile', ...Array.from({ length: GALLERY_COUNT }, (_, i) => `gallery-${i + 1}`)]
let ok = 0
for (const n of NAMES) { if (await enhance(n)) ok++ }
console.log(`ENHANCE DONE: ${ok}/${NAMES.length} -> ${OUT}`)
