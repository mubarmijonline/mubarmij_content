import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CaseStudies } from './collections/CaseStudies'
import { BlogPosts } from './collections/BlogPosts'
import { Testimonials } from './collections/Testimonials'
import { ClientLogos } from './collections/ClientLogos'
import { Resources } from './collections/Resources'
import { AnalyticsEvents } from './collections/AnalyticsEvents'
import { trackPageviewEndpoint } from './endpoints/analyticsTrack'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['/admin/components/AnalyticsDashboard.tsx'],
    },
  },
  collections: [
    Users,
    Media,
    CaseStudies,
    BlogPosts,
    Testimonials,
    ClientLogos,
    Resources,
    AnalyticsEvents,
  ],
  endpoints: [trackPageviewEndpoint],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Arabic', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:5552',
    'https://127.0.0.1:5552',
    'https://34.55.212.155:5552',
    'https://mubarmijonline.com',
    'https://www.mubarmijonline.com',
    process.env.NEXT_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:5552',
    'https://127.0.0.1:5552',
    'https://34.55.212.155:5552',
    'https://mubarmijonline.com',
    'https://www.mubarmijonline.com',
    process.env.NEXT_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
})
