import type { Endpoint } from "payload"

import { ok, cacheableHeaders } from "./helpers/envelope"
import { pickLocale } from "./helpers/locale"
import { listFaq } from "./data/faq"
import { getAbout } from "./data/about"

export const listFaqEndpoint: Endpoint = {
  path: "/v1/faq",
  method: "get",
  handler: async (req) => {
    const locale = pickLocale(req as unknown as Request)
    return ok(listFaq(locale), { headers: cacheableHeaders })
  },
}

export const getAboutEndpoint: Endpoint = {
  path: "/v1/about",
  method: "get",
  handler: async (req) => {
    const locale = pickLocale(req as unknown as Request)
    return ok(getAbout(locale), { headers: cacheableHeaders })
  },
}
