import { supabase } from '../../lib/supabase'
import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { AppContext } from '../../context/AppContext'
import { PulseLoader } from 'react-spinners'
import { shortenAddress } from '../../lib/shortenAddress'
import Head from 'next/head'
import Link from 'next/link'
import buyNft from '../../lib/contract/buyNft'
import logWeb3 from '../../lib/logWeb3'
import fetchMarketItemsMeta from '../../lib/contract/fetchMarketItemsMeta'

const Nft = ({ nft }) => {
  const { id, name, description, price, created_at, image_url, artists, tokenURI, tokenId } = nft
  const { library: provider } = useWeb3React()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  useEffect(() => {
    if (provider) fetchMeta()
  }, [provider])

  const fetchMeta = async () => {
    const meta = await fetchMarketItemsMeta(provider, tokenId)
    if (meta) {
      nft.owner = meta.owner
      nft.seller = meta.seller
    }
  }

  const initiateBuy = async (nft) => {
    if (!provider) {
      notify("Please connect your wallet to proceed")
      return
    }
    setLoading(true)
    logWeb3(`Initiating blockchain transfer...`)

    try {
      const hash = await buyNft(nft, provider)
      if (hash) {
        notify("Transfer to your wallet was successful!")
        logWeb3(`Transaction hash: ${hash}`)

        setTimeout(() => {
          router.push('/profile')
        }, 3000)
      } else {
        notify("Something went horribly wrong...")
      }
      setLoading(false)
    } catch (e) {
      console.log(e);
      notify("Something went horribly wrong...")
    }
  }

  return (
    <>
      <Head>
        <title>NFT | Project Moonshire</title>
        <meta name='description' content='NFT | Project Moonshire' />
      </Head>

      <div className='px-8 flex flex-col items-center'>
        <h1 className='mx-auto border-b-2 border-detail dark:border-detail-dark'>{name}</h1>
        <div key={id} className=' flex flex-col md:flex-row items-start justify-between gap-8 text-sm bg-detail dark:bg-detail-dark rounded-lg p-8'>
          <img src={image_url} alt='NFT Image' className='md:w-1/2' />
          <div className='w-full flex-grow'>
            <h2>
              <span className='text-sm pr-2'>by</span>
              <Link href={`/artists/${artists.id}`}><a>{artists.name}</a></Link>
            </h2>
            <hr className='border-t-2 border-lines dark:border-lines-dark my-8' />
            <p className='my-4'>{description}</p>
            <div className='text-xs whitespace-nowrap flex flex-col gap-1'>
              <a href={tokenURI} target='_blank' rel='noopener noreferrer nofollow'>
                <span className=' link'>{tokenURI.substring(0, 30)}&#8230;{tokenURI.slice(tokenURI.length - 4)}</span>
              </a>
              <p>Created: {created_at.slice(0, 10)}</p>
              {nft.owner && nft.seller &&
                <>
                  <p className='mt-2'>Owner: {shortenAddress(nft.owner)}</p>
                  <p>Seller: {shortenAddress(nft.seller)}</p>
                </>
              }
            </div>
            <p className='mt-8 text-lg'>Price: {price} ETH</p>

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
