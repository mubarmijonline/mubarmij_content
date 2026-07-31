"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ClientSummary } from "@/lib/v1";
import { cmsMedia, cn, localePath } from "@/lib/utils";

const UI = {
  en: { all: "All", view: "View case study", empty: "No case studies in this category yet." },
  ar: { all: "الكل", view: "شاهد الحالة", empty: "لا توجد دراسات حالة في هذا التصنيف بعد." },
} as const;

/** Filterable grid of case studies. Six real categories across the portfolio. */
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
    for (const c of clients) {
      if (c.category_label) m.set(c.category_label.toLowerCase(), c.category_label);
    }
    return Array.from(m.entries());
  }, [clients]);
  const [active, setActive] = useState<string | null>(null);

  const list = active ? clients.filter((c) => c.category_label?.toLowerCase() === active) : clients;

  return (
    <div>
      {cats.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <Chip active={active === null} onClick={() => setActive(null)}>
            {ui.all}
          </Chip>
          {cats.map(([key, label]) => (
            <Chip key={key} active={active === key} onClick={() => setActive(key)}>
              {label}
            </Chip>
          ))}
        </div>
      ) : null}

      {list.length ? (
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const img = cmsMedia(c.thumb_url || c.logo_url);
            return (
              <a
                key={c.slug}
                href={localePath(locale, `/case-studies/${c.slug}`)}
                className="focus-gold group block overflow-hidden rounded-card border border-hair bg-surface transition duration-300 hover:-translate-y-1 hover:border-hairhov hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-well">
                  {img ? (
                    <Image
                      src={img}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className={cn(
                        "transition-transform duration-500 group-hover:scale-105",
                        c.thumb_url ? "object-cover" : "object-contain p-6",
                      )}
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <span className="mono text-eyebrow uppercase text-fgmuted">
                    {c.category_label}
                  </span>
                  <h3 className="mt-2 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-relaxed text-fgbody">
                    {c.tagline}
                  </p>
                  <span className="mono mt-4 inline-flex items-center gap-2 text-[11px] uppercase text-fgmuted transition-colors group-hover:text-gold-deep">
                    {ui.view}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    >
                      {locale === "ar" ? "←" : "→"}
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 text-center text-fgmuted">{ui.empty}</p>
      )}
    </div>
  );
}

function Chip({
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
        "mono focus-gold rounded-chip border px-3 py-1.5 text-[11px] uppercase transition-colors",
        active
          ? "border-ink bg-ink text-white"
          : "border-hair text-fgmuted hover:border-hairhov hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
