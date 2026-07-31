import type { Locale } from "@/i18n/config";
import type { ClientDetail } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import {
  BrowserFrame,
  DarkPanel,
  GhostButton,
  HairCell,
  HairGrid,
  ImageWell,
  PhoneFrame,
  Pill,
  StatCell,
  WhatsAppButton,
  hasStat,
} from "@/components/system";
import { Arrow, GoldPeriod } from "@/components/system/Typo";

const COPY = {
  en: {
    pill: "Software house · Cairo, Egypt & the Gulf",
    title: "E-commerce, apps and the systems that run behind them",
    lede: "One engineering team for your storefront, your mobile app and your internal operations — scoped in writing, shipped in weeks, maintained after launch.",
    primary: "Start a project on WhatsApp",
    primaryMsg: "Hi MubarmiJ — I'd like to discuss a project.",
    secondary: "See case studies",
    statProjects: "Businesses shipped",
    statWeeks: "Weeks to launch",
    statWeeksValue: "4–8",
    statLive: "Live projects",
    showcase: "Latest build",
    caseStudy: "Case study",
  },
  ar: {
    pill: "شركة برمجيات · القاهرة، مصر والخليج",
    title: "متاجر إلكترونية وتطبيقات والأنظمة اللي بتشتغل وراهم",
    lede: "فريق هندسي واحد لمتجرك وتطبيقك وعمليات شغلك الداخلية — نطاق مكتوب، تسليم في أسابيع، وصيانة بعد الإطلاق.",
    primary: "ابدأ مشروعك على واتساب",
    primaryMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
    secondary: "شوف دراسات الحالة",
    statProjects: "مشروع تم تسليمه",
    statWeeks: "أسبوع للإطلاق",
    statWeeksValue: "4–8",
    statLive: "مشروع شغّال",
    showcase: "آخر مشروع",
    caseStudy: "دراسة الحالة",
  },
} as const;

export default function Hero({
  locale,
  projects,
  liveCount,
  showcase,
  webShot,
  phoneShot,
  phoneAlt,
}: {
  locale: Locale;
  /** about.stats.projects — the cell disappears when the API is unavailable. */
  projects?: number | null;
  /** Projects actually published in the CMS, not the mockup's hardcoded 9. */
  liveCount: number;
  showcase: ClientDetail | null;
  webShot?: string | null;
  /** A portrait app screenshot. Card thumbnails are landscape and mis-crop. */
  phoneShot?: string | null;
  phoneAlt?: string;
}) {
  const t = COPY[locale];

  const stats = [
    { value: projects ?? null, label: t.statProjects },
    { value: t.statWeeksValue, label: t.statWeeks },
    { value: liveCount || null, label: t.statLive },
  ].filter((s) => hasStat(s.value));

  return (
    <section className="surf-light border-b border-hair">
      <div className="shell grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise min-w-0 border-hair py-14 lg:border-e lg:py-16 lg:pe-10">
          <Pill dot="gold">{t.pill}</Pill>

          <h1 className="mt-6 text-balance font-display text-d1 font-bold text-fg">
            {t.title}
            <GoldPeriod />
          </h1>

          <p className="mt-5 max-w-[29em] text-lede text-fgbody">{t.lede}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton size="lg" message={t.primaryMsg}>
              {t.primary}
              <Arrow locale={locale} />
            </WhatsAppButton>
            <GhostButton size="lg" href={localePath(locale, "/case-studies")}>
              {t.secondary}
            </GhostButton>
          </div>

          {stats.length ? (
            <HairGrid cols={stats.length as 1 | 2 | 3} className="mt-12 border-t border-hair">
              {stats.map((s) => (
                <HairCell key={s.label} className="border-b-0 pt-6">
                  <StatCell value={s.value} label={s.label} />
                </HairCell>
              ))}
            </HairGrid>
          ) : null}
        </div>

        <DarkPanel className="-mx-5 min-w-0 px-5 py-12 md:-mx-8 md:px-8 lg:mx-0 lg:ps-10">
          <BrowserFrame url={browserLabel(showcase)} float={2}>
            <ImageWell
              src={webShot}
              alt={showcase?.name ?? "MubarmiJ"}
              height={300}
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </BrowserFrame>

          <div
            className={`mt-5 grid grid-cols-1 items-start gap-5 ${
              phoneShot ? "sm:grid-cols-[150px_1fr]" : ""
            }`}
          >
            {phoneShot ? (
              <PhoneFrame src={phoneShot} alt={phoneAlt ?? ""} float={1} className="h-[300px]" />
            ) : null}
            {showcase ? (
              <ShowcaseCard locale={locale} showcase={showcase} label={t.showcase} cta={t.caseStudy} />
            ) : null}
          </div>
        </DarkPanel>
      </div>
    </section>
  );
}

/**
 * The mockup puts a performance card here (+38% checkout conversion, a
 * progress bar, three deltas). None of those numbers exist in the CMS — the
 * `results` field holds qualitative phrases — so this shows the real ones.
 */
function ShowcaseCard({
  locale,
  showcase,
  label,
  cta,
}: {
  locale: Locale;
  showcase: ClientDetail;
  label: string;
  cta: string;
}) {
  const rows = (showcase.results ?? []).filter((r) => r.metric && r.label).slice(0, 3);

  return (
    <div className="rounded-panel border border-hair bg-white/5 p-5">
      <div className="mono text-eyebrow uppercase text-gold">{label}</div>
      <div className="mt-2 font-display text-[22px] font-bold tracking-[-0.02em] text-fg">
        {showcase.name}
      </div>
      {showcase.tagline ? (
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-fgmuted">{showcase.tagline}</p>
      ) : null}

      {rows.length ? (
        <div className="mt-5 grid gap-2.5 border-t border-hairin pt-4">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 text-[13.5px] text-fgbody">
              <span>{r.label}</span>
              <span className="mono text-end text-gold">{r.metric}</span>
            </div>
          ))}
        </div>
      ) : null}

      <a
        href={localePath(locale, `/case-studies/${showcase.slug}`)}
        className="focus-gold mono mt-5 inline-flex items-center gap-2 text-[11px] uppercase text-fgmuted transition-colors hover:text-gold"
      >
        {cta}
        <Arrow locale={locale} />
      </a>
    </div>
  );
}

/** Chrome URL bar: the client's real live domain when it has one. */
function browserLabel(showcase: ClientDetail | null): string {
  const live = showcase?.links?.live_url;
  if (live) {
    try {
      const u = new URL(live);
      const path = u.pathname === "/" ? "" : u.pathname;
      return `${u.hostname.replace(/^www\./, "")}${path}`;
    } catch {
      /* malformed URL in the CMS — fall through to the brand domain */
    }
  }
  return "mubarmijonline.com";
}
