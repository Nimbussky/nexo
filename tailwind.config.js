/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070D",
        surface: "rgba(18, 24, 38, 0.7)",
        surfaceLight: "rgba(255, 255, 255, 0.04)",
        surfaceHover: "rgba(255, 255, 255, 0.08)",
        line: "rgba(255, 255, 255, 0.08)",
        lineHighlight: "rgba(255, 255, 255, 0.16)",
        accent: "#8B5CF6",
        accentLight: "#A78BFA",
        cyanLight: "#38BDF8",
        mute: "#94A3B8",
      },
      boxShadow: {
        'glass-3d': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 20px 45px -12px rgba(0, 0, 0, 0.75)',
        'glass-card': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 10px 30px -5px rgba(0, 0, 0, 0.5)',
        'glass-glow': '0 0 35px rgba(139, 92, 246, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        'glass-cyan': '0 0 35px rgba(56, 189, 248, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
      },
      backdropBlur: {
        '2xl': '36px',
        '3xl': '54px',
      }
    },
  },
  plugins: [],
};
