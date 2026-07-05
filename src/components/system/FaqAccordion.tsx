"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/v1";
import { cn } from "@/lib/utils";

type Props = { items: FaqItem[]; dark?: boolean; jsonLd?: boolean };

/** One-open-at-a-time accordion. Height animates via the grid-rows trick (no jump). */
export function FaqAccordion({ items, dark = false, jsonLd = true }: Props) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl">
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
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const isOpen = open === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "overflow-hidden rounded-tile border",
                dark ? "border-line bg-panel" : "border-neutral-200 bg-white",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start focus-gold"
              >
                <span className={cn("font-medium", dark ? "text-cream" : "text-navy-deep")}>{item.question}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180",
                    dark ? "text-gold" : "text-navy",
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className={cn("px-5 pb-5 leading-relaxed", dark ? "text-bodydark" : "text-neutral-500")}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
