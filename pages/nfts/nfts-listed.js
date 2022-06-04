import ListedMarketItems from '../../components/market/ListedMarketItems'
import Head from 'next/head'

export default function Nfts() {

  return (
    <>
      <Head>
        <title>NFTs ListedItems | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        <h1 className='mb-2'>NFTs</h1>
        <ListedMarketItems />
      </div>
    </>
  )
}
