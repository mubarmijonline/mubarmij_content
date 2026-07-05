import CTAButton from "@/components/ui/CTAButton";

type ServiceCtaPanelProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function ServiceCtaPanel({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
}: ServiceCtaPanelProps) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[20px] bg-hero-gradient p-8 text-center text-white shadow-[0_30px_60px_-30px_rgba(10,22,40,0.55)] md:p-14">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            {eyebrow ? (
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-gold">
                {eyebrow}
              </div>
            ) : null}
            <h2 className="font-display rtl:font-arabic-display text-3xl md:text-4xl font-extrabold leading-tight">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTAButton
                href={primaryCta.href}
                variant="primary"
                size="lg"
              >
                {primaryCta.label}
              </CTAButton>
              {secondaryCta ? (
                <CTAButton
                  href={secondaryCta.href}
                  variant="secondary"
                  size="lg"
                >
                  {secondaryCta.label}
                </CTAButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
