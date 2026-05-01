import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  assetPrefix: '/admin',
  turbopack: {
    root: dirname,
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3001',
        'localhost:5552',
        '127.0.0.1:5552',
        '34.55.212.155:5552',
        'mubarmijonline.com',
        'www.mubarmijonline.com',
      ],
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

