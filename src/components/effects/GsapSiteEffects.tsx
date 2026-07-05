"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

function registerGsap() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

export default function GsapSiteEffects() {
  registerGsap();

  useGSAP(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    ScrollTrigger.batch(".reveal:not([data-gsap-managed='true'])", {
      start: "top 84%",
      once: true,
      onEnter: (batch) => {
        const elements = batch as Element[];
        gsap.fromTo(
          elements,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        );
      },
    });

    const buttons = gsap.utils.toArray<HTMLElement>("[data-gsap-button]");
    const cleanups: Array<() => void> = [];

    buttons.forEach((button) => {
      const enter = () => {
        gsap.to(button, {
          scale: 1.04,
          boxShadow: "0 16px 42px -22px rgba(244,201,122,0.75)",
          duration: 0.24,
          ease: "power3.out",
        });
      };
      const leave = () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: "",
          duration: 0.28,
          ease: "power3.out",
        });
      };
      button.addEventListener("mouseenter", enter);
      button.addEventListener("mouseleave", leave);
      button.addEventListener("focus", enter);
      button.addEventListener("blur", leave);
      cleanups.push(() => {
        button.removeEventListener("mouseenter", enter);
        button.removeEventListener("mouseleave", leave);
        button.removeEventListener("focus", enter);
        button.removeEventListener("blur", leave);
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count);
      if (!Number.isFinite(target)) return;
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 84%", once: true },
        onUpdate: () => {
          node.textContent = Math.round(state.value).toLocaleString();
        },
      });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}