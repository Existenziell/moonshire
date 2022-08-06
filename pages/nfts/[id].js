import { useState, useEffect } from 'react'
import { useRealtime, useFilter } from 'react-supabase'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
// import { shortenAddress } from '../../lib/shortenAddress'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import buyNft from '../../lib/contract/buyNft'
import logWeb3 from '../../lib/logWeb3'
import fetchMarketItemsMeta from '../../lib/contract/fetchMarketItemsMeta'
import fetchMyNfts from '../../lib/contract/fetchMyNfts'
import fromExponential from 'from-exponential'

const Nft = ({ propsId }) => {
  const router = useRouter()
  const { address, signer, notify, connectWallet } = useApp()
  const [physicalAssets, setPhysicalAssets] = useState()
  const [digitalAssets, setDigitalAssets] = useState()

  let [{ data: nft }] = useRealtime('nfts', {
    select: {
      columns: '*, artists(*), collections(*)',
      filter: useFilter((query) => query.eq('id', router.query.id ? router.query.id : propsId))
    }
  })

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sellerIsOwner, setSellerIsOwner] = useState(false)

  const setAssets = async () => {
    let physicalAssets = []
    let digitalAssets = []
    if (nft[0].assets) {
      for (let el of nft[0].assets) {
        el.type === 'digital' ?
          digitalAssets.push(el)
          :
          physicalAssets.push(el)
      }
    }
    setDigitalAssets(digitalAssets)
    setPhysicalAssets(physicalAssets)
  }

  useEffect(() => {
    if (address && nft) {
      fetchMeta()
      setAssets()
    }
  }, [address, nft])

  const fetchMeta = async () => {
    if (tokenId) {
      const meta = await fetchMarketItemsMeta(tokenId, signer)
      if (meta) {
        nft.owner = meta.owner
        nft.seller = meta.seller
        // Item is listed and seller is owner
        if (nft.seller === address) setSellerIsOwner(true)
      } else {
        // If we get no meta, item is not listed
        let myNfts = await fetchMyNfts(signer)
        if (myNfts.length) {
          let filtered = myNfts.filter(nft => (nft.tokenId === tokenId && nft.tokenURI === tokenURI))
          if (filtered.length) setSellerIsOwner(true)
        }
      }
    }
    setFetching(false)
  }

  const initiateBuy = async (nft) => {
    if (!address) {
      notify("Please connect your wallet to proceed")
      return
    }
    setLoading(true)
    logWeb3(`Initiating blockchain transfer...`)

    try {
      const hash = await buyNft(nft.at(0), signer)
      if (hash) {
        notify("Transfer to your wallet was successful!")
        logWeb3(`Transaction hash: ${hash}`)

        setTimeout(() => {
          router.push(`/success?hash=${hash}&id=${nft.at(0).id}&name=${nft.at(0).name}&image_url=${image_url}`)
        }, 1500)
      } else {
        notify("Something went horribly wrong...")
      }
      setLoading(false)
    } catch (e) {
      notify("Something went horribly wrong...")
    }
  }

  const listNFT = (nft) => {
    router.push(`/nfts/resell?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (!nft) return <div className='flex w-full justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  const { name, description, price, image_url, artists, listed, tokenURI, tokenId } = nft[0]

  return (
    <>
      <Head>
        <title>{name} | NFT | Project Moonshire</title>
        <meta name='description' content={`${name} | NFT | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)]'>

        <div className='flex flex-col md:flex-row items-center justify-center gap-[40px] w-full'>
          <div className='md:w-1/2'>
            <img src={image_url} alt='Artist Image' className='aspect-square bg-cover max-h-[calc(100vh-260px)] shadow-2xl' />
          </div>

          <div className='md:w-1/2'>
            <h1 className='mb-0'>{name}</h1>
            <hr className='my-6' />
            <p className='mb-4'>
              {description}
              {` `}Created by {` `}
              <Link href={`/artists/${artists.id}`}><a className='link-white'>{artists.name}</a></Link>
            </p>

            <div className='mt-16'>
              <h1 className='mb-0'>Assets</h1>
              <hr className='my-8' />
              <p className='mb-4'>Physical <span className='text-[#777777] dark:text-[#999999]'>(free shipping worldwide)</span></p>
              <ul>
                {physicalAssets?.map((asset, idx) => (
                  <li key={asset.name + idx}>&#8212;	{asset.name}</li>
                ))}
              </ul>
              <p className='mb-4 mt-8'>Digital</p>
              <ul>
                {digitalAssets?.map((asset, idx) => (
                  <li key={asset.name + idx}>
                    &#8212; {asset.name}{` `}
                    <Link href={`/download/${asset.link}`}>
                      <a className='link-white'>Download</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <hr className='my-8' />

            {/* <div className='whitespace-nowrap flex flex-col gap-1'>
             <p>
                <span className='text-sm'>Created by:{` `}</span>
                <Link href={`/artists/${artists.id}`}><a className='link-white'>{artists.name}</a></Link>
              </p>
              <p>Created: {created_at?.slice(0, 10)}</p>
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
              </div>

               <div className='mt-10'>
                <h1 className='mb-0'>Assets</h1>
                <hr className='my-8' />
              </div>
            </div> */}

            {loading ?
              <div className='flex flex-col items-start justify-center mt-8'>
                <PulseLoader color={'var(--color-cta)'} size={20} />
                <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                <div id='mintingInfo' className='text-xs'></div>
              </div>
              :
              <div className='flex items-center gap-10 mt-10'>
                <p className='my-0 text-[30px] relative bottom-1'>{fromExponential(price)} ETH</p>
                {!address ?
                  <button
                    onClick={connectWallet}
                    className='button button-connect uppercase font-serif'>
                    Sync Wallet
                  </button>
                  :
                  fetching ?
                    <PulseLoader color={'white'} size={4} />
                    :
                    listed ?
                      sellerIsOwner ?
                        // <p className='text-tiny'>You listed this NFT</p>
                        <button className='button button-cta'>Unlist</button>
                        :
                        <button onClick={() => initiateBuy(nft)} className='button button-cta'>Buy</button>
                      :
                      sellerIsOwner ?
                        <button onClick={() => listNFT(nft.at(0))} className='button button-cta'>List</button>
                        :
                        // <p className='text-tiny'>NFT not listed</p>
                        <button className='button button-cta'>List</button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  return {
    props: { propsId: id },
  }
}
export default Nft
