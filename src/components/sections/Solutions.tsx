import { useTranslations } from "next-intl";
import { Bot, Globe, Smartphone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";
import Reveal from "@/components/effects/Reveal";

export default function Solutions({ locale }: { locale: Locale }) {
  const t = useTranslations("solutions");
  const tCta = useTranslations("cta");
  const lp = (p: string) => localePath(locale, p);

  // Items come from messages so each language stays clean (no mixed AR/EN).
  const items1 = t.raw("card1Items") as string[];
  const items2 = t.raw("card2Items") as string[];
  const items3 = t.raw("card3Items") as string[];

  type Card = {
    icon: React.ReactNode;
    title: string;
    items: string[];
    badge?: string;
    footer: string;
    footerTone: "result" | "muted";
    href: string;
    /** Brand-aligned tint used for the card surface + accent stripe */
    tone: "gold" | "navy" | "ink";
  };

  const cards: Card[] = [
    {
      icon: <Bot size={28} />,
      title: t("card1Title"),
      items: items1,
      badge: t("highRoi"),
      footer: t("card1Result"),
      footerTone: "result",
      href: lp("/services/automation"),
      tone: "gold",
    },
    {
      icon: <Globe size={28} />,
      title: t("card2Title"),
      items: items2,
      footer: t("card2Price"),
      footerTone: "muted",
      href: lp("/services/web-development"),
      tone: "navy",
    },
    {
      icon: <Smartphone size={28} />,
      title: t("card3Title"),
      items: items3,
      footer: t("card3Eligibility"),
      footerTone: "muted",
      href: lp("/services/mobile-apps"),
      tone: "gold",
    },
  ];

  // Colour tokens per tone — all picked from the brand palette so the three
  // cards read as one connected system rather than random colours.
  const toneStyles: Record<
    Card["tone"],
    {
      surface: string;
      stripe: string;
      iconBox: string;
      title: string;
      body: string;
      bullet: string;
      mutedFooter: string;
      ring: string;
    }
  > = {
    gold: {
      surface: "bg-gradient-to-br from-gold/10 via-white to-gold/5",
      stripe: "bg-gradient-to-r from-gold via-gold/70 to-gold",
      iconBox: "bg-gold/15 text-gold ring-1 ring-gold/30",
      title: "text-navy-deep",
      body: "text-navy/80",
      bullet: "text-gold",
      mutedFooter: "text-navy bg-gold/10",
      ring: "border-gold/60 shadow-gold",
    },
    navy: {
      surface: "bg-gradient-to-br from-navy-deep via-navy to-navy-deep text-white",
      stripe: "bg-gradient-to-r from-gold via-white/70 to-gold",
      iconBox: "bg-white/10 text-gold ring-1 ring-white/20",
      title: "text-white",
      body: "text-white/80",
      bullet: "text-gold",
      mutedFooter: "text-white bg-white/10",
      ring: "border-navy-deep/40 shadow-navy",
    },
    ink: {
      surface: "bg-gradient-to-br from-bglight via-white to-bglight",
      stripe: "bg-gradient-to-r from-navy via-gold to-navy",
      iconBox: "bg-navy/10 text-navy-deep ring-1 ring-navy/20",
      title: "text-navy-deep",
      body: "text-navy/80",
      bullet: "text-navy",
      mutedFooter: "text-navy bg-bglight",
      ring: "border-navy/20",
    },
  };

  return (
    <section className="section bg-bglight">
      <div className="container mx-auto">
        <h2 className="section-title text-center max-w-3xl mx-auto">{t("title")}</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {cards.map((c, idx) => {
            const s = toneStyles[c.tone];
            return (
              <Reveal
                key={c.title}
                as="article"
                delayMs={idx * 110}
                className={`card-lift relative rounded-2xl p-7 flex flex-col h-full border overflow-hidden ${s.surface} ${s.ring}`}
              >
                {/* Top accent stripe — visually links the three cards */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 ${s.stripe}`}
                />
                <div className="flex items-center justify-between gap-3 min-h-[3.5rem]">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.iconBox}`}
                  >
                    {c.icon}
                  </div>
                  {c.badge && (
                    <span className="text-xs font-bold uppercase tracking-wide bg-gold text-navy-deep px-3 py-1 rounded-full">
                      {c.badge}
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-5 font-display rtl:font-arabic-display text-xl font-bold ${s.title}`}
                >
                  {c.title}
                </h3>

                <ul className={`mt-4 space-y-2 text-sm ${s.body}`}>
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className={s.bullet}>•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-5 inline-block self-start text-sm font-semibold px-3 py-1.5 rounded-full ${
                    c.footerTone === "result"
                      ? "text-green-700 bg-green-50"
                      : s.mutedFooter
                  }`}
                >
                  {c.footer}
                </div>

                <div className="mt-auto pt-6">
                  <CTAButton href={c.href} variant="primary">
                    {tCta("primary")}
                  </CTAButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
