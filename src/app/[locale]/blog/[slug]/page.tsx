import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { cmsMedia, localePath } from "@/lib/utils";
import { getBlogPost } from "@/lib/v1";
import { CTAPanel, ImageWell, MonoChip, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

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
      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <a
            href={localePath(locale, "/blog")}
            className="mono focus-gold inline-flex items-center gap-2 text-[11px] uppercase text-fgmuted transition-colors hover:text-fg"
          >
            <span aria-hidden="true" className="rtl:rotate-180">
              ←
            </span>
            {t.back}
          </a>

          <div className="mt-8 max-w-[46em]">
            <SectionEyebrow>{post.category}</SectionEyebrow>
            <h1 className="mt-3.5 text-balance font-display text-d1 font-bold text-fg">
              {post.title}
              <GoldPeriod />
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-fgbody">
              {avatar ? (
                <Image
                  src={avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : null}
              <span className="font-medium text-fg">{post.author?.name}</span>
              <span aria-hidden="true" className="text-fgfaint">
                ·
              </span>
              <span className="mono ltr-island text-[12px] text-fgmuted">
                {date}
                {post.reading_time_minutes ? ` · ${post.reading_time_minutes} ${t.minRead}` : ""}
              </span>
            </div>
          </div>

          {cover ? (
            <div className="mt-10 overflow-hidden rounded-card border border-hair">
              <ImageWell
                src={cover}
                alt={post.title}
                ratio="16 / 9"
                priority
                sizes="(max-width: 1280px) 100vw, 1216px"
              />
            </div>
          ) : null}
        </Shell>
      </section>

      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <div className="max-w-[46em]">
            {post.body_html ? (
              <div
                className="text-copy text-fgbody [&_a]:text-gold-deep [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-s-[3px] [&_blockquote]:border-gold [&_blockquote]:ps-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-fg [&_img]:my-6 [&_img]:rounded-card [&_li]:mt-2 [&_li]:leading-relaxed [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mt-5 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-5"
                dangerouslySetInnerHTML={{ __html: post.body_html }}
              />
            ) : null}

            {tags.length ? (
              <div className="mt-10 border-t border-hair pt-6">
                <h2 className="mono text-eyebrow uppercase text-accent">{t.tags}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <MonoChip key={tag}>{tag}</MonoChip>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Shell>
      </section>

      {related.length ? (
        <section className="surf-subtle border-b border-hair">
          <Shell className="sect">
            <SectionEyebrow>{t.related}</SectionEyebrow>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <a
                  key={r.slug}
                  href={localePath(locale, `/blog/${r.slug}`)}
                  className="focus-gold group flex flex-col overflow-hidden rounded-card border border-hair bg-surface transition duration-300 hover:-translate-y-1 hover:border-hairhov hover:shadow-lift"
                >
                  <ImageWell
                    src={r.cover_image_url}
                    alt={r.title}
                    ratio="16 / 10"
                    sizes="(max-width: 640px) 100vw, 400px"
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-[17px] font-semibold text-fg">{r.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </Shell>
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
