// Capture screenshots of a website for a portfolio import.
//
//   PI_URL=https://example.com/en PI_SLUG=example node capture.mjs
//
// Produces, under <originals>:
//   desktop.png (1440x1000), tablet.png (834x1112), mobile.png (390x844)
//   gallery-1.png .. gallery-6.png  (six sections spaced down the page)
//   logo-src.png                    (best-effort header logo, for prepare-logo.mjs)
//
// Requires: playwright (npm i playwright && npx playwright install --with-deps chromium)
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const URL = process.env.PI_URL
const SLUG = process.env.PI_SLUG
if (!URL || !SLUG) { console.error('Set PI_URL and PI_SLUG'); process.exit(1) }
const CMS = path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'))
const OUT = process.env.PI_ORIGINALS || path.join(CMS, 'tmp', 'project-imports', SLUG, 'originals')
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const GALLERY_COUNT = Number(process.env.PI_GALLERY_COUNT || 6)

async function dismissOverlays(page) {
  const sels = ['button:has-text("Accept")', 'button:has-text("موافق")', 'button:has-text("قبول")',
    'button:has-text("Got it")', 'button:has-text("OK")', '[aria-label="Close"]',
    'button:has-text("×")', '#onetrust-accept-btn-handler']
  for (const s of sels) { try { const el = await page.$(s); if (el) { await el.click({ timeout: 1000 }).catch(() => {}); await sleep(300) } } catch {} }
  await page.keyboard.press('Escape').catch(() => {})
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = () => new Promise((r) => setTimeout(r, 250))
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += Math.round(window.innerHeight * 0.8)) { window.scrollTo(0, y); await step() }
    window.scrollTo(0, 0)
  })
  await sleep(1200)
}
async function open(ctx) {
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
    .catch(() => page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }))
  await dismissOverlays(page); await autoScroll(page)
  return page
}

async function viewport(browser, name, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'en-US' })
  const page = await open(ctx)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false })
  console.log(`viewport ${name} ${width}x${height}`)
  await ctx.close()
}

async function gallery(browser) {
  const W = 1440, H = 900
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, locale: 'en-US' })
  const page = await open(ctx)

  // Best-effort header logo grab for prepare-logo.mjs.
  const logoSels = ['header a img', 'header img', '.logo img', 'a[href="/"] img',
    'img[alt*="logo" i]', 'header svg', 'a[href$="/en"] img']
  for (const s of logoSels) {
    try { const el = page.locator(s).first(); if (await el.count() && await el.isVisible()) {
      await el.screenshot({ path: `${OUT}/logo-src.png` }); console.log(`logo-src via ${s}`); break } } catch {}
  }

  const scrollH = await page.evaluate(() => document.body.scrollHeight)
  const maxY = Math.max(0, scrollH - H)
  for (let i = 0; i < GALLERY_COUNT; i++) {
    const y = Math.round((maxY * i) / (GALLERY_COUNT - 1))
    await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(700)
    await page.screenshot({ path: `${OUT}/gallery-${i + 1}.png`, fullPage: false })
    console.log(`gallery-${i + 1} @y=${y}`)
  }
  await ctx.close()
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
try {
  await viewport(browser, 'desktop', 1440, 1000)
  await viewport(browser, 'tablet', 834, 1112)
  await viewport(browser, 'mobile', 390, 844)
  await gallery(browser)
  console.log(`CAPTURE DONE -> ${OUT}`)
} finally { await browser.close() }
