/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"], // on garde la base du thème light
          "base-100": "#f3eae8",  // beige très clair, presque blanc cassé
          "base-200": "#f9ded8",  // beige légèrement plus prononcé
          "base-300": "#ebe3db",  // beige plus foncé pour le contraste
          "base-content": "#433422", // brun foncé adouci pour le texte
          "neutral": "#8c7355",  // brun moyen pour les éléments neutres
          "neutral-content": "#e7d9d1",
          "primary": "#78716c",  // version plus douce du primary
          "secondary": "#a8a29e", // version plus douce du secondary
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
        }
      },
    ],
  },
}