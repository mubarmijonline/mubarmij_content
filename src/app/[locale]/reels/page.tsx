import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getReels } from "@/lib/v1";
import { CTAPanel, Reveal, SectionEyebrow } from "@/components/system";
import ReelsRow from "@/components/reels/ReelsRow";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Reels",
    title: "See the work in motion",
    sub: "Short clips of the automations, apps, and systems we build — straight from real client projects.",
    empty: "New reels are dropping soon. In the meantime, explore our case studies.",
    emptyCta: "Browse case studies",
    ctaTitle: "Like what you see?",
    ctaSub: "Book a free call and let's build something worth filming.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I saw your reels and want to discuss a project.",
  },
  ar: {
    eyebrow: "ريلز",
    title: "شوف الشغل وهو شغّال",
    sub: "مقاطع قصيرة للأتمتة والتطبيقات والأنظمة اللي بنبنيها — من مشاريع عملاء حقيقية.",
    empty: "ريلز جديدة قرّبت تنزل. لحد كده، اتفرّج على دراسات الحالة.",
    emptyCta: "تصفّح دراسات الحالة",
    ctaTitle: "عجبك اللي شُفته؟",
    ctaSub: "احجز مكالمة مجانية وخلّينا نبني حاجة تستاهل التصوير.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! شُفت الريلز وحابب أناقش مشروع.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = "/reels";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function ReelsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const reelsEnv = await getReels(locale, { limit: 48 });
  const reels = reelsEnv?.data ?? [];

  return (
    <>
      <section className="bg-navy-deep px-4 pt-32 pb-10 md:pt-40 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
            <h1 className="mt-3 text-balance font-sans text-4xl font-semibold tracking-[-0.02em] text-cream md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-pretty text-lg text-bodydark">{t.sub}</p>
          </Reveal>
        </div>
      </section>

      {reels.length ? (
        <ReelsRow locale={locale} reels={reels} hideHeader />
      ) : (
        <section className="bg-navy-deep px-4 pb-24 md:pb-28">
          <div className="mx-auto max-w-6xl rounded-tile border border-line bg-panel p-10 text-center">
            <p className="text-pretty text-bodydark">{t.empty}</p>
            <a
              href={localePath(locale, "/case-studies")}
              className="mt-6 inline-flex items-center justify-center rounded-pill border border-line px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-gold/60 focus-gold"
            >
              {t.emptyCta}
            </a>
          </div>
        </section>
      )}

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
