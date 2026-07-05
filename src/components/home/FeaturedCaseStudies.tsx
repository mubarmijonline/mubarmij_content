import type { Locale } from "@/i18n/config";
import type { ClientSummary } from "@/lib/v1";
import { cmsMedia, localePath } from "@/lib/utils";
import { GhostButton, Reveal, SectionEyebrow } from "@/components/system";

const COPY = {
  en: { eyebrow: "Selected work", title: "Results we've shipped", view: "View case study", all: "See all case studies" },
  ar: { eyebrow: "أعمال مختارة", title: "نتائج سلّمناها", view: "شاهد الحالة", all: "كل دراسات الحالة" },
} as const;

/** P1 §5 — light, full-width responsive grid of featured case studies from /v1/clients?featured=true. */
export default function FeaturedCaseStudies({
  locale,
  clients,
}: {
  locale: Locale;
  clients: ClientSummary[];
}) {
  if (!clients.length) return null;
  const t = COPY[locale];
  return (
    <section className="bg-bglight px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
            <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
              {t.title}
            </h2>
          </div>
          <GhostButton href={localePath(locale, "/case-studies")} className="hidden md:inline-flex">
            {t.all}
          </GhostButton>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => {
            const img = cmsMedia(c.thumb_url || c.logo_url);
            return (
              <a
                key={c.slug}
                href={localePath(locale, `/case-studies/${c.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-tile border border-neutral-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 focus-gold"
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-200">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">
                    {c.category_label}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-navy-deep">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{c.tagline}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-navy group-hover:text-gold">
                    {t.view}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <GhostButton href={localePath(locale, "/case-studies")} className="w-full">
            {t.all}
          </GhostButton>
        </div>
      </div>
    </section>
  );
}
