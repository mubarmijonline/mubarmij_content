"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

import { fadeUp, reducedFade, revealProps, stagger } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  variant?: Variants;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
};

/** Single in-view reveal. Collapses to a 150ms fade under reduced motion. */
export function Reveal({ children, variant = fadeUp, className, as = "div", delay = 0, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag
      className={className}
      variants={reduce ? reducedFade : variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
};

/** Container that staggers its <StaggerItem> children at `delay` seconds. */
export function Stagger({ children, className, as = "div", delay = 0.08, once = true }: StaggerProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag
      className={className}
      variants={reduce ? reducedFade : stagger(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, className, as = "div", variant = fadeUp }: { children: ReactNode; className?: string; as?: ElementType; variant?: Variants }) {
  const reduce = useReducedMotion();
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag className={className} variants={reduce ? reducedFade : variant}>
      {children}
    </MotionTag>
  );
}

export { revealProps };
