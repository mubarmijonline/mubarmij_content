import type { V1Locale } from "../helpers/locale"

export type FaqItem = { id: string; question: string; answer: string; order: number }

type Bilingual = { en: string; ar: string }
type FaqSeed = { id: string; q: Bilingual; a: Bilingual }

const FAQ: FaqSeed[] = [
  {
    id: "site-vs-app",
    q: {
      en: "What's the difference between a website and an app? When do I need each?",
      ar: "إيه الفرق بين الموقع والتطبيق؟ وإمتى أحتاج كل منهما؟",
    },
    a: {
      en: "A website is the entry point for any customer via a browser; an app suits returning customers needing a tailored experience (notifications, offline use, etc.).",
      ar: "الموقع هو نقطة الدخول لأي عميل من المتصفح؛ التطبيق مناسب للعملاء المتكررين اللي محتاجين تجربة مخصصة (إشعارات، استخدام بدون نت، إلخ).",
    },
  },
  {
    id: "pricing",
    q: { en: "Why are your prices higher than freelancers?", ar: "ليه أسعاركم أعلى من الـ Freelancers؟" },
    a: {
      en: "You get a full team — developer, designer, PM, QA — plus a clear warranty and ongoing support after delivery.",
      ar: "بتحصل على فريق كامل — مطور ومصمم ومدير مشروع وفريق جودة — مع ضمان واضح ودعم مستمر بعد التسليم.",
    },
  },
  {
    id: "timeline",
    q: { en: "How long does a full website take?", ar: "الموقع الكامل بياخد قد إيه؟" },
    a: { en: "Usually 4–8 weeks depending on the scope.", ar: "عادةً 4–8 أسابيع حسب حجم المشروع." },
  },
  {
    id: "post-launch",
    q: { en: "Do you offer post-launch maintenance?", ar: "بتقدّموا صيانة بعد الإطلاق؟" },
    a: {
      en: "Yes — 3 months free, then EGP 1,500/month or a custom retainer.",
      ar: "نعم — 3 شهور مجانًا، وبعدها 1,500 ج.م. شهريًا أو عقد مخصص.",
    },
  },
  {
    id: "payments",
    q: { en: "How do payments work?", ar: "إزاي بتشتغل المدفوعات؟" },
    a: {
      en: "40% upfront, 30% at the milestone, 30% on delivery.",
      ar: "40% مقدم، 30% عند الـ Milestone، 30% عند التسليم.",
    },
  },
  {
    id: "remote",
    q: {
      en: "Do you work with companies in other cities or countries?",
      ar: "بتشتغلوا مع شركات في مدن أو دول تانية؟",
    },
    a: {
      en: "Yes — we work remotely across Egypt and the Gulf.",
      ar: "نعم — بنشتغل عن بُعد في كل مصر والخليج.",
    },
  },
  {
    id: "automation-when",
    q: { en: "What is automation, and when do I need it?", ar: "إيه هي الأتمتة وإمتى محتاجها؟" },
    a: {
      en: "Automation = systems doing repetitive work (10+ weekly tasks like data entry, replies, or reports). If your team copies-pastes data daily, you need it.",
      ar: "الأتمتة = أنظمة بتعمل الشغل المتكرر (10+ مهام أسبوعية زي إدخال البيانات أو الردود أو التقارير). لو فريقك بينسخ بيانات كل يوم، أنت محتاجها.",
    },
  },
  {
    id: "portfolio",
    q: { en: "Can I see your past work?", ar: "أقدر أشوف شغلكم السابق؟" },
    a: {
      en: "Yes — see the Case Studies section in the app or on our website.",
      ar: "نعم — شوف قسم Case Studies في التطبيق أو على موقعنا.",
    },
  },
  {
    id: "tech-stack",
    q: { en: "What technologies do you use?", ar: "إيه التقنيات اللي بتستخدموها؟" },
    a: {
      en: "Next.js, Node.js, PostgreSQL, Flutter, AWS, Cloudflare, n8n, Make.com, and more depending on the use case.",
      ar: "Next.js، Node.js، PostgreSQL، Flutter، AWS، Cloudflare، n8n، Make.com وغيرها حسب الاحتياج.",
    },
  },
  {
    id: "satisfaction",
    q: {
      en: "What's the policy if I don't like the work?",
      ar: "إيه السياسة لو الشغل مش عاجبني؟",
    },
    a: {
      en: "Iterations are built into every milestone, with reviews before sign-off so we catch issues early.",
      ar: "بنبني تعديلات في كل Milestone مع مراجعة قبل الاعتماد عشان نمسك أي مشكلة بدري.",
    },
  },
  {
    id: "hosting",
    q: { en: "Do you help with hosting and domain?", ar: "بتساعدوا في الاستضافة والدومين؟" },
    a: {
      en: "Yes — included free for the first year on the Starter plan.",
      ar: "نعم — مجانًا في السنة الأولى ضمن باقة Starter.",
    },
  },
  {
    id: "training",
    q: { en: "Do you offer training after delivery?", ar: "بتقدّموا تدريب بعد التسليم؟" },
    a: {
      en: "Yes — handover session, written docs, and recorded videos.",
      ar: "نعم — جلسة تسليم وتوثيق مكتوب وفيديوهات مسجلة.",
    },
  },
]

export function listFaq(locale: V1Locale): FaqItem[] {
  return FAQ.map((f, i) => ({
    id: f.id,
    question: f.q[locale],
    answer: f.a[locale],
    order: i + 1,
  }))
}
