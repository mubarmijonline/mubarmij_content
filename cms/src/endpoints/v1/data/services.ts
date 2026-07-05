// Hardcoded service catalog. Mirrors website copy under messages/{en,ar}.json.
// Single source of truth for /api/v1/services and /services/:slug.

import type { V1Locale } from "../helpers/locale"

export type ServiceSummary = {
  slug: string
  title: string
  tagline?: string
  icon?: string
  summary?: string
  deliverables: string[]
  proof?: string
  order: number
}

export type ServiceDetail = ServiceSummary & {
  intro: string
  hero_image_url?: string
  pain_points?: string[]
  types?: { title: string; icon: string }[]
  differentiators?: string[]
  has_roi_calculator?: boolean
}

type Bilingual = { en: string; ar: string }
type ServiceContent = {
  slug: string
  icon: string
  order: number
  hero_image_url?: string
  has_roi_calculator?: boolean
  title: Bilingual
  tagline?: Bilingual
  summary?: Bilingual
  intro: Bilingual
  proof?: Bilingual
  deliverables: { en: string[]; ar: string[] }
  pain_points?: { en: string[]; ar: string[] }
  types?: { title: Bilingual; icon: string }[]
  differentiators?: { en: string[]; ar: string[] }
}

const PUBLIC_BASE = "https://www.mubarmijonline.com"

