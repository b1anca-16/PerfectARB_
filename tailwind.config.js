/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,scss,css}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
