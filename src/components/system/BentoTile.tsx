import Link from "next/link";
import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "gold" | "outlineGold";

const VARIANTS: Record<Variant, string> = {
  default: "bg-panel border border-line text-cream hover:border-gold",
  gold: "bg-gold border border-gold text-gold-ink",
  outlineGold: "bg-panel border border-gold/60 text-cream hover:border-gold",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  as?: ElementType;
  href?: string;
  hover?: boolean;
};

/** Bento grid tile on dark. Composes into CSS-grid layouts. */
export function BentoTile({ children, variant = "default", className, as, href, hover = true }: Props) {
  const cls = cn(
    "rounded-tile p-5 transition-all duration-200",
    VARIANTS[variant],
    hover && "hover:-translate-y-1",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cn(cls, "block focus-gold")}>
        {children}
      </Link>
    );
  }
  const Tag = as || "div";
  return <Tag className={cls}>{children}</Tag>;
}
