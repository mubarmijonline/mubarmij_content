import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ImageWell } from "./ImageWell";

/**
 * Browser-chrome card from the hero — traffic-light dots plus a mono URL bar.
 * The chrome is a UI illustration, so it stays LTR in both locales.
 */
export function BrowserFrame({
  url,
  children,
  float,
  className,
}: {
  url: string;
  children: ReactNode;
  float?: 1 | 2;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-panel border border-hairbtn bg-white shadow-float",
        float === 1 && "animate-float1",
        float === 2 && "animate-float2",
        className,
      )}
    >
      <div className="ltr-island flex items-center gap-[7px] border-b border-hairin bg-ink-chrome px-3 py-2.5">
        <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-white/25" />
        <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-white/25" />
        <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-white/25" />
        <span className="ms-2.5 font-mono text-[10.5px] text-white/60">{url}</span>
      </div>
      {children}
    </div>
  );
}

/** Phone mockup: 26px outer frame, 8px bezel, 19px inner radius. */
export function PhoneFrame({
  src,
  alt,
  className,
  float,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  float?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        "rounded-phone border border-hairbtn bg-ink-chrome p-2 shadow-float",
        float === 1 && "animate-float1",
        float === 2 && "animate-float2",
        className,
      )}
    >
      <ImageWell
        src={src}
        alt={alt}
        className="h-full w-full rounded-phonein"
        sizes="(max-width: 768px) 50vw, 200px"
      />
    </div>
  );
}

/** Navy band with the 44px gold grid — the hero's right column. */
export function DarkPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("surf-dark grid-well relative", className)}>{children}</div>
  );
}
