/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#F3EFE6',
          300: '#E8E2D5'
        },
        charcoal: {
          900: '#181715',
          800: '#22201D',
          700: '#3D3A35',
          500: '#66625D',
          300: '#99948D'
        },
        bronze: {
          500: '#C5A059',
          600: '#A8833D',
          700: '#8C6D38'
        },
        terracotta: {
          500: '#C86D51',
          600: '#A75239'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
