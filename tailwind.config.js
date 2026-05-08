module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sanity/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#7dd3fc",
        "primary-light": "#c4b5fd",
        "surface-950": "#050816",
        "surface-900": "#0b1120",
        "surface-800": "#111827",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        body: ["var(--font-ibm-plex-sans)"],
      },
      boxShadow: {
        panel: "0 24px 80px rgba(5, 8, 22, 0.45)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
