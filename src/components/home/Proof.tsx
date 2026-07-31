import type { Locale } from "@/i18n/config";
import type { AboutData, TestimonialItem } from "@/lib/v1";
import { HairCell, HairGrid, SectionEyebrow, Shell, StatCell, hasStat } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const COPY = {
  en: {
    eyebrow: "Proof",
    title: "The number that matters is the one on your side of the launch",
    projects: "Projects delivered",
    customers: "Businesses served",
    years: "Years building",
    support: "Support",
  },
  ar: {
    eyebrow: "الدليل",
    title: "الرقم اللي يهم هو اللي في ناحيتك بعد الإطلاق",
    projects: "مشروع تم تسليمه",
    customers: "شركة اشتغلنا معاها",
    years: "سنوات خبرة",
    support: "دعم",
  },
} as const;

/**
 * Dark proof band.
 *
 * The mockup draws four invented figures (+38%, 80h, 1.4s, 100%) and two
 * testimonials footnoted "client name to confirm". None of that is backed by
 * the CMS, so this renders the real about-page stats instead, and the
 * quotes column only appears once the testimonials collection has rows.
 *
 * The band still renders when only stats exist, because the page depends on a
 * light-dark-light-dark rhythm that a missing section would break.
 */
export default function Proof({
  locale,
  index,
  about,
  testimonials,
}: {
  locale: Locale;
  index: string;
  about: AboutData | null;
  testimonials: TestimonialItem[];
}) {
  const t = COPY[locale];

  const stats = [
    { value: about?.stats?.projects, label: t.projects },
    { value: about?.stats?.customers, label: t.customers },
    { value: about?.stats?.years, label: t.years },
    { value: about?.stats?.support, label: t.support },
  ].filter((s) => hasStat(s.value));

  const quotes = testimonials.filter((q) => q.quote && q.author).slice(0, 2);

  if (!stats.length && !quotes.length) return null;

  return (
    <section className="surf-dark sect">
      <Shell>
        <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
        <h2 className="mt-3.5 max-w-[18em] font-display text-d2 font-bold text-fg">
          {t.title}
          <GoldPeriod />
        </h2>

        {stats.length ? (
          <HairGrid
            cols={1}
            mdCols={2}
            lgCols={stats.length as 1 | 2 | 3 | 4}
            className="mt-10 border-t border-hair"
          >
            {stats.map((s) => (
              <HairCell key={s.label} className="py-7 pe-5">
                <StatCell value={s.value} label={s.label} />
              </HairCell>
            ))}
          </HairGrid>
        ) : null}

        {quotes.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {quotes.map((q) => (
              <blockquote key={q.id} className="rounded-panel border border-hair p-6">
                <p className="text-[16.5px] leading-relaxed text-fg">“{q.quote}”</p>
                <footer className="mono mt-5 text-[11.5px] uppercase text-fgmuted">
                  {[q.author, q.role, q.company].filter(Boolean).join(" — ")}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : null}
      </Shell>
    </section>
  );
}
