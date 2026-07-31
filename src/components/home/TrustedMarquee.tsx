import Image from "next/image";

import type { Locale } from "@/i18n/config";
import { cmsMedia } from "@/lib/utils";
import type { LogoEntry } from "@/lib/content/clients";
import { Marquee, Shell } from "@/components/system";

const COPY = {
  en: { label: "Trusted by", closing: "The companies already building with us" },
  ar: { label: "بيثقوا فينا", closing: "شركات بتبني معانا بالفعل" },
} as const;

/**
 * Client logo strip.
 *
 * Logos sit directly on the surface — no chip. The assets are full-colour and
 * at wildly different aspect ratios, so a fixed height with `object-contain`
 * is what makes them sit together; the box is generous enough that a wide
 * wordmark and a square badge read at a similar visual weight.
 *
 * Fewer than six logos renders a static row: a marquee with a half-empty
 * track reads as broken rather than continuous.
 */
export default function TrustedMarquee({
  locale,
  logos,
  variant = "top",
}: {
  locale: Locale;
  logos: LogoEntry[];
  /** "closing" is the second pass near the foot of the page. */
  variant?: "top" | "closing";
}) {
  if (!logos.length) return null;
  const t = COPY[locale];
  const closing = variant === "closing";

  const items = logos.map((l) => <Logo key={l.name} entry={l} />);

  if (logos.length < 6) {
    return (
      <section className={`surf-light border-b border-hair ${closing ? "py-14" : "py-10"}`}>
        <Shell>
          {closing ? <Heading text={t.closing} /> : null}
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {closing ? null : <Label text={t.label} />}
            {items}
          </div>
        </Shell>
      </section>
    );
  }

  return (
    <section
      className={`surf-light border-b border-hair ${closing ? "py-14" : "py-10"}`}
      aria-label={closing ? t.closing : t.label}
    >
      {closing ? (
        <Shell>
          <Heading text={t.closing} />
        </Shell>
      ) : null}

      {/* The gutter offset starts the track on the measure rather than flush
          against the viewport edge. */}
      <Marquee className="ps-5 md:ps-8" seconds={closing ? 44 : 36}>
        {closing ? null : <Label text={t.label} />}
        {items}
      </Marquee>
    </section>
  );
}

function Label({ text }: { text: string }) {
  return <span className="mono shrink-0 text-eyebrow uppercase text-fgmuted">{text}</span>;
}

function Heading({ text }: { text: string }) {
  return (
    <p className="mono mb-9 text-center text-eyebrow uppercase text-fgmuted">{text}</p>
  );
}

/**
 * A logo, in its own brand colours, on the page surface.
 *
 * No outline filter: six of the eleven assets are opaque rectangles with no
 * alpha channel, so a drop-shadow traced a box around the whole image rather
 * than the letterforms. Logos that need a dark plate get one from the CMS
 * "dark card" flag.
 */
function Logo({ entry }: { entry: LogoEntry }) {
  const src = cmsMedia(entry.src);
  if (!src) return null;
  return (
    <span
      className={`relative block h-16 w-[168px] shrink-0 md:h-[72px] md:w-[190px] ${
        entry.darkCard ? "rounded-chip bg-ink px-3" : ""
      }`}
    >
      <Image
        src={src}
        alt={entry.name}
        fill
        sizes="190px"
        className={`object-contain ${entry.darkCard ? "p-3" : ""}`}
      />
    </span>
  );
}
