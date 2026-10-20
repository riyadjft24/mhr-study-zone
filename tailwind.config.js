/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Bengali"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 35px rgba(23, 37, 84, 0.07)",
      },
    },
  },
  plugins: [],
};
