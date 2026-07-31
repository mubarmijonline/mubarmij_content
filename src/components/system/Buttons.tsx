import Link from "next/link";
import type { ReactNode } from "react";

import { cn, whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./BrandIcons";

type BaseProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  size?: "md" | "lg";
};

const SIZES = {
  md: "px-5 py-3 text-[14.5px]",
  lg: "px-6 py-4 text-[15.5px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-btn font-display font-semibold transition-colors duration-200 focus-gold disabled:opacity-60";

function Inner({
  href,
  external,
  type = "button",
  onClick,
  ariaLabel,
  disabled,
  className,
  children,
}: BaseProps & { className: string }) {
  if (href && !disabled) {
    if (external) {
      return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={className} aria-label={ariaLabel} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/**
 * Primary action: solid ink, inverting to gold on hover. Gold is an accent in
 * this design, not a fill — so the old gold button is no longer the primary.
 */
export function DarkButton({ size = "md", className, ...props }: BaseProps) {
  return (
    <Inner
      {...props}
      className={cn(BASE, SIZES[size], "bg-ink text-white hover:bg-gold hover:text-ink", className)}
    />
  );
}

/** Alias kept so existing call sites keep working through the migration. */
export const GoldButton = DarkButton;

/** Secondary action: hairline outline, ink text. */
export function GhostButton({ size = "md", className, ...props }: BaseProps) {
  return (
    <Inner
      {...props}
      className={cn(BASE, SIZES[size], "border border-hairbtn text-fg hover:border-ink", className)}
    />
  );
}

/**
 * WhatsApp action. Ink button carrying the WhatsApp mark in its own brand
 * green, so the channel is recognisable at a glance on any surface.
 */
export function WhatsAppButton({
  size = "md",
  className,
  message,
  tone = "solid",
  children,
  ...props
}: BaseProps & {
  message?: string;
  /** Real variants, not className overrides — Tailwind resolves conflicting
   *  utilities by stylesheet order, so an override could lose silently. */
  tone?: "solid" | "outline";
  /** @deprecated the brand icon replaced it */
  dot?: boolean;
}) {
  return (
    <Inner
      {...props}
      external
      href={props.href || whatsappLink(message)}
      className={cn(
        BASE,
        SIZES[size],
        tone === "outline"
          ? "border border-hairbtn text-fg hover:border-ink"
          : "bg-ink text-white hover:bg-gold hover:text-ink",
        className,
      )}
    >
      <WhatsAppIcon size={18} />
      {children}
    </Inner>
  );
}
