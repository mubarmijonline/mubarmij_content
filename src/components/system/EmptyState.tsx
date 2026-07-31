import Link from "next/link";

import { cn } from "@/lib/utils";
import { Arrow } from "./Typo";

/**
 * Shown where a collection is genuinely empty (blog, resources today).
 *
 * The rule across the site is that a section with no data doesn't render at
 * all — this is the exception for routes that exist in the nav and therefore
 * have to answer with something rather than an empty grid.
 */
export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
  locale,
  className,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
  locale: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-hair bg-paper-subtle px-6 py-16 text-center",
        className,
      )}
    >
      <h2 className="font-display text-d3 font-semibold text-fg">{title}</h2>
      <p className="mx-auto mt-3 max-w-[38em] text-copy text-fgbody">{body}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="focus-gold mt-7 inline-flex items-center gap-2 rounded-btn bg-ink px-6 py-3.5 font-display text-[15px] font-semibold text-white transition-colors hover:bg-gold hover:text-ink"
        >
          {ctaLabel}
          <Arrow locale={locale} />
        </Link>
      ) : null}
    </div>
  );
}
