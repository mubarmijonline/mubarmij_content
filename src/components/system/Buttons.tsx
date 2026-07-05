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
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-transform duration-200 hover:scale-[1.03] focus-gold disabled:opacity-60 disabled:hover:scale-100";

function Inner({ href, external, type = "button", onClick, ariaLabel, disabled, className, children }: BaseProps & { className: string }) {
  if (href && !disabled) {
    if (external) {
      return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} data-gsap-button>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className} aria-label={ariaLabel} data-gsap-button>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={className} aria-label={ariaLabel} onClick={onClick} disabled={disabled} data-gsap-button>
      {children}
    </button>
  );
}

/** Primary action. Gold fill, gold-ink text. One per screenful (gold rationing). */
export function GoldButton({ size = "md", className, ...props }: BaseProps) {
  return <Inner {...props} className={cn(BASE, SIZES[size], "bg-gold text-gold-ink shadow-gold hover:bg-gold-light", className)} />;
}

/** Secondary action. Transparent with gold border + gold text. */
export function GhostButton({ size = "md", className, ...props }: BaseProps) {
  return <Inner {...props} className={cn(BASE, SIZES[size], "border border-gold text-gold hover:bg-gold/10", className)} />;
}

/** WhatsApp action. Green fill, white text. Defaults to wa.me with prefilled message. */
export function WhatsAppButton({
  size = "md",
  className,
  message,
  children,
  ...props
}: BaseProps & { message?: string }) {
  return (
    <Inner
      {...props}
      external
      href={props.href || whatsappLink(message)}
      className={cn(BASE, SIZES[size], "bg-whatsapp text-white hover:opacity-95", className)}
    >
      {children}
    </Inner>
  );
}
