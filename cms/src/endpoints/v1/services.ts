import type { Endpoint } from "payload"

import { ok, fail, cacheableHeaders } from "./helpers/envelope"
import { pickLocale } from "./helpers/locale"
import { listServices, getService, SERVICE_SLUGS } from "./data/services"

export const listServicesEndpoint: Endpoint = {
  path: "/v1/services",
  method: "get",
  handler: async (req) => {
    const locale = pickLocale(req as unknown as Request)
    return ok(listServices(locale), { headers: cacheableHeaders })
  },
}

export const getServiceEndpoint: Endpoint = {
  path: "/v1/services/:slug",
  method: "get",
  handler: async (req) => {
    const slug = String((req.routeParams as { slug?: string })?.slug || "")
    if (!SERVICE_SLUGS.includes(slug)) {
      return fail("NOT_FOUND", `Unknown service slug: ${slug}`)
    }
    const locale = pickLocale(req as unknown as Request)
    const service = getService(slug, locale)
    if (!service) return fail("NOT_FOUND", `Unknown service slug: ${slug}`)
    return ok(service, { headers: cacheableHeaders })
  },
}
