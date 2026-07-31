import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getReels } from "@/lib/v1";
import { CTAPanel, EmptyState, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";
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

  const reelsEnv = await getReels(locale, { page_size: 48 });
  const reels = reelsEnv?.data ?? [];

  return (
    <>
      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1 className="mt-3.5 max-w-[16em] font-display text-d1 font-bold text-fg">
            {t.title}
            <GoldPeriod />
          </h1>
          <p className="mt-5 max-w-[40em] text-lede text-fgbody">{t.sub}</p>
        </Shell>
      </section>

      {reels.length ? (
        <ReelsRow locale={locale} reels={reels} hideHeader />
      ) : (
        <section className="surf-light border-b border-hair">
          <Shell className="sect">
            <EmptyState
              locale={locale}
              title={t.title}
              body={t.empty}
              ctaHref={localePath(locale, "/case-studies")}
              ctaLabel={t.emptyCta}
            />
          </Shell>
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
