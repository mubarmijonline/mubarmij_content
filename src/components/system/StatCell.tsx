import { cn } from "@/lib/utils";

/**
 * Leading digits, allowing +, ~, −, currency and other symbol prefixes.
 * Written without \p{L} so it doesn't require an ES2018 compile target — the
 * excluded set is Latin plus the Arabic block, which is all this site sees.
 */
const NUMERIC = /^[^0-9A-Za-z؀-ۿ]*[0-9]/;

export function isNumericStat(value: unknown): boolean {
  return NUMERIC.test(String(value ?? ""));
}

/**
 * True when a stat is worth rendering. Empty and zero both fail: the spec
 * forbids zero-prefixed metrics, and a blank cell breaks the hairline grid
 * more visibly than a missing one.
 */
export function hasStat(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const s = String(value).trim();
  return s !== "" && s !== "0";
}

/**
 * One cell of a stat strip.
 *
 * The design draws these as big numbers, but the CMS `results` field holds
 * qualitative phrases ("Browse to bag", "Egypt & Gulf") on most clients.
 * Setting a phrase at 34px overflows the cell below ~360px and tears the
 * hairline grid apart, so non-numeric values drop to a display-weight phrase
 * size instead. That's a layout constraint, not a style preference.
 */
export function StatCell({
  value,
  label,
  kind = "auto",
  className,
}: {
  value: string | number | null | undefined;
  label: string;
  kind?: "auto" | "number" | "text";
  className?: string;
}) {
  if (!hasStat(value)) return null;

  const numeric = kind === "number" || (kind === "auto" && isNumericStat(value));

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "font-display font-bold text-fg",
          numeric
            ? "text-[30px] tracking-[-0.02em] tabular-nums"
            : "text-[17px] font-semibold leading-tight",
        )}
      >
        {value}
      </div>
      <div className="mono mt-1.5 text-[10.5px] uppercase text-fgmuted">{label}</div>
    </div>
  );
}
