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
        <h1 className='mt-20 py-2 border-b-2 border-detail dark:border-detail-dark'>Your Assets</h1>
        {nfts.length > 0 ?
          <div>
            <p className='mt-4'>Sold items: {soldNfts.length}</p>
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
            <p className='text-tiny mt-2'>By creating an asset it will be minted and put on sale on the marketplace.<br />Listing costs are 0.000001 ETH</p>
          </div>
          :
          <>
            <p className='text-sm mb-16'>You don&apos;t own any items yet.</p>
            <div className='flex flex-col md:flex-row items-center justify-center gap-16'>
              <div className='mb-8 md:mb-0'>
                <Link href='/nfts/create'><a className='button button-detail mb-8'>Create Asset</a></Link>
                <p className='text-tiny'>By creating an asset it will be minted and put on sale on the marketplace.<br />Listing costs are 0.000001 ETH</p>
              </div>
              <div>
                <Link href='/nfts'><a className='button button-detail mb-8'>Discover</a></Link>
                <p className='text-tiny'>Explore the marketplace to find some hidden gems for your wallet.<br />Purchased items will be listed here.</p>
              </div>
            </div>

          </>
        }

      </div>

    </>
  )
}
