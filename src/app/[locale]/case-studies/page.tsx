import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath, whatsappLink } from "@/lib/utils";
import { getClient, getClients } from "@/lib/v1";
import { caseStudyClients } from "@/lib/content/clients";
import {
  CTAPanel,
  DarkButton,
  HairCell,
  HairGrid,
  ImageWell,
  SectionEyebrow,
  Shell,
  StatCell,
} from "@/components/system";
import { Arrow, GoldPeriod, LinkArrow } from "@/components/system/Typo";
import CaseStudiesGrid from "@/components/case-studies/CaseStudiesGrid";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Case studies",
    title: "Work with a before and after",
    sub: "Real products we designed, built, and shipped — storefronts, apps, platforms and the systems behind them.",
    featured: "Featured",
    read: "Read the case study",
    nextEyebrow: "Next",
    nextTitle: "Your project here",
    nextBody: "We take a limited number of builds per quarter so each one gets the team it needs.",
    nextCta: "Start a conversation",
    nextMsg: "Hi MubarmiJ — I'd like to discuss a project.",
    ctaTitle: "Want results like these?",
    ctaSub: "Tell us about your project and we'll map the fastest path to launch.",
    ctaLabel: "Book a call",
    waLabel: "Message us on WhatsApp",
    waMsg: "Hi MubarmiJ! I saw your case studies and want to discuss a project.",
  },
  ar: {
    eyebrow: "دراسات الحالة",
    title: "شغل ليه قبل وبعد",
    sub: "منتجات حقيقية صمّمناها وبنيناها وأطلقناها — متاجر وتطبيقات ومنصّات والأنظمة اللي وراهم.",
    featured: "مميّز",
    read: "اقرأ دراسة الحالة",
    nextEyebrow: "التالي",
    nextTitle: "مشروعك هنا",
    nextBody: "بناخد عدد محدود من المشاريع كل ربع سنة عشان كل واحد ياخد الفريق اللي يستحقه.",
    nextCta: "ابدأ الكلام معانا",
    nextMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
    ctaTitle: "عايز نتايج زي دي؟",
    ctaSub: "احكيلنا عن مشروعك وهنرسم أسرع طريق للإطلاق.",
    ctaLabel: "احجز مكالمة",
    waLabel: "كلمنا على واتساب",
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

  const env = await getClients(locale, { page_size: 100 });
  // Drops the logo-only stubs, which have no slug to link to and would render
  // as empty tiles in the grid.
  const clients = caseStudyClients(env?.data ?? []);
  const [lead, ...others] = clients;
  const leadDetail = lead ? await getClient(lead.slug, locale) : null;

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

      {lead && leadDetail ? (
        <section className="surf-light border-b border-hair">
          <Shell className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-hair py-14 lg:border-e lg:pe-12">
              <div className="overflow-hidden rounded-card border border-hair">
                <ImageWell
                  src={leadDetail.hero_image_url || lead.thumb_url}
                  alt={lead.name}
                  height={340}
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>

            <div className="py-14 lg:ps-12">
              <SectionEyebrow>
                {t.featured} · {lead.category_label}
              </SectionEyebrow>
              <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">{lead.name}</h2>
              {leadDetail.brief || lead.tagline ? (
                <p className="mt-4 max-w-[36em] text-copy text-fgbody">
                  {leadDetail.brief || lead.tagline}
                </p>
              ) : null}

              {leadDetail.results?.length ? (
                <HairGrid cols={2} className="mt-9 border-t border-hair">
                  {leadDetail.results.slice(0, 4).map((r) => (
                    <HairCell key={r.label} className="py-6">
                      <StatCell value={r.metric} label={r.label} />
                    </HairCell>
                  ))}
                </HairGrid>
              ) : null}

              <div className="mt-9">
                <LinkArrow href={localePath(locale, `/case-studies/${lead.slug}`)} locale={locale}>
                  {t.read}
                </LinkArrow>
              </div>
            </div>
          </Shell>
        </section>
      ) : null}

      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <CaseStudiesGrid locale={locale} clients={others.length ? others : clients} />

          <div className="mt-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 rounded-card border border-hair bg-paper-subtle p-8">
            <div className="min-w-0 max-w-[32em]">
              <SectionEyebrow>{t.nextEyebrow}</SectionEyebrow>
              <h2 className="mt-3 font-display text-[26px] font-bold tracking-[-0.02em] text-fg">
                {t.nextTitle}
                <GoldPeriod />
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-fgbody">{t.nextBody}</p>
            </div>
            <DarkButton size="lg" external href={whatsappLink(t.nextMsg)}>
              {t.nextCta}
              <Arrow locale={locale} />
            </DarkButton>
          </div>
        </Shell>
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
