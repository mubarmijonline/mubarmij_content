"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type LogoItem = {
  src: string;
  alt: string;
  darkCard?: boolean;
  /** When set, the logo card is wrapped in a Link to this URL. */
  href?: string;
};

export default function LogoBarClient({
  logos,
  title,
}: {
  logos: LogoItem[];
  title: string;
}) {
  return (
    <section className="bg-bglight py-14 md:py-16 w-full">
      <div className="w-full px-4 md:px-8">
        <p className="text-center text-base md:text-lg text-navy/70 font-semibold mb-10">
          {title}
        </p>

        {/* Full view: every client logo visible at once, responsive grid */}
        <div className="grid gap-6 md:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {logos.map((logo) => {
            const card = (
              <>
                <div
                  className={`relative h-24 md:h-28 lg:h-32 w-full rounded-xl overflow-hidden ${
                    logo.darkCard ? "bg-navy-deep p-4" : ""
                  } ${
                    logo.href
                      ? "transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-gold/60"
                      : ""
                  }`}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className={`object-contain ${
                      logo.href
                        ? "transition-transform duration-300 group-hover:scale-105"
                        : ""
                    }`}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                    unoptimized={logo.src.startsWith("/api/")}
                  />
                  {/* "View profile" overlay — only when clickable */}
                  {logo.href && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-deep/0 group-hover:bg-navy-deep/70 transition-colors duration-300"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gold">
                        View profile
                        <ArrowUpRight size={14} />
                      </span>
                    </span>
                  )}
                </div>
                <figcaption
                  className={`mt-3 text-sm md:text-base font-semibold ${
                    logo.href
                      ? "text-navy group-hover:text-gold transition-colors"
                      : "text-navy"
                  }`}
                >
                  {logo.alt}
                </figcaption>
              </>
            );

            if (logo.href) {
              return (
                <Link
                  key={logo.alt}
                  href={logo.href}
                  title={`View ${logo.alt} profile`}
                  aria-label={`View ${logo.alt} profile`}
                  className="group flex flex-col items-center text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
                >
                  {card}
                </Link>
              );
            }

            return (
              <figure
                key={logo.alt}
                className="group flex flex-col items-center text-center"
              >
                {card}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
