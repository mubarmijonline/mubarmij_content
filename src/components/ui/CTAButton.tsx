import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "whatsapp" | "leadmagnet";

type Props = {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  size?: "md" | "lg";
};

const classes: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  whatsapp: "btn-whatsapp",
  leadmagnet: "btn-leadmagnet",
};

export default function CTAButton({
  href,
  variant = "primary",
  children,
  className = "",
  external = false,
  ariaLabel,
  type = "button",
  onClick,
  size = "md",
}: Props) {
  const sizeCls = size === "lg" ? "text-base md:text-lg px-8 py-4" : "";
  const cls = `${classes[variant]} ${sizeCls} ${className}`;
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}
