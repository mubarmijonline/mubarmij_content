import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getResources } from "@/lib/v1";
import { CTAPanel, ImageWell, MonoChip, SectionEyebrow, Shell } from "@/components/system";
import { Arrow, GoldPeriod } from "@/components/system/Typo";
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

      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Featured guide — a static PDF, not a CMS record. */}
            <div className="flex flex-col rounded-card border border-gold bg-surface p-6">
              <MonoChip className="w-fit border-gold text-gold-deep">{t.pdfBadge}</MonoChip>
              <h2 className="mt-4 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                {t.pdfTitle}
              </h2>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-fgbody">{t.pdfDesc}</p>
              <a
                href="/resources/10-mistakes-en.pdf"
                download
                className="focus-gold mt-6 inline-flex w-fit items-center gap-2 rounded-btn bg-ink px-5 py-3 font-display text-[14.5px] font-semibold text-white transition-colors hover:bg-gold hover:text-ink"
              >
                {t.download}
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {resources.map((r) => (
              <div
                key={r.slug}
                className="flex flex-col overflow-hidden rounded-card border border-hair bg-surface"
              >
                <ImageWell
                  src={r.cover_image_url}
                  alt={r.title}
                  ratio="16 / 10"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
                <div className="flex flex-1 flex-col p-6">
                  <span className="mono text-eyebrow uppercase text-fgmuted">{r.type}</span>
                  <h2 className="mt-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                    {r.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-fgbody">
                    {r.description}
                  </p>
                  {r.pdf_url ? (
                    <a
                      href={cmsMedia(r.pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono focus-gold mt-5 inline-flex items-center gap-2 text-[11px] uppercase text-fgmuted transition-colors hover:text-gold-deep"
                    >
                      {r.requires_email ? t.open : t.download}
                      <Arrow locale={locale} />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <p className="mono mt-10 text-[11px] uppercase text-fgfaint">{t.moreSoon}</p>
        </Shell>
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
