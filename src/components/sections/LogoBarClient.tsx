"use client";

import Image from "next/image";

export type LogoItem = { src: string; alt: string; darkCard?: boolean };

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
          {logos.map((logo) => (
            <figure
              key={logo.alt}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`relative h-24 md:h-28 lg:h-32 w-full rounded-xl overflow-hidden ${
                  logo.darkCard ? "bg-navy-deep p-4" : ""
                }`}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                  unoptimized={logo.src.startsWith("/api/")}
                />
              </div>
              <figcaption className="mt-3 text-sm md:text-base font-semibold text-navy">
                {logo.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
