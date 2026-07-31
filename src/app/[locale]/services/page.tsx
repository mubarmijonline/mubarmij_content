import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { getService, getServices } from "@/lib/v1";
import { localePath, whatsappLink } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import {
  CTAPanel,
  DarkButton,
  HairCell,
  HairGrid,
  ImageWell,
  MonoChip,
  SectionEyebrow,
  Shell,
  SlashList,
  StatCell,
  hasStat,
} from "@/components/system";
import { Arrow, GoldPeriod, LinkArrow } from "@/components/system/Typo";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Services",
    title: "Four ways we get hired",
    lede: "Every engagement starts the same way: a scope document with a fixed price, a date, and the list of what we need from you.",
    included: "What's included",
    timeline: "Timeline",
    investment: "Investment",
    investmentValue: "Scoped per project",
    quote: "Get a quote on WhatsApp",
    quoteMsg: (title: string) => `Hi MubarmiJ — I want a quote for: ${title}`,
    careTitle: "Care & retainer",
    more: "Read more",
    cta: "Tell us what you sell. We'll tell you what to build",
    ctaSub: "One 30-minute call, then a written scope with a fixed price and a date. No retainer to talk.",
    ctaLabel: "Book a call",
    waLabel: "Message us on WhatsApp",
    waMsg: "Hi MubarmiJ — I'd like to discuss a project.",
  },
  ar: {
    eyebrow: "خدماتنا",
    title: "أربع طرق بتشتغل بيها معانا",
    lede: "كل تعاون بيبدأ بنفس الطريقة: مستند نطاق فيه سعر ثابت وتاريخ تسليم وقائمة باللي محتاجينه منك.",
    included: "اللي بيتسلّم",
    timeline: "المدة",
    investment: "الاستثمار",
    investmentValue: "بيتحدّد حسب المشروع",
    quote: "اطلب عرض سعر على واتساب",
    quoteMsg: (title: string) => `أهلاً مبرمج — عايز عرض سعر لـ: ${title}`,
    careTitle: "الصيانة والدعم",
    more: "اقرأ أكتر",
    cta: "قولنا بتبيع إيه، ونقولك تبني إيه",
    ctaSub: "مكالمة 30 دقيقة، وبعدها نطاق مكتوب بسعر ثابت وتاريخ. الكلام مش بفلوس.",
    ctaLabel: "احجز مكالمة",
    waLabel: "كلمنا على واتساب",
    waMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = locale === "en" ? "/services" : "/ar/services";
  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: path,
      languages: {
        en: `${SITE_URL}/services`,
        ar: `${SITE_URL}/ar/services`,
        "x-default": `${SITE_URL}/services`,
      },
    },
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const services = await getServices(locale);
  const ordered = services.slice().sort((a, b) => a.order - b.order);

  // Maintenance gets its own "Care & retainer" block at the foot of the page,
  // so it must be filtered out of the grid or it renders twice.
  const care = ordered.find((s) => s.slug === "maintenance") ?? null;
  const sellable = ordered.filter((s) => s.slug !== "maintenance");
  const [flagship, ...rest] = sellable;

  // Only the flagship needs its full record (deliverables list + hero image).
  const flagshipDetail = flagship ? await getService(flagship.slug, locale) : null;

  return (
    <>
      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1 className="mt-3.5 max-w-[14em] font-display text-d1 font-bold text-fg">
            {t.title}
            <GoldPeriod />
          </h1>
          <p className="mt-5 max-w-[40em] text-lede text-fgbody">{t.lede}</p>
        </Shell>
      </section>

      {flagship && flagshipDetail ? (
        <section className="surf-light border-b border-hair">
          <Shell className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-hair py-14 lg:border-e lg:pe-12">
              <SectionEyebrow index="01">{flagship.tagline || t.eyebrow}</SectionEyebrow>
              <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">{flagship.title}</h2>
              <p className="mt-4 max-w-[34em] text-copy text-fgbody">
                {flagshipDetail.intro || flagship.summary}
              </p>
              <div className="mt-8 overflow-hidden rounded-card border border-hair">
                <ImageWell
                  src={flagshipDetail.hero_image_url}
                  alt={flagship.title}
                  height={260}
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>

            <div className="py-14 lg:ps-12">
              <div className="mono text-eyebrow uppercase text-accent">{t.included}</div>
              <SlashList className="mt-5" items={flagship.deliverables ?? []} />

              <HairGrid cols={2} className="mt-9 border-t border-hair">
                <HairCell className="border-b-0 pt-6">
                  <StatCell
                    kind="text"
                    value={flagship.duration ?? null}
                    label={t.timeline}
                  />
                </HairCell>
                <HairCell className="border-b-0 pt-6">
                  <StatCell kind="text" value={t.investmentValue} label={t.investment} />
                </HairCell>
              </HairGrid>

              <div className="mt-9 flex flex-wrap gap-3">
                <DarkButton size="lg" external href={whatsappLink(t.quoteMsg(flagship.title))}>
                  {t.quote}
                  <Arrow locale={locale} />
                </DarkButton>
                <LinkArrow href={localePath(locale, `/services/${flagship.slug}`)} locale={locale}>
                  {t.more}
                </LinkArrow>
              </div>
            </div>
          </Shell>
        </section>
      ) : null}

      {rest.length ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect">
            <HairGrid cols={1} mdCols={rest.length >= 3 ? 3 : 2} className="border-t border-hair">
              {rest.map((s, i) => (
                <HairCell key={s.slug} className="py-8">
                  <div className="mono ltr-island text-eyebrow text-accent">
                    {String(i + 2).padStart(2, "0")}
                  </div>
                  <h2 className="mt-3 font-display text-[24px] font-semibold tracking-[-0.02em] text-fg">
                    {s.title}
                  </h2>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-fgbody">{s.summary}</p>
                  <SlashList className="mt-5" items={(s.deliverables ?? []).slice(0, 4)} />
                  {s.duration ? (
                    <div className="mono mt-6 text-[11px] uppercase text-fgmuted">{s.duration}</div>
                  ) : null}
                  <div className="mt-4">
                    <LinkArrow href={localePath(locale, `/services/${s.slug}`)} locale={locale}>
                      {t.more}
                    </LinkArrow>
                  </div>
                </HairCell>
              ))}
            </HairGrid>
          </Shell>
        </section>
      ) : null}

      {care ? (
        <section className="surf-subtle border-b border-hair">
          <Shell className="sect grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-d2 font-bold text-fg">
                {t.careTitle}
                <GoldPeriod />
              </h2>
              <p className="mt-4 max-w-[36em] text-copy text-fgbody">{care.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(care.deliverables ?? []).slice(0, 4).map((d) => (
                  <MonoChip key={d}>{d}</MonoChip>
                ))}
              </div>
              <div className="mt-6">
                <LinkArrow href={localePath(locale, `/services/${care.slug}`)} locale={locale}>
                  {t.more}
                </LinkArrow>
              </div>
            </div>

            {hasStat(care.duration) || care.tagline ? (
              <HairGrid cols={2} className="self-start border-t border-hair">
                {care.duration ? (
                  <HairCell className="border-b-0 pt-6">
                    <StatCell kind="text" value={care.duration} label={t.timeline} />
                  </HairCell>
                ) : null}
                {care.tagline ? (
                  <HairCell className="border-b-0 pt-6">
                    <StatCell kind="text" value={care.tagline} label={t.eyebrow} />
                  </HairCell>
                ) : null}
              </HairGrid>
            ) : null}
          </Shell>
        </section>
      ) : null}

      <CTAPanel
        title={t.cta}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={t.waMsg}
      />
    </>
  );
}
