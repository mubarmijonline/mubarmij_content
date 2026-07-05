// v2 "Flagship" motion language — Framer Motion variants.
// Rule: animate transform + opacity only (GPU-composited, CLS-safe).
// Pair with `viewport={{ once: true, margin: "-80px" }}` for reveal-once.

import type { Variants } from "framer-motion";

export const EASE = [0.21, 0.65, 0.32, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

export const slideIn = (dir: "ltr" | "rtl"): Variants => ({
  hidden: { opacity: 0, x: dir === "rtl" ? 32 : -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

export const tileHover = { y: -4, transition: { duration: 0.2, ease: "easeOut" } };

// Standard in-view reveal props for a section root.
export const revealProps = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-80px" } as const,
};

// Reduced-motion fallback: variants collapse to a 150ms opacity fade.
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};
