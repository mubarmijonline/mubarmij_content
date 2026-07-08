"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";
import styles from "./LogoBar.module.css";

export type LogoItem = { src: string; alt: string; href?: string; darkCard?: boolean };

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
  "Al Mal3ab": 1.12,
  Amwally: 1.08,
  Eltime: 1.3,
  Fantazia: 1.12,
  "Masar GP": 1.08,
  Menus: 1.32,
  "OG's HUB": 1.28,
  "Padel Swift": 1.34,
  "Ramy Rafaat": 1.12,
};

let pluginsRegistered = false;

function registerGsap() {
  if (pluginsRegistered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

function Chip({ logo, k }: { logo: LogoItem; k: string }) {
  const dimensions = LOGO_DIMENSIONS[logo.alt] ?? { width: 280, height: 140 };
  const scale = LOGO_SCALE[logo.alt] ?? 1;
  const img = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={dimensions.width}
      height={dimensions.height}
      quality={100}
      sizes="150px"
      className={styles.logo}
      style={{ "--logo-scale": scale } as React.CSSProperties}
    />
  );
  return logo.href ? (
    <a
      key={k}
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={logo.alt}
      data-dark={logo.darkCard ? "true" : undefined}
      className={styles.chip}
    >
      {img}
    </a>
  ) : (
    <span key={k} data-dark={logo.darkCard ? "true" : undefined} className={styles.chip} aria-label={logo.alt}>
      {img}
    </span>
  );
}

/** Trusted-company logo wall — a dual-row, edge-faded marquee of legible chips. */
export function LogoBar({ logos, eyebrow, dir = "ltr", className }: Props) {
  registerGsap();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || typeof window === "undefined") return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const marquee = sectionRef.current.querySelector(`.${styles.marquee}`);
      if (reduce || !marquee) return;

      gsap.from(marquee, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [dir, logos.length] },
  );

  if (!logos.length) return null;

  // Two rows drifting in opposite directions; each row duplicates its set for a seamless loop.
  const rowA = logos;
  const rowB = [...logos].reverse();

  return (
    <section ref={sectionRef} className={cn(styles.section, className)} dir={dir}>
      <div className={styles.container}>
        {eyebrow ? <p className={styles.heading}>{eyebrow}</p> : null}
      </div>

      <div className={styles.marquee}>
        <div className={styles.row}>
          <div className={cn(styles.track, styles.left)}>
            {rowA.map((l, i) => (
              <Chip key={`a1-${l.alt}-${i}`} logo={l} k={`a1-${l.alt}-${i}`} />
            ))}
            {rowA.map((l, i) => (
              <Chip key={`a2-${l.alt}-${i}`} logo={l} k={`a2-${l.alt}-${i}`} />
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <div className={cn(styles.track, styles.right)}>
            {rowB.map((l, i) => (
              <Chip key={`b1-${l.alt}-${i}`} logo={l} k={`b1-${l.alt}-${i}`} />
            ))}
            {rowB.map((l, i) => (
              <Chip key={`b2-${l.alt}-${i}`} logo={l} k={`b2-${l.alt}-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
