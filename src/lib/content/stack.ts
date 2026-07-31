/**
 * Technology stack shown in the "02 — Stack" band.
 *
 * This is brand copy, not CMS data: `about.tech_stack` is eight flat strings,
 * which cannot fill five labelled columns. Tool names stay English in both
 * locales (SPEC: technical terms are not translated); only the group labels
 * and the surrounding prose are localized.
 */

export type StackGroup = { label: { en: string; ar: string }; items: string[] };

export const STACK: StackGroup[] = [
  {
    label: { en: "Front-end", ar: "الواجهة الأمامية" },
    items: [
      "React",
      "Next.js",
      "Vue",
      "TypeScript",
      "Tailwind CSS",
      "SCSS",
      "Vite",
      "GSAP",
    ],
  },
  {
    label: { en: "Mobile", ar: "الموبايل" },
    items: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
  },
  {
    label: { en: "Back-end", ar: "الواجهة الخلفية" },
    items: ["Node.js", "NestJS", "Laravel", "Django", "GraphQL", "REST"],
  },
  {
    label: { en: "Infra & DevOps", ar: "البنية التحتية و DevOps" },
    items: ["Nginx", "Docker", "AWS", "Cloudflare", "GitHub Actions", "Ubuntu", "Redis"],
  },
  {
    label: { en: "Data & automation", ar: "البيانات والأتمتة" },
    items: ["PostgreSQL", "MySQL", "MongoDB", "n8n", "WhatsApp API", "Meta Pixel"],
  },
];

export const STACK_COPY = {
  en: {
    eyebrow: "Stack",
    title: "Modern front-end, production infrastructure",
    lede: "We choose per project, not per habit — then deploy and run it ourselves behind hardened Nginx, so performance and uptime stay our responsibility.",
  },
  ar: {
    eyebrow: "التقنيات",
    title: "واجهات حديثة وبنية تحتية جاهزة للإنتاج",
    lede: "بنختار التقنية حسب المشروع، مش حسب العادة — وبعدين بننشرها وبنشغّلها بنفسنا خلف Nginx مؤمّن، عشان السرعة والاستقرار يفضلوا مسؤوليتنا.",
  },
} as const;
