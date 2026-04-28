import type { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'gated', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'PDF Guide', value: 'pdf' },
        { label: 'Checklist', value: 'checklist' },
        { label: 'Template', value: 'template' },
        { label: 'Whitepaper', value: 'whitepaper' },
      ],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gated',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'If enabled, requires email submission to download.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
