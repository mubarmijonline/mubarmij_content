import type { Endpoint } from "payload"

import { ok, fail } from "./helpers/envelope"

const BOT_RE = /(bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|http-client|wget|curl|axios)/i

/**
 * Lightweight event ingest for the public site (reel_play / reel_complete /
 * reel_cta_click, etc.). Stored in the analytics-events collection with an
 * `event:` path prefix so it stays distinct from pageviews. Fire-and-forget:
 * never blocks the client, swallows errors with a 202.
 */
export const analyticsEventEndpoint: Endpoint = {
  path: "/v1/analytics",
  method: "post",
  handler: async (req) => {
    try {
      const body = (await req.json?.()) ?? {}
      const event = String(body.event || "").slice(0, 60)
      if (!event) return fail("VALIDATION_ERROR", "event is required", { fields: { event: "Required" } })

      const reelId = body.reelId ? String(body.reelId).slice(0, 80) : undefined
      const locale = body.locale ? String(body.locale).slice(0, 8) : undefined
      const ua = req.headers.get("user-agent") || ""
      const isBot = BOT_RE.test(ua)
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        ""
      const country =
        req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || ""

      await req.payload.create({
        collection: "analytics-events",
        data: {
          path: `event:${event}${reelId ? `:${reelId}` : ""}`,
          locale,
          referrer: reelId ? `reel:${reelId}` : undefined,
          visitorId: String(body.visitorId || "anon").slice(0, 80),
          sessionId: String(body.sessionId || "anon").slice(0, 80),
          userAgent: ua.slice(0, 500),
          ip,
          country,
          isBot,
        },
      })

      return ok({ status: "recorded" }, { status: 201 })
    } catch (err) {
      req.payload.logger.error({ err }, "v1 analytics ingest failed")
      return ok({ status: "ignored" }, { status: 202 })
    }
  },
}
