"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";

const ITEMS_AR = [
  "بنفقد leads بسبب بطء الرد",
  "فريقي بيقضي ساعات في إدخال البيانات يدوياً",
  "بنبعت رسائل مماثلة (متابعة، تأكيد، تذكير) يوميا",
  "في تقارير بنعملها كل أسبوع/شهر بشكل يدوي",
  "أدواتنا (CRM, Sheets, ادز) مش متصلة ببعض",
  "بنفوت مواعيد follow-up مع عملاء حاليين",
  "ما عندناش رؤية واضحة عن مصادر الـ leads",
];
const ITEMS_EN = [
  "We lose leads because of slow response time",
  "My team spends hours on manual data entry",
  "We send similar messages (follow-up, confirmation, reminders) daily",
  "We produce weekly/monthly reports manually",
  "Our tools (CRM, Sheets, ads) are not connected",
  "We miss follow-up appointments with existing customers",
  "We don't have clear visibility on lead sources",
];

export default function AutomationChecklist({ locale }: { locale: "en" | "ar" }) {
  const t = useTranslations("automation");
  const tCta = useTranslations("cta");
  const tWa = useTranslations("whatsapp");
  const items = locale === "ar" ? ITEMS_AR : ITEMS_EN;
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const count = checked.filter(Boolean).length;
  const triggered = count >= 3;

  return (
    <section className="section bg-bglight">
      <div className="container mx-auto max-w-3xl">
        <h2 className="section-title text-center">{t("checklistTitle")}</h2>
        <ul className="mt-10 space-y-3">
          {items.map((item, i) => (
            <li key={i}>
              <label className="flex items-start gap-3 rounded-lg bg-white border border-bglight p-4 cursor-pointer hover:border-gold">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 accent-gold"
                  checked={checked[i]}
                  onChange={(e) => {
                    const next = [...checked];
                    next[i] = e.target.checked;
                    setChecked(next);
                  }}
                />
                <span className="font-medium text-navy-deep">{item}</span>
              </label>
            </li>
          ))}
        </ul>
        {triggered && (
          <div className="mt-8 rounded-2xl bg-navy-deep text-white p-6 text-center animate-fade-up">
            <p className="text-lg font-semibold">{t("checklistCta")}</p>
            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <CTAButton href={`/${locale === "en" ? "" : locale + "/"}book-call`} variant="primary">
                {tCta("primary")}
              </CTAButton>
              <CTAButton href={whatsappLink(tWa("prefilled"))} variant="whatsapp" external>
                {tCta("whatsapp")}
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
