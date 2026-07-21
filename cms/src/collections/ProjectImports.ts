import type { CollectionConfig } from 'payload'

/**
 * ProjectImports — persistent job store for the project-import API.
 *
 * A job is created by POST /api/v1/project-imports (agent/worker auth) and later
 * fulfilled by POST /api/v1/agent/project-imports/:jobId/result, which uploads the
 * enhanced screenshots and creates/updates the published `client-logos` project.
 *
 * These records are internal (admin-only read); the public site never reads them.
 */
export const ProjectImports: CollectionConfig = {
  slug: 'project-imports',
  labels: {
    singular: 'Project Import',
    plural: 'Project Imports',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'projectSlug', 'reelRecommended', 'createdAt'],
    description:
      'Auto-import jobs. Created and fulfilled through the /api/v1/project-imports API; not edited by hand.',
  },
  access: {
    // Admin-only. The API endpoints operate with overrideAccess.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', admin: { description: 'Project name from the import request.' } },
    { name: 'url', type: 'text', required: true },
    {
      name: 'idempotencyKey',
      type: 'text',
      index: true,
      admin: { description: 'Idempotency-Key header; a repeat with the same key returns the same job.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'params',
      type: 'json',
      admin: { description: 'Snapshot of the original import request payload.' },
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'projectSlug',
      type: 'text',
      admin: { description: 'Slug of the created/updated client-logos project.' },
    },
    {
      name: 'projectId',
      type: 'text',
      admin: { description: 'Payload document id of the created/updated project.' },
    },
    { name: 'publicUrl', type: 'text' },
    { name: 'galleryCount', type: 'number' },
    { name: 'reelRecommended', type: 'checkbox', defaultValue: false },
    { name: 'enhancement', type: 'text', admin: { description: 'higgsfield | sharp | none' } },
    { name: 'error', type: 'textarea' },
    { name: 'completedAt', type: 'date' },
  ],
}
