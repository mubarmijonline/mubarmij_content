import type { Endpoint } from "payload"

import { listServicesEndpoint, getServiceEndpoint } from "./services"
import { listClientsEndpoint, getClientEndpoint } from "./clients"
import { listBlogEndpoint, getBlogPostEndpoint } from "./blog"
import { listFaqEndpoint, getAboutEndpoint } from "./staticContent"
import { listResourcesEndpoint } from "./resources"
import { listTestimonialsEndpoint } from "./testimonials"
import { listReelsEndpoint, getReelEndpoint } from "./reels"
import { analyticsEventEndpoint } from "./analytics"
import {
  contactLeadEndpoint,
  guideLeadEndpoint,
  newsletterLeadEndpoint,
  consultationLeadEndpoint,
  roiLeadEndpoint,
} from "./leads"
import { pushRegisterEndpoint } from "./push"
import { openapiEndpoint } from "./openapi"

export const v1Endpoints: Endpoint[] = [
  // GET
  listServicesEndpoint,
  getServiceEndpoint,
  listClientsEndpoint,
  getClientEndpoint,
  listBlogEndpoint,
  getBlogPostEndpoint,
  listFaqEndpoint,
  getAboutEndpoint,
  listResourcesEndpoint,
  listTestimonialsEndpoint,
  listReelsEndpoint,
  getReelEndpoint,
  openapiEndpoint,
  // POST
  contactLeadEndpoint,
  guideLeadEndpoint,
  newsletterLeadEndpoint,
  consultationLeadEndpoint,
  roiLeadEndpoint,
  analyticsEventEndpoint,
  pushRegisterEndpoint,
]
