import { supabase } from "../../lib/supabase"
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import buyNft from '../../lib/contract/buyNft'
import logWeb3 from '../../lib/logWeb3'
import fetchMarketItemsMeta from '../../lib/contract/fetchMarketItemsMeta'
import fetchMyNfts from '../../lib/contract/fetchMyNfts'
import Success from '../../components/Success'
import Image from 'next/image'
import moment from 'moment'
import Error from "../../components/Error"

const Nft = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { address, currentUser, signer, notify, connectWallet, conversionRateEthUsd } = useApp()
  const [fetching, setFetching] = useState(true)
  const [buying, setBuying] = useState(false)
  const [sellerIsOwner, setSellerIsOwner] = useState(false)
  const [success, setSuccess] = useState(false)
  const [hash, setHash] = useState('')
  const [view, setView] = useState('description')
  const links = ['description', 'assets', 'provenance']

  async function fetchApi(...args) {
    if (!queryId) return
    const { data: nft } = await supabase
      .from('nfts')
      .select(`*, artists(*), collections(*), users!nfts_user_fkey(*)`)
      .eq('id', queryId)
      .single()
    if (!nft) return

    const { data: events } = await supabase
      .from('events')
      .select(`*, nfts(*), users(*)`)
      .eq('nft', queryId)
      .order('created_at', { ascending: true })

    if (nft) {
      const physicalAssets = []
      const digitalAssets = []
      if (nft.assets) {
        for (let el of nft.assets) {
          el.type === 'digital' ?
            digitalAssets.push(el)
            :
            physicalAssets.push(el)
        }
      }
      nft.digitalAssets = digitalAssets
      nft.physicalAssets = physicalAssets
    }

    if (events.length) {
      for (let e of events) {
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
      const lastEvent = events.pop()
      nft.events = events
      nft.lastEvent = lastEvent
    }
    return nft
  }

  const { status, data: nft } = useQuery(["nft", queryId], () => fetchApi())

  useEffect(() => {
    if (address && nft) {
      fetchMeta()
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
        const myNfts = await fetchMyNfts(signer)
        if (myNfts.length) {
          const filtered = myNfts.filter(nft => (nft.tokenId === tokenId && nft.tokenURI === tokenURI))
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
    setBuying(true)
    logWeb3(`Initiating blockchain transfer...`)

    try {
      const hash = await buyNft(nft, signer, address, currentUser.id)
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
      setBuying(false)
    } catch (e) {
      notify("Something went wrong...")
    }
  }

  const listNFT = (nft) => {
    router.push(`/nfts/resell?id=${nft.id}&tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}&userId=${currentUser.id}`)
  }

  const calcHeight = () => (window.innerHeight - 260)

  if (status === "error") return <Error message={status} />
  if (status === 'loading') return <div className='flex items-center justify-center min-w-max h-[calc(100vh-420px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (status === "success" && !nft) return ''

  const { name, description, price, image_url, artists, events, lastEvent, listed, tokenURI, tokenId, physicalAssets, digitalAssets } = nft

  return (
    <>
      <Head>
        <title>{name} | NFT | Project Moonshire</title>
        <meta name='description' content={`${name} | NFT | Project Moonshire`} />
      </Head>

      <div className='sized-page-wrapper'>
        <div className='sized-image-wrapper'>
          <Image
            width={calcHeight()}
            height={calcHeight()}
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
              <p><a href={`https://sepolia.etherscan.io/tx/${hash}`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{hash}</a></p>
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
                        <li key={asset.name + idx}>&#8212; {asset.name}</li>
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

                {view === 'provenance' && (
                  events.length > 0 ?
                    events.map(e =>
                      <div key={e.id} className='flex items-center justify-between w-full mb-4'>
                        <div className="flex items-center gap-6">
                          <Link href={`/users/${encodeURIComponent(e.users.username)}`}>
                            <a className="link-white">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${e.users.avatar_url}`}
                                alt='NFT Creator'
                                width={50}
                                height={50}
                                placeholder='blur'
                                blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${e.users.avatar_url}`}
                                className='rounded-sm'
                              />
                            </a>
                          </Link>
                          <div>
                            <p>{e.typeClean} <Link href={`/users/${encodeURIComponent(e.users.username)}`}><a className="link-white">@{e.users?.username}</a></Link></p>
                            <p className="hidden md:block">{moment(e.created_at).format('MMMM Do YYYY, h:mm a')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className='my-0 md:text-[20px] whitespace-nowrap'>{e.price} ETH</p>
                          <a href={`https://sepolia.etherscan.io/tx/${e.txHash}`} target='_blank' rel='noopener noreferrer nofollow' className='button button-detail'>
                            Etherscan
                          </a>
                        </div>
                      </div>
                    )
                    :
                    <p>No data yet</p>
                )}
              </div>
              <hr className='my-8' />

              {buying ?
                <div className='flex flex-col items-start justify-center mt-8'>
                  <PulseLoader color={'var(--color-cta)'} size={10} />
                  <p className='text-xs my-4'>Please follow MetaMask prompt...</p>
                  <div id='mintingInfo' className='text-xs'></div>
                </div>
                :
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-10'>
                  <div className='flex items-center gap-6'>
                    <div className="nextimg w-[50px] h-[50px]">
                      <Link href={`/users/${encodeURIComponent(lastEvent.users.username)}`}>
                        <a className="link-white">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${lastEvent.users.avatar_url}`}
                            alt='NFT Creator'
                            width={50}
                            height={50}
                            placeholder='blur'
                            blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}avatars/${lastEvent.users.avatar_url}`}
                          />
                        </a>
                      </Link>
                    </div>
                    <div>
                      {listed ? `Listed by ` : `Sold to `}
                      <Link href={`/users/${encodeURIComponent(lastEvent.users.username)}`}>
                        <a className="link-white">@{lastEvent.users?.username}</a>
                      </Link>
                      <p className='whitespace-nowrap'>{moment(lastEvent.created_at).format('MMMM Do YYYY, h:mm a')}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-6 justify-end w-full'>
                    <p className='text-gray-400 relative bottom-[1px]'>(${(price * conversionRateEthUsd).toFixed(2)})</p>
                    <p className='text-[20px] relative bottom-1 whitespace-nowrap'>{price} ETH</p>
                    {!address ?
                      <button
                        onClick={connectWallet}
                        className='button button-connect uppercase font-serif'>
                        Sync Wallet
                      </button>
                      :
                      fetching ?
                        <div className='h-[40px] flex items-center justify-center whitespace-nowrap'><PulseLoader color={'white'} size={4} /></div>
                        :
                        listed ?
                          sellerIsOwner ?
                            <button className='button button-cta' disabled>Unlist</button>
                            :
                            <button onClick={() => initiateBuy(nft)} className='button button-cta'>Buy</button>
                          :
                          sellerIsOwner ?
                            <button onClick={() => listNFT(nft)} className='button button-cta'>List</button>
                            :
                            <a href={`https://sepolia.etherscan.io/tx/${lastEvent.txHash}`} target='_blank' rel='noopener noreferrer nofollow' className='button button-detail'>
                              Etherscan
                            </a>
                    }
                  </div>
                </div>
              }
            </>
          }
        </div>
      </div>
    </>
  )
}

export default Nft
