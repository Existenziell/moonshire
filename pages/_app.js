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
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
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
