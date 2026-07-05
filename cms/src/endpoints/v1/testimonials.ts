/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Endpoint } from "payload"

import { ok, cacheableHeaders } from "./helpers/envelope"
import { pickLocale } from "./helpers/locale"

const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mubarmijonline.com"

function abs(media: unknown): string | undefined {
  if (!media || typeof media === "string") return undefined
  const m = media as { url?: string; filename?: string }
  const path = m.url || (m.filename ? `/api/media/file/${m.filename}` : undefined)
  if (!path) return undefined
  return path.startsWith("http") ? path : `${PUBLIC_BASE}${path}`
}

export const listTestimonialsEndpoint: Endpoint = {
  path: "/v1/testimonials",
  method: "get",
  handler: async (req) => {
    const locale = pickLocale(req as unknown as Request)
    const result = await req.payload.find({
      collection: "testimonials",
      limit: 50,
      sort: "order",
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const data = (result.docs as any).map( (t: any, i: number) =>  ({
      id: (t.id as string | number) ?? i + 1,
      quote: String(t.quote || ""),
      author: String(t.authorName || ""),
      role: String(t.authorTitle || ""),
      company: String(t.authorCompany || ""),
      avatar_url: abs(t.authorPhoto),
      rating: typeof t.rating === "number" ? t.rating : 5,
    }))

    return ok(data, { headers: cacheableHeaders })
  },
}
