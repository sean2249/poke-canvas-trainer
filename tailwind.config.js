/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 溫暖、療癒的色票
        cream: '#fffbeb',
        sand: '#fef3c7',
        sunny: '#f59e0b',
        coral: '#fb7185',
        mint: '#6ee7b7',
        sky: '#7dd3fc',
        grape: '#c4b5fd',
        ink: '#5b4636',
      },
      fontFamily: {
        round: ['"Noto Sans TC"', '"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(91, 70, 54, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
