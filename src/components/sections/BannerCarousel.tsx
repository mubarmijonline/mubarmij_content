"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type BannerSlide = {
  src: string;
  alt: string;
};

const SLIDES: BannerSlide[] = [
  { src: "/banners/banner-1.png", alt: "" },
  { src: "/banners/banner-2.png", alt: "" },
  { src: "/banners/banner-3.png", alt: "" },
  { src: "/banners/banner-4.png", alt: "" },
  { src: "/banners/banner-5.png", alt: "" },
  { src: "/banners/banner-6.png", alt: "" },
];

const AUTOPLAY_MS = 5000;

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      className="bg-white py-10 md:py-14"
      aria-label="Mubarmij service banners"
    >
      <div className="container mx-auto px-4">
        <div
          className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_10px_30px_-15px_rgba(10,22,40,0.18)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className="relative w-full shrink-0 aspect-[1456/760]"
                aria-hidden={i !== index}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute start-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#0A1628] shadow-md backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628] md:p-2.5"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="rtl:rotate-180"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute end-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2 text-[#0A1628] shadow-md backdrop-blur-sm transition hover:bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628] md:p-2.5"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="rtl:rotate-180"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/75 px-2.5 py-1.5 backdrop-blur-sm">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-[#0A1628]"
                    : "w-1.5 bg-[#0A1628]/35 hover:bg-[#0A1628]/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
