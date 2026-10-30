import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#182B25",
          dark: "#0F1C18",
          light: "#233A33",
        },
        olive: {
          DEFAULT: "#344536",
          dark: "#253227",
          light: "#465B49",
        },
        ivory: {
          DEFAULT: "#F2EEDF",
          light: "#FAF7EF",
          dark: "#E3DCC8",
        },
        gold: {
          DEFAULT: "#C6AD75",
          light: "#D8C597",
          dark: "#A98E53",
        },
        sage: {
          DEFAULT: "#87917A",
          light: "#9EA792",
          dark: "#6F7863",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(24, 43, 37, 0.12)',
        'luxury-lg': '0 30px 60px -20px rgba(24, 43, 37, 0.22)',
      },
    },
  },
  plugins: [],
};
export default config;
