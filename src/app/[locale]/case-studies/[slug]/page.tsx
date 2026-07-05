import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getClient, getReels } from "@/lib/v1";
import {
  CTAPanel,
  GhostButton,
  GoldButton,
  MetricStat,
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/system";
import ScreenshotGallery, { type Shot } from "@/components/cms/ScreenshotGallery";
import ReelsRow from "@/components/reels/ReelsRow";

export const revalidate = 300;

const COPY = {
  en: {
    back: "All case studies",
    visit: "Visit live site",
    appStore: "App Store",
    playStore: "Google Play",
    overview: "Overview",
    stack: "Built with",
    services: "What we did",
    timeline: "Timeline",
    results: "The results",
    gallery: "A look inside",
    ctaTitle: "Have a project in mind?",
    ctaSub: "Let's scope it together and map the fastest path to launch.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
  },
  ar: {
    back: "كل دراسات الحالة",
    visit: "زيارة الموقع",
    appStore: "App Store",
    playStore: "Google Play",
    overview: "نظرة عامة",
    stack: "اتبنى بـ",
    services: "اللي عملناه",
    timeline: "المدة",
    results: "النتايج",
    gallery: "من جوّه المشروع",
    ctaTitle: "عندك مشروع في بالك؟",
    ctaSub: "خلّينا نحدّد نطاقه سوا ونرسم أسرع طريق للإطلاق.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const client = await getClient(slug, locale);
  if (!client) return { title: "Case study" };
  const path = `/case-studies/${slug}`;
  const image = cmsMedia(client.hero_image_url || client.logo_url);
  return {
    title: `${client.name} — ${client.tagline}`,
    description: client.brief,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: {
        en: `${SITE_URL}${path}`,
        ar: `${SITE_URL}/ar${path}`,
        "x-default": `${SITE_URL}${path}`,
      },
    },
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const client = await getClient(slug, locale);
  if (!client) notFound();

  const reelsEnv = await getReels(locale, { client: slug, limit: 12 });
  const reels = reelsEnv?.data ?? [];

  const heroImg = cmsMedia(client.hero_image_url || client.logo_url);
  const gallery = (client.gallery ?? []).map(cmsMedia).filter(Boolean);
  const galleryShots: Shot[] = gallery.map((src, index) => ({
    src,
    alt: `${client.name} — ${index + 1}`,
  }));
  const results = client.results ?? [];
  const techStack = client.tech_stack ?? [];
  const services = client.services ?? [];
  const { live_url, app_store, play_store } = client.links ?? {};

  return (
    <>
      {/* Hero — dark */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:pt-28">
          <Reveal>
            <a
              href={localePath(locale, "/case-studies")}
              className="inline-flex items-center gap-1.5 text-sm text-bodydark transition-colors hover:text-cream focus-gold"
            >
              <span aria-hidden className="rtl:rotate-180">
                ←
              </span>
              {t.back}
            </a>
          </Reveal>
          <Reveal delay={0.06}>
            <SectionEyebrow className="mt-8">{client.category_label}</SectionEyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-3 text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-cream">
              {client.name}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-2xl text-pretty text-lg text-bodydark">{client.tagline}</p>
          </Reveal>
          {live_url || app_store || play_store ? (
            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap gap-3">
                {live_url ? (
                  <GoldButton href={live_url} external>
                    {t.visit}
                  </GoldButton>
                ) : null}
                {app_store ? (
                  <GhostButton href={app_store} external>
                    {t.appStore}
                  </GhostButton>
                ) : null}
                {play_store ? (
                  <GhostButton href={play_store} external>
                    {t.playStore}
                  </GhostButton>
                ) : null}
              </div>
            </Reveal>
          ) : null}
        </div>

        {heroImg ? (
          <div className="mx-auto max-w-6xl px-4 pb-16">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-tile border border-line bg-panel">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImg} alt={client.name} className="h-auto w-full object-cover" />
              </div>
            </Reveal>
          </div>
        ) : null}
      </section>

      <ReelsRow locale={locale} reels={reels} showAll={false} />

      {/* Overview — light */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_300px]">
          <div>
            <Reveal>
              <SectionEyebrow>{t.overview}</SectionEyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              {client.brief_html ? (
                <div
                  className="mt-5 max-w-2xl text-neutral-600 [&_a]:text-navy [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-deep [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy-deep [&_li]:mt-1.5 [&_li]:leading-relaxed [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-5"
                  dangerouslySetInnerHTML={{ __html: client.brief_html }}
                />
              ) : (
                <p className="mt-5 max-w-2xl leading-relaxed text-neutral-600">{client.brief}</p>
              )}
            </Reveal>
          </div>

          <aside className="space-y-8">
            {services.length ? (
              <Reveal delay={0.1}>
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">
                    {t.services}
                  </h2>
                  <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
                    {services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}

            {client.timeline ? (
              <Reveal delay={0.14}>
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">
                    {t.timeline}
                  </h2>
                  <p className="mt-3 text-sm text-neutral-600">{client.timeline}</p>
                </div>
              </Reveal>
            ) : null}

            {techStack.length ? (
              <Reveal delay={0.18}>
                <div>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">
                    {t.stack}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-pill border border-neutral-300 bg-white px-3 py-1 font-mono text-xs text-neutral-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Gallery — light continuation */}
      {galleryShots.length ? (
        <section className="bg-cream pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <SectionEyebrow>{t.gallery}</SectionEyebrow>
            </Reveal>
            <div className="mt-6">
              <ScreenshotGallery shots={galleryShots} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Results — dark */}
      {results.length ? (
        <section className="bg-navy-deep py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <Reveal>
              <SectionEyebrow>{t.results}</SectionEyebrow>
            </Reveal>
            <Stagger className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <StaggerItem key={r.label}>
                  <MetricStat value={r.metric} label={r.label} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Testimonial — light */}
      {client.testimonial?.quote ? (
        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Reveal>
              <blockquote className="text-balance font-sans text-2xl font-medium leading-relaxed tracking-[-0.01em] text-navy-deep sm:text-3xl">
                &ldquo;{client.testimonial.quote}&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 font-mono text-sm uppercase tracking-[0.15em] text-gold-dim">
                {client.testimonial.author}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      <CTAPanel
        title={t.ctaTitle}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={`Hi MubarmiJ! I saw the ${client.name} case study and want to discuss a project.`}
      />
    </>
  );
}
