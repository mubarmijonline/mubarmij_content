import Image from "next/image";

import type { TestimonialItem } from "@/lib/v1";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating || 5)));
  return (
    <div className="flex gap-0.5" aria-label={`${n} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn("h-4 w-4", i < n ? "fill-gold" : "fill-neutral-300")} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15.9 4.8 18.7l1-5.9L1.5 8.6l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

/** Testimonial card. Skips rendering when photo or company is missing (per spec). */
export function TestimonialCard({ item, dark = false }: { item: TestimonialItem; dark?: boolean }) {
  if (!item.avatar_url || !item.company) return null;
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-tile border p-6",
        dark ? "border-line bg-panel" : "border-neutral-200 bg-white shadow-sm",
      )}
    >
      <Stars rating={item.rating} />
      <blockquote className={cn("mt-4 flex-1 text-lg leading-relaxed", dark ? "text-cream/90" : "text-navy-deep")}>
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Image
          src={item.avatar_url}
          alt={item.author}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <span className="flex flex-col">
          <span className={cn("font-medium", dark ? "text-cream" : "text-navy-deep")}>{item.author}</span>
          <span className={cn("text-sm", dark ? "text-bodydark" : "text-neutral-500")}>
            {item.role ? `${item.role}, ` : ""}
            {item.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
