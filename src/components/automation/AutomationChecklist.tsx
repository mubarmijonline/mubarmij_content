"use client";

import { useTranslations } from "next-intl";

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
  const items = locale === "ar" ? ITEMS_AR : ITEMS_EN;

  return (
    <section className="section bg-bglight">
      <div className="container mx-auto max-w-3xl">
        <h2 className="section-title text-center">{t("checklistTitle")}</h2>
        <ul className="mt-10 space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg bg-white border border-bglight p-4"
            >
              <span className="mt-0.5 text-gold font-bold">-</span>
              <span className="font-medium text-navy-deep">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
