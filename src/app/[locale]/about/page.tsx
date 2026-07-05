import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getAbout } from "@/lib/v1";
import {
  CTAPanel,
  MetricStat,
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/system";

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
      {/* Hero + stats — dark */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-24 text-center sm:pt-28">
          <Reveal>
            <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-4 text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-cream">
              {about?.tagline || t.fallbackTitle}
            </h1>
          </Reveal>
          {about?.story ? (
            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-bodydark sm:text-lg">
                {about.story}
              </p>
            </Reveal>
          ) : null}
        </div>

        {statItems.length ? (
          <div className="relative mx-auto max-w-5xl px-4 pb-20">
            <Stagger className="grid grid-cols-2 gap-8 border-t border-line pt-10 sm:grid-cols-4">
              {statItems.map((s) => (
                <StaggerItem key={s.label} className="text-center">
                  <MetricStat value={s.value} label={s.label} className="items-center" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}
      </section>

      {/* Mission — light */}
      {about?.mission ? (
        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Reveal>
              <SectionEyebrow>{t.missionTitle}</SectionEyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-5 text-balance text-xl font-medium leading-relaxed tracking-[-0.01em] text-navy-deep sm:text-2xl">
                {about.mission}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Values — light */}
      {values.length ? (
        <section className="bg-bglight py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="mx-auto max-w-2xl text-center">
              <SectionEyebrow>{t.valuesTitle}</SectionEyebrow>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <StaggerItem key={v.title} className="rounded-tile border border-neutral-200 bg-white p-6">
                  <h3 className="font-semibold text-navy-deep">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{v.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* Expertise + stack — cream */}
      {expertise.length || techStack.length ? (
        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
            {expertise.length ? (
              <div>
                <Reveal>
                  <SectionEyebrow>{t.expertiseTitle}</SectionEyebrow>
                </Reveal>
                <div className="mt-6 space-y-5">
                  {expertise.map((e) => {
                    const pct = Math.max(0, Math.min(100, e.level));
                    return (
                      <Reveal key={e.name} delay={0.04}>
                        <div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-medium text-navy-deep">{e.name}</span>
                            <span className="font-mono text-xs text-gold-dim">{pct}%</span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-neutral-200">
                            <div className="h-full rounded-pill bg-gold" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {techStack.length ? (
              <div>
                <Reveal>
                  <SectionEyebrow>{t.stackTitle}</SectionEyebrow>
                </Reveal>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-pill border border-neutral-300 bg-white px-3.5 py-1.5 font-mono text-sm text-neutral-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Contact — light */}
      {contact ? (
        <section className="bg-bglight py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="text-center">
              <SectionEyebrow>{t.contactTitle}</SectionEyebrow>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ContactCard label={t.contact.phone} value={contact.phone} href={`tel:${contact.phone.replace(/\s+/g, "")}`} />
              <ContactCard label={t.contact.email} value={contact.email} href={`mailto:${contact.email}`} />
              <ContactCard label={t.contact.address} value={contact.address} />
              <ContactCard label={t.contact.hours} value={contact.hours} />
            </Stagger>
          </div>
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

function ContactCard({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <StaggerItem className="rounded-tile border border-neutral-200 bg-white p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">{label}</p>
      {href ? (
        <a href={href} className="mt-2 block break-words text-navy-deep transition-colors hover:text-gold focus-gold">
          {value}
        </a>
      ) : (
        <p className="mt-2 break-words text-navy-deep">{value}</p>
      )}
    </StaggerItem>
  );
}
