import { supabase } from '../../lib/supabase'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { AppContext } from '../../context/AppContext'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Link from 'next/link'
import buyNft from '../../lib/market/buyNft'
import logWeb3 from '../../lib/logWeb3'

const Nft = ({ nft }) => {
  const { id, name, description, price, format, created_at, image_url, artists } = nft
  const { library: provider } = useWeb3React()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const initiateBuy = async (nft) => {
    if (!provider) {
      notify("Please connect your wallet first")
      return
    }
    setLoading(true)
    logWeb3(`Initiating blockchain transfer...`)
    const hash = await buyNft(nft, provider)
    if (hash) {
      setLoading(false)
      notify("Transfer to your wallet was successful!")
      setTimeout(() => {
        router.push('/profile')
      }, 3000)
    } else {
      notify("Something went horribly wrong...")
    }
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
          <img src={image_url} alt='NFT Image' className='md:w-1/2' />
          <div>
            <h2>
              <span className='text-sm pr-2'>by</span>
              <Link href={`/artists/${artists.id}`}><a>{artists.name}</a></Link>
            </h2>
            <hr className='border-t-2 border-lines my-8' />
            <p className='my-4'>{description}</p>
            <p>Created: {created_at.slice(0, 10)}</p>
            <p className='mt-4'>{format}</p>
            <p className='mt-8 text-lg'>Price: {price} ETH</p>
            <p className='text-tiny mt-2'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>

            {loading ?
              <div className='flex flex-col items-start justify-center mt-8'>
                <div id='mintingInfo' className='mt-16 text-xs'></div>
                <PulseLoader color={'var(--color-cta)'} size={20} />
                <p className='text-xs mt-4'>Please follow MetaMask prompt...</p>
              </div>
              :
              <button onClick={() => initiateBuy(nft)} className='button button-cta mt-8'>Buy Asset</button>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const id = context.params.id

  let { data: nft } = await supabase
    .from('nfts')
    .select(`*, artists(*), collections(*)`)
    .eq('id', id)
    .single()

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
