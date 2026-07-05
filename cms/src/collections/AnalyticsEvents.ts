import type { CollectionConfig } from 'payload'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'locale', 'visitorId', 'sessionId', 'createdAt'],
    group: 'Analytics',
    description:
      'Raw page-view events ingested from the public site. Aggregated by the dashboard panel.',
    pagination: { defaultLimit: 50 },
  },
  access: {
    // Only authenticated admins can read events. Ingest is handled by the
    // public-site API route and Payload Local API (no REST create exposed).
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'path', type: 'text', required: true, index: true },
    { name: 'locale', type: 'text', index: true },
    { name: 'referrer', type: 'text' },
    { name: 'visitorId', type: 'text', required: true, index: true },
    { name: 'sessionId', type: 'text', required: true, index: true },
    { name: 'userAgent', type: 'text' },
    { name: 'ip', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'isBot', type: 'checkbox', defaultValue: false, index: true },
  ],
  timestamps: true,
}
