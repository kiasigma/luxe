/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium, calm palette with soft pastel accents.
        ink: {
          DEFAULT: "#1c1a1d",
          soft: "#4a464c",
          muted: "#8b868f",
        },
        canvas: "#fbfafc",
        blush: {
          50: "#fdf4f6",
          100: "#fce8ee",
          200: "#f8d2dd",
          300: "#f1adc1",
          400: "#e87fa0",
          500: "#d95683",
        },
        lilac: {
          50: "#f7f5fb",
          100: "#efe9f8",
          200: "#ddd0f0",
          300: "#c2abe3",
          400: "#a47fd1",
          500: "#8a5cbd",
        },
        sage: {
          50: "#f3f7f4",
          100: "#e3ede6",
          200: "#c6dccd",
          300: "#9cc1a8",
          400: "#6fa17f",
        },
        sand: {
          50: "#faf7f2",
          100: "#f3ece0",
          200: "#e6d8c3",
          300: "#d4bd9c",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        // Layered shadows read as real depth without feeling heavy.
        soft: "0 1px 2px rgba(28, 26, 29, 0.04), 0 8px 24px -10px rgba(28, 26, 29, 0.14)",
        lift: "0 2px 6px rgba(28, 26, 29, 0.06), 0 28px 56px -18px rgba(28, 26, 29, 0.30)",
        glow: "0 0 0 4px rgba(217, 86, 131, 0.12)",
        inset: "inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
