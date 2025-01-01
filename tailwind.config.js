/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        "4xl": ["0 35px 35px rgba(0, 0, 0, 1)", "0 45px 65px rgba(0, 0, 0, 1)"],
      },
    },
  },
  plugins: [],
};
