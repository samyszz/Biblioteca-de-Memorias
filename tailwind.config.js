/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'memoria-purple': '#4E2A3E', // Cor principal da sua logo
        'memoria-lavender': '#D6CFFF',
        'memoria-peach': '#FFDAB9',
        'memoria-cream': '#FFF8F0',
        'memoria-pink': '#F3C5C5',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}