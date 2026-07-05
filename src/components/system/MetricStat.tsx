"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type Props = {
  /** Value like 80, "50+", "24/7", "95%". Count-up animates the numeric part only. */
  value: number | string | null | undefined;
  label: string;
  className?: string;
  valueClassName?: string;
};

/** Parse a value into [prefix, number, suffix]; number is null when non-numeric. */
function parse(value: number | string): { prefix: string; num: number | null; suffix: string } {
  if (typeof value === "number") return { prefix: "", num: value, suffix: "" };
  const m = value.match(/^(\D*?)(\d[\d,.]*)(.*)$/);
  if (!m) return { prefix: value, num: null, suffix: "" };
  return { prefix: m[1] ?? "", num: parseFloat(m[2]!.replace(/,/g, "")), suffix: m[3] ?? "" };
}

/** Mono metric that counts up once in view. Renders nothing when value is missing. */
export function MetricStat({ value, label, className, valueClassName }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState<string>("");

  const valid = value !== null && value !== undefined && value !== "";
  const parsed = valid ? parse(value as number | string) : null;

  useEffect(() => {
    if (!parsed) return;
    if (parsed.num === null) {
      setDisplay(`${parsed.prefix}${parsed.suffix}`);
      return;
    }
    if (reduce || !inView) {
      if (reduce) setDisplay(`${parsed.prefix}${formatNum(parsed.num)}${parsed.suffix}`);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = parsed.num! * eased;
      setDisplay(`${parsed.prefix}${formatNum(current, parsed.num!)}${parsed.suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, parsed?.num, parsed?.prefix, parsed?.suffix]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!valid || !parsed) return null;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <span className={cn("font-mono text-3xl font-semibold text-gold md:text-4xl", valueClassName)}>
        {display || `${parsed.prefix}${parsed.num === null ? "" : "0"}${parsed.suffix}`}
      </span>
      <span className="mt-1 text-sm text-bodydark">{label}</span>
    </div>
  );
}

function formatNum(n: number, target?: number): string {
  const isInt = target !== undefined ? Number.isInteger(target) : Number.isInteger(n);
  if (isInt) return Math.round(n).toLocaleString();
  return n.toFixed(1);
}
