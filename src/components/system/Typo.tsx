import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The gold full stop that closes every headline in the design.
 *
 * A real span rather than a ::after pseudo-element, so bidi resolution puts
 * it on the correct side in Arabic and translators never have to carry it
 * inside the string.
 */
export function GoldPeriod() {
  return <span className="text-gold">.</span>;
}

/**
 * Direction-correct arrow glyph. Chosen by locale on the server — mirroring a
 * text node with scaleX(-1) also mirrors any Latin next to it.
 */
export function Arrow({ locale, className }: { locale: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("mono", className)}>
      {locale === "ar" ? "←" : "→"}
    </span>
  );
}

/** "All case studies →" — inline link with a nudging arrow. */
export function LinkArrow({
  href,
  locale,
  children,
  className,
  external,
}: {
  href: string;
  locale: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = cn(
    "group inline-flex items-center gap-2 font-display text-[15px] font-semibold text-fg transition-colors hover:text-gold-deep focus-gold",
    className,
  );
  const inner = (
    <>
      {children}
      <Arrow
        locale={locale}
        className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
      />
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Section headline. Poppins 700 at the design's clamp + tracking. */
export function SectionTitle({
  children,
  className,
  as = "h2",
  period = true,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  period?: boolean;
}) {
  const Tag = as;
  const size = as === "h1" ? "text-d1" : "text-d2";
  return (
    <Tag className={cn("font-display font-bold text-fg", size, className)}>
      {children}
      {period ? <GoldPeriod /> : null}
    </Tag>
  );
}
