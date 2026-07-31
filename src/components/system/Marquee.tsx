import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal track. The children are rendered twice — the second
 * copy is aria-hidden so screen readers don't hear the list stutter.
 *
 * Direction is handled by a single sign-flipped keyframe (`--mq-dir` in
 * globals.css), so RTL runs start-to-end without a second animation.
 */
export function Marquee({
  children,
  seconds = 36,
  className,
  trackClassName,
}: {
  children: ReactNode;
  seconds?: number;
  /** Applied to the clipping wrapper — use for the leading gutter offset. */
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={cn("mq-wrap overflow-hidden", className)}>
      <div
        className={cn("mq-track flex w-max items-center gap-14", trackClassName)}
        style={{ animationDuration: `${seconds}s` }}
      >
        <div className="flex items-center gap-14">{children}</div>
        <div aria-hidden="true" className="flex items-center gap-14">
          {children}
        </div>
      </div>
    </div>
  );
}
