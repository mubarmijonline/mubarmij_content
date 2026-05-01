"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Wraps children in a span/div that fades + slides up the first time it scrolls
 * into view. Server-rendered content stays visible if JS fails to hydrate.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delayMs = 0,
  className = "",
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.15,
  style,
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  delayMs?: number;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  // We render via createElement so `as` can be any tag name.
  const Component = Tag as unknown as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delayMs}ms`, ...style }}
    >
      {children}
    </Component>
  );
}
