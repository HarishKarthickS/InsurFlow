/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-atkinson)", "Atkinson Hyperlegible", "sans-serif"],
        display: ["var(--font-barlow)", "Barlow Condensed", "sans-serif"],
        mono: ["var(--font-redhat)", "Red Hat Mono", "ui-monospace", "monospace"],
      },
      colors: {
        primary: "#1F6A72",
        secondary: "#5A7A86",
        accent: "#3D6F7C",
        background: "#C5D0D8",
        folder: "#EEF2F4",
        rail: "#2A3D46",
        success: "#2F6B52",
        warning: "#8A6D2B",
        danger: "#7A3333",
        info: "#3A6470",
      },
    },
  },
  plugins: [],
};
