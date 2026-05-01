"use client";

/**
 * Splits a string into <span> per word and applies a staggered fade-up so each
 * word animates in sequence. Works in both LTR and RTL because we keep the
 * original whitespace as plain text nodes between spans.
 */
export default function AnimatedWords({
  text,
  className = "",
  wordClassName = "",
  delayBaseMs = 80,
  startDelayMs = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delayBaseMs?: number;
  startDelayMs?: number;
}) {
  const words = text.split(/(\s+)/); // keep whitespace tokens
  let wordIndex = -1;

  return (
    <span className={className} aria-label={text}>
      {words.map((tok, i) => {
        if (/^\s+$/.test(tok)) {
          // Preserve explicit newlines as <br/> so the author can force a line break.
          // We also keep a literal space so SEO crawlers / plain-text extractors
          // don't concatenate the two halves into a single word.
          if (tok.includes("\n")) return <span key={i}>{" "}<br /></span>;
          return <span key={i}>{tok}</span>;
        }
        wordIndex += 1;
        const delay = startDelayMs + wordIndex * delayBaseMs;
        return (
          <span
            key={i}
            className={`inline-block animate-fade-up ${wordClassName}`}
            style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
          >
            {tok}
          </span>
        );
      })}
    </span>
  );
}
