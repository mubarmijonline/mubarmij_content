import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import {
  getPublishedClientProfiles,
  getClientLogos,
  mediaUrl,
  type CmsClientProfile,
  type CmsClientLogo,
} from "@/lib/cms";
import { gradientForSlug, initialsForName, coverFit } from "@/lib/clientPlaceholder";
import { CLIENT_LOGOS } from "@/lib/site";

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

function industryLabel(
  value: string | undefined,
  custom: string | undefined,
  locale: Locale,
): string {
  if (!value) return custom?.trim() ?? "";
  if (value === "other" && custom?.trim()) return custom.trim();
  return INDUSTRY_LABEL[value]?.[locale] ?? value;
}

/* -------------------------------------------------------------------------- */
/*  Bento cards — cover photo with navy overlay (per spec)                    */
/* -------------------------------------------------------------------------- */

function HeroCard({
  client,
  locale,
  isAr,
}: {
  client: CmsClientProfile;
  locale: Locale;
  isAr: boolean;
}) {
  const cover = mediaUrl(client.coverImage);
  const fit = coverFit(client.coverImage);
  const href = localePath(locale, `/clients/${client.slug}`);
  const subtitle = client.tagline || client.shortDescription || "";
  const overlay =
    "linear-gradient(to top, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.15) 55%, rgba(10,22,40,0) 100%)";

  return (
    <Link
      href={href}
      title={isAr ? `استكشف ${client.name}` : `Explore ${client.name}`}
      className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[14px] border border-[#E2E8F0] p-6 text-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#1E3A5F] hover:shadow-[0_10px_30px_-10px_rgba(10,22,40,0.25)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628] md:min-h-[340px] md:row-span-2"
    >
      {cover ? (
        <>
          {fit === "contain" && (
            <Image
              src={cover}
              alt=""
              fill
              aria-hidden
              className="object-cover scale-110 blur-2xl opacity-50"
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={cover.startsWith("/api/")}
            />
          )}
          <Image
            src={cover}
            alt=""
            fill
            className={`${
              fit === "cover" ? "object-cover" : "object-contain"
            } object-center transition-transform duration-500 group-hover:scale-[1.03]`}
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
            unoptimized={cover.startsWith("/api/")}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="cover-placeholder absolute inset-0"
          style={{ background: gradientForSlug(client.slug) }}
        >
          <span className="cover-placeholder__initials">
            {initialsForName(client.name)}
          </span>
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: overlay }}
      />

      <div className="relative z-10">
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[1.5px] text-white backdrop-blur-sm">
          {isAr ? "مميز" : "Featured"}
          {client.industry
            ? ` · ${industryLabel(client.industry, client.industryCustom, locale)}`
            : ""}
        </span>
        <h3 className="mt-3 text-[18px] font-medium text-white md:text-[20px]">
          {client.name}
          {subtitle ? (
            <span className="text-white/85"> — {subtitle}</span>
          ) : null}
        </h3>
        {client.shortDescription && (
          <p className="mt-1 line-clamp-2 text-[12px] text-white/75 md:text-[13px]">
            {client.shortDescription}
          </p>
        )}

        {client.metrics && client.metrics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {client.metrics.slice(0, 2).map((m, i) => (
              <div key={i}>
                <div className="text-[22px] font-medium leading-none text-white">
                  {m.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[1.5px] text-white/75">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function SmallCard({
  client,
  locale,
  isAr,
}: {
  client: CmsClientProfile;
  locale: Locale;
  isAr: boolean;
}) {
  const cover = mediaUrl(client.coverImage);
  const fit = coverFit(client.coverImage);
  const href = localePath(locale, `/clients/${client.slug}`);
  const result = client.metrics?.[0];
  const overlay =
    "linear-gradient(to top, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.25) 55%, rgba(10,22,40,0) 100%)";

  return (
    <Link
      href={href}
      title={isAr ? `استكشف ${client.name}` : `Explore ${client.name}`}
      className="group relative flex min-h-[160px] flex-col justify-end overflow-hidden rounded-[14px] border border-[#E2E8F0] p-3.5 text-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[#1E3A5F] hover:shadow-[0_8px_20px_-12px_rgba(10,22,40,0.22)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628]"
    >
      {cover ? (
        <>
            {fit === "contain" && (
              <Image
                src={cover}
                alt=""
                fill
                aria-hidden
                className="object-cover scale-110 blur-xl opacity-55"
                sizes="(max-width: 768px) 50vw, 20vw"
                unoptimized={cover.startsWith("/api/")}
              />
            )}
          <Image
            src={cover}
            alt=""
            fill
            className={`${
              fit === "cover" ? "object-cover" : "object-contain"
            } object-center transition-transform duration-500 group-hover:scale-[1.04]`}
            sizes="(max-width: 768px) 50vw, 20vw"
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
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: overlay }}
      />

      <div className="relative z-10">
        <div className="text-[10px] font-medium uppercase tracking-[1.5px] text-white/85">
          {industryLabel(client.industry, client.industryCustom, locale) || "—"}
        </div>
        <div className="mt-1 text-[13px] font-medium leading-snug text-white">
          {client.name}
        </div>
        {result ? (
          <span className="mt-2 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {result.value} · {result.label}
          </span>
        ) : (
          client.tagline && (
            <span className="mt-1 line-clamp-1 text-[11px] text-white/80">
              {client.tagline}
            </span>
          )
        )}
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Logo strip — user-scrollable horizontal list                              */
/* -------------------------------------------------------------------------- */

type StripItem = { name: string; src?: string; darkCard?: boolean };

function LogoStrip({ items }: { items: StripItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-12 bg-gradient-to-r from-white to-transparent rtl:bg-gradient-to-l"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-white to-transparent rtl:bg-gradient-to-r"
      />

      <div
        className="logo-scroll flex snap-x snap-mandatory gap-8 overflow-x-auto rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-6"
        role="region"
        aria-label="Trusted by companies"
        tabIndex={0}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex h-14 min-w-[140px] shrink-0 snap-start items-center justify-center"
            title={item.name}
          >
            {item.src ? (
              <Image
                src={item.src}
                alt={item.name}
                width={160}
                height={56}
                className={`h-14 w-auto max-w-[160px] object-contain ${
                  item.darkCard ? "rounded-md bg-[#0A1628] p-1.5" : ""
                }`}
                unoptimized={item.src.startsWith("/api/")}
              />
            ) : (
              <span className="text-[15px] font-medium text-[#0A1628]">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default async function ClientShowcase({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const t = await getTranslations({ locale, namespace: "logoBar" });

  const [profiles, logos] = await Promise.all([
    getPublishedClientProfiles(locale),
    getClientLogos(),
  ]);

  const featured = profiles.find((p) => p.featured) || profiles[0] || null;
  const smallCards = profiles.filter((p) => p.id !== featured?.id).slice(0, 4);

  const stripItems: StripItem[] =
    logos.length > 0
      ? logos.map((l: CmsClientLogo) => ({
          name: l.name,
          src: mediaUrl(l.logo),
          darkCard: !!l.darkCard,
        }))
      : CLIENT_LOGOS.map((l) => ({
          name: l.alt,
          src: l.src,
          darkCard: !!l.darkCard,
        }));

  const showBento = !!featured;

  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="recent-work">
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#1E3A5F]">
            {isAr ? "أعمالنا الأخيرة" : "Our recent work"}
          </p>
          <h2
            id="recent-work"
            className="mt-2 font-display rtl:font-arabic-display text-[24px] font-medium leading-tight text-[#0A1628] md:text-[26px]"
          >
            {isAr
              ? "أنظمة حقيقية. شركات حقيقية. نتائج حقيقية."
              : "Real systems. Real businesses. Real results."}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#64748B]">
            {t("title")}
          </p>
        </div>

        {showBento && (
          <div className="grid gap-2.5 md:grid-cols-[1.7fr_1fr_1fr] md:grid-rows-2">
            <HeroCard client={featured} locale={locale} isAr={isAr} />
            {smallCards.map((c) => (
              <SmallCard key={c.id} client={c} locale={locale} isAr={isAr} />
            ))}
            {Array.from({ length: Math.max(0, 4 - smallCards.length) }).map(
              (_, i) => (
                <div
                  key={`pad-${i}`}
                  aria-hidden
                  className="hidden min-h-[140px] rounded-[14px] border border-dashed border-[#E2E8F0] bg-[#F8FAFC]/60 md:block"
                />
              ),
            )}
          </div>
        )}

        <div className="mt-8">
          <LogoStrip items={stripItems} />
        </div>
      </div>
    </section>
  );
}
