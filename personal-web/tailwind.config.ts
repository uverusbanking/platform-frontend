import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        // ── Unified tokens — use these in new code ─────────────────────
        "brand-primary": {
          DEFAULT: "rgb(var(--brand-primary) / <alpha-value>)",
          foreground: "rgb(var(--on-brand-primary) / <alpha-value>)",
        },
        "brand-secondary": {
          DEFAULT: "rgb(var(--brand-secondary) / <alpha-value>)",
          foreground: "rgb(var(--on-brand-secondary) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          high: "rgb(var(--surface-high) / <alpha-value>)",
          highest: "rgb(var(--surface-highest) / <alpha-value>)",
        },
        "foreground-subtle": "rgb(var(--foreground-subtle) / <alpha-value>)",
        "foreground-strong": "rgb(var(--foreground-strong) / <alpha-value>)",
        error: {
          DEFAULT: "rgb(var(--error) / <alpha-value>)",
          foreground: "rgb(var(--on-error) / <alpha-value>)",
        },

        // ── Shadcn/ui compat — kept so existing components don't break ─
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--brand-primary) / <alpha-value>)",
          foreground: "rgb(var(--on-brand-primary) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          foreground: "rgb(var(--foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--error) / <alpha-value>)",
          foreground: "rgb(var(--on-error) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          foreground: "rgb(var(--foreground-subtle) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--brand-secondary) / <alpha-value>)",
          foreground: "rgb(var(--on-brand-secondary) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--surface-highest) / <alpha-value>)",
          foreground: "rgb(var(--foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--surface-highest) / <alpha-value>)",
          foreground: "rgb(var(--foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          foreground: "rgb(var(--on-success) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--warning) / <alpha-value>)",
          foreground: "rgb(var(--on-warning) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "rgb(var(--sidebar-background) / <alpha-value>)",
          foreground: "rgb(var(--sidebar-foreground) / <alpha-value>)",
          primary: "rgb(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground":
            "rgb(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "rgb(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground":
            "rgb(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "rgb(var(--sidebar-border) / <alpha-value>)",
          ring: "rgb(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
