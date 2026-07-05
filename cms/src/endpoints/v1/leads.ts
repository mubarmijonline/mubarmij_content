/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Endpoint, PayloadRequest } from "payload"

import { ok, fail } from "./helpers/envelope"
import { v, validateBody, issuesToFields, honeypotTriggered, type ValidationResult } from "./helpers/validate"
import { take } from "./helpers/rateLimit"
import { clientIp } from "./helpers/rateLimit"
import { notifyLead } from "./helpers/notify"
import { maskEmail, maskPhone } from "./helpers/mask"

const SUBJECT = ["general", "automation", "web", "mobile", "maintenance", "other"] as const
const TOPIC = ["automation", "web", "mobile", "maintenance", "other"] as const
const PREF_CHANNEL = ["whatsapp", "call", "email"] as const
const PREF_WINDOW = ["morning", "afternoon", "evening"] as const
const LOCALE = ["en", "ar"] as const

async function readJson(req: PayloadRequest): Promise<unknown> {
  try {
    return (await req.json?.()) ?? {}
  } catch {
    return {}
  }
}

function rateLimitOrFail(req: Request, bucket: string) {
  const r = take(req, { bucket, max: 5, windowMs: 10 * 60_000 })
  if (!r.allowed) {
    return fail("RATE_LIMITED", "Too many requests. Please try again later.", {
      headers: { "Retry-After": String(r.retryAfterSec) },
    })
  }
  return null
}

function logSubmit(req: PayloadRequest, endpoint: string, status: number, body?: { email?: string; phone?: string }, issues?: Record<string, string>) {
  req.payload.logger.info(
    {
      evt: "v1.lead.submit",
      endpoint,
      status,
      ip: clientIp(req as unknown as Request),
      ua: (req as unknown as Request).headers.get("user-agent")?.slice(0, 200),
      email: maskEmail(body?.email),
      phone: maskPhone(body?.phone),
      issues,
    },
    "v1 lead submission",
  )
}

function metaForReq(req: PayloadRequest) {
  const r = req as unknown as Request
  return {
    ip: clientIp(r),
    userAgent: r.headers.get("user-agent")?.slice(0, 500) || undefined,
  }
}

// 3.11 POST /v1/leads/contact
export const contactLeadEndpoint: Endpoint = {
  path: "/v1/leads/contact",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const limit = rateLimitOrFail(r, "leads:contact"); if (limit) return limit

    const raw = await readJson(req)
    if (honeypotTriggered(raw)) {
      logSubmit(req, "/v1/leads/contact", 201, undefined, { honeypot: "triggered" })
      return ok({ id: "lead_honeypot", status: "received" }, { status: 201 })
    }

    type T = {
      name: string; email: string; phone?: string; subject: string; message: string;
      locale?: string; source?: string;
    }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      name: v.string({ min: 2, max: 80 }),
      email: v.email(),
      phone: v.phone({ optional: true }),
      subject: v.enum(SUBJECT),
      message: v.string({ min: 10, max: 2000 }),
      locale: v.enum(LOCALE, { optional: true, default: "en" }),
      source: v.string({ optional: true, max: 40 }),
      company_url: v.string({ optional: true, max: 200 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      const fields = issuesToFields(result.issues)
      logSubmit(req, "/v1/leads/contact", 400, raw as { email?: string; phone?: string }, fields)
      return fail("VALIDATION_ERROR", "Invalid submission.", { fields })
    }
    const v0 = result.value
    const meta = metaForReq(req)

    const created = await req.payload.create({
      collection: "leads",
      data: {
        channel: "contact_form",
        source: v0.source === "mobile_app" ? "mobile_app" : "website",
        name: v0.name,
        email: v0.email,
        phone: v0.phone,
        topic: v0.subject as (typeof TOPIC)[number],
        subject: v0.subject,
        message: v0.message,
        locale: v0.locale || "en",
        status: "new",
        priority: "normal",
        ip: meta.ip,
        userAgent: meta.userAgent,
      } as any,
    })

    await notifyLead(req.payload, {
      channel: "contact_form",
      source: v0.source === "mobile_app" ? "mobile_app" : "website",
      name: v0.name, email: v0.email, phone: v0.phone, topic: v0.subject,
      subject: v0.subject, message: v0.message, locale: v0.locale, ip: meta.ip, userAgent: meta.userAgent,
    }, { autoReply: true })

    logSubmit(req, "/v1/leads/contact", 201, v0)
    return ok({ id: `lead_${created.id}`, status: "received" }, { status: 201 })
  },
}

