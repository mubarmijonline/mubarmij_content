import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px", "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ---- v3 surface-scoped tokens -------------------------------------
        // Resolved from the .surf-light / .surf-subtle / .surf-dark scopes in
        // globals.css, so a primitive written once inverts inside a dark band.
        // NOTE: never use Tailwind opacity modifiers on these (text-fg/60) —
        // the vars hold rgba() and the modifier silently does nothing.
        surface: "var(--bg)",
        fg: "var(--fg)",
        fgbody: "var(--fg-body)",
        fgmuted: "var(--fg-muted)",
        fgfaint: "var(--fg-faint)",
        hair: "var(--rule)",
        hairin: "var(--rule-in)",
        hairbtn: "var(--rule-btn)",
        hairhov: "var(--rule-hov)",
        well: "var(--well)",
        // Named `accent`, not `eyebrow` — `text-eyebrow` is already the
        // font-size key, and a name in both scales resolves ambiguously.
        accent: "var(--eyebrow)",

        // ---- v3 literal values (never invert) ------------------------------
        ink: {
          DEFAULT: "#0A1628",
          body: "#46536B",
          muted: "#7A8698",
          faint: "#A3ADBB",
          logo: "#B6BEC9",
          chrome: "#16233A",
        },
        rule: { DEFAULT: "#E2E6EC", btn: "#D6DCE5", in: "#EDF0F5", hov: "#CBD3DE" },
        paper: { DEFAULT: "#FFFFFF", subtle: "#F7F8FA", well: "#F1F4F8" },
        live: "#4ADE80",

        gold: {
          DEFAULT: "#D4A24C",
          light: "#F4C97A",
          ink: "#3A2A05",
          dim: "#B98A2F",
          deep: "#9A6E22",
          50: "#FBF6EC",
          100: "#F5E8CC",
          400: "#E0B976",
          500: "#D4A24C",
          600: "#B6862F",
        },
        whatsapp: "#25D366",
      },
      maxWidth: {
        shell: "1280px",
      },
      borderRadius: {
        chip: "6px",
        btn: "9px",
        panel: "12px",
        card: "14px",
        phone: "26px",
        phonein: "19px",
        pill: "9999px",
      },
      fontSize: {
        eyebrow: ["10.5px", { lineHeight: "1.2", letterSpacing: "0.09em" }],
        monosm: ["11px", { lineHeight: "1.3", letterSpacing: "0.06em" }],
        d1: ["clamp(34px, 4.6vw, 60px)", { lineHeight: "1.07", letterSpacing: "-0.035em" }],
        d2: ["clamp(27px, 3.1vw, 38px)", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
        d3: ["21px", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        lede: ["18.5px", { lineHeight: "1.65" }],
        copy: ["16px", { lineHeight: "1.65" }],
      },
      fontFamily: {
        // Latin body/display/mono each chain to Cairo so a missed class still
        // renders Arabic rather than falling back to a system serif.
        sans: ["var(--font-dm)", "var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-cairo)", "system-ui", "sans-serif"],
        mono: ["var(--font-jet)", "ui-monospace", "SFMono-Regular", "monospace"],
        arabic: ["var(--font-cairo)", "Cairo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        float: "0 30px 70px -34px rgba(0, 0, 0, 0.6)",
        // Named rather than an arbitrary value: the rgba() commas inside a
        // shadow-[...] class parse into transparent layers.
        nav: "0 1px 0 0 #E2E6EC, 0 10px 30px -22px rgba(10, 22, 40, 0.45)",
        lift: "0 30px 60px -44px rgba(10, 22, 40, 0.45)",
      },
      animation: {
        // ---- v3 motion (from the design) ----------------------------------
        rise: "rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        float1: "float1 7.5s ease-in-out infinite",
        float2: "float2 9s ease-in-out infinite",
        mq: "mq 36s linear infinite",
        tick: "tick 2.4s ease-in-out infinite",
        bar: "bar 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both",

      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "none" },
        },
        float1: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        // Direction-aware: [dir=rtl] .mq-track flips --mq-dir to -1.
        mq: {
          to: { transform: "translateX(calc(-50% * var(--mq-dir, 1)))" },
        },
        tick: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        bar: {
          from: { width: "0%" },
          to: { width: "var(--bar-to, 86%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
