import type { CollectionConfig } from "payload"

export const PushDevices: CollectionConfig = {
  slug: "push-devices",
  admin: {
    useAsTitle: "fcmToken",
    defaultColumns: ["createdAt", "platform", "appVersion", "locale", "topicsList"],
    group: "Mobile",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "fcmToken", type: "text", required: true, unique: true, index: true },
    {
      name: "platform",
      type: "select",
      required: true,
      options: [
        { label: "iOS", value: "ios" },
        { label: "Android", value: "android" },
      ],
      index: true,
    },
    { name: "locale", type: "select", defaultValue: "en", options: [
      { label: "English", value: "en" },
      { label: "Arabic", value: "ar" },
    ] },
    { name: "appVersion", type: "text" },
    { name: "deviceModel", type: "text" },
    { name: "osVersion", type: "text" },
    {
      name: "topics",
      type: "select",
      hasMany: true,
      options: [
        { label: "New blog posts", value: "blog_new_post" },
        { label: "Offers", value: "offers" },
        { label: "Important news", value: "important_news" },
      ],
    },
    {
      // Read-only summary for admin list view (the "topics" field is rendered as chips
      // but useful as a comma string in lists).
      name: "topicsList",
      type: "text",
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const t = (siblingData?.topics as string[] | undefined) || []
            return t.join(", ")
          },
        ],
      },
    },
    { name: "lastSeenAt", type: "date" },
    { name: "ip", type: "text" },
  ],
  timestamps: true,
}
