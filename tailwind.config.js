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
          'Didot'
        ]
      },
      fontSize: {
        'tiny': '10px',
      },
      colors: {
        'brand': '#DBDBDB',
        'brand-dark': '#242424',
        'cta': '#FF0040',
        'detail': '#CFCFCF',
        'detail-dark': '#323232',
        'lines': '#CCCCCC',
        'lines-dark': '#363636',
        'admin-green': '#60CE4C',
      },
      backgroundImage: {
        'logo': 'url(/logo.png)',
        'logo-dark': 'url(/logo-dark.png)',
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
  plugins: [],
}
