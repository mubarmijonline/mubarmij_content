import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getClients } from "@/lib/v1";
import { CTAPanel, Reveal, SectionEyebrow } from "@/components/system";
import CaseStudiesGrid from "@/components/case-studies/CaseStudiesGrid";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Our work",
    title: "Case studies that earned their keep",
    sub: "Real products we designed, built, and shipped — apps, platforms, and automations that move the numbers that matter.",
    ctaTitle: "Want results like these?",
    ctaSub: "Tell us about your project and we'll map the fastest path to launch.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I saw your case studies and want to discuss a project.",
  },
  ar: {
    eyebrow: "أعمالنا",
    title: "دراسات حالة أثبتت نفسها",
    sub: "منتجات حقيقية صمّمناها وبنيناها وأطلقناها — تطبيقات ومنصّات وأتمتة بتحرّك الأرقام اللي تهمّك.",
    ctaTitle: "عايز نتايج زي دي؟",
    ctaSub: "احكيلنا عن مشروعك وهنرسم أسرع طريق للإطلاق.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! شُفت دراسات الحالة وحابب أناقش مشروع.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = "/case-studies";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: {
        en: `${SITE_URL}${path}`,
        ar: `${SITE_URL}/ar${path}`,
        "x-default": `${SITE_URL}${path}`,
      },
    },
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const env = await getClients(locale, { limit: 60 });
  const clients = (env?.data ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:py-28">
          <Reveal>
            <SectionEyebrow className="justify-center">{t.eyebrow}</SectionEyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-4 text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-cream">
              {t.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-bodydark sm:text-lg">
              {t.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <CaseStudiesGrid locale={locale} clients={clients} />
        </div>
      </section>

      <CTAPanel
        title={t.ctaTitle}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={t.waMsg}
      />
    </>
  );
}
