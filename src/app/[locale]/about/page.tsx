import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getAbout } from "@/lib/v1";
import { CTAPanel, HairCell, HairGrid, MonoChip, SectionEyebrow, Shell, StatCell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Who we are",
    fallbackTitle: "Software that earns its keep",
    missionTitle: "Our mission",
    valuesTitle: "What we value",
    expertiseTitle: "Where we're strong",
    stackTitle: "Tools we reach for",
    contactTitle: "Talk to a human",
    stats: { projects: "Projects shipped", customers: "Happy customers", years: "Years building", support: "Support" },
    contact: { phone: "Phone", email: "Email", address: "Based in", hours: "Hours" },
    ctaTitle: "Let's build something that lasts.",
    ctaSub: "Tell us what you're working on — we'll tell you the fastest, cleanest way to ship it.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I'd like to learn more about working with you.",
  },
  ar: {
    eyebrow: "مين إحنا",
    fallbackTitle: "سوفت وير بيشتغل ويستاهل",
    missionTitle: "مهمتنا",
    valuesTitle: "قيمنا",
    expertiseTitle: "نقاط قوتنا",
    stackTitle: "أدواتنا",
    contactTitle: "كلّم حد حقيقي",
    stats: { projects: "مشروع متسلّم", customers: "عميل سعيد", years: "سنين خبرة", support: "دعم" },
    contact: { phone: "تليفون", email: "إيميل", address: "مقرّنا", hours: "مواعيد العمل" },
    ctaTitle: "خلّينا نبني حاجة تفضل.",
    ctaSub: "احكيلنا بتشتغل على إيه — وهنقولّك أسرع وأنضف طريقة تطلّعها.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! حابب أعرف أكتر عن الشغل معاكم.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const about = await getAbout(locale);
  const path = "/about";
  return {
    title: about?.tagline || t.fallbackTitle,
    description: about?.story || about?.mission || t.fallbackTitle,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const about = await getAbout(locale);

  const values = about?.values ?? [];
  const expertise = about?.expertise ?? [];
  const techStack = about?.tech_stack ?? [];
  const stats = about?.stats;
  const contact = about?.contact;

  const statItems = stats
    ? [
        { value: `${stats.projects}+`, label: t.stats.projects },
        { value: `${stats.customers}+`, label: t.stats.customers },
        { value: `${stats.years}+`, label: t.stats.years },
        { value: `${stats.support}`, label: t.stats.support },
      ]
    : [];

  return (
    <>
      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1 className="mt-3.5 max-w-[16em] text-balance font-display text-d1 font-bold text-fg">
            {about?.tagline || t.fallbackTitle}
            <GoldPeriod />
          </h1>
          {about?.story ? (
            <p className="mt-5 max-w-[42em] text-lede text-fgbody">{about.story}</p>
          ) : null}

          {statItems.length ? (
            <HairGrid cols={2} lgCols={4} className="mt-12 border-t border-hair">
              {statItems.map((s) => (
                <HairCell key={s.label} className="py-7">
                  <StatCell value={s.value} label={s.label} />
                </HairCell>
              ))}
            </HairGrid>
          ) : null}
        </Shell>
      </section>

      {about?.mission ? (
        <section className="surf-dark sect">
          <Shell>
            <SectionEyebrow>{t.missionTitle}</SectionEyebrow>
            <p className="mt-5 max-w-[24em] text-balance font-display text-d2 font-bold text-fg">
              {about.mission}
              <GoldPeriod />
            </p>
          </Shell>
        </section>
      ) : null}

      {values.length ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect">
            <SectionEyebrow>{t.valuesTitle}</SectionEyebrow>
            <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-9 border-t border-hair">
              {values.map((v) => (
                <HairCell key={v.title} className="py-7">
                  <h2 className="font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                    {v.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-fgbody">{v.body}</p>
                </HairCell>
              ))}
            </HairGrid>
          </Shell>
        </section>
      ) : null}

      {expertise.length || techStack.length ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect grid gap-12 lg:grid-cols-2">
            {expertise.length ? (
              <div>
                <SectionEyebrow>{t.expertiseTitle}</SectionEyebrow>
                <div className="mt-7 space-y-6">
                  {expertise.map((e) => {
                    const pct = Math.max(0, Math.min(100, e.level));
                    return (
                      <div key={e.name}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-display text-[15.5px] font-semibold text-fg">
                            {e.name}
                          </span>
                          <span className="mono ltr-island text-[11px] text-fgmuted">{pct}%</span>
                        </div>
                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-pill bg-well">
                          {/* The design's `bar` keyframe, on the one figure that
                              genuinely animates from zero to a real value. */}
                          <div
                            className="h-full animate-bar rounded-pill bg-gold"
                            style={{ ["--bar-to" as string]: `${pct}%`, width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {techStack.length ? (
              <div>
                <SectionEyebrow>{t.stackTitle}</SectionEyebrow>
                <div className="mt-7 flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <MonoChip key={tech}>{tech}</MonoChip>
                  ))}
                </div>
              </div>
            ) : null}
          </Shell>
        </section>
      ) : null}

      {contact ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect">
            <SectionEyebrow>{t.contactTitle}</SectionEyebrow>
            <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-9 border-t border-hair">
              <ContactCell
                label={t.contact.phone}
                value={contact.phone}
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                mono
              />
              <ContactCell
                label={t.contact.email}
                value={contact.email}
                href={`mailto:${contact.email}`}
                mono
              />
              <ContactCell label={t.contact.address} value={contact.address} />
              <ContactCell label={t.contact.hours} value={contact.hours} />
            </HairGrid>
          </Shell>
        </section>
      ) : null}

      <CTAPanel
        title={t.ctaTitle}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={t.waMsg}
      />
    </>
  );
}

function ContactCell({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value: string;
  href?: string;
  /** Latin contact details need an LTR island inside Arabic pages. */
  mono?: boolean;
}) {
  const body = mono ? "mono ltr-island text-[14px]" : "text-[15px]";
  return (
    <HairCell className="py-7">
      <p className="mono text-eyebrow uppercase text-accent">{label}</p>
      {href ? (
        <a href={href} className={`focus-gold mt-2 block break-words text-fg hover:text-gold-deep ${body}`}>
          {value}
        </a>
      ) : (
        <p className={`mt-2 break-words text-fgbody ${body}`}>{value}</p>
      )}
    </HairCell>
  );
}
