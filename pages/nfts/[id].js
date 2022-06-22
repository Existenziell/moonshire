import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
// import { shortenAddress } from '../../lib/shortenAddress'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import buyNft from '../../lib/contract/buyNft'
import logWeb3 from '../../lib/logWeb3'
import fetchMarketItemsMeta from '../../lib/contract/fetchMarketItemsMeta'

const Nft = ({ nft }) => {
  /* eslint-disable no-unused-vars */
  const { id, name, description, price, created_at, image_url, artists, tokenURI, tokenId } = nft
  /* eslint-enable no-unused-vars */
  const { address, signer, notify } = useApp()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [sellerIsOwner, setSellerIsOwner] = useState(false)

  useEffect(() => {
    if (address) fetchMeta()
  }, [address])

  const fetchMeta = async () => {
    const meta = await fetchMarketItemsMeta(tokenId, signer)
    if (meta) {
      nft.owner = meta.owner
      nft.seller = meta.seller
    }
    // If seller is current owner, don't offer 'Buy' option
    if (nft.seller === address) setSellerIsOwner(true)
  }

  const initiateBuy = async (nft) => {
    if (!address) {
      notify("Please connect your wallet to proceed")
      return
    }
    setLoading(true)
    logWeb3(`Initiating blockchain transfer...`)

    try {
      const hash = await buyNft(nft, signer)
      if (hash) {
        notify("Transfer to your wallet was successful!")
        logWeb3(`Transaction hash: ${hash}`)

        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        notify("Something went horribly wrong...")
      }
      setLoading(false)
    } catch (e) {
      notify("Something went horribly wrong...")
    }
  }

  return (
    <>
      <Head>
        <title>{name} | NFT | Project Moonshire</title>
        <meta name='description' content={`${name} | NFT | Project Moonshire`} />
      </Head>

      <div className='flex flex-col items-center h-[calc(100vh-260px)] px-[40px]'>

        <div key={id} className='flex flex-col md:flex-row items-center justify-between gap-[40px] w-full'>
          <img src={image_url} alt='NFT Image' className='md:w-[calc(50vw-100px)] shadow-2xl' />
          <div className='flex-grow'>
            <h1 className='mb-0'>{name}</h1>
            <hr className='my-6' />
            <p className='mb-4'>{description}</p>
            <div className='whitespace-nowrap flex flex-col gap-1'>
              <p>
                <span className='text-sm'>Artist:{` `}</span>
                <Link href={`/artists/${artists.id}`}><a className='link text-white'>{artists.name}</a></Link>
              </p>
              {/* <p>Created: {created_at?.slice(0, 10)}</p>
              {nft.owner && nft.seller &&
                <>
                  <p>Owner: {shortenAddress(nft.owner)}</p>
                  <p>Seller: {shortenAddress(nft.seller)}</p>
                </>
              }
              <div>
                <span>Metadata:{` `}</span>
                <a href={tokenURI} target='_blank' rel='noopener noreferrer nofollow' className='link inline-block'>
                  {tokenURI.substring(0, 30)}&#8230;{tokenURI.slice(tokenURI.length - 4)}
                </a>
              </div> */}
            </div>
            <p className='mt-8'>Price: {price} ETH</p>

            {loading ?
              <div className='flex flex-col items-start justify-center mt-8'>
                <PulseLoader color={'var(--color-cta)'} size={20} />
                <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                <div id='mintingInfo' className='text-xs'></div>
              </div>
              :
              sellerIsOwner ?
                <div className='flex items-center mt-8 gap-8'>
                  <Link href={`/profile`}>
                    <a className='button button-detail inline-block'>
                      Sell
                    </a>
                  </Link>
                  <span className='text-tiny inline-block'>You own this asset</span>
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

export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: nft } = await supabase
    .from('nfts')
    .select(`*, artists(*), collections(*)`)
    .eq('id', id)
    .single()

  if (!nft) {
    return {
      redirect: {
        permanent: false,
        destination: "/nfts",
      },
      props: {}
    }
  }

  return {
    props: { nft },
  }
}

export default Nft
