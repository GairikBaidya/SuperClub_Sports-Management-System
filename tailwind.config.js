/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Bebas Neue', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        primary: {
          50: 'rgba(232,184,75,0.08)',
          100: 'rgba(232,184,75,0.15)',
          200: '#F5D07A',
          300: '#F5D07A',
          400: '#E8B84B',
          500: '#E8B84B',
          600: '#E8B84B',
          700: '#D4940A',
          800: '#B07808',
          900: '#8C5E06',
        },
      },
    },
  },
  plugins: [],
}
