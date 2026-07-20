// Prepare the brand logo for (a) the CMS `logo` field and (b) the browser-tab
// title on the enhanced frames.
//
//   PI_SLUG=example node prepare-logo.mjs
//
// Preferred input: <originals>/logo-src.png (captured by capture.mjs).
// Fallback: crop from <originals>/desktop.png using PI_LOGO_X/Y/W/H fractions
//           (defaults target a typical top-left header logo — tune if needed).
//
// Outputs:
//   <enhanced>/logo.webp        white card wordmark for the CMS `logo` upload field
//   <enhanced>/logo-embed.png   tight PNG used by enhance.mjs for the title tab
import { createRequire } from 'module'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
const require = createRequire(path.join(process.cwd(), 'node_modules/'))
let sharp
try { sharp = require('sharp') } catch { sharp = createRequire(path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'), 'node_modules/'))('sharp') }

const SLUG = process.env.PI_SLUG
if (!SLUG) { console.error('Set PI_SLUG'); process.exit(1) }
const CMS = path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'))
const BASE = process.env.PI_DIR || path.join(CMS, 'tmp', 'project-imports', SLUG)
const ORIG = `${BASE}/originals`, ENH = `${BASE}/enhanced`
mkdirSync(ENH, { recursive: true })

const fx = Number(process.env.PI_LOGO_X ?? 0.072)
const fy = Number(process.env.PI_LOGO_Y ?? 0.052)
const fw = Number(process.env.PI_LOGO_W ?? 0.070)
const fh = Number(process.env.PI_LOGO_H ?? 0.046)

async function tightBuffer() {
  const srcLogo = `${ORIG}/logo-src.png`
  if (existsSync(srcLogo)) {
    return sharp(srcLogo).trim({ threshold: 30 }).flatten({ background: '#ffffff' }).png().toBuffer()
  }
  const desktop = `${ORIG}/desktop.png`
  if (!existsSync(desktop)) throw new Error('No logo-src.png and no desktop.png to crop from')
  const m = await sharp(desktop).metadata()
  return sharp(desktop)
    .extract({ left: Math.round(m.width * fx), top: Math.round(m.height * fy),
               width: Math.round(m.width * fw), height: Math.round(m.height * fh) })
    .trim({ threshold: 30 }).flatten({ background: '#ffffff' }).png().toBuffer()
}

const buf = await tightBuffer()
// tab embed PNG (tight, ~72px tall)
await sharp(buf).resize({ height: 72 }).png().toFile(`${ENH}/logo-embed.png`)
// CMS logo field: white card wordmark
await sharp(buf).resize({ width: 460, fit: 'inside' })
  .extend({ top: 26, bottom: 26, left: 34, right: 34, background: '#ffffff' })
  .flatten({ background: '#ffffff' }).webp({ quality: 92 }).toFile(`${ENH}/logo.webp`)
const em = await sharp(`${ENH}/logo-embed.png`).metadata()
console.log(`logo ready: logo.webp + logo-embed.png (${em.width}x${em.height})`)
