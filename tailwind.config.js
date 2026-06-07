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
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#4B56D2",
        secondary: "#82C3EC",
        accent: "#F1B4BB",
        background: "#F5F5F5",
        success: "#4CAF50",
        warning: "#FFC107",
        danger: "#F44336",
        info: "#2196F3",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
        hover: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
