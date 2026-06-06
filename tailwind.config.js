import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1A3263",
          light: "#547792",
        },
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1500px",
        },
      },
    },
  },
  plugins: [heroui()],
};
