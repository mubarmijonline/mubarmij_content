import type { Endpoint } from "payload"

import { ok, fail, cacheableHeaders } from "./helpers/envelope"
import { pickLocale } from "./helpers/locale"

const configuredPublicBase = process.env.NEXT_PUBLIC_SITE_URL || ""
const PUBLIC_BASE = configuredPublicBase.includes("localhost") || configuredPublicBase.includes("127.0.0.1")
  ? "https://www.mubarmijonline.com"
  : configuredPublicBase || "https://www.mubarmijonline.com"

function absMediaUrl(media: unknown): string | undefined {
  if (!media) return undefined
  if (typeof media === "string") return undefined // depth=0 gives id only
  const m = media as { url?: string; filename?: string }
  const path = m.url || (m.filename ? `/api/media/file/${m.filename}` : undefined)
  if (!path) return undefined
  if (path.startsWith("http")) {
    try {
      const url = new URL(path)
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return `${PUBLIC_BASE}${url.pathname}`
      }
    } catch {
      return path
    }
    return path
  }
  return `${PUBLIC_BASE}${path}`
}

type CmsMedia = { url?: string; filename?: string; width?: number; height?: number; alt?: string }

type CmsReel = {
  id: string
  title?: string
  description?: string
  source?: "hosted" | "embed"
  videoFile?: unknown
  hlsUrl?: string
  embedUrl?: string
  thumbnail?: unknown
  durationSeconds?: number
  category?: string
  client?: unknown
  publishStatus?: string
}

/** Shape a CMS reel doc into the public /v1 contract (matches the app ReelItem). */
function reelItem(r: CmsReel) {
  const isHosted = r.source !== "embed"
  const thumbMedia = (r.thumbnail && typeof r.thumbnail === "object" ? r.thumbnail : undefined) as
    | CmsMedia
    | undefined
  const mp4 = absMediaUrl(r.videoFile)
  const client =
    r.client && typeof r.client === "object"
      ? {
          slug: String((r.client as { slug?: string }).slug || ""),
          name: String((r.client as { name?: string }).name || ""),
        }
      : null

  return {
    id: String(r.id),
    title: r.title || "",
    description: r.description || undefined,
    source: isHosted ? ("hosted" as const) : ("embed" as const),
    playback: isHosted ? { hls: r.hlsUrl || undefined, mp4: mp4 || undefined } : null,
    embedUrl: isHosted ? null : r.embedUrl || null,
    thumbnail: {
      url: absMediaUrl(r.thumbnail) || "",
      width: thumbMedia?.width,
      height: thumbMedia?.height,
      alt: thumbMedia?.alt,
    },
    durationSeconds: r.durationSeconds || undefined,
    category: r.category || "",
    client,
  }
}

export const listReelsEndpoint: Endpoint = {
  path: "/v1/reels",
  method: "get",
  handler: async (req) => {
    const url = new URL((req as unknown as Request).url)
    const locale = pickLocale(req as unknown as Request)
    const category = url.searchParams.get("category")
    const clientSlug = url.searchParams.get("client") || url.searchParams.get("client_slug")
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("limit") || url.searchParams.get("page_size") || "20", 10)),
    )

    const where: Record<string, unknown> = { publishStatus: { equals: "published" } }
    if (category && category !== "all") where.category = { equals: category }
    if (clientSlug) {
      const clientResult = await req.payload.find({
        collection: "client-logos",
        where: { slug: { equals: clientSlug } },
        limit: 1,
        depth: 0,
        locale,
        fallbackLocale: "en",
      })
      const clientId = String((clientResult.docs?.[0] as { id?: string } | undefined)?.id || "")
      where.client = { equals: clientId || "__missing_client__" }
    }

    const result = await req.payload.find({
      collection: "reels",
      where: where as never,
      limit: pageSize,
      page,
      sort: "order",
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const docs = (result.docs as unknown as CmsReel[]).map(reelItem)
    return ok(docs, {
      meta: { page: result.page || page, page_size: pageSize, total: result.totalDocs },
      headers: cacheableHeaders,
    })
  },
}

export const getReelEndpoint: Endpoint = {
  path: "/v1/reels/:id",
  method: "get",
  handler: async (req) => {
    const id = String((req.routeParams as { id?: string })?.id || "")
    if (!id) return fail("NOT_FOUND", "Reel not found")
    const locale = pickLocale(req as unknown as Request)

    try {
      const doc = (await req.payload.findByID({
        collection: "reels",
        id,
        depth: 1,
        locale,
        fallbackLocale: "en",
      })) as unknown as CmsReel
      if (!doc || (doc.publishStatus || "draft") !== "published") {
        return fail("NOT_FOUND", `Reel not found: ${id}`)
      }
      return ok(reelItem(doc), { headers: cacheableHeaders })
    } catch {
      return fail("NOT_FOUND", `Reel not found: ${id}`)
    }
  },
}
