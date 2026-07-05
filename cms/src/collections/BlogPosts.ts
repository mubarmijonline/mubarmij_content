import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: { drafts: true },
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
      index: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Business', value: 'business' },
        { label: 'Tutorials', value: 'tutorials' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text', required: true },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
      localized: true,
    },
    {
      name: 'authorName',
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
