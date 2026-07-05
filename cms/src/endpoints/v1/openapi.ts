import type { Endpoint } from "payload"

const SPEC = {
  openapi: "3.1.0",
  info: {
    title: "MubarmiJ Mobile API",
    version: "1.0.0",
    description: "Public REST API consumed by the MubarmiJ Flutter mobile app.",
  },
  servers: [
    { url: "https://www.mubarmijonline.com/api", description: "Production" },
  ],
  components: {
    parameters: {
      AcceptLanguage: {
        name: "Accept-Language",
        in: "header",
        required: false,
        schema: { type: "string", enum: ["en", "ar"] },
        description: "Locale (en or ar). Defaults to en.",
      },
      Page: { name: "page", in: "query", required: false, schema: { type: "integer", minimum: 1, default: 1 } },
      PageSize: { name: "page_size", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
    },
    schemas: {
      Envelope: {
        type: "object",
        properties: {
          data: {},
          meta: { type: "object", additionalProperties: true },
        },
        required: ["data"],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              fields: { type: "object", additionalProperties: { type: "string" } },
            },
            required: ["code", "message"],
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: "Validation failed.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      RateLimited: {
        description: "Too many requests.",
        headers: { "Retry-After": { schema: { type: "integer" } } },
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      NotFound: {
        description: "Not found.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
  paths: {
    "/v1/services": {
      get: {
        summary: "List services",
        parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Envelope" } } } } },
      },
    },
    "/v1/services/{slug}": {
      get: {
        summary: "Get service detail",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string", enum: ["automation", "web-development", "mobile-apps", "maintenance"] } },
          { $ref: "#/components/parameters/AcceptLanguage" },
        ],
        responses: { "200": { description: "OK" }, "404": { $ref: "#/components/responses/NotFound" } },
      },
    },
    "/v1/clients": {
      get: {
        summary: "List clients",
        parameters: [
          { name: "featured", in: "query", schema: { type: "string", enum: ["true", "false"] } },
          { name: "category", in: "query", schema: { type: "string" } },
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/PageSize" },
          { $ref: "#/components/parameters/AcceptLanguage" },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/v1/clients/{slug}": {
      get: {
        summary: "Get client detail",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
          { $ref: "#/components/parameters/AcceptLanguage" },
        ],
        responses: { "200": { description: "OK" }, "404": { $ref: "#/components/responses/NotFound" } },
      },
    },
    "/v1/blog": {
      get: {
        summary: "List blog posts",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" } },
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/PageSize" },
          { $ref: "#/components/parameters/AcceptLanguage" },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/v1/blog/{slug}": {
      get: {
        summary: "Get post detail",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
          { $ref: "#/components/parameters/AcceptLanguage" },
        ],
        responses: { "200": { description: "OK" }, "404": { $ref: "#/components/responses/NotFound" } },
      },
    },
    "/v1/faq": { get: { summary: "FAQ", parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }], responses: { "200": { description: "OK" } } } },
    "/v1/about": { get: { summary: "About", parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }], responses: { "200": { description: "OK" } } } },
    "/v1/resources": { get: { summary: "Resources", parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }], responses: { "200": { description: "OK" } } } },
    "/v1/testimonials": { get: { summary: "Testimonials", parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }], responses: { "200": { description: "OK" } } } },
    "/v1/leads/contact": {
      post: {
        summary: "Submit a contact form lead",
        requestBody: {
          required: true,
          content: { "application/json": { schema: {
            type: "object",
            required: ["name", "email", "subject", "message"],
            properties: {
              name: { type: "string", minLength: 2, maxLength: 80 },
              email: { type: "string", format: "email" },
              phone: { type: "string" },
              subject: { type: "string", enum: ["general", "automation", "web", "mobile", "maintenance", "other"] },
              message: { type: "string", minLength: 10, maxLength: 2000 },
              locale: { type: "string", enum: ["en", "ar"] },
              source: { type: "string", description: "Set to 'mobile_app' for app submissions." },
              company_url: { type: "string", description: "Honeypot. Leave empty." },
            },
          } } },
        },
        responses: { "201": { description: "Created" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
    "/v1/leads/guide": {
      post: {
        summary: "Submit a guide download lead",
        requestBody: { required: true, content: { "application/json": { schema: {
          type: "object", required: ["name", "email", "guide_slug"],
          properties: {
            name: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" },
            guide_slug: { type: "string" }, locale: { type: "string", enum: ["en", "ar"] }, source: { type: "string" },
          },
        } } } },
        responses: { "201": { description: "Created" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
    "/v1/leads/newsletter": {
      post: {
        summary: "Subscribe to newsletter",
        requestBody: { required: true, content: { "application/json": { schema: {
          type: "object", required: ["email"],
          properties: { email: { type: "string", format: "email" }, locale: { type: "string", enum: ["en", "ar"] }, source: { type: "string" } },
        } } } },
        responses: { "200": { description: "Already subscribed" }, "201": { description: "Subscribed" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
    "/v1/leads/consultation": {
      post: {
        summary: "Request a consultation",
        requestBody: { required: true, content: { "application/json": { schema: {
          type: "object", required: ["name", "email", "preferred_channel", "preferred_day", "preferred_time_window", "topic"],
          properties: {
            name: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" },
            preferred_channel: { type: "string", enum: ["whatsapp", "call", "email"] },
            preferred_day: { type: "string", format: "date" },
            preferred_time_window: { type: "string", enum: ["morning", "afternoon", "evening"] },
            topic: { type: "string", enum: ["automation", "web", "mobile", "maintenance", "other"] },
            notes: { type: "string" }, locale: { type: "string", enum: ["en", "ar"] }, source: { type: "string" },
          },
        } } } },
        responses: { "201": { description: "Created" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
    "/v1/leads/roi": {
      post: {
        summary: "Submit ROI calculator lead",
        requestBody: { required: true, content: { "application/json": { schema: {
          type: "object", required: ["employees", "daily_hours_per_employee", "monthly_salary_egp", "name", "email"],
          properties: {
            employees: { type: "integer", minimum: 1 },
            daily_hours_per_employee: { type: "number", minimum: 0.1 },
            monthly_salary_egp: { type: "number", minimum: 1000 },
            computed_monthly_savings_egp: { type: "number" },
            computed_monthly_hours_saved: { type: "number" },
            name: { type: "string" }, email: { type: "string", format: "email" }, phone: { type: "string" },
            locale: { type: "string", enum: ["en", "ar"] }, source: { type: "string" },
          },
        } } } },
        responses: { "201": { description: "Created" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
    "/v1/push/register": {
      post: {
        summary: "Register or update an FCM device for push notifications",
        requestBody: { required: true, content: { "application/json": { schema: {
          type: "object", required: ["fcm_token", "platform"],
          properties: {
            fcm_token: { type: "string" },
            platform: { type: "string", enum: ["ios", "android"] },
            locale: { type: "string", enum: ["en", "ar"] },
            app_version: { type: "string" }, device_model: { type: "string" }, os_version: { type: "string" },
            topics: { type: "array", items: { type: "string", enum: ["blog_new_post", "offers", "important_news"] } },
          },
        } } } },
        responses: { "200": { description: "Updated" }, "201": { description: "Created" }, "400": { $ref: "#/components/responses/ValidationError" }, "429": { $ref: "#/components/responses/RateLimited" } },
      },
    },
  },
} as const

export const openapiEndpoint: Endpoint = {
  path: "/v1/openapi.json",
  method: "get",
  handler: async () => {
    return new Response(JSON.stringify(SPEC, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    })
  },
}
