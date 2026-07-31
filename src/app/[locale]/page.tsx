import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { getAbout, getClient, getClients, getFaq, getReels, getServices, getTestimonials } from "@/lib/v1";
import { caseStudyClients, logoEntries } from "@/lib/content/clients";
import { CTAPanel } from "@/components/system";

import Hero from "@/components/home/Hero";
import TrustedMarquee from "@/components/home/TrustedMarquee";
import Capabilities from "@/components/home/Capabilities";
import Stack from "@/components/home/Stack";
import SelectedWork from "@/components/home/SelectedWork";
import Proof from "@/components/home/Proof";
import Process from "@/components/home/Process";
import FaqSection from "@/components/home/FaqSection";
import ReelsRow from "@/components/reels/ReelsRow";

// The homepage was force-dynamic with revalidate 0, which meant six CMS calls
// on every hit. A short ISR window keeps CMS edits near-live without paying
// that on the LCP path.
export const revalidate = 60;

const COPY = {
  en: {
    ctaTitle: "Let's build the thing that pays for itself",
    ctaSub: "Send a message — you'll get a real answer from the person who would run your project, not a sales script.",
    ctaLabel: "Book a call",
    waLabel: "Message us on WhatsApp",
    waMsg: "Hi MubarmiJ — I'd like to discuss a project.",
  },
  ar: {
    ctaTitle: "يلا نبني الحاجة اللي بتدفع تكلفتها بنفسها",
    ctaSub: "ابعتلنا رسالة — هترد عليك الشخص اللي هيدير مشروعك نفسه، مش سكريبت مبيعات.",
    ctaLabel: "احجز مكالمة",
    waLabel: "كلمنا على واتساب",
    waMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
  },
} as const;

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];

  const [about, featuredEnv, allEnv, services, faq, reelsEnv, testimonials, mobileEnv] =
    await Promise.all([
      getAbout(locale),
      getClients(locale, { featured: true, page_size: 8 }),
      getClients(locale, { page_size: 100 }),
      getServices(locale),
      getFaq(locale),
      getReels(locale, { page_size: 8 }),
      getTestimonials(locale),
      getClients(locale, { category: "mobile", page_size: 1 }),
    ]);

  const all = allEnv?.data ?? [];
  // Fall back to the full list when nothing is flagged featured yet.
  const featured = featuredEnv?.data?.length ? featuredEnv.data : all;

  const work = caseStudyClients(featured);
  const logos = logoEntries(all);
  const reels = reelsEnv?.data ?? [];
  const phoneClient = mobileEnv?.data?.[0] ?? null;

  // Detail records: the showcase card needs `results` and the live URL, and the
  // phone frame needs a portrait screenshot — card thumbnails are landscape and
  // crop badly inside a phone bezel.
  const [showcase, mobileDetail] = await Promise.all([
    work[0] ? getClient(work[0].slug, locale) : null,
    phoneClient ? getClient(phoneClient.slug, locale) : null,
  ]);

  // Section numbers are assigned from the sections that actually survive their
  // zero-state check, so a missing band doesn't leave a gap in the sequence.
  const hasProof =
    Boolean(about?.stats) || testimonials.some((q) => q.quote && q.author);
  const order = [
    services.length ? "capabilities" : null,
    "stack",
    work.length ? "work" : null,
    // Reels sit with Selected Work — the same projects, in motion — rather
    // than near the foot of the page where they were rarely reached.
    reels.length ? "reels" : null,
    hasProof ? "proof" : null,
    "process",
    faq.length ? "faq" : null,
  ].filter(Boolean) as string[];
  const n = (key: string) => {
    const i = order.indexOf(key);
    return i < 0 ? "" : String(i + 1).padStart(2, "0");
  };

  return (
    <>
      <Hero
        locale={locale}
        projects={about?.stats?.projects ?? null}
        liveCount={all.length}
        showcase={showcase}
        webShot={showcase?.hero_image_url || work[0]?.thumb_url}
        phoneShot={mobileDetail?.gallery?.[0]}
        phoneAlt={mobileDetail?.name}
      />
      <TrustedMarquee locale={locale} logos={logos} />
      <Capabilities locale={locale} index={n("capabilities")} services={services} />
      <Stack locale={locale} index={n("stack")} />
      <SelectedWork locale={locale} index={n("work")} clients={work} />
      <ReelsRow locale={locale} reels={reels} index={n("reels")} showAll />
      <Proof locale={locale} index={n("proof")} about={about} testimonials={testimonials} />
      <Process locale={locale} index={n("process")} />
      <FaqSection locale={locale} index={n("faq")} items={faq} />
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
