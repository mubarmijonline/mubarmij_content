"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/**
 * In-view reveal on a plain IntersectionObserver — no animation library.
 *
 * The hidden state is expressed as `data-reveal="hidden"`, and globals.css
 * only honours it inside `@media (scripting: enabled)`. So a visitor without
 * JS (or on a browser that doesn't support the query) gets the content
 * outright rather than a permanently invisible page.
 *
 * The `variant` prop is accepted and ignored — it exists so the ~30 call
 * sites that still pass a motion variant keep compiling.
 */

type RevealProps = {
  children: ReactNode;
  variant?: unknown;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
};

function useInView(once: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return { ref, shown };
}

export function Reveal({ children, className, as = "div", delay = 0, once = true }: RevealProps) {
  const Tag = as as ElementType;
  const { ref, shown } = useInView(once);
  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "shown" : "hidden"}
      className={cn(shown && "animate-rise", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds between children. */
  delay?: number;
  once?: boolean;
};

/**
 * Container that reveals its <StaggerItem> descendants in sequence. The step
 * is a CSS custom property injected onto each direct child, so the animation
 * itself stays in the stylesheet.
 */
export function Stagger({ children, className, as = "div", delay = 0.08, once = true }: StaggerProps) {
  const Tag = as as ElementType;
  const { ref, shown } = useInView(once);

  let i = 0;
  const indexed = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const props = child.props as { style?: CSSProperties };
    const style = { ...(props.style ?? {}), ["--i" as string]: i++ } as CSSProperties;
    return cloneElement(child as React.ReactElement<{ style?: CSSProperties }>, { style });
  });

  return (
    <Tag
      ref={ref}
      data-stagger={shown ? "shown" : "hidden"}
      style={{ ["--stg-step" as string]: `${delay}s` } as CSSProperties}
      className={className}
    >
      {indexed}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: unknown;
  style?: CSSProperties;
}) {
  const Tag = as as ElementType;
  return (
    <Tag className={cn("stg-item", className)} style={style}>
      {children}
    </Tag>
  );
}
