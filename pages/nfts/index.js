import ListedMarketItems from '../../components/market/ListedMarketItems'
import Head from 'next/head'

export default function Nfts() {

  return (
    <>
      <Head>
        <title>NFTs | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        <h1>NFTs</h1>
        <div className='flex flex-col items-center justify-center gap-24 text-sm'>
          <ListedMarketItems />
        </div>
      </div>
    </>
  )
}
