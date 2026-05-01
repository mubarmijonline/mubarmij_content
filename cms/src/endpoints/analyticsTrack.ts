import type { Endpoint } from 'payload'

const BOT_RE = /(bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|http-client|wget|curl|axios)/i

export const trackPageviewEndpoint: Endpoint = {
  path: '/analytics/track',
  method: 'post',
  handler: async (req) => {
    try {
      // Read JSON body. Payload v3 wraps Next's Request in `req`.
      const body = (await req.json?.()) ?? {}
      const path = String(body.path || '/').slice(0, 500)
      const locale = body.locale ? String(body.locale).slice(0, 8) : undefined
      const referrer = body.referrer ? String(body.referrer).slice(0, 500) : undefined
      const visitorId = String(body.visitorId || '').slice(0, 80)
      const sessionId = String(body.sessionId || '').slice(0, 80)

      if (!visitorId || !sessionId) {
        return Response.json({ ok: false, error: 'missing ids' }, { status: 400 })
      }

      const ua = req.headers.get('user-agent') || ''
      const isBot = BOT_RE.test(ua)
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        ''
      const country =
        req.headers.get('cf-ipcountry') ||
        req.headers.get('x-vercel-ip-country') ||
        ''

      await req.payload.create({
        collection: 'analytics-events',
        data: {
          path,
          locale,
          referrer,
          visitorId,
          sessionId,
          userAgent: ua.slice(0, 500),
          ip,
          country,
          isBot,
        },
      })

      return Response.json({ ok: true })
    } catch (err) {
      req.payload.logger.error({ err }, 'analytics ingest failed')
      return Response.json({ ok: false }, { status: 500 })
    }
  },
}
