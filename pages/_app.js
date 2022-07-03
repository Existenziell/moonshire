import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Head from 'next/head'
import Layout from '../components/_Layout'
import { AppProvider } from '../context/App'

function Moonshire({ Component, pageProps }) {
  return (
    <AppProvider>
      <Head>
        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/favicon/icon-144x144.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#242424" />
        <meta name="msapplication-TileColor" content="#DBDBDB" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#DBDBDB" />
        {/* Fonts */}
        {/* <link rel="preload" href="/fonts/Didot.ttc" as="font" crossOrigin="" /> */}
        <link href="/fonts/Atlas-Typewriter-Regular.ttf" as="font" crossOrigin="" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}

export default Moonshire
