"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

type RevealTag = "div" | "section" | "article" | "aside" | "li" | "span" | "p";

type Props = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  once?: boolean;
  start?: string;
};

let pluginsRegistered = false;

function registerGsap() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

export default function ScrollReveal({
  children,
  as: Component = "div",
  className,
  delay = 0,
  distance = 32,
  duration = 0.75,
  once = true,
  start = "top 84%",
}: Props) {
  registerGsap();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || typeof window === "undefined") return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(ref.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: distance },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
            once,
          },
        },
      );

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: ref, dependencies: [delay, distance, duration, once, start] },
  );

  return (
    <Component ref={ref as never} className={cn("reveal", className)} data-gsap-managed="true">
      {children}
    </Component>
  );
}