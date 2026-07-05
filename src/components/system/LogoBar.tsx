"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";
import styles from "./LogoBar.module.css";

export type LogoItem = { src: string; alt: string; href?: string };

type Props = {
  logos: LogoItem[];
  eyebrow?: string;
  dir?: "ltr" | "rtl";
  className?: string;
};

const LOGO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "Al Mal3ab": { width: 512, height: 512 },
  Amwally: { width: 1200, height: 630 },
  Eltime: { width: 2048, height: 2048 },
  Fantazia: { width: 1577, height: 1182 },
  "Masar GP": { width: 2221, height: 2007 },
  Menus: { width: 1024, height: 1024 },
  "OG's HUB": { width: 512, height: 512 },
  "Padel Swift": { width: 1582, height: 1582 },
  "Ramy Rafaat": { width: 1536, height: 1024 },
};

const LOGO_SCALE: Record<string, number> = {
  "Al Mal3ab": 1.18,
  Amwally: 1.12,
  Eltime: 1.58,
  Fantazia: 1.16,
  "Masar GP": 1.12,
  Menus: 1.55,
  "OG's HUB": 1.45,
  "Padel Swift": 1.62,
  "Ramy Rafaat": 1.16,
};

let pluginsRegistered = false;

function registerGsap() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

/** Normalized trusted-company logo showcase with GSAP stagger reveal. */
export function LogoBar({ logos, eyebrow, dir = "ltr", className }: Props) {
  registerGsap();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || typeof window === "undefined") return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>(".logo-item");
      if (reduce) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: dir === "rtl" ? -0.1 : 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [dir, logos.length] },
  );

  if (!logos.length) return null;

  return (
    <section ref={sectionRef} className={cn(styles.section, className)} dir={dir}>
      <div className={styles.container}>
        {eyebrow ? (
          <p className={styles.heading}>{eyebrow}</p>
        ) : null}
        <div className={styles.grid}>
          {logos.map((logo) => {
            const dimensions = LOGO_DIMENSIONS[logo.alt] ?? { width: 280, height: 140 };
            const scale = LOGO_SCALE[logo.alt] ?? 1;
            return logo.href ? (
              <a key={logo.alt} href={logo.href} target="_blank" rel="noopener noreferrer" className={cn(styles.item, "logo-item")}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={dimensions.width}
                  height={dimensions.height}
                  quality={100}
                  sizes="(max-width: 640px) 118px, 140px"
                  className={styles.logo}
                  style={{ "--logo-scale": scale } as React.CSSProperties}
                />
              </a>
            ) : (
              <span key={logo.alt} className={cn(styles.item, "logo-item")}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={dimensions.width}
                  height={dimensions.height}
                  quality={100}
                  sizes="(max-width: 640px) 118px, 140px"
                  className={styles.logo}
                  style={{ "--logo-scale": scale } as React.CSSProperties}
                />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
