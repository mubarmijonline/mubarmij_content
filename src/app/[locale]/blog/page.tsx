import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getBlog } from "@/lib/v1";
import { CTAPanel, GhostButton, GoldButton, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Blog",
    title: "Notes on building software that works",
    sub: "Lessons, playbooks, and behind-the-scenes from our projects.",
    emptyTitle: "First posts coming soon",
    emptyBody: "We're writing our first articles now. In the meantime, grab a free guide or book a call.",
    resources: "Browse resources",
    book: "Book a call",
    minRead: "min read",
    ctaTitle: "Want this kind of thinking on your project?",
    ctaSub: "Book a free call and we'll bring the ideas — tailored to your business.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I read your blog and want to discuss a project.",
  },
  ar: {
    eyebrow: "المدونة",
    title: "ملاحظات عن بناء سوفت وير بيشتغل",
    sub: "دروس وبلايبوكس وكواليس من مشاريعنا.",
    emptyTitle: "أول المقالات قريب",
    emptyBody: "بنكتب أول مقالاتنا دلوقتي. لحد ما تنزل، خد دليل مجاني أو احجز مكالمة.",
    resources: "تصفّح المصادر",
    book: "احجز مكالمة",
    minRead: "دقيقة قراءة",
    ctaTitle: "عايز التفكير ده على مشروعك؟",
    ctaSub: "احجز مكالمة مجانية وهنجيب الأفكار — مفصّلة على شغلك.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! قريت مدونتكم وحابب أناقش مشروع.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = "/blog";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const env = await getBlog(locale, { limit: 24 });
  const posts = env?.data ?? [];
  const dateFmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

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

      {/* Posts or empty state — light */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          {posts.length ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const cover = cmsMedia(p.cover_image_url);
                return (
                  <StaggerItem key={p.slug}>
                    <a
                      href={localePath(locale, `/blog/${p.slug}`)}
                      className="group flex h-full flex-col overflow-hidden rounded-tile border border-neutral-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 focus-gold"
                    >
                      {cover ? (
                        <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cover}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">{p.category}</span>
                        <h2 className="mt-2 text-lg font-semibold text-navy-deep">{p.title}</h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{p.excerpt}</p>
                        <p className="mt-4 font-mono text-xs text-neutral-400">
                          {dateFmt(p.published_at)}
                          {p.reading_time_minutes ? ` · ${p.reading_time_minutes} ${t.minRead}` : ""}
                        </p>
                      </div>
                    </a>
                  </StaggerItem>
                );
              })}
            </Stagger>
          ) : (
            <Reveal className="mx-auto max-w-xl rounded-tile border border-neutral-200 bg-white p-10 text-center">
              <h2 className="text-xl font-semibold text-navy-deep">{t.emptyTitle}</h2>
              <p className="mt-3 text-neutral-500">{t.emptyBody}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <GoldButton href={localePath(locale, "/resources")}>{t.resources}</GoldButton>
                <GhostButton href={localePath(locale, "/book-call")} className="border-neutral-300 text-navy hover:bg-navy/5">
                  {t.book}
                </GhostButton>
              </div>
            </Reveal>
          )}
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
