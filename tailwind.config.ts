import type { Config } from "tailwindcss";

/**
 * Springs 360 design tokens.
 * Ivory + forest carry the system. Gold is a restrained accent only.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        deep: "#0A2118",
        forest: {
          DEFAULT: "#123B2A",
          900: "#0A2118",
          800: "#0F3023",
          700: "#123B2A",
          600: "#1B4D38",
          500: "#2C6A4F",
        },
        ivory: {
          DEFAULT: "#F5F1E8",
          50: "#FBF9F4",
          100: "#F5F1E8",
          200: "#ECE6D8",
          300: "#DDD5C3",
        },
        sage: {
          DEFAULT: "#DCE7DE",
          100: "#EAF0EB",
          200: "#DCE7DE",
          300: "#BFD1C3",
          400: "#A3BBA9",
        },
        gold: {
          DEFAULT: "#B89B62",
          light: "#D2BC8E",
          dark: "#715A2F",
        },
        ink: {
          DEFAULT: "#20332B",
          muted: "#4C5D55",
          soft: "#5A6962",
        },
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', '"Bodoni Moda"', "Didot", "Georgia", "serif"],
        sans: ['"DM Sans Variable"', '"DM Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.3rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-xl": ["clamp(2.6rem, 6.4vw, 6.25rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.2rem, 4.6vw, 4.5rem)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.8rem, 3.2vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.45rem, 2.2vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        lead: ["clamp(1.075rem, 1.4vw, 1.3rem)", { lineHeight: "1.6" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      maxWidth: {
        prose: "68ch",
        site: "88rem",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
      },
      spacing: {
        section: "clamp(5rem, 11vw, 10rem)",
        "section-sm": "clamp(3.5rem, 7vw, 6rem)",
        gutter: "clamp(1.25rem, 4vw, 3rem)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,33,24,0.04), 0 12px 32px -16px rgba(10,33,24,0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
