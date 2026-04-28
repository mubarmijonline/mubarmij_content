"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ROICalculator() {
  const t = useTranslations("automation");
  const [employees, setEmployees] = useState(5);
  const [hours, setHours] = useState(2);
  const [salary, setSalary] = useState(8000);
  const [showResult, setShowResult] = useState(false);

  // Working hours/month = 22 days * 8h = 176
  const workHoursPerMonth = 176;
  const hourlyCost = salary / workHoursPerMonth;
  const monthlyLossPerEmployee = hours * 22 * hourlyCost;
  const yearlyLoss = Math.round(monthlyLossPerEmployee * 12 * employees);
  // Assume automation can save ~70% of the repetitive load
  const yearlySave = Math.round(yearlyLoss * 0.7);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <section className="section bg-white">
      <div className="container mx-auto max-w-3xl">
        <h2 className="section-title text-center">{t("roiTitle")}</h2>

        <div className="mt-10 rounded-2xl border border-bglight bg-bglight/40 p-6 md:p-8 grid gap-5">
          <NumberField
            label={t("roiEmployees")}
            value={employees}
            min={1}
            max={500}
            onChange={setEmployees}
          />
          <NumberField
            label={t("roiHours")}
            value={hours}
            min={0}
            max={8}
            step={0.5}
            onChange={setHours}
          />
          <NumberField
            label={t("roiSalary")}
            value={salary}
            min={1000}
            max={100000}
            step={500}
            onChange={setSalary}
          />

          <button
            type="button"
            className="btn-primary w-full md:w-auto md:self-start"
            onClick={() => setShowResult(true)}
          >
            {t("roiCalculate")}
          </button>

          {showResult && (
            <div className="mt-2 rounded-xl bg-navy-deep text-white p-5 animate-fade-up">
              <p>
                {t("roiResult", { loss: fmt(yearlyLoss), save: fmt(yearlySave) })}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-navy-deep focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />
    </label>
  );
}
