/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#08080d',
          900: '#101018',
          800: '#181824',
          700: '#252535',
          600: '#35354a',
        },
      },
    },
  },
  plugins: [],
}

