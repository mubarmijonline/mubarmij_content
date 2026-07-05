import type { V1Locale } from "../helpers/locale"

type Bilingual = { en: string; ar: string }

const ABOUT: {
  tagline: Bilingual
  story: Bilingual
  mission: Bilingual
  values: { title: Bilingual; body: Bilingual }[]
  expertise: { name: Bilingual; level: number }[]
  tech_stack: string[]
  stats: { projects: number; customers: number; years: number; support: string }
  contact: { phone: string; email: string; address: Bilingual; hours: Bilingual }
} = {
  tagline: {
    en: "Passionate developers building the future of software",
    ar: "مطورون شغوفون يبنون مستقبل البرمجيات",
  },
  story: {
    en: "Founded with a vision to transform Egyptian and Gulf SMEs through working software — automation, websites, and apps that actually move the needle.",
    ar: "اتأسسنا برؤية إن نحوّل شركات الـ SMEs في مصر والخليج عن طريق برمجيات شغّالة — أتمتة ومواقع وتطبيقات بتفرق فعلًا.",
  },
  mission: {
    en: "Empowering businesses with technology — free teams from manual, repetitive work and let them focus on what grows the business.",
    ar: "تمكين الشركات بالتكنولوجيا — تحرير الفِرَق من الشغل اليدوي المتكرر وتركيزها على اللي بينمّي الشغل.",
  },
  values: [
    { title: { en: "Innovation", ar: "ابتكار" }, body: { en: "We pick the right tool for the job, not the trendiest one.", ar: "بنختار الأداة الصح للمهمة، مش الترند." } },
    { title: { en: "Partnership", ar: "شراكة" }, body: { en: "One accountable team — designers, developers, PMs, QA — all under one roof.", ar: "فريق واحد مسؤول — مصممين ومطورين ومديرين ومراقبين جودة — كلهم تحت سقف واحد." } },
    { title: { en: "Excellence", ar: "تميّز" }, body: { en: "We ship measurable results — speed, conversions, hours saved.", ar: "بنسلّم نتائج قابلة للقياس — سرعة، تحويلات، ساعات موفّرة." } },
    { title: { en: "Integrity", ar: "نزاهة" }, body: { en: "Transparent pricing, honest timelines, no surprise invoices.", ar: "أسعار شفافة، مواعيد صادقة، مفيش فواتير مفاجئة." } },
  ],
  expertise: [
    { name: { en: "Web Development", ar: "تطوير الويب" }, level: 95 },
    { name: { en: "Mobile App Development", ar: "تطوير تطبيقات الموبايل" }, level: 90 },
    { name: { en: "Cloud & DevOps", ar: "السحابة والـ DevOps" }, level: 85 },
    { name: { en: "UI/UX Design", ar: "تصميم واجهات وتجربة المستخدم" }, level: 88 },
  ],
  tech_stack: ["React", "Node.js", "Python", "AWS", "Docker", "Flutter", "JavaScript", "Swift"],
  stats: { projects: 50, customers: 50, years: 5, support: "24/7" },
  contact: {
    phone: "+201200588803",
    email: "info@mubarmijonline.com",
    address: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
    hours: { en: "Sunday – Thursday, 10:00 – 18:00 (Cairo time)", ar: "الأحد – الخميس، 10:00 – 18:00 (توقيت القاهرة)" },
  },
}

export function getAbout(locale: V1Locale) {
  return {
    tagline: ABOUT.tagline[locale],
    story: ABOUT.story[locale],
    mission: ABOUT.mission[locale],
    values: ABOUT.values.map((v) => ({ title: v.title[locale], body: v.body[locale] })),
    expertise: ABOUT.expertise.map((e) => ({ name: e.name[locale], level: e.level })),
    tech_stack: ABOUT.tech_stack,
    stats: ABOUT.stats,
    contact: {
      phone: ABOUT.contact.phone,
      email: ABOUT.contact.email,
      address: ABOUT.contact.address[locale],
      hours: ABOUT.contact.hours[locale],
    },
  }
}