// 3.12 POST /v1/leads/guide
export const guideLeadEndpoint: Endpoint = {
  path: "/v1/leads/guide",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const limit = rateLimitOrFail(r, "leads:guide"); if (limit) return limit

    const raw = await readJson(req)
    if (honeypotTriggered(raw)) return ok({ id: "lead_honeypot", delivery: "emailed" }, { status: 201 })

    type T = { name: string; email: string; phone?: string; guide_slug: string; locale?: string; source?: string }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      name: v.string({ min: 2, max: 80 }),
      email: v.email(),
      phone: v.phone({ optional: true }),
      guide_slug: v.string({ min: 1, max: 200 }),
      locale: v.enum(LOCALE, { optional: true, default: "en" }),
      source: v.string({ optional: true, max: 40 }),
      company_url: v.string({ optional: true, max: 200 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      const fields = issuesToFields(result.issues)
      logSubmit(req, "/v1/leads/guide", 400, raw as { email?: string; phone?: string }, fields)
      return fail("VALIDATION_ERROR", "Invalid submission.", { fields })
    }
    const v0 = result.value

    // Verify guide exists.
    const guide = await req.payload.find({
      collection: "resources",
      where: { slug: { equals: v0.guide_slug } },
      limit: 1,
      depth: 1,
    })
    if (!guide.docs.length) {
      const fields = { guide_slug: "Unknown guide_slug." }
      logSubmit(req, "/v1/leads/guide", 400, v0, fields)
      return fail("VALIDATION_ERROR", "Unknown guide.", { fields })
    }
    const guideDoc = guide.docs[0] as any
    const file = guideDoc.file as { url?: string; filename?: string } | undefined
    const pdfPath = file?.url || (file?.filename ? `/api/media/file/${file.filename}` : undefined)
    const PUBLIC_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mubarmijonline.com"
    const pdfUrl = pdfPath ? (pdfPath.startsWith("http") ? pdfPath : `${PUBLIC_BASE}${pdfPath}`) : undefined

    const meta = metaForReq(req)
    const created = await req.payload.create({
      collection: "leads",
      data: {
        channel: "guide_download",
        source: v0.source === "mobile_app" ? "mobile_app" : "website",
        name: v0.name, email: v0.email, phone: v0.phone,
        guideSlug: v0.guide_slug,
        locale: v0.locale || "en",
        status: "new", priority: "normal",
        ip: meta.ip, userAgent: meta.userAgent,
        deliveredAt: new Date().toISOString(),
      } as any,
    })

    await notifyLead(req.payload, {
      channel: "guide_download",
      source: v0.source === "mobile_app" ? "mobile_app" : "website",
      name: v0.name, email: v0.email, phone: v0.phone,
      guideSlug: v0.guide_slug, locale: v0.locale, ip: meta.ip, userAgent: meta.userAgent,
    }, { autoReply: true, pdfUrl })

    logSubmit(req, "/v1/leads/guide", 201, v0)
    return ok({ id: `lead_${created.id}`, delivery: "emailed" }, { status: 201 })
  },
}

