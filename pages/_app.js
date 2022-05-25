import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Layout from '../components/_Layout'
import Head from 'next/head'
import { AppWrapper } from '../context/AppContext'

function App({ Component, pageProps }) {

  return (
    <AppWrapper>
      <Head>
        <link rel="preload" href="/fonts/Didot.ttc" as="font" crossOrigin="" />
        <link rel="preload" href="/fonts/Atlas-Typewriter-Regular.ttf" as="font" crossOrigin="" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppWrapper>
  )
}

export default App
