/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B', // Deep Black
        surface: '#171717',    // Dark Grey for cards/nav
        primary: '#E4002B',    // Fast Food Red
        'primary-hover': '#C80025',
        text: '#FFFFFF',       // White text
        muted: '#A3A3A3',      // Grey text
        border: '#333333',     // Dark borders
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};