// 3.13 POST /v1/leads/newsletter
export const newsletterLeadEndpoint: Endpoint = {
  path: "/v1/leads/newsletter",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const limit = rateLimitOrFail(r, "leads:newsletter"); if (limit) return limit

    const raw = await readJson(req)
    if (honeypotTriggered(raw)) return ok({ status: "subscribed" }, { status: 201 })

    type T = { email: string; locale?: string; source?: string }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      email: v.email(),
      locale: v.enum(LOCALE, { optional: true, default: "en" }),
      source: v.string({ optional: true, max: 40 }),
      company_url: v.string({ optional: true, max: 200 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      const fields = issuesToFields(result.issues)
      logSubmit(req, "/v1/leads/newsletter", 400, raw as { email?: string; phone?: string }, fields)
      return fail("VALIDATION_ERROR", "Invalid email.", { fields })
    }
    const v0 = result.value

    const existing = await req.payload.find({
      collection: "leads",
      where: { email: { equals: v0.email }, channel: { equals: "newsletter" } },
      limit: 1,
    })
    if (existing.docs.length) {
      logSubmit(req, "/v1/leads/newsletter", 200, v0)
      return ok({ status: "already_subscribed" }, { status: 200 })
    }

    const meta = metaForReq(req)
    await req.payload.create({
      collection: "leads",
      data: {
        channel: "newsletter",
        source: v0.source === "mobile_app" ? "mobile_app" : "website",
        email: v0.email, locale: v0.locale || "en",
        status: "new", priority: "normal",
        ip: meta.ip, userAgent: meta.userAgent,
      } as any,
    })

    await notifyLead(req.payload, {
      channel: "newsletter",
      source: v0.source === "mobile_app" ? "mobile_app" : "website",
      email: v0.email, locale: v0.locale, ip: meta.ip, userAgent: meta.userAgent,
    })

    logSubmit(req, "/v1/leads/newsletter", 201, v0)
    return ok({ status: "subscribed" }, { status: 201 })
  },
}

// 3.14 POST /v1/leads/consultation
export const consultationLeadEndpoint: Endpoint = {
  path: "/v1/leads/consultation",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const limit = rateLimitOrFail(r, "leads:consultation"); if (limit) return limit

    const raw = await readJson(req)
    if (honeypotTriggered(raw)) return ok({ id: "lead_honeypot", status: "received" }, { status: 201 })

    type T = {
      name: string; email: string; phone?: string;
      preferred_channel: string; preferred_day: string; preferred_time_window: string;
      topic: string; notes?: string; locale?: string; source?: string;
    }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      name: v.string({ min: 2, max: 80 }),
      email: v.email(),
      phone: v.phone({ optional: true }),
      preferred_channel: v.enum(PREF_CHANNEL),
      preferred_day: v.date({ futureDate: true }),
      preferred_time_window: v.enum(PREF_WINDOW),
      topic: v.enum(TOPIC),
      notes: v.string({ optional: true, max: 2000 }),
      locale: v.enum(LOCALE, { optional: true, default: "en" }),
      source: v.string({ optional: true, max: 40 }),
      company_url: v.string({ optional: true, max: 200 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      const fields = issuesToFields(result.issues)
      logSubmit(req, "/v1/leads/consultation", 400, raw as { email?: string; phone?: string }, fields)
      return fail("VALIDATION_ERROR", "Invalid submission.", { fields })
    }
    const v0 = result.value
    const meta = metaForReq(req)

    const created = await req.payload.create({
      collection: "leads",
      data: {
        channel: "consultation_request",
        source: v0.source === "mobile_app" ? "mobile_app" : "website",
        name: v0.name, email: v0.email, phone: v0.phone,
        topic: v0.topic, notes: v0.notes,
        preferredChannel: v0.preferred_channel,
        preferredDay: v0.preferred_day,
        preferredTimeWindow: v0.preferred_time_window,
        locale: v0.locale || "en",
        status: "new", priority: "high",
        ip: meta.ip, userAgent: meta.userAgent,
      } as any,
    })

    await notifyLead(req.payload, {
      channel: "consultation_request",
      source: v0.source === "mobile_app" ? "mobile_app" : "website",
      name: v0.name, email: v0.email, phone: v0.phone, topic: v0.topic,
      preferredChannel: v0.preferred_channel,
      preferredDay: v0.preferred_day,
      preferredTimeWindow: v0.preferred_time_window,
      notes: v0.notes, locale: v0.locale, ip: meta.ip, userAgent: meta.userAgent,
    }, { autoReply: true })

    logSubmit(req, "/v1/leads/consultation", 201, v0)
    return ok({ id: `lead_${created.id}`, status: "received" }, { status: 201 })
  },
}

