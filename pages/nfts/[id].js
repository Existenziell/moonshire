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
import Success from '../../components/Success'
import Image from 'next/image'

const Nft = ({ propsId }) => {
  const router = useRouter()
  const { address, currentUser, signer, notify, connectWallet } = useApp()
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
  const [success, setSuccess] = useState(false)
  const [hash, setHash] = useState('')

  const setAssets = async () => {
    let physicalAssets = []
    let digitalAssets = []
    if (nft[0]?.assets) {
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
      const hash = await buyNft(nft.at(0), signer, address, currentUser.id)
      if (hash) {
        notify("Transfer to your wallet was successful!")
        setHash(hash)
        setSuccess(true)
        setTimeout(() => {
          router.push(`/profile`)
        }, 3000)
      } else {
        notify("Something went wrong...")
      }
      setLoading(false)
    } catch (e) {
      notify("Something went wrong...")
    }
  }

  const listNFT = (nft) => {
    router.push(`/nfts/resell?id=${nft.id}&tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}&userId=${currentUser.id}`)
  }

  if (!nft) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!nft[0]) return <h1 className="mb-4 text-3xl flex items-center justify-center">NFT not found</h1>

  const { name, description, price, image_url, artists, listed, tokenURI, tokenId } = nft[0]

  return (
    <>
      <Head>
        <title>{name} | NFT | Project Moonshire</title>
        <meta name='description' content={`${name} | NFT | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)] flex flex-col md:flex-row items-center justify-start gap-[40px] w-full'>

        <div className='w-full md:w-1/2 md:max-h-[calc(100vh-260px)] shadow-2xl nextimg'>
          <Image
            width={1000}
            height={1000}
            placeholder="blur"
            src={image_url}
            blurDataURL={image_url}
            alt='NFT Image'
          />
        </div>

        <div className='md:w-1/2 w-full '>
          {success ?
            <>
              <h1 className='mb-4'>Congratulations</h1>
              <hr />
              <p className='mt-4'>Transaction was successfully executed on the Blockchain.<br />You are now the owner of this NFT.</p>
              <p className="mt-4">Transaction hash:</p>
              <p><a href={`https://rinkeby.etherscan.io/tx/${hash}`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{hash}</a></p>
              <Success />
            </>
            :
            <>
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
                  <PulseLoader color={'var(--color-cta)'} size={10} />
                  <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                  <div id='mintingInfo' className='text-xs'></div>
                </div>
                :
                <div className='flex items-center justify-between gap-10 mt-10'>
                  <p className='my-0 text-[20px] relative bottom-1'>{price} ETH</p>
                  {!address ?
                    <button
                      onClick={connectWallet}
                      className='button button-connect uppercase font-serif'>
                      Sync Wallet
                    </button>
                    :
                    fetching ?
                      <div className='h-[40px] flex items-center justify-center'><PulseLoader color={'white'} size={4} /></div>
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
            </>
          }

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
