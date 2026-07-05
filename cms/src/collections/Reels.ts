import type { CollectionConfig } from 'payload'

/**
 * Short-form vertical video clips (9:16) showcased on the public site.
 * Mirrors the ClientLogos publish/visibility pattern. Supports two sources:
 *  - hosted: an uploaded MP4 and/or a provider HLS URL (Bunny / Cloudflare Stream)
 *  - embed:  a YouTube / Vimeo URL
 */
export const Reels: CollectionConfig = {
  slug: 'reels',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'source', 'publishStatus', 'order'],
    group: 'Content',
    description: 'Short vertical video clips (1–90s) shown on the site reels row and lightbox.',
  },
  access: {
    read: () => true, // public read; drafts filtered in the /v1 endpoint
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true, maxLength: 280 },
    {
      name: 'source',
      type: 'radio',
      required: true,
      defaultValue: 'hosted',
      options: [
        { label: 'Hosted (uploaded file / HLS URL)', value: 'hosted' },
        { label: 'Embed (YouTube / Vimeo)', value: 'embed' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.source === 'hosted',
        description: 'MP4 for direct playback. Optional if you provide an HLS URL.',
      },
    },
    {
      name: 'hlsUrl',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.source === 'hosted',
        description: 'Optional HLS (.m3u8) URL from Bunny Stream / Cloudflare Stream.',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.source === 'embed',
        description: 'YouTube or Vimeo URL (must start with https://).',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Poster image. Auto-created reels use the matched client cover/logo when possible.' },
    },
    {
      name: 'durationSeconds',
      type: 'number',
      min: 1,
      max: 90,
      admin: { description: 'Clip length in seconds (1–90).', step: 1 },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'automation',
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Behind the scenes', value: 'behind-the-scenes' },
      ],
      index: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'client-logos',
      hasMany: false,
      admin: { description: 'Optional linked case study.', position: 'sidebar' },
    },
    {
      name: 'publishStatus',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
      index: true,
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
