"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

type Props = {
  firstLine: string;
  secondLine: string;
  className?: string;
};

let pluginsRegistered = false;

function registerGsap() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export default function HeroHeadline({ firstLine, secondLine, className }: Props) {
  registerGsap();
  const ref = useRef<HTMLHeadingElement>(null);
  const firstWords = useMemo(() => splitWords(firstLine), [firstLine]);
  const secondWords = useMemo(() => splitWords(secondLine), [secondLine]);

  useGSAP(
    () => {
      if (!ref.current || typeof window === "undefined") return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      if (reduce) {
        gsap.set(words, { autoAlpha: 1, yPercent: 0 });
        return;
      }

      gsap.from(words, {
        autoAlpha: 0,
        yPercent: 110,
        duration: 0.75,
        stagger: 0.045,
        ease: "power3.out",
      });

      const section = ref.current.closest("section");
      const parallax = section?.querySelector(".hero-parallax");
      if (section && parallax) {
        gsap.to(parallax, {
          y: 70,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: ref, dependencies: [firstLine, secondLine] },
  );

  const renderLine = (words: string[], lineClassName: string) => (
    <span className={cn("block", lineClassName)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="me-[0.28em] inline-block overflow-hidden align-bottom">
          <span className="hero-word inline-block will-change-transform">{word}</span>
        </span>
      ))}
    </span>
  );

  return (
    <h1
      ref={ref}
      className={cn(
        "text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]",
        className,
      )}
    >
      {renderLine(firstWords, "text-cream")}
      {renderLine(secondWords, "kw-gold mt-1")}
    </h1>
  );
}