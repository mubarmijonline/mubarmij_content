import type { CollectionConfig } from "payload"

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["createdAt", "name", "email", "channel", "source", "topic", "status"],
    group: "Mobile",
  },
  access: {
    // Public submissions are inserted via the v1 endpoints (which use req.payload.create
    // server-side). REST `create` is closed; reads are admin-only.
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "channel",
      type: "select",
      required: true,
      options: [
        { label: "Contact form", value: "contact_form" },
        { label: "Guide download", value: "guide_download" },
        { label: "Newsletter", value: "newsletter" },
        { label: "Consultation request", value: "consultation_request" },
        { label: "ROI calculator", value: "roi_calculator" },
      ],
      index: true,
    },
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "website",
      options: [
        { label: "Website", value: "website" },
        { label: "Mobile app", value: "mobile_app" },
        { label: "Other", value: "other" },
      ],
      index: true,
    },
    { name: "name", type: "text" },
    { name: "email", type: "email", index: true },
    { name: "phone", type: "text" },
    {
      name: "topic",
      type: "select",
      options: [
        { label: "General", value: "general" },
        { label: "Automation", value: "automation" },
        { label: "Web", value: "web" },
        { label: "Mobile", value: "mobile" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "subject", type: "text" },
    { name: "message", type: "textarea" },
    { name: "guideSlug", type: "text" },
    { name: "preferredChannel", type: "select", options: [
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Call", value: "call" },
      { label: "Email", value: "email" },
    ] },
    { name: "preferredDay", type: "date" },
    { name: "preferredTimeWindow", type: "select", options: [
      { label: "Morning", value: "morning" },
      { label: "Afternoon", value: "afternoon" },
      { label: "Evening", value: "evening" },
    ] },
    { name: "notes", type: "textarea" },
    {
      name: "roi",
      type: "group",
      fields: [
        { name: "employees", type: "number" },
        { name: "dailyHoursPerEmployee", type: "number" },
        { name: "monthlySalaryEgp", type: "number" },
        { name: "clientReportedSavingsEgp", type: "number" },
        { name: "clientReportedHoursSaved", type: "number" },
        { name: "serverComputedSavingsEgp", type: "number" },
        { name: "serverComputedHoursSaved", type: "number" },
      ],
    },
    { name: "locale", type: "select", defaultValue: "en", options: [
      { label: "English", value: "en" },
      { label: "Arabic", value: "ar" },
    ] },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In progress", value: "in_progress" },
        { label: "Closed (won)", value: "won" },
        { label: "Closed (lost)", value: "lost" },
        { label: "Spam", value: "spam" },
      ],
      index: true,
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "normal",
      options: [
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
      ],
    },
    { name: "ip", type: "text" },
    { name: "userAgent", type: "text" },
    { name: "deliveredAt", type: "date" },
  ],
  timestamps: true,
}
