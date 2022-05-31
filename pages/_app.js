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
