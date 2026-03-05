/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./admin/*.html",
    "./landing-pages/*.html",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary-rgb, 19 127 236) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark-rgb, 14 87 166) / <alpha-value>)",
        "background-light": "rgb(var(--color-background-light-rgb, 246 247 248) / <alpha-value>)",
        "background-dark": "rgb(var(--color-background-dark-rgb, 16 25 34) / <alpha-value>)",
        "text-main": "rgb(var(--color-text-main-rgb, 13 27 23) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted-rgb, 76 154 128) / <alpha-value>)",
        "luxury-dark": "rgb(var(--color-luxury-dark-rgb, 15 20 25) / <alpha-value>)",
        "luxury-gold": "rgb(var(--color-luxury-gold-rgb, 212 175 55) / <alpha-value>)",
        "luxury-light": "rgb(var(--color-luxury-light-rgb, 245 245 245) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb, 255 255 255) / <alpha-value>)",
        "neutral-dark": "rgb(var(--color-neutral-dark-rgb, 13 27 23) / <alpha-value>)",
        "neutral-mid": "rgb(var(--color-neutral-mid-rgb, 76 154 128) / <alpha-value>)",
        "playful-pink": "rgb(var(--color-playful-pink-rgb, 236 72 153) / <alpha-value>)",
        "playful-yellow": "rgb(var(--color-playful-yellow-rgb, 250 204 21) / <alpha-value>)",
        "playful-orange": "rgb(var(--color-playful-orange-rgb, 249 115 22) / <alpha-value>)",
        "bg-light": "rgb(var(--color-bg-light-rgb, 246 247 248) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
