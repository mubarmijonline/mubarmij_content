import type { CollectionConfig, Payload } from 'payload'

type MediaDoc = {
  id: string
  filename?: string | null
  mimeType?: string | null
  alt?: string | null
}

type ClientDoc = {
  id: string
  slug?: string | null
  name?: string | null
  logo?: unknown
  coverImage?: unknown
  services?: string[] | null
  publishStatus?: string | null
}

const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm'])

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '')
}

function humanTitle(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(v|version)\s*\d+\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function relationId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return String((value as { id?: unknown }).id || '') || undefined
  return undefined
}

function categoryFromClient(client?: ClientDoc): 'automation' | 'web' | 'mobile' | 'behind-the-scenes' {
  const services = client?.services || []
  if (services.includes('automation')) return 'automation'
  if (services.includes('web')) return 'web'
  if (services.includes('mobile')) return 'mobile'
  return 'behind-the-scenes'
}

async function findClientForVideo(payload: Payload, filename: string): Promise<ClientDoc | null> {
  const haystack = normalize(filename)
  if (!haystack) return null

  const result = await payload.find({
    collection: 'client-logos',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  let best: { client: ClientDoc; score: number } | null = null
  for (const raw of result.docs as unknown as ClientDoc[]) {
    if ((raw.publishStatus || 'published') === 'draft') continue
    const name = raw.name || ''
    const slug = raw.slug || ''
    const firstNameToken = name.split(/\s+/)[0] || ''
    const tokens = [slug, name, firstNameToken]
      .map(normalize)
      .filter((token) => token.length >= 3)

    for (const token of tokens) {
      if (haystack.includes(token) && (!best || token.length > best.score)) {
        best = { client: raw, score: token.length }
      }
    }
  }

  return best?.client || null
}

export async function createReelForVideoMedia({ payload, media }: { payload: Payload; media: MediaDoc }) {
  if (!media.id || !media.mimeType || !VIDEO_MIME_TYPES.has(media.mimeType)) return

  const existing = await payload.find({
    collection: 'reels',
    where: { videoFile: { equals: media.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs?.[0]) return

  const filename = media.filename || media.alt || 'Project Reel'
  const client = await findClientForVideo(payload, filename)
  const thumbnail = relationId(client?.coverImage) || relationId(client?.logo)
  const title = humanTitle(filename) || `${client?.name || 'Project'} Reel`

  await payload.create({
    collection: 'reels',
    data: {
      title,
      description: client?.name ? `A short look at the ${client.name} project.` : undefined,
      source: 'hosted',
      videoFile: media.id,
      thumbnail,
      category: categoryFromClient(client || undefined),
      client: client?.id,
      publishStatus: 'published',
      order: 0,
    },
    overrideAccess: true,
  })
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4', 'video/webm'],
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await createReelForVideoMedia({ payload: req.payload, media: doc as MediaDoc })
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}
