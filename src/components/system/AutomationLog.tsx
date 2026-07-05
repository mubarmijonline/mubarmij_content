"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type LogLine = { text: string; gold?: boolean };

const DEFAULT_LINES: LogLine[] = [
  { text: "✓ lead captured → CRM" },
  { text: "✓ WhatsApp follow-up sent" },
  { text: "✓ invoice generated" },
  { text: "— 80 hrs/month saved", gold: true },
];

type Props = {
  lines?: LogLine[];
  caption?: string;
  className?: string;
  startDelay?: number;
};

/** Brand terminal window. Types its lines while in view; static under reduced motion. */
export function AutomationLog({ lines = DEFAULT_LINES, caption = "automation.log — live", className, startDelay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<string[]>(() => lines.map(() => ""));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    if (reduce) {
      setShown(lines.map((l) => l.text));
      return clearAll;
    }
    if (!inView) {
      clearAll();
      return clearAll;
    }

    const CHAR = 24;
    const BETWEEN = 400;
    const HOLD = 3000;

    const run = () => {
      clearAll();
      setShown(lines.map(() => ""));
      let t = startDelay;
      lines.forEach((line, li) => {
        for (let c = 1; c <= line.text.length; c++) {
          const at = t + c * CHAR;
          timers.current.push(
            setTimeout(() => {
              setShown((prev) => {
                const next = [...prev];
                next[li] = line.text.slice(0, c);
                return next;
              });
            }, at),
          );
        }
        t += line.text.length * CHAR + BETWEEN;
      });
      timers.current.push(setTimeout(run, t + HOLD));
    };

    run();
    return clearAll;
  }, [inView, reduce, lines, startDelay]);

  return (
    <div
      ref={ref}
      className={cn(
        "term w-full max-w-md rounded-tile border border-line bg-navy-deep/80 shadow-navy backdrop-blur",
        className,
      )}
      aria-label={caption}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="ms-3 text-xs text-bodydark">{caption}</span>
      </div>
      <div className="space-y-2 px-4 py-4 text-sm leading-relaxed">
        {lines.map((line, i) => (
          <p key={i} className={cn("min-h-[1.25rem]", line.gold ? "text-gold" : "text-cream/90")}>
            {shown[i]}
            {!reduce && shown[i] && shown[i]!.length < line.text.length ? (
              <span className="ms-0.5 inline-block h-4 w-2 animate-pulse bg-gold/70 align-middle" />
            ) : null}
          </p>
        ))}
      </div>
    </div>
  );
}
