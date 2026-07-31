import Link from "next/link";
import type { ReactNode } from "react";

import { cn, whatsappLink } from "@/lib/utils";

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
 * WhatsApp action. Same ink treatment as the primary, with an optional live
 * dot — the design's header CTA, not a green vendor-coloured button.
 */
export function WhatsAppButton({
  size = "md",
  className,
  message,
  dot,
  children,
  ...props
}: BaseProps & { message?: string; dot?: boolean }) {
  return (
    <Inner
      {...props}
      external
      href={props.href || whatsappLink(message)}
      className={cn(BASE, SIZES[size], "group bg-ink text-white hover:bg-gold hover:text-ink", className)}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="block h-[7px] w-[7px] rounded-full bg-live transition-colors group-hover:bg-ink"
        />
      ) : null}
      {children}
    </Inner>
  );
}
