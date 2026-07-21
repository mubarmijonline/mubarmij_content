/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Endpoint, PayloadRequest } from "payload"

import { ok, fail } from "./helpers/envelope"

// ---------------------------------------------------------------------------
// Project Import API
//
// Flow:
//   1. POST /v1/project-imports                         (PROJECT_IMPORT_API_KEY)
//        -> creates a job, returns { jobId }
//   2. POST /v1/agent/project-imports/:jobId/result     (PROJECT_IMPORT_AGENT_KEY)
//        -> multipart: metadata JSON + screenshot files
//        -> uploads media, creates/updates a published `client-logos` project,
//           completes the job.
//   3. GET  /v1/project-imports/:jobId                  (PROJECT_IMPORT_API_KEY)
//        -> job status / projectSlug / publicUrl / reelRecommended
// ---------------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

function bearer(req: PayloadRequest): string {
  const h = (req as unknown as Request).headers.get("authorization") || ""
  const m = /^Bearer\s+(.+)$/i.exec(h.trim())
  return m ? m[1].trim() : ""
}

/** Returns null when authorized, or a Response to short-circuit. */
function authGuard(req: PayloadRequest, envName: "PROJECT_IMPORT_API_KEY" | "PROJECT_IMPORT_AGENT_KEY"): Response | null {
  const expected = process.env[envName]
  if (!expected) {
    return fail("SERVER_ERROR", `${envName} is not configured on the server.`)
  }
  if (bearer(req) !== expected) {
    return fail("VALIDATION_ERROR", "Unauthorized: invalid or missing bearer token.", { status: 401 })
  }
  return null
}

async function readJson(req: PayloadRequest): Promise<Record<string, any>> {
  try {
    return ((await (req as any).json?.()) ?? {}) as Record<string, any>
  } catch {
    return {}
  }
}

const SERVICE_VALUES = new Set(["automation", "web", "mobile", "maintenance", "consulting"])

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[ً-ْ]/g, "")
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/(^-|-$)/g, "")

