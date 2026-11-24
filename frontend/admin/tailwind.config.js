/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        surface: '#171717',
        card: '#202020',
        primary: '#E4002B',
        'primary-hover': '#C80025',
        text: '#FFFFFF',
        muted: '#A3A3A3',
        border: '#333333',
      },
    },
  },
  plugins: [],
};