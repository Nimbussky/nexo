/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        surface: "#14141A",
        line: "#23232C",
        accent: "#7C5CFF",
        mute: "#A1A1AA",
      },
    },
  },
  plugins: [],
};
