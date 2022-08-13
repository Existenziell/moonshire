import MarketItems from '../../components/market/MarketItems'
import Head from 'next/head'

export default function Nfts() {

  return (
    <>
      <Head>
        <title>NFTs MarketItems | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center px-[40px]'>
        <MarketItems />
      </div>
    </>
  )
}
