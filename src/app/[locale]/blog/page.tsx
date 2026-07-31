import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getBlog } from "@/lib/v1";
import { CTAPanel, EmptyState, ImageWell, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

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
  const env = await getBlog(locale, { page_size: 24 });
  const posts = env?.data ?? [];
  const dateFmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

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
          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <a
                  key={p.slug}
                  href={localePath(locale, `/blog/${p.slug}`)}
                  className="focus-gold group flex h-full flex-col overflow-hidden rounded-card border border-hair bg-surface transition duration-300 hover:-translate-y-1 hover:border-hairhov hover:shadow-lift"
                >
                  <ImageWell
                    src={p.cover_image_url}
                    alt={p.title}
                    ratio="16 / 10"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mono text-eyebrow uppercase text-fgmuted">{p.category}</span>
                    <h2 className="mt-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-fgbody">
                      {p.excerpt}
                    </p>
                    <p className="mono mt-4 text-[11px] text-fgfaint">
                      {dateFmt(p.published_at)}
                      {p.reading_time_minutes ? ` · ${p.reading_time_minutes} ${t.minRead}` : ""}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <EmptyState
              locale={locale}
              title={t.emptyTitle}
              body={t.emptyBody}
              ctaHref={localePath(locale, "/resources")}
              ctaLabel={t.resources}
            />
          )}
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
