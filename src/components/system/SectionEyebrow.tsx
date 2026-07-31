import { cn } from "@/lib/utils";

/**
 * Mono eyebrow above a section headline, optionally numbered ("01 — Stack").
 *
 * The index sits in its own LTR island: without `unicode-bidi: isolate` the
 * digits and the em-dash reorder around Arabic text and the label reads
 * back-to-front.
 *
 * Numbers are passed in by the page, never hardcoded here — sections can drop
 * out when their data is empty, and the sequence has to close up behind them.
 */
export function SectionEyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow mono text-eyebrow font-medium uppercase text-accent", className)}>
      {index ? (
        <>
          <span className="ltr-island">{index}</span>
          <span aria-hidden="true"> — </span>
        </>
      ) : null}
      {children}
    </p>
  );
}
