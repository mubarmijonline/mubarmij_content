import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import {
  getClientProfile,
  getRelatedClients,
  mediaUrl,
  type CmsMedia,
  type CmsClientProfile,
} from "@/lib/cms";
import { gradientForSlug, initialsForName, coverFit } from "@/lib/clientPlaceholder";
import LexicalRenderer from "@/components/cms/LexicalRenderer";
import ScreenshotGallery, { type Shot } from "@/components/cms/ScreenshotGallery";
import VideoList, { type VideoEntry } from "@/components/cms/VideoList";

type Params = Promise<{ locale: Locale; slug: string }>;

// Render on-demand so CMS edits show immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const SERVICE_LABEL: Record<string, { en: string; ar: string }> = {
  automation: { en: "Automation", ar: "أتمتة" },
  web: { en: "Web Development", ar: "تطوير ويب" },
  mobile: { en: "Mobile Apps", ar: "تطبيقات موبايل" },
  maintenance: { en: "Maintenance", ar: "صيانة" },
  consulting: { en: "Consulting", ar: "استشارات" },
};

const INDUSTRY_LABEL: Record<string, { en: string; ar: string }> = {
  ecommerce: { en: "E-commerce", ar: "تجارة إلكترونية" },
  hospitality: { en: "Hospitality", ar: "ضيافة" },
  fnb: { en: "Food & Beverage", ar: "أغذية ومشروبات" },
  healthcare: { en: "Healthcare", ar: "رعاية صحية" },
  "real-estate": { en: "Real Estate", ar: "عقارات" },
  education: { en: "Education", ar: "تعليم" },
  logistics: { en: "Logistics", ar: "خدمات لوجستية" },
  retail: { en: "Retail", ar: "تجزئة" },
  services: { en: "Services", ar: "خدمات" },
  other: { en: "Other", ar: "أخرى" },
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const profile = await getClientProfile(slug, locale);
  if (!profile) {
    return {
      title: locale === "ar" ? "لم يتم العثور على الصفحة" : "Profile not found",
    };
  }
  const path = localePath(locale, `/clients/${slug}`);
  const description =
    profile.shortDescription ||
    profile.tagline ||
    (locale === "ar"
      ? `تعرّف على شراكتنا مع ${profile.name}`
      : `Learn about our work with ${profile.name}`);
  const ogImage = mediaUrl(profile.coverImage || profile.logo);
  return {
    title: `${profile.name}${profile.tagline ? ` — ${profile.tagline}` : ""}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${path}`,
      title: profile.name,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ClientProfilePage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug: rawSlug } = await params;
  setRequestLocale(locale);
  const slug = safeDecode(rawSlug);
  const profile = await getClientProfile(slug, locale);
  if (!profile) notFound();

  const isAr = locale === "ar";
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const cover = mediaUrl(profile.coverImage);
  const logoSrc = mediaUrl(profile.logo);

  const shots: Shot[] = (profile.screenshots || [])
    .map((s) => {
      const media =
        s && typeof s === "object" && "image" in s
          ? (s as { image: CmsMedia }).image
          : (s as CmsMedia);
      const caption =
        s && typeof s === "object" && "caption" in s
          ? (s as { caption?: string }).caption
          : media?.alt;
      return {
        src: mediaUrl(media),
        alt: caption || profile.name,
        caption,
        width: media?.width,
        height: media?.height,
      };
    })
    .filter((shot) => !!shot.src);

  // First shot inline inside "What we built", remainder in gallery at end.
  const inlineShot = shots[0];
  const gallery = shots.slice(1);

  const videos: VideoEntry[] = (profile.videos || [])
    .map((v) => ({
      source: v.source,
      url: v.url,
      fileUrl: v.file ? mediaUrl(v.file) : undefined,
      title: v.title,
      thumbnail: v.thumbnail ? mediaUrl(v.thumbnail) : undefined,
    }))
    .filter((v) => (v.source === "upload" ? !!v.fileUrl : !!v.url));

  const related = profile.slug
    ? await getRelatedClients(profile.slug, 3, locale)
    : [];

  return (
    <article className="bg-white text-[#0F172A]">
      {/* Breadcrumb */}
      <nav
        aria-label={t("Breadcrumb", "مسار التنقل")}
        className="container mx-auto px-4 pt-6 text-[12px] text-[#64748B]"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localePath(locale, "/")} className="hover:text-[#0A1628]">
              {t("Home", "الرئيسية")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={localePath(locale, "/case-studies")}
              className="hover:text-[#0A1628]"
            >
              {t("Clients", "العملاء")}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[#0A1628]">{profile.name}</li>
        </ol>
      </nav>

      {/* Cover hero */}
      <header className="container mx-auto mt-5 px-4">
        <div className="relative w-full overflow-hidden rounded-[12px] aspect-video md:aspect-[3.4/1]">
          {cover ? (
            <>
              {coverFit(profile.coverImage) === "contain" && (
                <Image
                  src={cover}
                  alt=""
                  fill
                  aria-hidden
                  className="object-cover scale-110 blur-2xl opacity-70"
                  sizes="(max-width: 1080px) 100vw, 1080px"
                  unoptimized={cover.startsWith("/api/")}
                />
              )}
              <Image
                src={cover}
                alt={`${profile.name} cover`}
                fill
                className={`${
                  coverFit(profile.coverImage) === "cover"
                    ? "object-cover"
                    : "object-contain"
                } object-center`}
                sizes="(max-width: 1080px) 100vw, 1080px"
                priority
                unoptimized={cover.startsWith("/api/")}
              />
            </>
          ) : (
            <div
              aria-hidden
              className="cover-placeholder absolute inset-0"
              style={{ background: gradientForSlug(profile.slug) }}
            >
              <span className="cover-placeholder__initials">
                {initialsForName(profile.name)}
              </span>
            </div>
          )}
          <span className="absolute start-4 top-4 z-10 inline-flex items-center rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px] text-white backdrop-blur-sm">
            {t("Case study", "دراسة حالة")}
          </span>
        </div>
      </header>

      {/* Two-column main + sidebar */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
          {/* Main column */}
          <div className="min-w-0">
            <h1
              className="font-display rtl:font-arabic-display text-[24px] font-medium leading-tight text-[#0A1628] md:text-[26px]"
              style={{ letterSpacing: "-0.4px" }}
            >
              {profile.name}
              {profile.tagline ? (
                <span className="text-[#1E3A5F]"> — {profile.tagline}</span>
              ) : null}
            </h1>

            {profile.shortDescription && (
              <p className="mt-3 max-w-3xl text-[14px] leading-[1.7] text-[#64748B]">
                {profile.shortDescription}
              </p>
            )}

            {/* WHAT WE BUILT */}
            {profile.description != null && (
              <section className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                  {t("What we built", "ما الذي بنيناه")}
                </p>
                <div className="mt-3 max-w-3xl text-[14px] leading-[1.7] text-[#0F172A] [&_p]:mb-4 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-[18px] [&_h2]:font-medium [&_h2]:text-[#0A1628] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-[16px] [&_h3]:font-medium [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_a]:text-[#0A1628] [&_a]:underline">
                  <LexicalRenderer value={profile.description} />
                </div>

                {inlineShot && (
                  <div className="mt-6 overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="relative w-full aspect-[1.8/1]">
                      <Image
                        src={inlineShot.src}
                        alt={inlineShot.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1080px) 100vw, 720px"
                        unoptimized={inlineShot.src.startsWith("/api/")}
                      />
                    </div>
                    {inlineShot.caption && (
                      <p className="border-t border-[#E2E8F0] px-3 py-2 text-[11px] text-[#64748B]">
                        {inlineShot.caption}
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* RESULTS */}
            {profile.metrics && profile.metrics.length > 0 && (
              <section className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                  {t("Results", "النتائج")}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {profile.metrics.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="rounded-[8px] border border-[#E2E8F0] p-3"
                    >
                      <div className="text-[18px] font-medium leading-none text-[#0A1628]">
                        {m.value}
                      </div>
                      <div className="mt-2 text-[10px] uppercase tracking-[1.5px] text-[#64748B]">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TESTIMONIAL */}
            {profile.testimonialQuote && (
              <section className="mt-10">
                <figure className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                  <blockquote className="text-[14px] leading-[1.7] text-[#0F172A]">
                    “{profile.testimonialQuote}”
                  </blockquote>
                  {profile.testimonialAuthor && (
                    <figcaption className="mt-3 text-[12px] text-[#64748B]">
                      — {profile.testimonialAuthor}
                    </figcaption>
                  )}
                </figure>
              </section>
            )}

            {/* VIDEOS */}
            {videos.length > 0 && (
              <section className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                  {t("Videos", "فيديوهات")}
                </p>
                <div className="mt-3">
                  <VideoList videos={videos} />
                </div>
              </section>
            )}

            {/* SCREENSHOT GALLERY */}
            {gallery.length > 0 && (
              <section className="mt-10">
                <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                  {t("Screenshots", "لقطات من المشروع")}
                </p>
                <div className="mt-3">
                  <ScreenshotGallery shots={gallery} />
                </div>
              </section>
            )}

            {/* Back link */}
            <div className="mt-10">
              <Link
                href={localePath(locale, "/")}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[#0A1628]"
              >
                <ArrowLeft size={14} className="rtl:rotate-180" />
                {t("Back to home", "العودة للرئيسية")}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:order-last">
            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 md:sticky md:top-[88px]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[8px] bg-[#0A1628] text-white">
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={profile.name}
                      width={44}
                      height={44}
                      className={`h-full w-full object-contain ${
                        profile.darkCard ? "p-1" : "bg-white p-0.5"
                      }`}
                      unoptimized={logoSrc.startsWith("/api/")}
                    />
                  ) : (
                    <span className="text-[14px] font-medium">
                      {initialsForName(profile.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-[#0A1628]">
                    {profile.name}
                  </div>
                  <div className="truncate text-[11px] text-[#64748B]">
                    {[
                      profile.industry === "other" &&
                      profile.industryCustom?.trim()
                        ? profile.industryCustom.trim()
                        : INDUSTRY_LABEL[profile.industry || ""]?.[locale] ||
                          profile.industryCustom?.trim() ||
                          profile.industry,
                      profile.country,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </div>

              {profile.services && profile.services.length > 0 && (
                <div className="mt-3 border-t border-[#E2E8F0] py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                    {t("Services", "الخدمات")}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {profile.services.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-1.5 text-[11px] text-[#0F172A]"
                      >
                        <Check
                          size={12}
                          className="mt-[3px] shrink-0 text-[#0A1628]"
                        />
                        <span>{SERVICE_LABEL[s]?.[locale] ?? s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.techStack && profile.techStack.length > 0 && (
                <div className="mt-2 border-t border-[#E2E8F0] py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                    {t("Stack", "التقنيات")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded border border-[#CBD5E1] bg-white px-1.5 py-0.5 text-[10px] text-[#0F172A]"
                      >
                        {tech.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.timeline && (
                <div className="mt-2 border-t border-[#E2E8F0] py-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#94A3B8]">
                    {t("Timeline", "المدة الزمنية")}
                  </p>
                  <div className="mt-1 text-[12px] font-medium text-[#0A1628]">
                    {profile.timeline}
                  </div>
                </div>
              )}

              {profile.websiteUrl && (
                <div className="mt-2 border-t border-[#E2E8F0] py-2.5">
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0A1628] hover:underline"
                  >
                    {t("Visit live site", "زيارة الموقع")}
                    <ArrowRight
                      size={12}
                      className="rtl:rotate-180"
                      aria-hidden
                    />
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* MORE WORK */}
      {related.length > 0 && (
        <section className="bg-[#F8FAFC] py-7 md:py-10">
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#64748B]">
              {t("More work", "أعمال أخرى")}
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
              {related.map((c) => (
                <RelatedCard
                  key={c.id}
                  client={c}
                  locale={locale}
                  isAr={isAr}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-[#0A1628] py-7 text-white md:py-10">
        <div className="container mx-auto flex flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[16px] font-medium">
              {t(
                "Want results like these for your business?",
                "عايز نتائج زي دي لشركتك؟",
              )}
            </h2>
            <p className="mt-1 text-[12px] text-white/65">
              {t(
                "Free 30-minute consultation. No commitment.",
                "استشارة مجانية ٣٠ دقيقة. بدون أي التزام.",
              )}
            </p>
          </div>
          <Link
            href={localePath(locale, "/book-call")}
            className="inline-flex items-center gap-2 rounded-[8px] bg-white px-4 py-2.5 text-[13px] font-medium text-[#0A1628] transition hover:bg-white/90"
          >
            {t("Book a call", "احجز مكالمة")}
            <ArrowRight size={14} className="rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </section>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* "More work" mini card                                                      */
/* -------------------------------------------------------------------------- */

function RelatedCard({
  client,
  locale,
  isAr,
}: {
  client: CmsClientProfile;
  locale: Locale;
  isAr: boolean;
}) {
  const cover = mediaUrl(client.coverImage);
  const href = localePath(locale, `/clients/${client.slug}`);
  return (
    <Link
      href={href}
      title={isAr ? `استكشف ${client.name}` : `Explore ${client.name}`}
      className="group block rounded-[8px] border border-[#E2E8F0] bg-white p-2.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#CBD5E1] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628]"
    >
      <div className="relative mb-2 w-full overflow-hidden rounded aspect-[1.8/1]">
        {cover ? (
          <>
            {coverFit(client.coverImage) === "contain" && (
              <Image
                src={cover}
                alt=""
                fill
                aria-hidden
                className="object-cover scale-110 blur-xl opacity-70"
                sizes="(max-width: 600px) 100vw, 33vw"
                unoptimized={cover.startsWith("/api/")}
              />
            )}
            <Image
              src={cover}
              alt=""
              fill
              className={`${
                coverFit(client.coverImage) === "cover"
                  ? "object-cover"
                  : "object-contain"
              } object-center`}
              sizes="(max-width: 600px) 100vw, 33vw"
              unoptimized={cover.startsWith("/api/")}
            />
          </>
        ) : (
          <div
            aria-hidden
            className="cover-placeholder absolute inset-0"
            style={{ background: gradientForSlug(client.slug) }}
          >
            <span
              className="cover-placeholder__initials"
              style={{ fontSize: "32px" }}
            >
              {initialsForName(client.name)}
            </span>
          </div>
        )}
      </div>
      <div className="text-[12px] font-medium text-[#0A1628]">
        {client.name}
      </div>
      <div className="text-[10px] text-[#64748B]">
        {client.industry === "other" && client.industryCustom?.trim()
          ? client.industryCustom.trim()
          : INDUSTRY_LABEL[client.industry || ""]?.[locale] ||
            client.industryCustom?.trim() ||
            client.industry ||
            ""}
      </div>
    </Link>
  );
}
