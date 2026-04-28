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
        navy: { DEFAULT: "#1E3A5F", deep: "#0A1628" },
        gold: {
          DEFAULT: "#D4A24C",
          50: "#FBF6EC",
          100: "#F5E8CC",
          400: "#E0B976",
          500: "#D4A24C",
          600: "#B6862F",
        },
        whatsapp: "#25D366",
        bglight: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "Cairo", "system-ui", "sans-serif"],
        "arabic-display": ["var(--font-tajawal)", "Tajawal", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4A24C 0%, #B6862F 100%)",
      },
      boxShadow: {
        gold: "0 10px 30px -10px rgba(212, 162, 76, 0.45)",
        navy: "0 10px 30px -10px rgba(10, 22, 40, 0.55)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 30s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
