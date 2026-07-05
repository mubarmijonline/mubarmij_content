// Simple in-memory per-IP token bucket. Suitable for single-process Next.js.
// Replace with Upstash if/when horizontally scaled.

type Bucket = { hits: number[]; }
const STORE: Map<string, Bucket> = new Map()

export type RateLimitOpts = {
  windowMs: number
  max: number
  bucket: string  // logical bucket key (e.g. "leads:contact")
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") || "unknown"
}

// Returns { allowed, retryAfterSec }
export function take(req: Request, opts: RateLimitOpts): { allowed: boolean; retryAfterSec: number } {
  const ip = clientIp(req)
  const key = `${opts.bucket}:${ip}`
  const now = Date.now()
  const cutoff = now - opts.windowMs
  const b = STORE.get(key) || { hits: [] }
  // prune
  b.hits = b.hits.filter((t) => t > cutoff)
  if (b.hits.length >= opts.max) {
    const oldest = b.hits[0]!
    const retryMs = oldest + opts.windowMs - now
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryMs / 1000)) }
  }
  b.hits.push(now)
  STORE.set(key, b)
  // Periodic cleanup: when over 1000 keys, drop empty.
  if (STORE.size > 1000) {
    for (const [k, v] of STORE) {
      v.hits = v.hits.filter((t) => t > cutoff)
      if (v.hits.length === 0) STORE.delete(k)
    }
  }
  return { allowed: true, retryAfterSec: 0 }
}
