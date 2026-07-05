import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { BentoTile, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const COPY = {
  en: {
    eyebrow: "What we do",
    title: "One partner. Every layer of your software.",
    roiBadge: "Highest ROI",
    automation: {
      title: "Automation",
      body: "Custom workflows that capture leads, follow up on WhatsApp, generate invoices, and sync your tools — running 24/7.",
      proof: "✓ a client saved 80 hours/month",
    },
    web: {
      title: "Web development",
      body: "Fast, conversion-focused websites and web apps that turn visitors into paying customers.",
    },
    mobile: { title: "Mobile apps", body: "iOS & Android apps your customers actually keep on their home screen." },
    maintenance: { title: "Care & maintenance", body: "Updates, monitoring, and support so nothing breaks while you grow." },
    explore: "Explore",
  },
  ar: {
    eyebrow: "اللي بنعمله",
    title: "شريك واحد. لكل طبقة في برمجياتك.",
    roiBadge: "أعلى عائد",
    automation: {
      title: "الأتمتة",
      body: "أنظمة مخصّصة بتلتقط العملاء، وتتابع على واتساب، وتطلّع الفواتير، وتزامن أدواتك — شغّالة 24/7.",
      proof: "✓ عميل وفّر 80 ساعة شهريًا",
    },
    web: {
      title: "تطوير الويب",
      body: "مواقع وتطبيقات ويب سريعة ومركّزة على التحويل بتحوّل الزائر لعميل دافع.",
    },
    mobile: { title: "تطبيقات الموبايل", body: "تطبيقات iOS و Android عملاؤك بيحتفظوا بيها فعلًا." },
    maintenance: { title: "الصيانة والدعم", body: "تحديثات ومتابعة ودعم علشان ما يحصلش أعطال وإنت بتكبر." },
    explore: "استكشف",
  },
} as const;

/** P1 §4 — dark bento grid; Automation tile spans two rows with a gold ROI badge. */
export default function Solutions({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="bg-navy-deep px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-cream md:text-4xl">
            {t.title}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          <StaggerItem className="md:row-span-2">
            <BentoTile
              variant="outlineGold"
              href={localePath(locale, "/services/automation")}
              className="flex h-full flex-col"
            >
              <span className="inline-flex w-fit items-center rounded-pill bg-gold px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-gold-ink">
                {t.roiBadge}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-cream">{t.automation.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-bodydark">{t.automation.body}</p>
              <p className="mt-6 font-mono text-sm text-gold">{t.automation.proof}</p>
            </BentoTile>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <BentoTile href={localePath(locale, "/services/web-development")} className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-cream">{t.web.title}</h3>
              <p className="mt-2 leading-relaxed text-bodydark">{t.web.body}</p>
            </BentoTile>
          </StaggerItem>

          <StaggerItem>
            <BentoTile href={localePath(locale, "/services/mobile-apps")} className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-cream">{t.mobile.title}</h3>
              <p className="mt-2 leading-relaxed text-bodydark">{t.mobile.body}</p>
            </BentoTile>
          </StaggerItem>

          <StaggerItem>
            <BentoTile href={localePath(locale, "/services/maintenance")} className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-cream">{t.maintenance.title}</h3>
              <p className="mt-2 leading-relaxed text-bodydark">{t.maintenance.body}</p>
            </BentoTile>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