/** Build a minimal Lexical richText document from a plain-text string. */
function lexicalFromText(text?: string, rtl = false): any {
  const value = (text || "").trim()
  if (!value) return undefined
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: rtl ? "rtl" : "ltr",
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: rtl ? "rtl" : "ltr",
          textFormat: 0,
          children: [
            {
              type: "text",
              text: value,
              format: 0,
              style: "",
              mode: "normal",
              detail: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

/** Accept either { en, ar } or a bare string. */
function loc(v: any): { en?: string; ar?: string } {
  if (v == null) return {}
  if (typeof v === "string") return { en: v }
  return { en: v.en, ar: v.ar }
}

// ---------------------------------------------------------------------------
// 1. Create job
// ---------------------------------------------------------------------------
export const createProjectImportEndpoint: Endpoint = {
  path: "/v1/project-imports",
  method: "post",
  handler: async (req) => {
    const guard = authGuard(req, "PROJECT_IMPORT_API_KEY")
    if (guard) return guard

    const body = await readJson(req)
    const url = typeof body.url === "string" ? body.url.trim() : ""
    if (!url || !/^https?:\/\//i.test(url)) {
      return fail("VALIDATION_ERROR", "A valid `url` (http/https) is required.", { fields: { url: "required" } })
    }

    const idempotencyKey =
      (req as unknown as Request).headers.get("idempotency-key")?.trim() ||
      (typeof body.idempotencyKey === "string" ? body.idempotencyKey.trim() : "")

    // Idempotency: same key -> return the existing job untouched.
    if (idempotencyKey) {
      const existing = await req.payload.find({
        collection: "project-imports",
        where: { idempotencyKey: { equals: idempotencyKey } },
        limit: 1,
        overrideAccess: true,
      })
      const prior = existing.docs?.[0] as any
      if (prior) {
        return ok(
          {
            jobId: String(prior.id),
            status: prior.status,
            idempotent: true,
            projectSlug: prior.projectSlug || null,
          },
          { status: 200 },
        )
      }
    }

    const job = await req.payload.create({
      collection: "project-imports",
      data: {
        name: typeof body.name === "string" ? body.name : undefined,
        url,
        idempotencyKey: idempotencyKey || undefined,
        status: "pending",
        notes: typeof body.notes === "string" ? body.notes : undefined,
        galleryCount: typeof body.galleryCount === "number" ? body.galleryCount : undefined,
        params: body,
      },
      overrideAccess: true,
    })

    return ok(
      { jobId: String((job as any).id), status: "pending", idempotent: false },
      { status: 201 },
    )
  },
}

// ---------------------------------------------------------------------------
// 2. Get job
// ---------------------------------------------------------------------------
export const getProjectImportEndpoint: Endpoint = {
  path: "/v1/project-imports/:jobId",
  method: "get",
  handler: async (req) => {
    const guard = authGuard(req, "PROJECT_IMPORT_API_KEY")
    if (guard) return guard

    const jobId = String((req.routeParams as { jobId?: string })?.jobId || "")
    if (!jobId) return fail("NOT_FOUND", "Job not found")

    let job: any
    try {
      job = await req.payload.findByID({ collection: "project-imports", id: jobId, overrideAccess: true })
    } catch {
      return fail("NOT_FOUND", `Job not found: ${jobId}`)
    }
    if (!job) return fail("NOT_FOUND", `Job not found: ${jobId}`)

    return ok({
      jobId: String(job.id),
      status: job.status,
      projectSlug: job.projectSlug || null,
      projectId: job.projectId || null,
      publicUrl: job.publicUrl || null,
      galleryCount: job.galleryCount ?? null,
      reelRecommended: Boolean(job.reelRecommended),
      enhancement: job.enhancement || null,
      error: job.error || null,
      completedAt: job.completedAt || null,
    })
  },
}

// ---------------------------------------------------------------------------
// 3. Submit result (agent)
// ---------------------------------------------------------------------------
const GALLERY_KEYS = ["gallery_1", "gallery_2", "gallery_3", "gallery_4", "gallery_5", "gallery_6"] as const
const VIEWPORT_KEYS = ["desktop", "tablet", "mobile"] as const

export const submitProjectImportResultEndpoint: Endpoint = {
  path: "/v1/agent/project-imports/:jobId/result",
  method: "post",
  handler: async (req) => {
    const guard = authGuard(req, "PROJECT_IMPORT_AGENT_KEY")
    if (guard) return guard

    const jobId = String((req.routeParams as { jobId?: string })?.jobId || "")
    if (!jobId) return fail("NOT_FOUND", "Job not found")

    let job: any
    try {
      job = await req.payload.findByID({ collection: "project-imports", id: jobId, overrideAccess: true })
    } catch {
      return fail("NOT_FOUND", `Job not found: ${jobId}`)
    }
    if (!job) return fail("NOT_FOUND", `Job not found: ${jobId}`)

    // Parse multipart form.
    let form: FormData
    try {
      form = await (req as any).formData()
    } catch (e) {
      return fail("VALIDATION_ERROR", "Expected multipart/form-data body.", {
        fields: { body: String((e as Error)?.message || e) },
      })
    }

    // metadata may arrive as a JSON string field or as a file part.
    let metaRaw: string | undefined
    const metaPart = form.get("metadata")
    if (metaPart && typeof (metaPart as any).text === "function") {
      metaRaw = await (metaPart as Blob).text()
    } else if (typeof metaPart === "string") {
      metaRaw = metaPart
    }
    let metadata: Record<string, any>
    try {
      metadata = metaRaw ? JSON.parse(metaRaw) : {}
    } catch {
      return fail("VALIDATION_ERROR", "`metadata` is not valid JSON.")
    }
    if (!metadata || typeof metadata !== "object") {
      return fail("VALIDATION_ERROR", "`metadata` object is required.")
    }

    const jobParams = (job.params || {}) as Record<string, any>
    const name: string = String(metadata.name || jobParams.name || job.name || "").trim()
    if (!name) return fail("VALIDATION_ERROR", "`metadata.name` is required.")
    const slug: string = slugify(String(metadata.slug || name))

    const enhancement = String(metadata.enhancement || jobParams.enhancement || "sharp")

    try {
      await req.payload.update({
        collection: "project-imports",
        id: jobId,
        data: { status: "processing" },
        overrideAccess: true,
      })

      // ---- Upload media parts ----------------------------------------------
      const uploadPart = async (key: string, altBase: string): Promise<string | undefined> => {
        const part = form.get(key)
        if (!part || typeof (part as any).arrayBuffer !== "function") return undefined
        const file = part as File
        const buf = Buffer.from(await file.arrayBuffer())
        if (!buf.length) return undefined
        const created = await req.payload.create({
          collection: "media",
          data: { alt: `${altBase}` },
          file: {
            data: buf,
            mimetype: file.type || "image/webp",
            name: (file as any).name || `${slug}-${key}.webp`,
            size: buf.length,
          },
          overrideAccess: true,
        })
        return String((created as any).id)
      }

      const viewportIds: Record<string, string | undefined> = {}
      for (const k of VIEWPORT_KEYS) {
        viewportIds[k] = await uploadPart(k, `${name} — ${k}`)
      }
      const galleryIds: string[] = []
      for (let i = 0; i < GALLERY_KEYS.length; i++) {
        const id = await uploadPart(GALLERY_KEYS[i], `${name} — gallery ${i + 1}`)
        if (id) galleryIds.push(id)
      }

      const logoId = await uploadPart("logo", `${name} logo`)
      const coverImageId = viewportIds.desktop || galleryIds[0]
      // `logo` is required on client-logos; fall back to the hero/cover when no
      // dedicated logo mark is supplied so the import never hard-fails.
      const resolvedLogoId = logoId || coverImageId

      // Optional reel video — buffered here but uploaded AFTER the client doc
      // exists (below), so the Media afterChange hook can link the auto-created
      // Reels entry to this project. No video is generated server-side.
      let reelMediaId: string | undefined
      let reelBuf: Buffer | undefined
      let reelExt = "mp4"
      let reelMime = "video/mp4"
      const reelPart = form.get("reel")
      if (reelPart && typeof (reelPart as any).arrayBuffer === "function") {
        const f = reelPart as File
        const b = Buffer.from(await f.arrayBuffer())
        if (b.length) {
          reelBuf = b
          reelMime = f.type || "video/mp4"
          reelExt = (f.type || "").includes("webm") ? "webm" : "mp4"
        }
      }
      // Optional portrait (9:16) poster for the reel card/thumbnail.
      let reelPosterBuf: Buffer | undefined
      let reelPosterMime = "image/webp"
      const reelPosterPart = form.get("reelPoster")
      if (reelPosterPart && typeof (reelPosterPart as any).arrayBuffer === "function") {
        const f = reelPosterPart as File
        const b = Buffer.from(await f.arrayBuffer())
        if (b.length) { reelPosterBuf = b; reelPosterMime = f.type || "image/webp" }
      }

      // ---- Map metadata -> client-logos fields ------------------------------
      const tagline = loc(metadata.tagline)
      const shortDescription = loc(metadata.shortDescription)
      const description = loc(metadata.description)
      const reelReason = loc(metadata.reelReason)
      const reelBrief = loc(metadata.reelBrief)

      const services = Array.isArray(metadata.services)
        ? metadata.services.filter((s: any) => SERVICE_VALUES.has(s))
        : []

      const important = Boolean(metadata.important ?? metadata.featured ?? jobParams.important)
      const publishStatus =
        metadata.publishStatus === "published" || jobParams.publish === true ? "published" : "draft"

      const techStack = Array.isArray(metadata.techStack)
        ? metadata.techStack
            .map((t: any) => (typeof t === "string" ? t : t?.label))
            .filter(Boolean)
            .map((label: string) => ({ label }))
        : []

      const metrics = Array.isArray(metadata.metrics)
        ? metadata.metrics
            .filter((m: any) => m && (m.label || m.value))
            .map((m: any) => ({ label: String(m.label || ""), value: String(m.value || "") }))
        : []

      const reelRecommended = Boolean(metadata.reelRecommended)
      const reelPriority = ["low", "medium", "high"].includes(metadata.reelPriority)
        ? metadata.reelPriority
        : "medium"

      // Base (English) document.
      const baseData: Record<string, any> = {
        name,
        slug,
        logo: resolvedLogoId,
        tagline: tagline.en,
        industry: metadata.industry || jobParams.industry || undefined,
        websiteUrl: metadata.websiteUrl || jobParams.url || undefined,
        sourceUrl: metadata.sourceUrl || jobParams.url || job.url || undefined,
        shortDescription: shortDescription.en,
        description: lexicalFromText(description.en, false),
        services,
        coverImage: coverImageId,
        screenshots: galleryIds.length ? galleryIds : undefined,
        metrics,
        techStack,
        featured: important,
        displayOnHomepage: Boolean(metadata.displayOnHomepage ?? true),
        importedBy: metadata.importedBy || "claude_code",
        reelRecommended,
        reelPriority,
        reelReason: reelReason.en,
        reelBrief: reelBrief.en,
        publishStatus,
        order: typeof metadata.order === "number" ? metadata.order : 0,
      }

      // Upsert by slug.
      const existing = await req.payload.find({
        collection: "client-logos",
        where: { slug: { equals: slug } },
        limit: 1,
        overrideAccess: true,
      })
      const priorDoc = existing.docs?.[0] as any

      let projectId: string
      if (priorDoc) {
        const updated = await req.payload.update({
          collection: "client-logos",
          id: priorDoc.id,
          data: baseData,
          locale: "en",
          overrideAccess: true,
        })
        projectId = String((updated as any).id)
      } else {
        const created = await req.payload.create({
          collection: "client-logos",
          data: baseData,
          locale: "en",
          overrideAccess: true,
        })
        projectId = String((created as any).id)
      }

      // Arabic localized overlay.
      const arData: Record<string, any> = {}
      if (tagline.ar) arData.tagline = tagline.ar
      if (shortDescription.ar) arData.shortDescription = shortDescription.ar
      if (description.ar) arData.description = lexicalFromText(description.ar, true)
      if (reelReason.ar) arData.reelReason = reelReason.ar
      if (reelBrief.ar) arData.reelBrief = reelBrief.ar
      // NB: deliberately do NOT re-send `metrics` here. Re-sending the array in a
      // second (ar) write recreates the rows and wipes the English labels. Metric
      // labels are set once in the base (en) write; other locales fall back via
      // fallbackLocale: "en" on read.
      if (Object.keys(arData).length) {
        await req.payload.update({
          collection: "client-logos",
          id: projectId,
          data: arData,
          locale: "ar",
          overrideAccess: true,
        })
      }

      // Now that the client exists, (re)attach the reel. Clean prior import reels
      // for this project first so re-runs stay idempotent, then upload — the Media
      // hook auto-creates a Reels entry linked to the now-existing client.
      if (reelBuf) {
        const priorMedia = await req.payload.find({
          collection: "media",
          where: { filename: { like: `${slug}-reel` } },
          limit: 50,
          overrideAccess: true,
        })
        for (const m of priorMedia.docs as any[]) {
          const rs = await req.payload.find({
            collection: "reels",
            where: { videoFile: { equals: m.id } },
            limit: 50,
            overrideAccess: true,
          })
          for (const r of rs.docs as any[]) {
            await req.payload.delete({ collection: "reels", id: r.id, overrideAccess: true }).catch(() => undefined)
          }
          await req.payload.delete({ collection: "media", id: m.id, overrideAccess: true }).catch(() => undefined)
        }
        const createdReel = await req.payload.create({
          collection: "media",
          data: { alt: `${name} reel` },
          file: { data: reelBuf, mimetype: reelMime, name: `${slug}-reel.${reelExt}`, size: reelBuf.length },
          overrideAccess: true,
        })
        reelMediaId = String((createdReel as any).id)

        // Upload the portrait poster (if any) and refine the auto-created Reels
        // entry: proper title, portrait thumbnail, and order (low = first).
        let posterMediaId: string | undefined
        if (reelPosterBuf) {
          const pm = await req.payload.create({
            collection: "media",
            data: { alt: `${name} reel poster` },
            file: { data: reelPosterBuf, mimetype: reelPosterMime, name: `${slug}-reel-poster.webp`, size: reelPosterBuf.length },
            overrideAccess: true,
          })
          posterMediaId = String((pm as any).id)
        }
        const reelDocs = await req.payload.find({
          collection: "reels",
          where: { videoFile: { equals: reelMediaId } },
          limit: 1,
          overrideAccess: true,
        })
        const reelDoc = reelDocs.docs?.[0] as any
        if (reelDoc) {
          const reelOrder =
            typeof metadata.reelOrder === "number" ? metadata.reelOrder
            : typeof metadata.order === "number" ? metadata.order : 0
          await req.payload.update({
            collection: "reels",
            id: reelDoc.id,
            data: { title: `${name} Reel`, order: reelOrder, ...(posterMediaId ? { thumbnail: posterMediaId } : {}) },
            overrideAccess: true,
          })
        }
      }

      const publicUrl = `${SITE_URL.replace(/\/$/, "")}/case-studies/${slug}`

      await req.payload.update({
        collection: "project-imports",
        id: jobId,
        data: {
          status: "completed",
          projectSlug: slug,
          projectId,
          publicUrl,
          galleryCount: galleryIds.length,
          reelRecommended,
          enhancement,
          completedAt: new Date().toISOString(),
          error: "",
        },
        overrideAccess: true,
      })

      return ok({
        jobId,
        status: "completed",
        projectSlug: slug,
        projectId,
        publicUrl,
        galleryCount: galleryIds.length,
        viewports: Object.fromEntries(Object.entries(viewportIds).filter(([, v]) => v)),
        reelMediaId: reelMediaId || null,
        reelRecommended,
        reelPriority,
        enhancement,
        publishStatus,
      })
    } catch (e) {
      const message = String((e as Error)?.message || e)
      await req.payload.update({
        collection: "project-imports",
        id: jobId,
        data: { status: "failed", error: message },
        overrideAccess: true,
      }).catch(() => undefined)
      return fail("SERVER_ERROR", `Import failed: ${message}`)
    }
  },
}