const SERVICES: ServiceContent[] = [
  {
    slug: "automation",
    icon: "bolt",
    order: 1,
    hero_image_url: `${PUBLIC_BASE}/banners/banner-2.png`,
    has_roi_calculator: true,
    title: {
      en: "Automated systems that work for you",
      ar: "أنظمة أتمتة بتشتغل بدالك",
    },
    tagline: { en: "Highest ROI", ar: "أعلى عائد على الاستثمار" },
    summary: {
      en: "WhatsApp Bots, CRM Integration, Lead Management.",
      ar: "بوتات واتساب، ربط CRM، إدارة العملاء المحتملين.",
    },
    intro: {
      en: "We build working automation that saves you hours every week — from WhatsApp bots that close sales to CRMs wired into your ads, site, and reports.",
      ar: "بنبني أتمتة شغّالة بتوفّر عليك ساعات كل أسبوع — من بوتات واتساب اللي بتقفل البيع لحد ربط CRM بالإعلانات والموقع والتقارير.",
    },
    proof: {
      en: "A client saved 80 hours of work per month.",
      ar: "عميل وفّر 80 ساعة عمل في الشهر.",
    },
    deliverables: {
      en: ["WhatsApp Bots", "CRM Integration", "Lead Management", "Workflow Automation", "System Integrations"],
      ar: ["بوتات واتساب", "ربط CRM", "إدارة العملاء المحتملين", "أتمتة العمليات", "ربط الأنظمة"],
    },
    pain_points: {
      en: [
        "We lose leads because of slow response time",
        "My team spends hours on manual data entry",
        "We send similar messages daily",
        "We produce weekly reports manually",
        "Our tools are not connected",
        "We miss follow-ups with existing customers",
        "We don't have clear visibility on lead sources",
      ],
      ar: [
        "بنفقد عملاء بسبب بطء الرد",
        "الفريق بيصرف ساعات على إدخال بيانات يدوي",
        "بنبعت رسايل متشابهة كل يوم",
        "بنعمل تقارير أسبوعية يدوي",
        "أدواتنا مش متربوطة ببعض",
        "بنفقد المتابعة مع العملاء الحاليين",
        "مفيش رؤية واضحة على مصادر الـ leads",
      ],
    },
    types: [
      { title: { en: "WhatsApp Bot for sales", ar: "بوت واتساب للمبيعات" }, icon: "whatsapp" },
      { title: { en: "CRM integrated with site + ads", ar: "CRM متربط بالموقع والإعلانات" }, icon: "crm" },
      { title: { en: "Workflow Automation (custom)", ar: "أتمتة عمليات مخصصة" }, icon: "flow" },
      { title: { en: "System Integrations", ar: "ربط الأنظمة" }, icon: "plug" },
    ],
    differentiators: {
      en: ["Real systems, not templates", "Bilingual EN/AR support", "3 months free maintenance", "Clear measurable savings"],
      ar: ["أنظمة حقيقية مش قوالب", "دعم ثنائي اللغة عربي/إنجليزي", "3 شهور صيانة مجانية", "توفير قابل للقياس"],
    },
  },
  {
    slug: "web-development",
    icon: "globe",
    order: 2,
    hero_image_url: `${PUBLIC_BASE}/banners/banner-6.png`,
    title: {
      en: "Websites that bring clients, not just brochures",
      ar: "مواقع بتجيب عملاء، مش مجرد بروشور",
    },
    tagline: { en: "Tailored to your business", ar: "مفصّلة على نشاطك" },
    summary: {
      en: "Lightning-fast, SEO-ready, bilingual sites that convert.",
      ar: "مواقع سريعة جدًا، جاهزة للسيو، ثنائية اللغة بتحوّل الزوار لعملاء.",
    },
    intro: {
      en: "Landing pages, corporate sites, e-commerce, and admin dashboards — built on a stack that ranks on Google and looks great on every device.",
      ar: "Landing pages ومواقع شركات ومتاجر إلكترونية ولوحات تحكم، مبنية على ستاك بيظهر في جوجل وشكله ممتاز على أي جهاز.",
    },
    deliverables: {
      en: ["Landing Pages", "Corporate Websites", "E-commerce", "Custom Dashboards", "SEO"],
      ar: ["Landing Pages", "مواقع شركات", "متاجر إلكترونية", "لوحات تحكم مخصصة", "تهيئة لمحركات البحث"],
    },
    types: [
      { title: { en: "Landing pages that convert", ar: "Landing pages بتحوّل" }, icon: "rocket" },
      { title: { en: "Corporate brochure sites", ar: "مواقع شركات احترافية" }, icon: "building" },
      { title: { en: "E-commerce stores", ar: "متاجر إلكترونية" }, icon: "shopping-cart" },
      { title: { en: "Custom admin dashboards", ar: "لوحات تحكم مخصصة" }, icon: "layout-dashboard" },
    ],
    differentiators: {
      en: [
        "Lightning-fast loads",
        "SEO-ready structure",
        "E-commerce that converts",
        "Custom admin dashboards",
        "Bilingual EN / AR",
        "3 months free support",
      ],
      ar: [
        "تحميل سريع جدًا",
        "بنية جاهزة للسيو",
        "متجر إلكتروني بيبيع",
        "لوحات تحكم مخصصة",
        "ثنائي اللغة عربي / إنجليزي",
        "3 شهور دعم مجاني",
      ],
    },
  },
  {
    slug: "mobile-apps",
    icon: "phone",
    order: 3,
    hero_image_url: `${PUBLIC_BASE}/banners/banner-5.png`,
    title: {
      en: "Mobile apps that grow your business",
      ar: "تطبيقات موبايل بتنمّي شغلك",
    },
    tagline: { en: "For companies with a serious budget", ar: "للشركات بميزانية جدية" },
    summary: {
      en: "Cross-platform Flutter apps with real backend, dashboard, and store deployment.",
      ar: "تطبيقات Flutter لـ iOS وأندرويد بـ backend حقيقي ولوحة تحكم ونشر على المتاجر.",
    },
    intro: {
      en: "iOS and Android in one Flutter codebase, backed by a real API, an admin dashboard, push notifications, and full App Store + Play Store deployment.",
      ar: "iOS وأندرويد بكود Flutter واحد، ومعاه API حقيقي ولوحة تحكم وإشعارات Push ونشر كامل على App Store و Play Store.",
    },
    deliverables: {
      en: ["iOS + Android", "Flutter", "Full Backend", "Admin Dashboard", "App Store deployment"],
      ar: ["iOS + أندرويد", "Flutter", "Backend كامل", "لوحة تحكم", "نشر على App Store"],
    },
    types: [
      { title: { en: "Customer-facing apps", ar: "تطبيقات للعملاء" }, icon: "users" },
      { title: { en: "Internal ops apps", ar: "تطبيقات تشغيل داخلية" }, icon: "briefcase" },
      { title: { en: "Marketplace apps", ar: "تطبيقات Marketplace" }, icon: "store" },
      { title: { en: "Booking / scheduling apps", ar: "تطبيقات حجوزات" }, icon: "calendar" },
    ],
    differentiators: {
      en: [
        "iOS + Android in one codebase",
        "Real backend, not a wrapper",
        "Admin dashboard included",
        "Push notifications & analytics",
        "App Store + Play Store deployment",
      ],
      ar: [
        "iOS وأندرويد بكود واحد",
        "Backend حقيقي مش مجرد wrapper",
        "لوحة تحكم إدارية ضمن الباقة",
        "إشعارات Push وتحليلات",
        "نشر على App Store و Play Store",
      ],
    },
  },
  {
    slug: "maintenance",
    icon: "shield-check",
    order: 4,
    hero_image_url: `${PUBLIC_BASE}/banners/banner-4.png`,
    title: { en: "Maintenance & Support", ar: "صيانة ودعم" },
    tagline: { en: "Priority support", ar: "دعم بأولوية" },
    summary: {
      en: "Hosting, updates, security, monitoring, and priority WhatsApp support.",
      ar: "استضافة، تحديثات، أمان، مراقبة، ودعم واتساب بأولوية.",
    },
    intro: {
      en: "A monthly retainer that keeps your site or system fast, secure, and running — with a clear SLA and priority WhatsApp support.",
      ar: "عقد دعم شهري بيخلي موقعك أو نظامك سريع وآمن وشغّال، تحت SLA واضح ودعم واتساب بأولوية.",
    },
    deliverables: {
      en: [
        "Hosting, DNS, backups",
        "Framework & dependency updates",
        "Security patches & SSL",
        "Bug fixes within SLA",
        "Uptime monitoring & alerts",
        "Priority WhatsApp support",
      ],
      ar: [
        "استضافة، DNS، نسخ احتياطية",
        "تحديث الفريم وورك والمكتبات",
        "تحديثات الأمان وشهادات SSL",
        "حل المشاكل خلال SLA محدد",
        "مراقبة الـ uptime وتنبيهات",
        "دعم واتساب بأولوية",
      ],
    },
  },
]

function summary(c: ServiceContent, locale: V1Locale): ServiceSummary {
  return {
    slug: c.slug,
    title: c.title[locale],
    tagline: c.tagline?.[locale],
    icon: c.icon,
    summary: c.summary?.[locale],
    deliverables: c.deliverables[locale],
    proof: c.proof?.[locale],
    order: c.order,
  }
}

function detail(c: ServiceContent, locale: V1Locale): ServiceDetail {
  return {
    ...summary(c, locale),
    intro: c.intro[locale],
    hero_image_url: c.hero_image_url,
    pain_points: c.pain_points?.[locale],
    types: c.types?.map((t) => ({ title: t.title[locale], icon: t.icon })),
    differentiators: c.differentiators?.[locale],
    has_roi_calculator: c.has_roi_calculator || undefined,
  }
}

export function listServices(locale: V1Locale): ServiceSummary[] {
  return SERVICES.slice().sort((a, b) => a.order - b.order).map((c) => summary(c, locale))
}

export function getService(slug: string, locale: V1Locale): ServiceDetail | null {
  const c = SERVICES.find((s) => s.slug === slug)
  return c ? detail(c, locale) : null
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug)
