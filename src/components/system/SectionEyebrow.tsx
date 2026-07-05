import { cn } from "@/lib/utils";

/** Mono eyebrow above section headlines. Uppercase in LTR, natural in RTL. */
export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow font-mono text-[11px] font-medium tracking-[0.2em] text-gold-dim uppercase", className)}>
      {children}
    </p>
  );
}
