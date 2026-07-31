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
 * Gutters: cells get symmetric inline padding so text never touches a rule,
 * and the grid is pulled outward by exactly that padding. The result is the
 * mockup's behaviour for free, at any number of rows — the first column's
 * text sits flush on the measure, the last column's ends on it, and every
 * interior column is inset from the rule on both sides.
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

  // Inline gutter, symmetric at exactly the cell padding. It must not exceed
  // the shell's own padding: an earlier -me-[21px] (padding + the trailing
  // rule) pushed the grid 1px past the viewport and gave every mobile page a
  // horizontal scroll. A single-column grid has no interior rules, so it only
  // takes the gutter once it actually splits into columns at md.
  const gutter =
    cols > 1 ? "[&>*]:px-5 -ms-5 -me-5" : "md:[&>*]:px-5 md:-ms-5 md:-me-5";

  return (
    <div
      data-gsap="stagger"
      className={cn(
        "-mb-px grid",
        gutter,
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
