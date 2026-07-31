import Image from "next/image";

import type { Locale } from "@/i18n/config";
import { cmsMedia } from "@/lib/utils";
import type { LogoEntry } from "@/lib/content/clients";
import { Marquee } from "@/components/system";

const COPY = { en: "Trusted by", ar: "بيثقوا فينا" } as const;

/**
 * Client logo strip.
 *
 * Real logos are full-colour PNGs at wildly different aspect ratios, so they
 * are desaturated and dimmed to sit together — the mockup assumed flat grey
 * wordmarks. Fewer than six logos renders a static row: a marquee with a
 * half-empty track reads as broken rather than continuous.
 */
export default function TrustedMarquee({
  locale,
  logos,
}: {
  locale: Locale;
  logos: LogoEntry[];
}) {
  if (!logos.length) return null;

  const label = (
    <span className="mono shrink-0 text-eyebrow uppercase text-fgfaint">{COPY[locale]}</span>
  );

  const items = logos.map((l) => <Logo key={l.name} entry={l} />);

  if (logos.length < 6) {
    return (
      <section className="surf-light border-b border-hair py-6">
        <div className="shell flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {label}
          {items}
        </div>
      </section>
    );
  }

  return (
    <section className="surf-light border-b border-hair py-6" aria-label={COPY[locale]}>
      {/* ps-5/md:ps-8 matches the shell gutter so the track starts on the
          measure rather than flush against the viewport edge. */}
      <Marquee className="ps-5 md:ps-8">
        {label}
        {items}
      </Marquee>
    </section>
  );
}

/**
 * Logos sit on a tinted chip. The design assumed flat grey wordmarks; the real
 * assets are full-colour PNGs at inconsistent aspect ratios, and some (AURA)
 * are pure white on transparent — invisible on any light surface.
 *
 * `darkCard` is the CMS's own flag for that case. It is currently unset on
 * every document, so the drop-shadow outline is what actually carries this:
 * it gives a white logo a visible edge while staying imperceptible on a dark
 * or coloured one. Ticking "dark card" in the CMS upgrades that logo to a
 * proper dark chip.
 */
function Logo({ entry }: { entry: LogoEntry }) {
  const src = cmsMedia(entry.src);
  if (!src) return null;
  return (
    <span
      className={`relative block h-12 w-[132px] shrink-0 rounded-chip ${
        entry.darkCard ? "bg-ink" : "bg-paper-well"
      }`}
    >
      <Image
        src={src}
        alt={entry.name}
        fill
        sizes="132px"
        className={`object-contain p-2 opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 ${
          entry.darkCard ? "" : "[filter:grayscale(1)_drop-shadow(0_0_1px_rgba(10,22,40,0.6))]"
        }`}
      />
    </span>
  );
}
