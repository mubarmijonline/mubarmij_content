import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getBlogPost } from "@/lib/v1";
import { CTAPanel, Reveal, SectionEyebrow } from "@/components/system";

export const revalidate = 300;

const COPY = {
  en: {
    back: "All posts",
    minRead: "min read",
    tags: "Tags",
    related: "Keep reading",
    ctaTitle: "Have a project in mind?",
    ctaSub: "Let's turn ideas into something shipped.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I read one of your posts and want to discuss a project.",
  },
  ar: {
    back: "كل المقالات",
    minRead: "دقيقة قراءة",
    tags: "وسوم",
    related: "كمّل قراءة",
    ctaTitle: "عندك مشروع في بالك؟",
    ctaSub: "خلّينا نحوّل الأفكار لحاجة متنفّذة.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! قريت مقال من مقالاتكم وحابب أناقش مشروع.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return { title: "Post" };
  const path = `/blog/${slug}`;
  const image = cmsMedia(post.cover_image_url);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const post = await getBlogPost(slug, locale);
  if (!post) notFound();

  const cover = cmsMedia(post.cover_image_url);
  const avatar = cmsMedia(post.author?.avatar_url);
  const tags = post.tags ?? [];
  const related = post.related ?? [];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      {/* Hero — dark */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-24 sm:pt-28">
          <Reveal>
            <a
              href={localePath(locale, "/blog")}
              className="inline-flex items-center gap-1.5 text-sm text-bodydark transition-colors hover:text-cream focus-gold"
            >
              <span aria-hidden className="rtl:rotate-180">
                ←
              </span>
              {t.back}
            </a>
          </Reveal>
          <Reveal delay={0.06}>
            <SectionEyebrow className="mt-8">{post.category}</SectionEyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-3 text-balance font-sans text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.02em] text-cream">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 flex items-center gap-3 text-sm text-bodydark">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={post.author?.name ?? ""} className="h-9 w-9 rounded-full object-cover" />
              ) : null}
              <span className="font-medium text-cream">{post.author?.name}</span>
              <span aria-hidden>·</span>
              <span className="font-mono text-xs">
                {date}
                {post.reading_time_minutes ? ` · ${post.reading_time_minutes} ${t.minRead}` : ""}
              </span>
            </div>
          </Reveal>
        </div>

        {cover ? (
          <div className="mx-auto max-w-4xl px-4 pb-16">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-tile border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={post.title} className="h-auto w-full object-cover" />
              </div>
            </Reveal>
          </div>
        ) : null}
      </section>

      {/* Body — light */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          {post.body_html ? (
            <div
              className="text-neutral-700 [&_a]:text-navy [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-s-4 [&_blockquote]:border-gold [&_blockquote]:ps-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-navy-deep [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-navy-deep [&_img]:my-6 [&_img]:rounded-tile [&_li]:mt-2 [&_li]:leading-relaxed [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mt-5 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-5"
              dangerouslySetInnerHTML={{ __html: post.body_html }}
            />
          ) : null}

          {tags.length ? (
            <div className="mt-10 border-t border-neutral-200 pt-6">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">{t.tags}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-pill border border-neutral-300 px-3 py-1 font-mono text-xs text-neutral-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Related — light */}
      {related.length ? (
        <section className="bg-bglight py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <SectionEyebrow>{t.related}</SectionEyebrow>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rc = cmsMedia(r.cover_image_url);
                return (
                  <a
                    key={r.slug}
                    href={localePath(locale, `/blog/${r.slug}`)}
                    className="group flex flex-col overflow-hidden rounded-tile border border-neutral-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 focus-gold"
                  >
                    {rc ? (
                      <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rc} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    ) : null}
                    <div className="p-5">
                      <h3 className="font-semibold text-navy-deep">{r.title}</h3>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

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
