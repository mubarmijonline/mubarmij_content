// Standard form login → saves a Playwright storageState so capture.mjs and
// build-reel.mjs can screenshot pages behind auth.
//
//   PI_URL=https://app.example.com PI_SLUG=example \
//   PI_LOGIN_URL=https://app.example.com/login \
//   PI_LOGIN_USER='me@x.com' PI_LOGIN_PASS='secret' node login.mjs
//
// Optional explicit selectors when auto-detection isn't enough:
//   PI_LOGIN_USER_SEL, PI_LOGIN_PASS_SEL, PI_LOGIN_SUBMIT_SEL
//
// Credentials are read from env at runtime and never written anywhere except the
// resulting session cookie in <dir>/auth.json (gitignored under tmp/).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const URL_ = process.env.PI_URL
const SLUG = process.env.PI_SLUG
const USER = process.env.PI_LOGIN_USER
const PASS = process.env.PI_LOGIN_PASS
if (!URL_ || !SLUG) { console.error('Set PI_URL and PI_SLUG'); process.exit(1) }
if (!USER || !PASS) { console.error('Set PI_LOGIN_USER and PI_LOGIN_PASS'); process.exit(1) }
const LOGIN_URL = process.env.PI_LOGIN_URL || new URL('/login', URL_).href
const CMS = path.resolve(process.env.PI_CMS_DIR || path.join(process.cwd(), '..', '..'))
const DIR = process.env.PI_DIR || path.join(CMS, 'tmp', 'project-imports', SLUG)
mkdirSync(DIR, { recursive: true })
const OUT = path.join(DIR, 'auth.json')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const USER_SELS = [process.env.PI_LOGIN_USER_SEL, 'input[type="email"]', 'input[name*="email" i]',
  'input[name*="user" i]', 'input[id*="email" i]', 'input[id*="user" i]', 'input[autocomplete="username"]'].filter(Boolean)
const PASS_SELS = [process.env.PI_LOGIN_PASS_SEL, 'input[type="password"]', 'input[name*="pass" i]',
  'input[autocomplete="current-password"]'].filter(Boolean)
const SUBMIT_SELS = [process.env.PI_LOGIN_SUBMIT_SEL, 'button[type="submit"]', 'button:has-text("Log in")',
  'button:has-text("Login")', 'button:has-text("Sign in")', 'button:has-text("تسجيل الدخول")', 'input[type="submit"]'].filter(Boolean)

async function fillFirst(page, sels, value) {
  for (const s of sels) {
    try { const el = page.locator(s).first(); if (await el.count() && await el.isVisible()) { await el.fill(value); return true } } catch {}
  }
  return false
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US' })
  const page = await ctx.newPage()
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 60000 })
    .catch(() => page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }))
  await sleep(600)
  if (!(await fillFirst(page, USER_SELS, USER))) throw new Error('username field not found (set PI_LOGIN_USER_SEL)')
  if (!(await fillFirst(page, PASS_SELS, PASS))) throw new Error('password field not found (set PI_LOGIN_PASS_SEL)')
  let submitted = false
  for (const s of SUBMIT_SELS) {
    try { const el = page.locator(s).first(); if (await el.count() && await el.isVisible()) { await el.click(); submitted = true; break } } catch {}
  }
  if (!submitted) await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
  await sleep(1500)
  // Heuristic: still on the login URL with a password field visible ⇒ likely failed.
  const stillLogin = page.url().includes('/login') && (await page.locator('input[type="password"]').count()) > 0
  if (stillLogin) console.warn('WARN: still on the login page — credentials or selectors may be wrong')
  await ctx.storageState({ path: OUT })
  console.log(`LOGIN OK -> ${OUT} (url now: ${page.url()})`)
} finally {
  await browser.close()
}
