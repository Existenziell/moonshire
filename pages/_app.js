import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Head from 'next/head'
import Layout from '../components/_Layout'
import { AppWrapper } from '../context/AppContext'
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"

const getLibrary = (provider) => {
  return new Web3Provider(provider)
}

function Moonshire({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppWrapper>
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
          <link rel="preload" href="/fonts/Didot.ttc" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/Atlas-Typewriter-Regular.ttf" as="font" crossOrigin="" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </Web3ReactProvider>
  )
}

export default Moonshire
