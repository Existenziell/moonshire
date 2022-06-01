const withPWA = require("next-pwa")

const settings = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  devIndicators: {
    autoPrerender: false,
  }
}

module.exports = process.env.NODE_ENV === 'development' ? settings : withPWA(settings)