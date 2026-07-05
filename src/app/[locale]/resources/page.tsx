import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getResources } from "@/lib/v1";
import { CTAPanel, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";
import LeadMagnet from "@/components/home/LeadMagnet";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Free resources",
    title: "Guides to help you ship smarter",
    sub: "Practical playbooks and checklists from real projects — no fluff, no email wall unless noted.",
    download: "Download PDF",
    open: "Open",
    pdfBadge: "Free · PDF",
    pdfTitle: "10 Mistakes That Slow Down Your Software Project",
    pdfDesc: "The most common — and most expensive — mistakes we see, and how to avoid them before they cost you months.",
    moreSoon: "More guides are on the way.",
    ctaTitle: "Want this applied to your business?",
    ctaSub: "Book a free call and we'll turn the playbook into a plan for your team.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I downloaded a guide and want to discuss applying it.",
  },
  ar: {
    eyebrow: "مصادر مجانية",
    title: "أدلة تساعدك تشتغل بذكاء",
    sub: "بلايبوكس وتشيك ليستس عملية من مشاريع حقيقية — من غير حشو ولا حاجز إيميل إلا لو مكتوب.",
    download: "حمّل الـ PDF",
    open: "افتح",
    pdfBadge: "مجاني · PDF",
    pdfTitle: "10 أخطاء بتبطّأ مشروع السوفت وير بتاعك",
    pdfDesc: "أكتر الأخطاء شيوعًا — وأغلاها — اللي بنشوفها، وإزاي تتجنّبها قبل ما تكلّفك شهور.",
    moreSoon: "أدلة تانية في الطريق.",
    ctaTitle: "عايز تطبّق ده على شغلك؟",
    ctaSub: "احجز مكالمة مجانية وهنحوّل البلايبوك لخطة لفريقك.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! حمّلت دليل وحابب أناقش تطبيقه.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = "/resources";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const resources = await getResources(locale);

  return (
    <>
      {/* Hero — dark */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-28">
          <Reveal>
            <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
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

      {/* Resource grid — light */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured static PDF guide */}
            <StaggerItem className="flex flex-col rounded-tile border border-gold/60 bg-white p-6 shadow-sm">
              <span className="inline-flex w-fit items-center rounded-pill bg-gold/15 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-gold-dim">
                {t.pdfBadge}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy-deep">{t.pdfTitle}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{t.pdfDesc}</p>
              <a
                href="/resources/10-mistakes-en.pdf"
                download
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-pill bg-gold px-5 py-2.5 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold"
              >
                {t.download}
                <span aria-hidden>↓</span>
              </a>
            </StaggerItem>

            {/* CMS-backed resources */}
            {resources.map((r) => {
              const cover = cmsMedia(r.cover_image_url);
              return (
                <StaggerItem
                  key={r.slug}
                  className="flex flex-col overflow-hidden rounded-tile border border-neutral-200 bg-white shadow-sm"
                >
                  {cover ? (
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">{r.type}</span>
                    <h3 className="mt-2 text-lg font-semibold text-navy-deep">{r.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{r.description}</p>
                    {r.pdf_url ? (
                      <a
                        href={cmsMedia(r.pdf_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy hover:text-gold focus-gold"
                      >
                        {r.requires_email ? t.open : t.download}
                        <span aria-hidden>→</span>
                      </a>
                    ) : null}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <p className="mt-10 text-center text-sm text-neutral-400">{t.moreSoon}</p>
        </div>
      </section>

      {/* Email capture — dark */}
      <LeadMagnet locale={locale} />

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
