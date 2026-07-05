import type { Endpoint } from "payload"

import { ok, fail, cacheableHeaders } from "./helpers/envelope"
import { pickLocale } from "./helpers/locale"
import { lexicalToHtml } from "./helpers/sanitize"

const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mubarmijonline.com"

function abs(media: unknown): string | undefined {
  if (!media || typeof media === "string") return undefined
  const m = media as { url?: string; filename?: string }
  const path = m.url || (m.filename ? `/api/media/file/${m.filename}` : undefined)
  if (!path) return undefined
  return path.startsWith("http") ? path : `${PUBLIC_BASE}${path}`
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

type CmsPost = {
  id: string
  slug?: string
  title?: string
  excerpt?: string
  body?: unknown
  coverImage?: unknown
  category?: string
  tags?: { tag?: string }[] | string[]
  authorName?: string
  publishedAt?: string
  status?: string
}

function tagList(t: CmsPost["tags"]): string[] {
  if (!Array.isArray(t)) return []
  return (t as unknown[]).map((x) =>
    typeof x === "string" ? x : (x as { tag?: string })?.tag || "",
  ).filter(Boolean)
}

export const listBlogEndpoint: Endpoint = {
  path: "/v1/blog",
  method: "get",
  handler: async (req) => {
    const url = new URL((req as unknown as Request).url)
    const locale = pickLocale(req as unknown as Request)
    const category = url.searchParams.get("category")
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(url.searchParams.get("page_size") || "10", 10)))

    const where: Record<string, unknown> = { status: { equals: "published" } }
    if (category) where.category = { equals: category }

    const result = await req.payload.find({
      collection: "blog-posts",
      where: where as never,
      limit: pageSize,
      page,
      sort: "-publishedAt",
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const data = (result.docs as unknown as CmsPost[]).map((p) => {
      const html = lexicalToHtml(p.body)
      return {
        slug: p.slug || "",
        title: p.title || "",
        excerpt: p.excerpt || "",
        cover_image_url: abs(p.coverImage),
        category: p.category || "",
        reading_time_minutes: readingTime(html),
        published_at: p.publishedAt || null,
      }
    })

    return ok(data, {
      meta: { page: result.page || page, page_size: pageSize, total: result.totalDocs },
      headers: cacheableHeaders,
    })
  },
}

export const getBlogPostEndpoint: Endpoint = {
  path: "/v1/blog/:slug",
  method: "get",
  handler: async (req) => {
    const slug = String((req.routeParams as { slug?: string })?.slug || "")
    if (!slug) return fail("NOT_FOUND", "Post not found")
    const locale = pickLocale(req as unknown as Request)

    const result = await req.payload.find({
      collection: "blog-posts",
      where: { slug: { equals: slug }, status: { equals: "published" } },
      limit: 1,
      depth: 2,
      locale,
      fallbackLocale: "en",
    })
    const post = result.docs?.[0] as unknown as CmsPost | undefined
    if (!post) return fail("NOT_FOUND", `Post not found: ${slug}`)

    const html = lexicalToHtml(post.body)

    // Related: same category, exclude current.
    const related = await req.payload.find({
      collection: "blog-posts",
      where: {
        status: { equals: "published" },
        slug: { not_equals: slug },
        ...(post.category ? { category: { equals: post.category } } : {}),
      },
      limit: 3,
      sort: "-publishedAt",
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const data = {
      slug: post.slug || "",
      title: post.title || "",
      cover_image_url: abs(post.coverImage),
      body_html: html,
      author: { name: post.authorName || "MubarmiJ Team", avatar_url: undefined as string | undefined },
      category: post.category || "",
      tags: tagList(post.tags),
      reading_time_minutes: readingTime(html),
      published_at: post.publishedAt || null,
      related: (related.docs as unknown as CmsPost[]).map((r) => ({
        slug: r.slug || "",
        title: r.title || "",
        cover_image_url: abs(r.coverImage),
      })),
    }

    return ok(data, { headers: cacheableHeaders })
  },
}
