// Placeholder testimonials section.
// Per spec: any testimonial without photo OR without company name must be removed.
// Until real testimonials with photo + company are provided, render NOTHING (omit metric rule).
import { useTranslations } from "next-intl";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  logo?: string;
};

const testimonials: Testimonial[] = [
  // Add real testimonials here. Each MUST have photo + company.
];

export default function Testimonials() {
  const t = useTranslations("testimonials");
  if (testimonials.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center">{t("title")}</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {/* render cards when populated */}
        </div>
      </div>
    </section>
  );
}
