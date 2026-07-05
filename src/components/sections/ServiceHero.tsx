import Image from "next/image";

import CTAButton from "@/components/ui/CTAButton";

type ServiceHeroProps = {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: string;
  imageAlt?: string;
};

export default function ServiceHero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  imageAlt = "",
}: ServiceHeroProps) {
  return (
    <section className="bg-hero-gradient text-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-center md:text-start">
            <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {title}
            </h1>
            <p className="mt-5 text-lg text-white/85">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <CTAButton href={primaryCta.href} variant="primary" size="lg">
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
          <div className="relative w-full overflow-hidden rounded-[16px] border border-white/15 bg-white/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] aspect-[1456/760]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
