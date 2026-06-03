/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: '#1a8c7a',
        'light-teal': '#2ab5a0',
        'lighter-teal': '#3dd6c0',
        navy: '#152238',
        elephant: '#3d4f5c',
        silver: '#8a9aaa',
        ufo: '#c4cdd6',
        sage: '#f5f0e8',
        'dark-sage': '#d4d8c8',
        'darkest-sage': '#b0b8a8',
        yellow: '#f0a820',
        orange: '#e86030',
        red: '#c84848',
        'dark-red': '#a83030',
        'darkest-red': '#882020',
      },
      fontFamily: {
        heading: ['"Publico Headline"', 'Georgia', 'serif'],
        body: ['Mulish', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
