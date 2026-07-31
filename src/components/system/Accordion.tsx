import type { FaqItem } from "@/lib/v1";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion on native <details>/<summary>.
 *
 * No state, no client bundle, and it works with JS disabled — which the
 * previous useState implementation did not. <details> carries its own
 * expanded/collapsed semantics, so no ARIA is needed.
 */
export function Accordion({
  items,
  jsonLd = true,
  className,
}: {
  items: FaqItem[];
  jsonLd?: boolean;
  className?: string;
  /** Accepted and ignored — tone now comes from the enclosing surface scope. */
  dark?: boolean;
}) {
  if (!items.length) return null;

  return (
    <div className={cn("border-t border-hair", className)}>
      {items.map((item) => (
        <details key={item.id} className="group border-b border-hair">
          <summary className="focus-gold flex items-start justify-between gap-6 py-5 font-display text-[17px] font-semibold text-fg">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="mono mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-[46em] pb-6 text-[15.5px] leading-relaxed text-fgbody">
            {item.answer}
          </p>
        </details>
      ))}

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((i) => ({
                "@type": "Question",
                name: i.question,
                acceptedAnswer: { "@type": "Answer", text: i.answer },
              })),
            }),
          }}
        />
      ) : null}
    </div>
  );
}

/** Name kept alive for the pages that still import the old component. */
export { Accordion as FaqAccordion };
