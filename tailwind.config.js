/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fb-blue': '#1B3B6B',  // Facilitaire Bedrijven blauw
        'fb-orange': '#FF6B35', // Accent kleur
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    themes: [
      {
        fbtheme: {
          "primary": "#1B3B6B",
          "secondary": "#FF6B35",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
}

