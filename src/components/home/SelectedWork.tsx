import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { ClientSummary } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import { ImageWell, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod, LinkArrow } from "@/components/system/Typo";

const COPY = {
  en: { eyebrow: "Selected work", title: "Shipped, live, and selling", all: "All case studies" },
  ar: { eyebrow: "مختارات من أعمالنا", title: "متسلّم، شغّال، وبيبيع", all: "كل دراسات الحالة" },
} as const;

/**
 * Two large cards then a row of three smaller ones.
 *
 * The list is pre-filtered to clients that actually have a case study — the
 * five logo-only stubs in the CMS would otherwise render as empty tiles. With
 * fewer than three entries the small row is dropped rather than half-filled.
 */
export default function SelectedWork({
  locale,
  index,
  clients,
}: {
  locale: Locale;
  index: string;
  clients: ClientSummary[];
}) {
  if (!clients.length) return null;

  const t = COPY[locale];
  const large = clients.slice(0, 2);
  const small = clients.length >= 3 ? clients.slice(2, 5) : [];

  return (
    <section id="work" className="surf-light border-b border-hair">
      <Shell className="sect">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div className="min-w-0">
            <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
            <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
              {t.title}
              <GoldPeriod />
            </h2>
          </div>
          <LinkArrow href={localePath(locale, "/case-studies")} locale={locale}>
            {t.all}
          </LinkArrow>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {large.map((c) => (
            <WorkCard key={c.slug} locale={locale} client={c} height={310} />
          ))}
        </div>

        {small.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {small.map((c) => (
              <WorkCard key={c.slug} locale={locale} client={c} height={190} compact />
            ))}
          </div>
        ) : null}
      </Shell>
    </section>
  );
}

function WorkCard({
  locale,
  client,
  height,
  compact,
}: {
  locale: Locale;
  client: ClientSummary;
  height: number;
  compact?: boolean;
}) {
  return (
    <Link
      href={localePath(locale, `/case-studies/${client.slug}`)}
      className="focus-gold group block overflow-hidden rounded-card border border-hair bg-surface transition duration-300 hover:-translate-y-1 hover:border-hairhov hover:shadow-lift"
    >
      <ImageWell
        src={client.thumb_url || client.logo_url}
        alt={client.name}
        height={height}
        fit={client.thumb_url ? "cover" : "contain"}
        sizes={compact ? "(max-width: 1024px) 100vw, 400px" : "(max-width: 768px) 100vw, 600px"}
      />
      <div className={compact ? "px-5 pb-5 pt-4" : "px-6 pb-6 pt-5"}>
        <div className="mono text-eyebrow uppercase text-fgmuted">{client.category_label}</div>
        <h3
          className={
            compact
              ? "mt-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg"
              : "mt-2.5 font-display text-[25px] font-semibold tracking-[-0.02em] text-fg"
          }
        >
          {client.name}
        </h3>
        {client.tagline ? (
          <p className="mt-2 text-[15px] leading-relaxed text-fgbody">{client.tagline}</p>
        ) : null}
      </div>
    </Link>
  );
}
