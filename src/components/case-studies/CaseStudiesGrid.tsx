"use client";

import { useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ClientSummary } from "@/lib/v1";
import { cmsMedia, cn, localePath } from "@/lib/utils";

const UI = {
  en: { all: "All", view: "View case study", empty: "No case studies in this category yet." },
  ar: { all: "الكل", view: "شاهد الحالة", empty: "لا توجد دراسات حالة في هذا التصنيف بعد." },
} as const;

/** Filterable grid of case studies (category pills + cards). */
export default function CaseStudiesGrid({
  locale,
  clients,
}: {
  locale: Locale;
  clients: ClientSummary[];
}) {
  const ui = UI[locale];
  const cats = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of clients) if (c.category_label) m.set(c.category_label.toLowerCase(), c.category_label);
    return Array.from(m.entries());
  }, [clients]);
  const [active, setActive] = useState<string | null>(null);

  const list = active
    ? clients.filter((c) => c.category_label?.toLowerCase() === active)
    : clients;

  return (
    <div>
      {cats.length > 1 ? (
        <div className="flex flex-wrap justify-center gap-2">
          <Pill active={active === null} onClick={() => setActive(null)}>
            {ui.all}
          </Pill>
          {cats.map(([key, label]) => (
            <Pill key={key} active={active === key} onClick={() => setActive(key)}>
              {label}
            </Pill>
          ))}
        </div>
      ) : null}

      {list.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const img = cmsMedia(c.thumb_url || c.logo_url);
            return (
              <a
                key={c.slug}
                href={localePath(locale, `/case-studies/${c.slug}`)}
                className="group block overflow-hidden rounded-tile border border-neutral-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 focus-gold"
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
                <div className="p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">
                    {c.category_label}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-navy-deep">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{c.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold">
                    {ui.view}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-neutral-500">{ui.empty}</p>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-pill border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors focus-gold",
        active
          ? "border-gold bg-gold text-gold-ink"
          : "border-neutral-300 text-neutral-500 hover:border-gold hover:text-navy-deep",
      )}
    >
      {children}
    </button>
  );
}
