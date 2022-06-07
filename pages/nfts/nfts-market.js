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
        <h1 className='mb-2'>NFTs</h1>
        <MarketItems />
      </div>
    </>
  )
}
