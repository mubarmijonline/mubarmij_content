import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'industry', 'serviceType', 'publishedAt', 'status'],
  },
  access: {
    read: ({ req }) => {
      // Public: only published. Admin: all.
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'industry',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      hasMany: true,
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'Web Development', value: 'web' },
        { label: 'Mobile Apps', value: 'mobile' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'challenge',
      type: 'richText',
      editor: lexicalEditor({}),
      localized: true,
    },
    {
      name: 'solution',
      type: 'richText',
      editor: lexicalEditor({}),
      localized: true,
    },
    {
      name: 'results',
      type: 'array',
      labels: { singular: 'Result', plural: 'Results' },
      fields: [
        { name: 'metric', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'testimonialQuote',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'testimonialAuthor',
      type: 'text',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: { position: 'sidebar' },
    },
  ],
}
