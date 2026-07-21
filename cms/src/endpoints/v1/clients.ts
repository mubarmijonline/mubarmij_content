import type { Endpoint } from "payload"

import { ok, fail, cacheableHeaders } from "./helpers/envelope"
import { pickLocale, pickLocalized, type V1Locale } from "./helpers/locale"

const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mubarmijonline.com"

// Human-readable labels for the industry select values (matches ClientLogos options).
const INDUSTRY_LABELS: Record<string, string> = {
  automotive: "Automotive",
  ecommerce: "E-Commerce",
  hospitality: "Hospitality",
  fnb: "Food & Beverage",
  healthcare: "Healthcare",
  "real-estate": "Real Estate",
  education: "Education",
  logistics: "Logistics",
  retail: "Retail",
  services: "Services",
}

function industryLabel(industry?: string, custom?: string): string {
  if (!industry) return ""
  if (industry === "other") return custom || "Other"
  return INDUSTRY_LABELS[industry] || industry
}

function absMediaUrl(media: unknown): string | undefined {
  if (!media) return undefined
  // depth=1 gives full media object; depth=0 gives id string.
  if (typeof media === "string") return undefined
  const m = media as { url?: string; filename?: string }
  const path = m.url || (m.filename ? `/api/media/file/${m.filename}` : undefined)
  if (!path) return undefined
  if (path.startsWith("http")) return path
  return `${PUBLIC_BASE}${path}`
}

type CmsClient = {
  id: string
  slug?: string
  name?: string
  tagline?: string
  industry?: string
  industryCustom?: string
  country?: string
  logo?: unknown
  coverImage?: unknown
  screenshots?: unknown[]
  services?: string[]
  description?: unknown
  shortDescription?: string
  metrics?: { label?: string; value?: string }[]
  videos?: { source?: string; url?: string; file?: unknown; title?: string; thumbnail?: unknown }[]
  websiteUrl?: string
  featured?: boolean
  publishStatus?: string
  testimonialQuote?: string
  testimonialAuthor?: string
  timeline?: string
  techStack?: { label?: string }[]
  reelRecommended?: boolean
  reelPriority?: string
  reelReason?: string
  reelBrief?: string
}

function clientSummary(c: CmsClient, locale: V1Locale, order: number) {
  const logo = absMediaUrl(c.logo)
  const cover = absMediaUrl(c.coverImage)
  return {
    slug: c.slug || "",
    name: c.name || "",
    tagline: c.tagline || c.shortDescription || "",
    category: c.industry || "",
    category_label: industryLabel(c.industry, c.industryCustom),
    logo_url: logo,
    thumb_url: cover || logo,
    featured: Boolean(c.featured),
    order,
    locale,
  }
}

export const listClientsEndpoint: Endpoint = {
  path: "/v1/clients",
  method: "get",
  handler: async (req) => {
    const url = new URL((req as unknown as Request).url)
    const locale = pickLocale(req as unknown as Request)
    const featured = url.searchParams.get("featured")
    const category = url.searchParams.get("category")
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("page_size") || "20", 10)))

    const where: Record<string, unknown> = {}
    if (featured === "true" || featured === "1") where.featured = { equals: true }
    if (category && category !== "all") {
      // Map the requested service category to the multi-select services field.
      // Accept aliases: "automation" | "web" | "mobile" | "ecommerce".
      const map: Record<string, string> = { web: "web", mobile: "mobile", automation: "automation", maintenance: "maintenance" }
      const mapped = map[category]
      if (mapped) where.services = { contains: mapped }
      else where.industry = { equals: category } // e.g. "ecommerce"
    }

    const result = await req.payload.find({
      collection: "client-logos",
      where: where as never,
      limit: pageSize,
      page,
      // Order-first (ascending, matches reels/testimonials/homepage logo bar),
      // name as tie-breaker. Set a lower `order` to pin a project to the top.
      sort: ["order", "name"],
      depth: 1,
      locale,
      fallbackLocale: "en",
    })

    const docs = (result.docs as unknown as CmsClient[])
      .filter((d) => (d.publishStatus || "draft") !== "draft")
      .map((d, i) => clientSummary(d, locale, (page - 1) * pageSize + i + 1))

    return ok(docs, {
      meta: { page: result.page || page, page_size: pageSize, total: result.totalDocs },
      headers: cacheableHeaders,
    })
  },
}

export const getClientEndpoint: Endpoint = {
  path: "/v1/clients/:slug",
  method: "get",
  handler: async (req) => {
    const slug = String((req.routeParams as { slug?: string })?.slug || "")
    if (!slug) return fail("NOT_FOUND", "Client not found")
    const locale = pickLocale(req as unknown as Request)

    const result = await req.payload.find({
      collection: "client-logos",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      locale,
      fallbackLocale: "en",
    })
    const doc = result.docs?.[0] as unknown as CmsClient | undefined
    if (!doc || (doc.publishStatus || "draft") === "draft") {
      return fail("NOT_FOUND", `Client not found: ${slug}`)
    }

    // Lexical → HTML for rich text fields.
    const { lexicalToHtml } = await import("./helpers/sanitize")
    const briefHtml = lexicalToHtml(doc.description)

    const gallery: string[] = []
    if (Array.isArray(doc.screenshots)) {
      for (const s of doc.screenshots as unknown[]) {
        // Two possible shapes: direct media or { image: media }
        const media = (s && typeof s === "object" && "image" in (s as Record<string, unknown>))
          ? (s as { image: unknown }).image
          : s
        const u = absMediaUrl(media)
        if (u) gallery.push(u)
      }
    }

    const detail = {
      slug: doc.slug || "",
      name: doc.name || "",
      tagline: doc.tagline || doc.shortDescription || "",
      category: doc.industry || "",
      category_label: industryLabel(doc.industry, doc.industryCustom),
      hero_image_url: absMediaUrl(doc.coverImage) || absMediaUrl(doc.logo),
      logo_url: absMediaUrl(doc.logo),
      gallery,
      brief: doc.shortDescription || "",
      brief_html: briefHtml,
      results: (doc.metrics || []).map((m) => ({ metric: m.value || "", label: m.label || "" })),
      tech_stack: (doc.techStack || [])
        .map((t) => (t?.label || "").trim())
        .filter(Boolean),
      links: {
        live_url: doc.websiteUrl || undefined,
        play_store: undefined as string | undefined,
        app_store: undefined as string | undefined,
      },
      services: doc.services || [],
      featured: Boolean(doc.featured),
      timeline: doc.timeline || undefined,
      testimonial: doc.testimonialQuote
        ? { quote: doc.testimonialQuote, author: doc.testimonialAuthor || "" }
        : undefined,
      reel: {
        recommended: Boolean(doc.reelRecommended),
        priority: doc.reelPriority || undefined,
        reason: doc.reelReason || undefined,
        brief: doc.reelBrief || undefined,
      },
    }

    // pickLocalized used implicitly above (already filtered by locale param).
    void pickLocalized
    return ok(detail, { headers: cacheableHeaders })
  },
}
