import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Nft = ({ nft }) => {
  const { id, name, desc, price, format, created_at, public_url, artists } = nft

  const mint = () => {
    alert('Minting coming soon :)')
  }

  return (
    <>
      <Head>
        <title>NFT | Project Moonshire</title>
        <meta name='description' content='NFT | Project Moonshire' />
      </Head>

      <div className='px-8 pb-24 flex flex-col items-center'>
        <h1 className='mx-auto'>{name}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8 text-sm pt-12'>
          <img src={public_url} alt='NFT Image' className='md:w-1/2' />
          <div>
            <h2>
              <span className='text-sm pr-2'>by</span>
              <Link href={`/artists/${artists.id}`}><a>{artists.name}</a></Link>
            </h2>
            <hr className='border-t-2 border-lines my-8' />
            <p className='my-4'>{desc}</p>
            <p>Created: {created_at.slice(0, 10)}</p>
            <p className='mt-4'>{format}</p>
            <p className='mt-8 text-lg'>Price: {price} ETH</p>
            <p className='text-tiny mt-2'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
            <button onClick={mint} className='button button-cta mt-8'>Buy Now</button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const id = context.params.id

  let { data: nft } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).eq('id', id).single()

  if (nft.image_url) {
    const url = await getPublicUrl('nfts', nft.image_url)
    nft.public_url = url
  }

  return {
    props: { nft },
  }
}

export async function getStaticPaths() {
  let { data } = await supabase
    .from('nfts')
    .select(`*`)

  const paths = data.map(d => ({
    params: { id: d.id.toString() },
  }))

  return { paths, fallback: false }
}

export default Nft
