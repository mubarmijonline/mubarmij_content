"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

const QUESTIONS_AR = [
  { q: "إيه الفرق بين موقع وتطبيق؟ وإمتى أحتاج كل واحد؟", a: "الموقع نقطة دخول لكل العملاء عبر المتصفح، والتطبيق مناسب لما العميل بيرجعلك بشكل متكرر ومحتاج تجربة مخصصة (إشعارات، استخدام بدون نت، إلخ). لو لسه بتجمع جمهور — موقع. لو عندك جمهور ثابت — تطبيق." },
  { q: "ليه أسعاركو أعلى من الفريلانسرز؟", a: "بنشتغل بفريق متكامل (مطور + مصمم + product manager + QA) مع ضمان وصيانة ودعم. الفريلانسر الواحد بيكون تكلفته أقل لكن من غير ضمان استمرارية." },
  { q: "بتاخدوا كام مدة لتطوير موقع متكامل؟", a: "متوسط 4–8 أسابيع حسب التعقيد. بنحدد جدول زمني واضح بعد الـ Discovery Call." },
  { q: "هل بتقدموا صيانة بعد التسليم؟ وبكم؟", a: "آه، 3 شهور صيانة مجانية بعد الإطلاق. بعدها باقات صيانة شهرية تبدأ من 1,500 ج." },
  { q: "إزاي بتتم الدفعات؟", a: "مقدم 40% – Milestone 30% – عند التسليم 30%." },
  { q: "بتشتغلوا مع شركات في مدن تانية أو دول؟", a: "نعم، بنخدم عملاء في كل مصر والخليج عن بُعد." },
  { q: "إيه هي الـ Automation وإمتى أحتاجها؟", a: "أتمتة = أنظمة بتعمل المهام المتكررة بدلاً من فريقك. لو فيه مهمة بتتعمل أكتر من 10 مرات في الأسبوع — في الأغلب ينفع تتأتمت." },
  { q: "ممكن أشوف شغل سابق ليكم؟", a: "أكيد. شوف صفحة Case Studies." },
  { q: "بتستخدموا أنهي تكنولوجيات؟", a: "Next.js, Node.js, Postgres, Flutter, AWS, Cloudflare، وأدوات أتمتة زي n8n وMake.com." },
  { q: "لو مش عاجبني الشغل، إيه السياسة؟", a: "بنشتغل بنظام Iterations مع review في كل مرحلة، فبنتأكد إنك راضي قبل ما ننتقل للخطوة اللي بعدها." },
  { q: "هل بتساعدوا في hosting و domain؟", a: "آه، بنوفّرهم في باقة Starter للسنة الأولى مجاناً." },
  { q: "هل بتعملوا training بعد التسليم؟", a: "آه، جلسة تسليم + Documentation + فيديوهات شرح." },
];

const QUESTIONS_EN = [
  { q: "What's the difference between a website and an app? When do I need each?", a: "A website is the entry point for any customer via a browser; an app suits returning customers needing a tailored experience (notifications, offline use, etc.). Still building an audience? Site. Have a recurring audience? App." },
  { q: "Why are your prices higher than freelancers?", a: "We work as a full team (dev + designer + PM + QA) with warranty, maintenance, and support. A single freelancer is cheaper, but without continuity guarantees." },
  { q: "How long does a full website take to build?", a: "Typically 4–8 weeks depending on complexity. We set a clear timeline after the Discovery Call." },
  { q: "Do you offer post-launch maintenance? At what cost?", a: "Yes — 3 months free after launch. After that, monthly maintenance plans start at EGP 1,500." },
  { q: "How do payments work?", a: "40% upfront – 30% at milestone – 30% on delivery." },
  { q: "Do you work with companies in other cities or countries?", a: "Yes — we serve clients across Egypt and the Gulf remotely." },
  { q: "What is automation, and when do I need it?", a: "Automation = systems doing repetitive tasks for your team. If a task happens 10+ times a week, it's likely automatable." },
  { q: "Can I see your past work?", a: "Of course — see the Case Studies page." },
  { q: "What technologies do you use?", a: "Next.js, Node.js, Postgres, Flutter, AWS, Cloudflare, plus automation tools like n8n and Make.com." },
  { q: "What's the policy if I don't like the work?", a: "We work in iterations with reviews at each milestone — making sure you're satisfied before we proceed." },
  { q: "Do you help with hosting and domain?", a: "Yes — included free for the first year on the Starter package." },
  { q: "Do you offer training after delivery?", a: "Yes — handover session + documentation + walkthrough videos." },
];

export default function FAQ({ locale }: { locale: "en" | "ar" }) {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);
  const items = locale === "ar" ? QUESTIONS_AR : QUESTIONS_EN;

  // FAQPage JSON-LD
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="section bg-white">
      <div className="container mx-auto max-w-3xl">
        <h2 className="section-title text-center">{t("title")}</h2>
        <div className="mt-10 divide-y divide-bglight border-y border-bglight">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-start py-5 font-semibold text-navy-deep"
                >
                  <span>{it.q}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && <p className="pb-5 text-navy/80 leading-relaxed">{it.a}</p>}
              </div>
            );
          })}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </div>
    </section>
  );
}
