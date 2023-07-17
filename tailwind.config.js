/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl': 'rgb(0 0 0 / 20%) 0px 25px 20px -20px'
      }
    }
  },
  plugins: []
};
