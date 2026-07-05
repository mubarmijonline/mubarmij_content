"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mub_celebrated_v1";
const COLORS = [
  "#D4AF37", // gold
  "#0F1F4B", // navy-deep
  "#22c55e", // green
  "#3B82F6", // blue
  "#F97316", // orange
  "#EC4899", // pink
  "#FFFFFF",
];

type Piece = {
  id: number;
  left: number;
  size: number;
  color: string;
  cx: number;
  cy: number;
  rot: number;
  delay: number;
  duration: number;
  shape: "square" | "circle" | "ribbon";
};

function makePieces(count: number): Piece[] {
  const out: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * (0.15 + Math.random() * 0.7)) - Math.PI / 2; // mostly upward then fall
    const force = 220 + Math.random() * 320;
    const cx = Math.cos(angle) * force * (Math.random() < 0.5 ? -1 : 1);
    const cy = -Math.abs(Math.sin(angle) * force) - 80 + Math.random() * 600; // launch then fall
    out.push({
      id: i,
      left: 50 + (Math.random() * 30 - 15), // start near center bottom
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      cx,
      cy,
      rot: (Math.random() * 720 - 360) | 0,
      delay: Math.random() * 1200,
      duration: 3200 + Math.random() * 3200,
      shape: ["square", "circle", "ribbon"][Math.floor(Math.random() * 3)] as Piece["shape"],
    });
  }
  return out;
}

export default function Confetti({
  message,
}: {
  message?: string;
} = {}) {
  const [active, setActive] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore storage errors; still play once per session
    }
    setPieces(makePieces(220));
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 8000);
    return () => window.clearTimeout(t);
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {pieces.map((p) => {
        const style: React.CSSProperties = {
          left: `${p.left}%`,
          bottom: 0,
          width: p.size,
          height: p.shape === "ribbon" ? p.size * 2 : p.size,
          background: p.color,
          borderRadius: p.shape === "circle" ? "50%" : p.shape === "ribbon" ? 2 : 1,
          animationDelay: `${p.delay}ms`,
          animationDuration: `${p.duration}ms`,
          // CSS vars consumed by the confettiBurst keyframe
          ["--cx" as never]: `${p.cx}px`,
          ["--cy" as never]: `${p.cy}px`,
          ["--cr" as never]: `${p.rot}deg`,
        };
        return (
          <span
            key={p.id}
            className="absolute block animate-confetti-burst"
            style={style}
          />
        );
      })}
      {message ? (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 animate-fade-up rounded-full bg-navy-deep/95 px-5 py-2 text-sm md:text-base font-semibold text-gold shadow-navy">
          {message}
        </div>
      ) : null}
    </div>
  );
}
