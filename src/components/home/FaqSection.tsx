import type { Locale } from "@/i18n/config";
import type { FaqItem } from "@/lib/v1";
import { whatsappLink } from "@/lib/utils";
import { Accordion, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod, LinkArrow } from "@/components/system/Typo";

const COPY = {
  en: {
    eyebrow: "FAQ",
    title: "Before you ask",
    lede: "Still unsure? Send one message on WhatsApp and we'll tell you what we'd build — and what we wouldn't.",
    ask: "Ask us",
    askMsg: "Hi MubarmiJ — I have a question.",
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    title: "قبل ما تسأل",
    lede: "لسه مش متأكد؟ ابعتلنا رسالة واحدة على واتساب ونقولك هنبني إيه — وإيه اللي مش هنبنيه.",
    ask: "اسألنا",
    askMsg: "أهلاً مبرمج — عندي سؤال.",
  },
} as const;

export default function FaqSection({
  locale,
  index,
  items,
}: {
  locale: Locale;
  index: string;
  items: FaqItem[];
}) {
  if (!items.length) return null;
  const t = COPY[locale];

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
        <div className="border-hair py-16 lg:border-e lg:pe-10">
          <div className="sticky top-[calc(var(--hdr-h)+24px)]">
            <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
            <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
              {t.title}
              <GoldPeriod />
            </h2>
            <p className="mt-4 max-w-[26em] text-[16.5px] leading-relaxed text-fgbody">{t.lede}</p>
            <div className="mt-6">
              <LinkArrow href={whatsappLink(t.askMsg)} locale={locale} external>
                {t.ask}
              </LinkArrow>
            </div>
          </div>
        </div>

        <div className="pb-16 lg:ps-12 lg:pt-16">
          <Accordion items={items} />
        </div>
      </Shell>
    </section>
  );
}
