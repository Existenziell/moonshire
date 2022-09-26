import { supabase } from "../../lib/supabase"
import { useState, useEffect } from 'react'
import { useRealtime, useFilter } from 'react-supabase'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
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
import convert from 'crypto-convert'
import moment from 'moment'

const Nft = ({ propsId }) => {
  const router = useRouter()
  const { address, currentUser, signer, notify, connectWallet } = useApp()
  const [physicalAssets, setPhysicalAssets] = useState()
  const [digitalAssets, setDigitalAssets] = useState()
  const [creatorUrl, setCreatorUrl] = useState()
  const [priceUSD, setPriceUSD] = useState()
  const [view, setView] = useState('description')
  const links = ['description', 'assets', 'provenance']

  let [{ data: nft }] = useRealtime('nfts', {
    select: {
      columns: '*, artists(*), collections(*), users(*)',
      filter: useFilter((query) => query.eq('id', router.query.id ? router.query.id : propsId))
    }
  })

  let [{ data: events }] = useRealtime('events', {
    select: {
      columns: '*, nfts(*)',
      filter: useFilter((query) => query.eq('nft', router.query.id ? router.query.id : propsId))
    }
  })

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sellerIsOwner, setSellerIsOwner] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hash, setHash] = useState('')

  const fetchUser = async () => {
    for (let e of events) {
      const { data: user } = await supabase
        .from('users')
        .select(`*`)
        .eq('id', e.user)
        .single()

      e.users = {
        username: user.username,
        id: user.id,
        signed_url: await getSignedUrl('avatars', user.avatar_url)
      }

      switch (e.type) {
        case 'CREATE':
          e.typeClean = 'Minted by'
          break
        case 'BUY':
          e.typeClean = 'Bought by'
          break
        case 'LIST':
          e.typeClean = 'Listed by'
          break
      }
    }
  }

  useEffect(() => {
    if (events) fetchUser()
  }, [events])

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
    convertPrice()
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

    const url = await getSignedUrl('avatars', nft.at(0).users.avatar_url)
    console.log('setCreatorUrl', url)
    setCreatorUrl(url)

    setFetching(false)
  }

  const convertPrice = async () => {
    await convert.ready(); //Cache is not yet loaded on first start
    const price = new convert.from("ETH").to("USD").amount(nft.at(0).price).toFixed(2)
    console.log("setPrice:", price);
    setPriceUSD(price)
    return price
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

  const { name, description, price, image_url, artists, users, listed, tokenURI, tokenId, created_at } = nft.at(0)

  return (
    <>
      <Head>
        <title>{name} | NFT | Project Moonshire</title>
        <meta name='description' content={`${name} | NFT | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)] flex flex-col md:flex-row items-center justify-start gap-[40px] w-full'>

        <div className='w-full md:w-1/2 shadow-2xl nextimg'>
          <Image
            width={1000}
            height={1000}
            placeholder="blur"
            src={image_url}
            blurDataURL={image_url}
            alt='NFT Image'
          />
        </div>

        <div className='md:w-1/2 w-full'>
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
              <h1 className='mb-12'>{name}</h1>

              <div className='flex justify-between w-full border-b-2 border-detail dark:border-detail-dark'>
                <ul className='flex items-center justify-start gap-8 transition-colors'>
                  {links.map(link => (
                    <li key={link} className={view === link ? `relative top-[2px] pb-5 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative bottom-[6px]`}>
                      <button onClick={(e) => setView(e.target.name)} name={`${link}`} className='capitalize'>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='h-72 mt-8 overflow-y-auto'>

                {view === 'description' &&
                  <p className='mb-4'>
                    {description}
                    {` `}Created by {` `}
                    <Link href={`/artists/${artists.id}`}><a className='link-white'>{artists.name}</a></Link>
                  </p>
                }

                {view === 'assets' &&
                  <div>
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
                }

                {view === 'provenance' &&
                  <div>
                    {events.map(e =>
                      <div key={e.id} className='flex items-center justify-between w-full mb-4'>
                        <div className="flex items-center gap-6">
                          <img src={e.users?.signed_url} alt='NFT Creator' width={50} height={50} />
                          <div>
                            <p>{e.typeClean} <span className="link-white">@{e.users?.username}</span></p>
                            <p>{moment(e.created_at).format('MMMM Do YYYY, h:mm a')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className='my-0 text-[20px] whitespace-nowrap'>{e.price} ETH</p>
                          <a href={`https://rinkeby.etherscan.io/tx/${e.txHash}`} target='_blank' rel='noopener noreferrer nofollow' className='button button-cta'>
                            Etherscan
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                }

              </div>
              <hr className='my-8' />

              {loading ?
                <div className='flex flex-col items-start justify-center mt-8'>
                  <PulseLoader color={'var(--color-cta)'} size={10} />
                  <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                  <div id='mintingInfo' className='text-xs'></div>
                </div>
                :
                <div className='flex items-center justify-between gap-10 mt-10'>
                  <div className='flex items-center gap-6'>
                    <img src={creatorUrl} alt='NFT Creator' width={50} height={50} />
                    <div>
                      Listed by <span className='link-white'>@{users.username}</span>
                      <p className='whitespace-nowrap'>{moment(created_at).format('MMMM Do YYYY, h:mm a')}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-6'>
                    <p className='my-0 text-[20px] whitespace-nowrap'>{price} ETH</p>
                    <p className='text-[20px] text-gray-400 whitespace-nowrap'>${priceUSD}</p>
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
                </div>
              }
            </>
          }

        </div >
      </div >
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
