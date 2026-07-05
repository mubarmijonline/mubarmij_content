/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Endpoint, PayloadRequest } from "payload"

import { ok, fail } from "./helpers/envelope"
import { v, validateBody, issuesToFields, type ValidationResult } from "./helpers/validate"
import { take, clientIp } from "./helpers/rateLimit"

const TOPICS = ["blog_new_post", "offers", "important_news"] as const

async function readJson(req: PayloadRequest): Promise<unknown> {
  try {
    return (await req.json?.()) ?? {}
  } catch {
    return {}
  }
}

export const pushRegisterEndpoint: Endpoint = {
  path: "/v1/push/register",
  method: "post",
  handler: async (req) => {
    const r = req as unknown as Request
    const lim = take(r, { bucket: "push:register", max: 20, windowMs: 60 * 60_000 })
    if (!lim.allowed) {
      return fail("RATE_LIMITED", "Too many requests.", { headers: { "Retry-After": String(lim.retryAfterSec) } })
    }

    const raw = await readJson(req)
    type T = {
      fcm_token: string; platform: "ios" | "android"; locale?: "en" | "ar";
      app_version?: string; device_model?: string; os_version?: string;
      topics?: string[];
    }
    const result: ValidationResult<T> = validateBody<T>(raw, {
      fcm_token: v.string({ min: 20, max: 4096 }),
      platform: v.enum(["ios", "android"]),
      locale: v.enum(["en", "ar"], { optional: true, default: "en" }),
      app_version: v.string({ optional: true, max: 40 }),
      device_model: v.string({ optional: true, max: 80 }),
      os_version: v.string({ optional: true, max: 40 }),
      topics: v.array(v.enum(TOPICS), { optional: true, max: 10 }),
    } as Record<string, ReturnType<typeof v.string>>)
    if (!result.ok) {
      return fail("VALIDATION_ERROR", "Invalid registration.", { fields: issuesToFields(result.issues) })
    }
    const v0 = result.value

    const data = {
      fcmToken: v0.fcm_token,
      platform: v0.platform,
      locale: v0.locale || "en",
      appVersion: v0.app_version,
      deviceModel: v0.device_model,
      osVersion: v0.os_version,
      topics: v0.topics || [],
      lastSeenAt: new Date().toISOString(),
      ip: clientIp(r),
    }

    let action: "created" | "updated" = "created"
    let id: string | number = ""
    const existing = await req.payload.find({
      collection: "push-devices",
      where: { fcmToken: { equals: v0.fcm_token } },
      limit: 1,
    })
    if (existing.docs.length) {
      const doc = existing.docs[0] as { id: string | number }
      const updated = await req.payload.update({
        collection: "push-devices",
        id: doc.id,
        data: data as any,
      })
      action = "updated"
      id = (updated as { id: string | number }).id
    } else {
      const created = await req.payload.create({
        collection: "push-devices",
        data: data as any,
      })
      id = (created as { id: string | number }).id
    }

    req.payload.logger.info(
      { evt: "v1.push.register", action, id, platform: v0.platform, topics: v0.topics?.length || 0 },
      "push device registered",
    )

    return ok({ id: `device_${id}`, action }, { status: action === "created" ? 201 : 200 })
  },
}
