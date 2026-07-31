import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { MonoChip } from "./MonoChip";

/**
 * A capability row: title on the start edge, a mono meta value (a duration,
 * usually) on the end edge, body copy, then chips. Used by the Capabilities
 * band and the services page.
 *
 * `meta` is optional because the CMS `duration` field is optional — an absent
 * value leaves the cell empty rather than dropping the row.
 */
export function SpecRow({
  title,
  meta,
  children,
  chips,
  className,
}: {
  title: string;
  meta?: string | null;
  children?: ReactNode;
  chips?: string[] | null;
  className?: string;
}) {
  return (
    <div className={cn("transition-colors hover:bg-paper-subtle", className)}>
      <div className="flex items-baseline justify-between gap-5">
        <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-fg md:text-[26px]">
          {title}
        </h3>
        {meta ? <span className="mono shrink-0 text-[11px] text-fgfaint">{meta}</span> : null}
      </div>
      {children ? (
        <p className="mt-2.5 max-w-[44em] text-copy text-fgbody">{children}</p>
      ) : null}
      {chips?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <MonoChip key={c}>{c}</MonoChip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** The services page's "what's included" list, with mono slash bullets. */
export function SlashList({ items, className }: { items: string[]; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <div key={item} className="flex gap-3 text-[15.5px] leading-relaxed text-fgbody">
          <span aria-hidden="true" className="mono shrink-0 text-gold">
            /
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
