import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          950: "#211D16",
          900: "#2B2620",
          800: "#3A3329",
        },
        sprout: {
          400: "#9FCB6B",
          500: "#7FAE4C",
          600: "#628F38",
        },
        paper: "#F7F4EC",
        clay: "#B5652F",
        radish: "#C1436B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
