import Image from "next/image";

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

/** Trusted-company logos — a single clean row, each shown once. */
export function LogoBar({ logos, eyebrow, dir = "ltr", className }: Props) {
  if (!logos.length) return null;

  return (
    <section className={cn(styles.section, className)} dir={dir}>
      <div className={styles.container}>
        {eyebrow ? <p className={styles.heading}>{eyebrow}</p> : null}
        <div className={styles.row}>
          {logos.map((logo) => {
            const d = LOGO_DIMENSIONS[logo.alt] ?? { width: 280, height: 140 };
            const scale = LOGO_SCALE[logo.alt] ?? 1;
            const img = (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={d.width}
                height={d.height}
                quality={100}
                sizes="150px"
                className={styles.logo}
                style={{ "--logo-scale": scale } as React.CSSProperties}
              />
            );
            return logo.href ? (
              <a
                key={logo.alt}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={logo.alt}
                className={styles.item}
              >
                {img}
              </a>
            ) : (
              <span key={logo.alt} aria-label={logo.alt} className={styles.item}>
                {img}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
