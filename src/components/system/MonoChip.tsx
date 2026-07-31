import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small bordered mono label — tech tags, capability chips, category marks.
 * Tool and framework names stay Latin in both locales, so the contents get an
 * LTR island.
 */
export function MonoChip({
  children,
  className,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  /** Gold border/text on hover. Use inside the dark Stack band. */
  interactive?: boolean;
}) {
  return (
    <span
      className={cn(
        "mono ltr-island inline-block rounded-chip border border-hair px-2.5 py-[5px] text-[11.5px] text-fgbody",
        interactive && "transition-colors hover:border-gold hover:text-gold",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Status pill with an optional pulsing dot — the hero's "Software house ·
 * Cairo, Egypt & the Gulf" badge and the header's live marker.
 */
export function Pill({
  children,
  dot,
  className,
}: {
  children: ReactNode;
  dot?: "gold" | "live";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-2.5 rounded-chip border border-hair bg-paper-subtle px-3 py-[7px] text-[11px] uppercase text-fgbody",
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn(
            "block h-1.5 w-1.5 rounded-full",
            dot === "gold" ? "animate-tick bg-gold" : "bg-live",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
