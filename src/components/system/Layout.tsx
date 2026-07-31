import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Centered 1280px measure with the design's 20/32px gutters. */
export function Shell({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as as ElementType;
  return <Tag className={cn("shell", className)}>{children}</Tag>;
}

const TONE = {
  light: "surf-light",
  subtle: "surf-subtle",
  dark: "surf-dark",
} as const;

const PAD = {
  lg: "sect",
  sm: "sect-sm",
  none: "",
} as const;

/**
 * A full-bleed band. `tone` swaps the surface scope, which is what makes every
 * primitive inside invert without a single dark: variant.
 */
export function Section({
  id,
  tone = "light",
  pad = "lg",
  rule = true,
  children,
  className,
}: {
  id?: string;
  tone?: keyof typeof TONE;
  pad?: keyof typeof PAD;
  /** Hairline on the block-end edge. Suppress it where a dark band follows. */
  rule?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(TONE[tone], PAD[pad], rule && tone !== "dark" && "border-b border-hair", className)}
    >
      {children}
    </section>
  );
}

/**
 * The hairline grid — the design's core layout device, where the rules *are*
 * the structure.
 *
 * Every cell carries the same `border-e border-b`; the wrapper's negative
 * inline-end / block-end margins swallow the outermost rules. `-me-px` is a
 * logical margin, so the whole thing flips correctly under RTL with no
 * direction-specific CSS.
 *
 * Cells must be rendered with <HairCell> (or carry the same border classes).
 */
export function HairGrid({
  cols = 1,
  mdCols,
  lgCols,
  children,
  className,
}: {
  cols?: 1 | 2 | 3 | 4 | 5;
  mdCols?: 1 | 2 | 3 | 4 | 5;
  lgCols?: 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
  className?: string;
}) {
  // Written out rather than interpolated so Tailwind's scanner keeps them.
  const base = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  } as const;
  const md = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  } as const;
  const lg = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
  } as const;

  return (
    <div
      className={cn(
        "-mb-px -me-px grid",
        base[cols],
        mdCols && md[mdCols],
        lgCols && lg[lgCols],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HairCell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-w-0 border-b border-e border-hair", className)}>{children}</div>;
}
