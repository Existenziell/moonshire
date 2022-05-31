import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='flex flex-col md:flex-row items-center justify-center gap-8 text-sm pt-12'>
        <img src='/landing.png' alt='Landing' className='w-1/2' />
        <div>
          <h1>Synthetic Wave Field Collection</h1>
          <p className='mt-4'>We are surrounded by electronic waves. The transmission quality of data is the ubiquitous status quo of the informational age.</p>
          <hr className='border-t-2 border-lines my-8' />
          <p>10 Unique Audio-Visual NFTs by <span className='text-cta'>Andreas Rothaug</span></p>
          <p>50 ETH</p>
          <p className='text-tiny my-8'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
          <Link href='/collection'>
            <a className='button button-detail'>View Collection</a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
