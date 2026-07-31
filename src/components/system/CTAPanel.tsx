import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { DarkButton, WhatsAppButton } from "./Buttons";
import { Reveal } from "./Reveal";
import { Shell } from "./Layout";
import { GoldPeriod } from "./Typo";

type Props = {
  title: string;
  subtitle?: string;
  ctaHref: string;
  ctaLabel: string;
  whatsappLabel: string;
  whatsappMessage?: string;
  showContact?: boolean;
  tone?: "subtle" | "dark";
  className?: string;
};

/**
 * The closing CTA band, used as the last section on nearly every page.
 *
 * Two columns rather than the old centered stack: copy on the start edge,
 * actions on the end edge, on the design's `#F7F8FA` surface.
 */
export function CTAPanel({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  whatsappLabel,
  whatsappMessage,
  showContact = true,
  tone = "subtle",
  className,
}: Props) {
  return (
    <section
      className={cn(
        tone === "dark" ? "surf-dark" : "surf-subtle border-t border-hair",
        "sect",
        className,
      )}
    >
      <Shell>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <div className="min-w-0 max-w-[30em]">
            <h2 className="font-display text-d2 font-bold text-fg">
              {title}
              <GoldPeriod />
            </h2>
            {subtitle ? <p className="mt-4 text-copy text-fgbody">{subtitle}</p> : null}
            {showContact ? (
              <p className="mono ltr-island mt-5 text-[13px] text-fgmuted">
                <a href={`tel:${CONTACT_PHONE}`} className="focus-gold hover:text-gold-deep">
                  {CONTACT_PHONE}
                </a>
                <span aria-hidden="true" className="mx-2 text-fgfaint">
                  ·
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="focus-gold hover:text-gold-deep">
                  {CONTACT_EMAIL}
                </a>
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DarkButton size="lg" href={ctaHref}>
              {ctaLabel}
            </DarkButton>
            <WhatsAppButton
              size="lg"
              message={whatsappMessage}
              className="border border-hairbtn bg-transparent text-fg hover:border-ink hover:bg-transparent hover:text-fg"
            >
              {whatsappLabel}
            </WhatsAppButton>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
