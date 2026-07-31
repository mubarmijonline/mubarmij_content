import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getClient, getReels } from "@/lib/v1";
import {
  CTAPanel,
  DarkButton,
  GhostButton,
  HairCell,
  HairGrid,
  ImageWell,
  MonoChip,
  SectionEyebrow,
  Shell,
  StatCell,
  hasStat,
} from "@/components/system";
import { Arrow, GoldPeriod } from "@/components/system/Typo";
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
    results: "Highlights",
    gallery: "A look inside",
    ctaTitle: "Have a project in mind?",
    ctaSub: "Let's scope it together and map the fastest path to launch.",
    ctaLabel: "Book a call",
    waLabel: "Message us on WhatsApp",
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
    results: "أبرز النقاط",
    gallery: "من جوّه المشروع",
    ctaTitle: "عندك مشروع في بالك؟",
    ctaSub: "خلّينا نحدّد نطاقه سوا ونرسم أسرع طريق للإطلاق.",
    ctaLabel: "احجز مكالمة",
    waLabel: "كلمنا على واتساب",
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

  const gallery = (client.gallery ?? []).map(cmsMedia).filter(Boolean);

  // Logo-only stubs resolve through the API but have nothing to show. Sending
  // them to a page with a name and no content is worse than a 404.
  if (!client.brief && !client.brief_html && !gallery.length) notFound();

  const reelsEnv = await getReels(locale, { client: slug, page_size: 12 });
  const reels = reelsEnv?.data ?? [];

  const galleryShots: Shot[] = gallery.map((src, index) => ({
    src,
    alt: `${client.name} — ${index + 1}`,
  }));
  const results = (client.results ?? []).filter((r) => hasStat(r.metric));
  const techStack = client.tech_stack ?? [];
  const services = client.services ?? [];
  const { live_url, app_store, play_store } = client.links ?? {};

  return (
    <>
      <section className="surf-light border-b border-hair">
        <Shell className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-hair py-12 lg:border-e lg:py-14 lg:pe-12">
            <a
              href={localePath(locale, "/case-studies")}
              className="mono focus-gold inline-flex items-center gap-2 text-[11px] uppercase text-fgmuted transition-colors hover:text-fg"
            >
              <span aria-hidden="true" className="rtl:rotate-180">
                ←
              </span>
              {t.back}
            </a>

            <div className="mt-8">
              <SectionEyebrow>{client.category_label}</SectionEyebrow>
            </div>
            <h1 className="mt-3.5 text-balance font-display text-d1 font-bold text-fg">
              {client.name}
              <GoldPeriod />
            </h1>
            {client.tagline ? (
              <p className="mt-5 max-w-[32em] text-lede text-fgbody">{client.tagline}</p>
            ) : null}

            {live_url || app_store || play_store ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {live_url ? (
                  <DarkButton href={live_url} external>
                    {t.visit}
                    <Arrow locale={locale} />
                  </DarkButton>
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
            ) : null}

            {results.length ? (
              <HairGrid cols={2} className="mt-12 border-t border-hair">
                {results.slice(0, 4).map((r) => (
                  <HairCell key={r.label} className="py-6">
                    <StatCell value={r.metric} label={r.label} />
                  </HairCell>
                ))}
              </HairGrid>
            ) : null}
          </div>

          <div className="py-12 lg:ps-12 lg:pt-14">
            <div className="overflow-hidden rounded-card border border-hair">
              <ImageWell
                src={client.hero_image_url || client.logo_url}
                alt={client.name}
                height={400}
                priority
                fit={client.hero_image_url ? "cover" : "contain"}
                sizes="(max-width: 1024px) 100vw, 640px"
              />
            </div>
          </div>
        </Shell>
      </section>

      <section className="surf-light border-b border-hair">
        <Shell className="sect grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            <SectionEyebrow>{t.overview}</SectionEyebrow>
            {client.brief_html ? (
              <div
                className="mt-5 max-w-[42em] text-copy text-fgbody [&_a]:text-gold-deep [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-[21px] [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-fg [&_li]:mt-1.5 [&_li]:leading-relaxed [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-5"
                dangerouslySetInnerHTML={{ __html: client.brief_html }}
              />
            ) : (
              <p className="mt-5 max-w-[42em] text-copy text-fgbody">{client.brief}</p>
            )}
          </div>

          <aside className="grid gap-8 self-start lg:border-s lg:border-hair lg:ps-8">
            {services.length ? (
              <div>
                <h2 className="mono text-eyebrow uppercase text-accent">{t.services}</h2>
                <ul className="mt-3 space-y-1.5 text-[14.5px] text-fgbody">
                  {services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {client.timeline ? (
              <div>
                <h2 className="mono text-eyebrow uppercase text-accent">{t.timeline}</h2>
                <p className="mt-3 text-[14.5px] text-fgbody">{client.timeline}</p>
              </div>
            ) : null}

            {techStack.length ? (
              <div>
                <h2 className="mono text-eyebrow uppercase text-accent">{t.stack}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <MonoChip key={tech}>{tech}</MonoChip>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </Shell>
      </section>

      {galleryShots.length ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect">
            <SectionEyebrow>{t.gallery}</SectionEyebrow>
            <div className="mt-6">
              <ScreenshotGallery shots={galleryShots} />
            </div>
          </Shell>
        </section>
      ) : null}

      <ReelsRow locale={locale} reels={reels} showAll={false} />

      {client.testimonial?.quote ? (
        <section className="surf-dark sect">
          <Shell className="max-w-3xl text-center">
            <blockquote className="text-balance font-display text-[26px] font-semibold leading-relaxed tracking-[-0.01em] text-fg sm:text-[30px]">
              &ldquo;{client.testimonial.quote}&rdquo;
            </blockquote>
            <p className="mono mt-6 text-[11.5px] uppercase text-gold">
              {client.testimonial.author}
            </p>
          </Shell>
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
