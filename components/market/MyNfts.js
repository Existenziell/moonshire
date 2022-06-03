import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'
import fetchMyNfts from '../../lib/market/fetchMyNfts'

export default function MyNfts() {
  const [nfts, setNfts] = useState([])
  const [soldNfts, setSoldNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  const { library: provider } = useWeb3React()

  useEffect(() => {
    if (provider) loadNfts()
  }, [provider])

  const loadNfts = async () => {
    const nfts = await fetchMyNfts(provider)
    const soldNfts = nfts.filter(i => i.sold)
    setNfts(nfts)
    setSoldNfts(soldNfts)
    setLoadingState('loaded')
  }

  function listNFT(nft) {
    router.push(`/nfts/resell?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'not-loaded') return <div className='mt-8 mb-12'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <div className='mt-8 mb-24 flex flex-col items-start justify-start'>
        <h1 className='mt-20'>Your Assets</h1>
        <div>
          <h2 className="text-2xl py-2 border-b-2 border-detail dark:border-detail-dark">Created Assets</h2>
          {nfts.length > 0 ?
            <div>
              <div className="flex flex-wrap gap-4 pt-4">
                {nfts.map((nft, i) => (
                  <div key={i} className="shadow rounded flex flex-col max-w-xs">
                    <img src={nft.image} alt='NFT Image' />
                    <div className="p-4 flex flex-col justify-between h-full">
                      <h2 className="text-2xl">{nft.name}</h2>
                      <p className="text-sm mt-4 mb-6">{nft.description}</p>
                      <p className="font-bold">Price: {nft.price} Eth</p>
                      <button
                        className="mt-4 button button-cta"
                        onClick={() => listNFT(nft)}
                      >
                        List
                      </button>
                      <span className='text-tiny mt-2'>Listing price is 0.000001 ETH</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href='/nfts/create'><a className='button button-detail mt-20'>Create Asset</a></Link>
            </div>
            :
            <>
              <p className='text-sm mb-8'>You don&apos;t own any items.</p>
              <Link href='/nfts/create'><a className='button button-detail'>Create Asset</a></Link>
              {/* <Link href='/nfts'><a className='button button-detail'>Discover</a></Link> */}
            </>
          }
        </div>

        <div className='my-20'>
          <h2 className="text-2xl py-2 border-b-2 border-detail dark:border-detail-dark">Sold Assets</h2>
          {soldNfts.length ?
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  soldNfts.map((nft, i) => (
                    <div key={i} className="shadow rounded overflow-hidden">
                      <img src={nft.image} className="rounded" alt='NFT Image' />
                      <div className="p-4 bg-brand text-brand-dark">
                        <p className="text-2xl font-semibold mb-2">{nft.name}</p>
                        <p className="font-bold">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              {/* <Link href='/nfts/sell'><a className='button button-detail'>Sell Asset</a></Link> */}
            </div>
            :
            <>
              <p className='text-sm mt-2 mb-12'>No items sold yet.</p>
              {/* <Link href='/nfts/sell'><a className='button button-detail'>Sell Asset</a></Link> */}
            </>
          }
        </div>
      </div>
    </>
  )
}
