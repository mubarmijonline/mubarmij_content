"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Pixel radius the button can travel toward the cursor */
  strength?: number;
};

/**
 * Magnetic CTA — the button gently follows the cursor when nearby and
 * springs back on leave. Disabled on touch / reduced-motion.
 */
export default function MagneticCTA({
  href,
  children,
  className = "btn-primary text-base md:text-lg px-8 py-4",
  ariaLabel,
  strength = 14,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    setPos({ x: dx * strength, y: dy * strength });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${className} will-change-transform`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.x === 0 && pos.y === 0
          ? "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "transform 120ms ease-out",
      }}
    >
      <span
        className="inline-block"
        style={{
          transform: `translate3d(${pos.x * 0.5}px, ${pos.y * 0.5}px, 0)`,
          transition: pos.x === 0 && pos.y === 0
            ? "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 120ms ease-out",
        }}
      >
        {children}
      </span>
    </Link>
  );
}
