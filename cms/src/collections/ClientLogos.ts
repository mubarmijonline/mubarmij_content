import type { CollectionConfig } from 'payload'

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayOnHomepage', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'websiteUrl',
      type: 'text',
    },
    {
      name: 'darkCard',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Render this logo on a dark navy card (use for logos with white/light artwork).',
      },
    },
    {
      name: 'displayOnHomepage',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
