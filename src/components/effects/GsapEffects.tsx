"use client";

import { useEffect } from "react";

/**
 * Scroll motion for the whole site, driven by GSAP + ScrollTrigger.
 *
 * Loaded via next/dynamic with ssr:false and imported lazily inside the
 * effect, so neither GSAP nor ScrollTrigger sits in the initial bundle or
 * blocks the LCP paint. Everything it animates is fully visible without it —
 * these are enhancements on top of server-rendered markup, never the thing
 * that makes content appear.
 *
 * Elements opt in with data attributes so the components stay free of motion
 * wiring:
 *   data-gsap="rise"     one element rises and fades in
 *   data-gsap="stagger"  direct children rise in sequence
 *   data-gsap="parallax" drifts slowly against the scroll
 *   data-count="50"      integer counts up when it scrolls into view
 */
export default function GsapEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Honour the OS setting. GSAP is never even fetched in that case.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const EASE = "power2.out";

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-gsap="rise"]').forEach((el) => {
          gsap.from(el, {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-gsap="stagger"]').forEach((group) => {
          const kids = Array.from(group.children) as HTMLElement[];
          if (!kids.length) return;
          gsap.from(kids, {
            y: 22,
            autoAlpha: 0,
            duration: 0.6,
            ease: EASE,
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-gsap="parallax"]').forEach((el) => {
          gsap.to(el, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
        });

        // Count-up for genuinely numeric stats. The DOM already holds the real
        // value, so if this never runs the number is simply there.
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target) || target <= 0) return;
          const suffix = el.dataset.countSuffix ?? "";
          const state = { n: 0 };
          gsap.to(state, {
            n: target,
            duration: 1.1,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(state.n)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = `${target}${suffix}`;
            },
          });
        });
      });

      // Late-loading images change section heights; recompute once settled.
      ScrollTrigger.refresh();
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
