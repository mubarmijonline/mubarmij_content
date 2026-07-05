import type { CollectionConfig } from 'payload'

/** Auto-generate a URL slug from the name when none is provided. */
const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u0652]/g, '') // strip Arabic diacritics
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'publishStatus', 'displayOnHomepage', 'order'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && (!data.slug || String(data.slug).trim() === '') && data.name) {
          data.slug = slugify(String(data.name))
        }
        return data
      },
    ],
  },
  fields: [
    // ---------- Identity ----------
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'URL slug used for the profile page (/clients/<slug>). Auto-generated from name if left empty.',
        position: 'sidebar',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'One-line headline shown under the company name.' },
    },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Hospitality', value: 'hospitality' },
        { label: 'Food & Beverage', value: 'fnb' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Real Estate', value: 'real-estate' },
        { label: 'Education', value: 'education' },
        { label: 'Logistics', value: 'logistics' },
        { label: 'Retail', value: 'retail' },
        { label: 'Services', value: 'services' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'industryCustom',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Custom industry label shown when "Other" is selected above.',
        condition: (data) => data?.industry === 'other',
      },
    },
    { name: 'country', type: 'text' },
    { name: 'foundedYear', type: 'number' },

    // ---------- Logo & branding (existing) ----------
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'darkCard',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Render this logo on a dark navy card (use for logos with white/light artwork).',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      admin: { description: 'External website (e.g. https://example.com).' },
    },

    // ---------- Profile content ----------
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      maxLength: 240,
      admin: {
        description:
          'Up to 240 characters. Used for SEO meta description and the listing card preview.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Full profile description shown on the company profile page.' },
    },
    {
      name: 'services',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'Web Development', value: 'web' },
        { label: 'Mobile Apps', value: 'mobile' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Consulting', value: 'consulting' },
      ],
      admin: { description: 'Services we delivered to this client.' },
    },

    // ---------- Media (gallery) ----------
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Hero banner image for the profile page (optional).' },
    },
    {
      name: 'screenshots',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Image gallery for the profile page. To add multiple images: 1) click "Add Screenshots" → 2) tick the checkbox on the left of each image you want → 3) click the GREEN PULSING "Select N" pill at the TOP-RIGHT of the drawer (that is the save button — clicking it adds all selected images and closes the drawer). Drag rows here to reorder.',
      },
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Videos' },
      admin: { description: 'Videos shown on the profile page.' },
      fields: [
        {
          name: 'source',
          type: 'select',
          required: true,
          defaultValue: 'youtube',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Uploaded file', value: 'upload' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'YouTube/Vimeo URL (only for YouTube/Vimeo sources).',
            condition: (_, siblingData) =>
              siblingData?.source === 'youtube' || siblingData?.source === 'vimeo',
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'MP4/WebM video file (only when source is "Uploaded file").',
            condition: (_, siblingData) => siblingData?.source === 'upload',
          },
        },
        { name: 'title', type: 'text', localized: true },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional poster image for the video.' },
        },
      ],
    },

    // ---------- Proof / results ----------
    {
      name: 'metrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Metrics' },
      admin: { description: 'Headline numbers, e.g. "+34% conversion".' },
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'testimonialQuote', type: 'textarea', localized: true },
    { name: 'testimonialAuthor', type: 'text' },

    // ---------- Project meta (sidebar on detail page) ----------
    {
      name: 'techStack',
      type: 'array',
      labels: { singular: 'Tech', plural: 'Tech stack' },
      admin: {
        description:
          'Tools / technologies used. Each item shows as a small pill in the sidebar.',
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'timeline',
      type: 'text',
      localized: true,
      admin: { description: 'Project timeline, e.g. "5 weeks", "3 أسابيع".' },
    },

    // ---------- Visibility (sidebar) ----------
    {
      name: 'publishStatus',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Only "published" profiles are visible publicly. Logos still appear in the homepage logo bar regardless of this setting.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'displayOnHomepage',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
