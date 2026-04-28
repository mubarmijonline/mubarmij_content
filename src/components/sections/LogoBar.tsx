import Image from "next/image";
import { useTranslations } from "next-intl";
import { CLIENT_LOGOS } from "@/lib/site";

export default function LogoBar() {
  const t = useTranslations("logoBar");
  // Duplicate for seamless marquee
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="bg-bglight py-12">
      <div className="container mx-auto">
        <p className="text-center text-sm text-navy/70 font-semibold mb-6">
          {t("title")}
        </p>
        <div className="overflow-hidden relative">
          <div className="flex gap-12 animate-marquee w-max items-center">
            {logos.map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="flex-shrink-0 h-12 md:h-14 relative w-28 md:w-36"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
