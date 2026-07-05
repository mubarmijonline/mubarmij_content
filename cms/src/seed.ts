/**
 * Seed Payload with the current static site data.
 *
 * Usage (from cms/):
 *   npm run seed
 *
 * Idempotent: skips records that already exist (matched by `name`/`alt`).
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from './payload.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Resolve the public/images directory of the marketing site
const PUBLIC_IMAGES = path.resolve(dirname, '../../public/images')

type LogoSeed = {
  name: string
  file: string
  alt: string
  websiteUrl?: string
  darkCard?: boolean
  order: number
}

const CLIENT_LOGOS: LogoSeed[] = [
  { name: 'Al Mal3ab', file: 'almal3ab.png', alt: 'Al Mal3ab', order: 10 },
  { name: 'Amwally', file: 'amwally_logo.png', alt: 'Amwally', order: 20 },
  { name: 'Eltime', file: 'eltime_logo.png', alt: 'Eltime', order: 30 },
  { name: 'Fantazia', file: 'fantazia_logo.png', alt: 'Fantazia', darkCard: true, order: 40 },
  { name: 'Masar GP', file: 'masargp_logo.png', alt: 'Masar GP', order: 50 },
  { name: 'Menus', file: 'menus_logo.png', alt: 'Menus', order: 60 },
  { name: "OG's HUB", file: 'ogs_hub.png', alt: "OG's HUB", order: 70 },
  { name: 'Padel Swift', file: 'padel_swift_logo.png', alt: 'Padel Swift', order: 80 },
  { name: 'Ramy Rafaat', file: 'ramyrafaat_logo.png', alt: 'Ramy Rafaat', order: 90 },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('▶ Seeding ClientLogos…')

  // Add the darkCard flag to ClientLogos collection at runtime?
  // Schema doesn't currently have darkCard; we encode it into the name suffix
  // is wrong — instead we store it via a custom field if it exists. For now
  // we just skip darkCard (LogoBar will infer it from name === 'Fantazia').

  for (const logo of CLIENT_LOGOS) {
    const existing = await payload.find({
      collection: 'client-logos',
      where: { name: { equals: logo.name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Exists: ${logo.name}`)
      continue
    }

    const filePath = path.join(PUBLIC_IMAGES, logo.file)

    // Upload media doc with file payload
    const mediaDoc = await payload.create({
      collection: 'media',
      data: { alt: logo.alt },
      filePath,
    })

    await payload.create({
      collection: 'client-logos',
      data: {
        name: logo.name,
        logo: mediaDoc.id,
        websiteUrl: logo.websiteUrl,
        darkCard: logo.darkCard ?? false,
        displayOnHomepage: true,
        order: logo.order,
      },
    })

    console.log(`  + Created: ${logo.name}`)
  }

  console.log('✅ Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
