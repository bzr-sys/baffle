/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ground: '#EFEAFF',
        ink: '#1B1B1B',
        locked: '#D9D2F5',
        blue: '#4D96FF',
        red: '#FF6B6B',
        green: '#6BCB77',
        yellow: '#FFD93D',
        purple: '#B983FF',
        orange: '#FF9F45',
        teal: '#6FE0D6',
        pink: '#F79AD3',
      },
      boxShadow: {
        hard: '4px 4px 0 #1B1B1B',
        'hard-sm': '2px 2px 0 #1B1B1B',
        'hard-lg': '5px 5px 0 #1B1B1B',
      },
    },
  },
}
