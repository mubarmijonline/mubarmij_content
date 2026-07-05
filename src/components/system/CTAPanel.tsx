import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { GoldButton, WhatsAppButton } from "./Buttons";
import { Reveal } from "./Reveal";

type Props = {
  title: string;
  subtitle?: string;
  ctaHref: string;
  ctaLabel: string;
  whatsappLabel: string;
  whatsappMessage?: string;
  showContact?: boolean;
  className?: string;
};

/** Full-width navy CTA band. Used as the final section on every page. */
export function CTAPanel({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  whatsappLabel,
  whatsappMessage,
  showContact = true,
  className,
}: Props) {
  return (
    <section className={cn("bg-navy-deep px-4 py-20 md:py-28", className)}>
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-cream md:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-bodydark">{subtitle}</p> : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <GoldButton href={ctaHref} size="lg">
            {ctaLabel}
          </GoldButton>
          <WhatsAppButton size="lg" message={whatsappMessage}>
            {whatsappLabel}
          </WhatsAppButton>
        </div>
        {showContact ? (
          <p className="mt-6 font-mono text-sm text-bodydark">
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-gold">
              {CONTACT_PHONE}
            </a>
            <span className="mx-2 text-line">·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold">
              {CONTACT_EMAIL}
            </a>
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
