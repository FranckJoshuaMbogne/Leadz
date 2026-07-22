import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--color-base)",
        elevated: "var(--color-elevated)",
        navy: "var(--color-navy)",
        electric: "var(--color-electric)",
        cyan: "var(--color-cyan)",
        purple: "var(--color-purple)",
        silver: "var(--color-silver)",
        ink: "var(--color-ink)",
      },
      fontFamily: {
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(61,123,255,0.35)",
        "glow-purple": "0 20px 60px -20px rgba(124,92,255,0.35)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #3D7BFF 0%, #7C5CFF 60%, #22D3EE 100%)",
        "gradient-radial-glow": "radial-gradient(circle at 50% 0%, rgba(61,123,255,0.15), transparent 60%)",
      },
      spacing: {
        section: "8rem",
        "section-sm": "4rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
