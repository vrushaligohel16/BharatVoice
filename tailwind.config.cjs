/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F2EDE4',
        'cream-dark': '#EDEAE4',
        'cream-tag': '#E8E0D6',
        'cream-pill': '#E8E0D6',
        heading: '#1C1410',
        body: '#6B5B4E',
        muted: '#A89880',
        accent: '#C4A882',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0, 0, 0, 0.04)',
        float: '0 20px 60px rgba(0, 0, 0, 0.08)',
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [],
};
