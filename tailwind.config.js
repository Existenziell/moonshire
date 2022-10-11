const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Atlas-Typewriter', ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          'Arial', ...defaultTheme.fontFamily.serif,
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
        'upload': "url('/upload.png')",
        'upload-dark': "url('/upload-dark.png')",
      },
      animation: {},
      keyframes: {},
    },
    gradientColorStops: theme => ({
      primary: '#DBDBDB',
      secondary: '#242424',
    }),
    // used in Nav 
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // ...
  ],
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
