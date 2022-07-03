module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      // https://tailwindcss.com/docs/font-family#customizing
      fontFamily: {
        sans: [
          'Atlas-Typewriter',
        ],
        serif: [
          'Arial',
        ]
      },
      fontSize: {
        'tiny': '9px',
      },
      colors: {
        'brand': '#DBDBDB',
        'brand-dark': '#242424',
        'cta': '#D6A269',
        'detail': '#CFCFCF',
        'detail-dark': '#323232',
        'lines': '#CCCCCC',
        'lines-dark': '#363636',
      },
      backgroundImage: {
        'upload': 'url(/upload.png)',
        'upload-dark': 'url(/upload-dark.png)',
        'home1': 'url(/home/1.webp)',
        'home2': 'url(/home/2.webp)',
        'home3': 'url(/home/3.webp)',
        'home4': 'url(/home/4.webp)',
        'home5': 'url(/home/5.webp)',
        'home6': 'url(/home/6.webp)',
      },
      animation: {},
      keyframes: {},
    },
    gradientColorStops: theme => ({
      primary: '#DBDBDB',
      secondary: '#242424',
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