// 3.15 POST /v1/leads/roi
export const roiLeadEndpoint: Endpoint = {
  path: "/v1/leads/roi",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const limit = rateLimitOrFail(r, "leads:roi"); if (limit) return limit

    const raw = await readJson(req)
    if (honeypotTriggered(raw)) return ok({ id: "lead_honeypot", server_computed_monthly_savings_egp: 0, server_computed_monthly_hours_saved: 0 }, { status: 201 })

    type T = {
      employees: number; daily_hours_per_employee: number; monthly_salary_egp: number;
      computed_monthly_savings_egp?: number; computed_monthly_hours_saved?: number;
      name: string; email: string; phone?: string; locale?: string; source?: string;
    }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      employees: v.int({ min: 1, max: 10000 }),
      daily_hours_per_employee: v.number({ min: 0.1, max: 24 }),
      monthly_salary_egp: v.number({ min: 1000, max: 10_000_000 }),
      computed_monthly_savings_egp: v.number({ optional: true, min: 0 }),
      computed_monthly_hours_saved: v.number({ optional: true, min: 0 }),
      name: v.string({ min: 2, max: 80 }),
      email: v.email(),
      phone: v.phone({ optional: true }),
      locale: v.enum(LOCALE, { optional: true, default: "en" }),
      source: v.string({ optional: true, max: 40 }),
      company_url: v.string({ optional: true, max: 200 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      const fields = issuesToFields(result.issues)
      logSubmit(req, "/v1/leads/roi", 400, raw as { email?: string; phone?: string }, fields)
      return fail("VALIDATION_ERROR", "Invalid submission.", { fields })
    }
    const v0 = result.value

    // Server-computed: working days per month ≈ 22, hourly rate = monthly_salary / (22 * 8).
    const workingDays = 22
    const hoursPerMonthSaved = v0.daily_hours_per_employee * workingDays * v0.employees
    const hourlyRate = v0.monthly_salary_egp / (workingDays * 8)
    const savings = +(hoursPerMonthSaved * hourlyRate).toFixed(2)

    const meta = metaForReq(req)
    const created = await req.payload.create({
      collection: "leads",
      data: {
        channel: "roi_calculator",
        source: v0.source === "mobile_app" ? "mobile_app" : "website",
        name: v0.name, email: v0.email, phone: v0.phone,
        topic: "automation",
        locale: v0.locale || "en",
        status: "new", priority: "normal",
        roi: {
          employees: v0.employees,
          dailyHoursPerEmployee: v0.daily_hours_per_employee,
          monthlySalaryEgp: v0.monthly_salary_egp,
          clientReportedSavingsEgp: v0.computed_monthly_savings_egp,
          clientReportedHoursSaved: v0.computed_monthly_hours_saved,
          serverComputedSavingsEgp: savings,
          serverComputedHoursSaved: hoursPerMonthSaved,
        },
        ip: meta.ip, userAgent: meta.userAgent,
      } as any,
    })

    await notifyLead(req.payload, {
      channel: "roi_calculator",
      source: v0.source === "mobile_app" ? "mobile_app" : "website",
      name: v0.name, email: v0.email, phone: v0.phone, locale: v0.locale,
      roi: {
        employees: v0.employees,
        dailyHoursPerEmployee: v0.daily_hours_per_employee,
        monthlySalaryEgp: v0.monthly_salary_egp,
        serverComputedSavingsEgp: savings,
        serverComputedHoursSaved: hoursPerMonthSaved,
      },
      ip: meta.ip, userAgent: meta.userAgent,
    }, { autoReply: true })

    logSubmit(req, "/v1/leads/roi", 201, v0)
    return ok({
      id: `lead_${created.id}`,
      server_computed_monthly_savings_egp: savings,
      server_computed_monthly_hours_saved: hoursPerMonthSaved,
    }, { status: 201 })
  },
}
