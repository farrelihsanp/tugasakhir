/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#cc2526', // Merah utama
        'primary-light': '#ff7171', // Merah terang
        'primary-dark': '#891f1f', // Merah gelap
      },
    },
  },
  plugins: [],
};
