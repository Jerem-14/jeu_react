/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
const daisyui = require('daisyui');

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  }
}

