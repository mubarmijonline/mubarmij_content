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
        "fade-in": "fadeIn 0.8s ease-out both",
        "slide-in-left": "slideInLeft 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-right": "slideInRight 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "logo-pop": "logoPop 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
        "logo-float": "logoFloat 4s ease-in-out infinite",
        "shine": "shine 3s linear infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "blink-caret": "blinkCaret 0.85s steps(2, start) infinite",
        "type": "type var(--type-duration, 2.6s) steps(var(--type-steps, 30), end) both",
        "orbit": "orbit 4s linear infinite",
        "dot-land": "dotLand 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
        "confetti-burst": "confettiBurst 1.4s ease-out forwards",
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
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        logoPop: {
          "0%": { opacity: "0", transform: "scale(0.6) rotate(-12deg)" },
          "60%": { opacity: "1", transform: "scale(1.08) rotate(4deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0)" },
        },
        logoFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        blinkCaret: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
        type: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        dotLand: {
          "0%": { opacity: "0", transform: "translate(-50%, -180%) scale(0)" },
          "60%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.4)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        confettiBurst: {
          "0%": { opacity: "1", transform: "translate(0,0) rotate(0deg)" },
          "100%": {
            opacity: "0",
            transform:
              "translate(var(--cx, 0px), var(--cy, 0px)) rotate(var(--cr, 720deg))",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
