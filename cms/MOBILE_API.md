# MubarmiJ Mobile API (`/api/v1/*`)

Public REST API consumed by the MubarmiJ Flutter mobile app.
Lives on the **CMS** Next.js app (port 3001) and is exposed through the existing nginx
`/api/*` proxy. **No nginx changes required.**

Base URL: `https://www.mubarmijonline.com/api`

OpenAPI 3.1 spec: [`/api/v1/openapi.json`](https://www.mubarmijonline.com/api/v1/openapi.json)
Postman collection: [`docs/postman/mubarmij-mobile.postman_collection.json`](../docs/postman/mubarmij-mobile.postman_collection.json)

---

## Conventions

* **Locale**: send `Accept-Language: en` or `Accept-Language: ar`. Defaults to `en`.
* **Envelope**: every response is `{ "data": ... , "meta"?: {...} }` for success or
  `{ "error": { "code", "message", "fields"? } }` for failure.
* **Caching**: read endpoints set `Cache-Control: public, max-age=300, stale-while-revalidate=600`.
* **Rate limits** (in-memory, per IP):
  * `/v1/leads/*` → 5 req / 10 min per bucket. Returns `429` + `Retry-After`.
  * `/v1/push/register` → 20 req / hour per IP.
* **Honeypot**: lead endpoints accept an optional `company_url` field. If non-empty,
  the request is silently accepted (returns 201) but no record is stored.
* **Mobile-app tag**: include `"source": "mobile_app"` in lead/newsletter/push payloads
  so admin can filter via the **Source** column.

## Endpoints

### Read (10)

| Method | Path | Returns |
|---|---|---|
| GET | `/v1/services` | List of 4 services (slug, title, tagline, summary, hero, deliverables, …). |
| GET | `/v1/services/{slug}` | Full service profile. 404 if unknown. |
| GET | `/v1/clients?featured=&category=&page=&page_size=` | Paginated client logos. |
| GET | `/v1/clients/{slug}` | Full client case study. |
| GET | `/v1/blog?category=&page=&page_size=` | Published posts (newest first). |
| GET | `/v1/blog/{slug}` | Post + sanitized HTML body + 3 related. |
| GET | `/v1/faq` | 12 FAQ items. |
| GET | `/v1/about` | About / values / expertise / stats / contact. |
| GET | `/v1/resources` | Lead-magnet PDFs. |
| GET | `/v1/testimonials` | Customer quotes. |
| GET | `/v1/openapi.json` | Machine-readable spec. |

### Write (6)

| Method | Path | Channel stored on `leads` |
|---|---|---|
| POST | `/v1/leads/contact` | `contact_form` |
| POST | `/v1/leads/guide` | `guide_download` |
| POST | `/v1/leads/newsletter` | `newsletter` (returns 200 if already subscribed) |
| POST | `/v1/leads/consultation` | `consultation_request` |
| POST | `/v1/leads/roi` | `roi_calculator` (server recomputes savings) |
| POST | `/v1/push/register` | upsert on `push-devices` |

## Adding a new lead source

1. Add a new value to the `source` select in
   [`cms/src/collections/Leads.ts`](src/collections/Leads.ts).
2. (Optional) accept that value from a new endpoint or pass it through from the
   mobile app payload — the existing endpoints already accept any string and store
   `mobile_app` if explicit, otherwise `website`.
3. `npm run build && sudo systemctl restart mubarmij_cms.service`.

## Push notification trigger (sample)

Today the mobile API only registers FCM devices on `push-devices`. To actually send
a notification, run an admin script (or attach a Payload `afterChange` hook on
`blog-posts`) that:

```ts
import payload from 'payload'
import { initPayload } from './bootstrap'

await initPayload()

const devices = await payload.find({
  collection: 'push-devices',
  where: { topics: { contains: 'blog_new_post' } },
  limit: 1000,
})

const tokens = devices.docs.map((d) => d.fcmToken)
// POST to FCM v1 (requires FIREBASE_SERVICE_ACCOUNT_JSON env var):
await fetch('https://fcm.googleapis.com/v1/projects/<PROJECT_ID>/messages:send', {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: {
      tokens,
      notification: { title: 'New post on MubarmiJ', body: post.title },
      data: { type: 'blog_new_post', slug: post.slug },
    },
  }),
})
```

The `firebase-admin` dependency is **not** installed yet — wire it (or call FCM
HTTP v1 directly with a service-account JWT) when you ship the first push campaign.

## Side-effects (email / WhatsApp / CRM)

[`endpoints/v1/helpers/notify.ts`](src/endpoints/v1/helpers/notify.ts) sends:

* Team email via Brevo (`BREVO_API_KEY` + `BREVO_SENDER_EMAIL` + optional
  `BREVO_TEAM_NOTIFY_EMAIL`).
* Auto-reply to the lead in their locale (Brevo).
* WhatsApp deep link (`https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=…`) — logged
  for now. Wire the WhatsApp Cloud API if you want server-side sends.

When `BREVO_API_KEY` is unset, every channel logs the formatted message to the
Payload logger — safe by default in dev.

## Verifying after deploy

```bash
cd /projects/mubarmij_site/_next_rewrite/cms && npm run build
sudo systemctl restart mubarmij_cms.service && sleep 5
for ep in services faq about clients blog resources testimonials openapi.json; do
  printf "%-25s %s\n" "$ep" "$(curl -sk -o /dev/null -w '%{http_code}' \
    https://www.mubarmijonline.com/api/v1/$ep)"
done
```

All should print `200`.
