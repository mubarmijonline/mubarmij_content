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

export const listResourcesEndpoint: Endpoint = {
  path: "/v1/resources",
  method: "get",
  handler: async (req) => {
    const locale = pickLocale(req as unknown as Request)
    const result = await req.payload.find({
      collection: "resources",
      limit: 50,
      sort: "-publishedAt",
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const data = (result.docs as any).map( (r: any)  => ({
      slug: String(r.slug || ""),
      type: r.type === "pdf" ? "pdf_guide" : (r.type as string) || "pdf_guide",
      title: String(r.title || ""),
      description: String(r.description || ""),
      cover_image_url: abs(r.coverImage),
      pdf_url: abs(r.file),
      language: locale,
      requires_email: Boolean(r.gated ?? true),
      published_at: r.publishedAt || null,
    }))

    return ok(data, { headers: cacheableHeaders })
  },
}
