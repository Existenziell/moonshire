/**
 * @type {import('next').NextConfig}
 */

const withPWA = require("next-pwa")

const nextConfig = {
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  // pwa: {
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  // },
  images: {
    domains: ['bpwdpdrdsuhpgevetixn.supabase.co', 'moonshire.infura-ipfs.io'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
