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
  /** Typical delivery window, shown as the mono meta value on capability rows. */
  duration?: string
}

/** One stage of how a service is actually delivered, in client-facing terms. */
export type ServiceStep = {
  title: string
  body: string
}

export type ServiceDetail = ServiceSummary & {
  /** How the engagement runs, stage by stage. */
  process?: ServiceStep[]
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
  duration?: Bilingual
  summary?: Bilingual
  intro: Bilingual
  proof?: Bilingual
  deliverables: { en: string[]; ar: string[] }
  pain_points?: { en: string[]; ar: string[] }
  types?: { title: Bilingual; icon: string }[]
  differentiators?: { en: string[]; ar: string[] }
  process?: { title: Bilingual; body: Bilingual }[]
}

const PUBLIC_BASE = "https://www.mubarmijonline.com"

const SERVICES: ServiceContent[] = [
  {
    slug: "ecommerce",
    process: [
      {
        title: { en: "Scope & catalogue audit", ar: "تحديد النطاق ومراجعة الكتالوج" },
        body: {
          en: "We map your products, variants and how customers actually shop today. You get a written scope with a fixed price, a launch date and the list of what we need from you.",
          ar: "بنراجع منتجاتك ومتغيراتها وطريقة شراء عملائك فعليًا. وبتاخد مستند نطاق مكتوب بسعر ثابت وتاريخ إطلاق وقائمة باللي محتاجينه منك.",
        },
      },
      {
        title: { en: "Storefront design", ar: "تصميم المتجر" },
        body: {
          en: "Clickable screens for home, category, product and checkout — approved by you before a single line of production code is written.",
          ar: "شاشات قابلة للضغط للرئيسية والأقسام والمنتج والدفع — بتوافق عليها قبل ما نكتب سطر كود إنتاجي واحد.",
        },
      },
      {
        title: { en: "Build & integrations", ar: "التنفيذ والربط" },
        body: {
          en: "Catalogue structure, one-step checkout, local payment and shipping, Arabic RTL, and WhatsApp order updates. Weekly demos on a live staging link.",
          ar: "ترتيب الكتالوج، شراء في خطوة واحدة، دفع وشحن محلي، عربي بدعم RTL، وتحديثات الطلبات على واتساب. مع عرض أسبوعي على رابط staging شغّال.",
        },
      },
      {
        title: { en: "Launch & handover", ar: "الإطلاق والتسليم" },
        body: {
          en: "Content load, real test orders, team training, documentation, and three months of care after go-live.",
          ar: "رفع المحتوى، طلبات اختبار حقيقية، تدريب الفريق، توثيق، و3 شهور صيانة بعد الإطلاق.",
        },
      },
    ],
    icon: "shopping-cart",
    order: 1,
    hero_image_url: `${PUBLIC_BASE}/services/ecommerce.webp`,
    title: {
      en: "E-commerce shops built to sell",
      ar: "متاجر إلكترونية مبنية عشان تبيع",
    },
    tagline: { en: "Most requested", ar: "الأكثر طلبًا" },
    duration: { en: "5–8 weeks", ar: "5–8 أسابيع" },
    summary: {
      en: "Fast product pages, one-step checkout, local payment and shipping, and a dashboard your team can actually run.",
      ar: "صفحات منتجات سريعة، شراء في خطوة واحدة، دفع وشحن محلي، ولوحة تحكم فريقك يقدر يشغّلها فعلًا.",
    },
    intro: {
      en: "For retail and fashion brands going online properly — or moving off a template that caps their growth. We design the storefront, structure the catalogue, wire the payments and shipping, and hand you a dashboard with the training to use it.",
      ar: "للعلامات التجارية في التجزئة والأزياء اللي عايزة تنزل أونلاين صح — أو تسيب قالب جاهز بيحدّد نموّها. بنصمم المتجر، ونرتّب الكتالوج، ونربط الدفع والشحن، ونسلّمك لوحة تحكم مع تدريب عليها.",
    },
    deliverables: {
      en: [
        "Brand-led storefront design, desktop and mobile",
        "Catalogue structure, variants and search",
        "One-step checkout, local payment and shipping",
        "Arabic / English with full RTL",
        "Abandoned-cart and WhatsApp order flows",
        "Team training, docs, three months of care",
      ],
      ar: [
        "تصميم متجر معبّر عن العلامة، على الكمبيوتر والموبايل",
        "ترتيب الكتالوج والمتغيرات والبحث",
        "شراء في خطوة واحدة مع دفع وشحن محلي",
        "عربي / إنجليزي بدعم RTL كامل",
        "متابعة السلات المتروكة وطلبات واتساب",
        "تدريب الفريق، توثيق، و3 شهور صيانة",
      ],
    },
    pain_points: {
      en: [
        "Half our catalogue is buried and never gets seen",
        "People add to cart and never finish checkout",
        "We take orders in DMs and lose track of them",
        "The store is slow on mobile data",
        "Arabic looks broken on our current template",
        "We can't edit products without calling a developer",
      ],
      ar: [
        "نص الكتالوج مدفون ومحدش بيشوفه",
        "الناس بتضيف للسلة وما بتكمّلش الشراء",
        "بناخد الطلبات في الرسايل وبتضيع مننا",
        "المتجر بطيء على بيانات الموبايل",
        "العربي شكله باظ في القالب الحالي",
        "مش بنقدر نعدّل منتج من غير ما نكلّم مبرمج",
      ],
    },
    types: [
      { title: { en: "Fashion and lifestyle storefronts", ar: "متاجر أزياء ولايف ستايل" }, icon: "shopping-cart" },
      { title: { en: "Catalogue-heavy retail", ar: "تجزئة بكتالوج كبير" }, icon: "building" },
      { title: { en: "Replatforming off a template", ar: "الانتقال من قالب جاهز" }, icon: "rocket" },
      { title: { en: "Payment and shipping integrations", ar: "ربط الدفع والشحن" }, icon: "plug" },
    ],
    differentiators: {
      en: [
        "Built around collections, not raw SKUs",
        "Local payment and cash on delivery wired in",
        "Arabic RTL designed in, not bolted on",
        "Three months of care included after launch",
      ],
      ar: [
        "مبني حول المجموعات، مش مجرد أكواد منتجات",
        "دفع محلي والدفع عند الاستلام متربوطين من الأول",
        "العربي و RTL مصممين من الأساس، مش ملزوقين",
        "3 شهور صيانة مشمولة بعد الإطلاق",
      ],
    },
  },
  {
    slug: "automation",
    process: [
      {
        title: { en: "Map the work", ar: "رسم خريطة الشغل" },
        body: {
          en: "We sit with the team and follow one real process end to end, counting the hours it currently costs.",
          ar: "بنقعد مع الفريق ونتابع عملية حقيقية من أولها لآخرها، وبنحسب كام ساعة بتاخد دلوقتي.",
        },
      },
      {
        title: { en: "Design the flow", ar: "تصميم المسار" },
        body: {
          en: "You see the new flow on paper — what triggers it, what it decides, and where a human still steps in.",
          ar: "بتشوف المسار الجديد على الورق — إيه اللي بيشغّله، وبيقرر إيه، وفين لسه محتاج تدخل بشري.",
        },
      },
      {
        title: { en: "Build & connect", ar: "التنفيذ والربط" },
        body: {
          en: "We wire your tools together — WhatsApp, CRM, sheets, invoicing — and run it beside the manual process until it matches.",
          ar: "بنربط أدواتك ببعض — واتساب، CRM، الشيتات، الفواتير — وبنشغّله جنب الطريقة اليدوية لحد ما يطابقها.",
        },
      },
      {
        title: { en: "Run & measure", ar: "التشغيل والقياس" },
        body: {
          en: "It goes live with monitoring, and we report the hours it actually saved so the return is a number, not a promise.",
          ar: "بيشتغل مع مراقبة، وبنقولك وفّر كام ساعة فعلًا — فالعائد رقم مش وعد.",
        },
      },
    ],
    icon: "bolt",
    order: 4,
    duration: { en: "scoped", ar: "حسب النطاق" },
    hero_image_url: `${PUBLIC_BASE}/services/automation.webp`,
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
    process: [
      {
        title: { en: "Positioning & structure", ar: "تحديد الرسالة والهيكل" },
        body: {
          en: "We agree who the site is for and what it must make them do, then map the pages around that.",
          ar: "بنتفق الموقع موجّه لمين وإيه المطلوب إن الزائر يعمله، وبعدين نرتّب الصفحات حوالين ده.",
        },
      },
      {
        title: { en: "Copy & design", ar: "المحتوى والتصميم" },
        body: {
          en: "Messaging and clickable screens in English and Arabic together, so the words and the layout are approved as one thing.",
          ar: "الرسائل والشاشات القابلة للضغط بالعربي والإنجليزي مع بعض، فبتوافق على الكلام والتصميم كوحدة واحدة.",
        },
      },
      {
        title: { en: "Build, SEO & speed", ar: "التنفيذ والسيو والسرعة" },
        body: {
          en: "Production build on a stack that ranks and loads fast, with a CMS your team can edit without calling us.",
          ar: "تنفيذ على ستاك بيظهر في البحث وبيحمّل بسرعة، مع لوحة تحكم فريقك يقدر يعدّل منها من غير ما يكلمنا.",
        },
      },
      {
        title: { en: "Launch & measure", ar: "الإطلاق والقياس" },
        body: {
          en: "Analytics wired in from day one so you can see which pages actually bring enquiries.",
          ar: "ربط التحليلات من أول يوم عشان تشوف أنهي صفحات بتجيب استفسارات فعلًا.",
        },
      },
    ],
    icon: "globe",
    order: 2,
    duration: { en: "4–6 weeks", ar: "4–6 أسابيع" },
    hero_image_url: `${PUBLIC_BASE}/services/web-development.webp`,
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
    process: [
      {
        title: { en: "Product scope", ar: "تحديد نطاق المنتج" },
        body: {
          en: "We cut the idea down to the version worth shipping first, and write what it does, what it costs and when it lands.",
          ar: "بنقلّل الفكرة لأول نسخة تستاهل تنزل، ونكتب بتعمل إيه وبكام وهتنزل إمتى.",
        },
      },
      {
        title: { en: "Design & prototype", ar: "التصميم والنموذج" },
        body: {
          en: "Full screens plus a clickable prototype you can hand to a real user before we build anything.",
          ar: "شاشات كاملة ونموذج قابل للضغط تقدر تجرّبه على مستخدم حقيقي قبل ما نبني حاجة.",
        },
      },
      {
        title: { en: "Build & integrations", ar: "التنفيذ والربط" },
        body: {
          en: "One codebase for iOS and Android with auth, push, payments and offline. Weekly builds you can install on your phone.",
          ar: "كود واحد لـ iOS وأندرويد مع تسجيل الدخول والإشعارات والدفع والعمل أوفلاين. ونسخ أسبوعية تقدر تنزّلها على موبايلك.",
        },
      },
      {
        title: { en: "Store release & monitoring", ar: "النشر والمتابعة" },
        body: {
          en: "We handle App Store and Google Play submission, then keep crash reporting and analytics running after launch.",
          ar: "بنتولى رفع التطبيق على App Store وجوجل بلاي، وبنكمّل متابعة الأعطال والتحليلات بعد الإطلاق.",
        },
      },
    ],
    icon: "phone",
    order: 3,
    duration: { en: "8–14 weeks", ar: "8–14 أسبوع" },
    hero_image_url: `${PUBLIC_BASE}/services/mobile-apps.webp`,
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
    process: [
      {
        title: { en: "Onboarding audit", ar: "مراجعة البداية" },
        body: {
          en: "We take stock of what you have — hosting, domains, dependencies, backups — and fix whatever is already at risk.",
          ar: "بنراجع اللي عندك — استضافة ودومينات ومكتبات ونسخ احتياطية — وبنصلّح أي حاجة في خطر من دلوقتي.",
        },
      },
      {
        title: { en: "Monitoring & backups", ar: "المراقبة والنسخ الاحتياطي" },
        body: {
          en: "Uptime checks and automated backups run continuously, so a problem reaches us before it reaches your customers.",
          ar: "فحص التشغيل والنسخ الاحتياطي بيشتغلوا باستمرار، فالمشكلة بتوصلنا قبل ما توصل لعملائك.",
        },
      },
      {
        title: { en: "Updates & patches", ar: "التحديثات والترقيعات" },
        body: {
          en: "Framework and security updates applied on a schedule, tested on staging before they touch the live site.",
          ar: "تحديثات الأنظمة والأمان بتتطبق بجدول، وبتتجرّب على staging قبل ما تلمس الموقع الفعلي.",
        },
      },
      {
        title: { en: "Monthly report & improvements", ar: "تقرير شهري وتحسينات" },
        body: {
          en: "One report covering uptime and performance, plus a fixed allowance of hours for the changes you want next.",
          ar: "تقرير واحد بيغطي التشغيل والأداء، مع عدد ساعات ثابت للتعديلات اللي عايزها بعد كده.",
        },
      },
    ],
    icon: "shield-check",
    order: 5,
    duration: { en: "monthly", ar: "شهري" },
    hero_image_url: `${PUBLIC_BASE}/services/maintenance.webp`,
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
    duration: c.duration?.[locale],
  }
}

function detail(c: ServiceContent, locale: V1Locale): ServiceDetail {
  return {
    ...summary(c, locale),
    intro: c.intro[locale],
    hero_image_url: c.hero_image_url,
    pain_points: c.pain_points?.[locale],
    types: c.types?.map((t) => ({ title: t.title[locale], icon: t.icon })),
    process: c.process?.map((x) => ({ title: x.title[locale], body: x.body[locale] })),
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
