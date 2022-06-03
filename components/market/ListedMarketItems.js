import { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { PulseLoader } from 'react-spinners'
import fetchListedItems from '../../lib/market/fetchListedItems'
import buyNft from '../../lib/market/buyNft'

export default function ListedMarketItems() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [buying, setBuying] = useState(false)
  const { library: provider } = useWeb3React()

  useEffect(() => {
    if (provider) loadNfts()
  }, [provider])

  const loadNfts = async () => {
    const nfts = await fetchListedItems(provider)
    setNfts(nfts)
    setLoadingState('loaded')
  }

  const initiateBuy = async (nft) => {
    setBuying(true)
    await buyNft(nft, provider)
    setBuying(false)
    loadNfts()
  }

  if (loadingState === 'not-loaded') return <PulseLoader color={'var(--color-cta)'} size={20} />

  return (
    <>
      {buying &&
        <div className='mt-4'>
          <PulseLoader color={'var(--color-cta)'} size={20} />
        </div>
      }
      <div className="flex justify-center">

        {nfts.length ?
          <div className="px-4">
            <div className="flex flex-wrap justify-evenly gap-8 pt-4">
              {
                nfts.map((nft, i) => (
                  <div key={i} className="shadow-xl rounded max-w-xs flex flex-col justify-between flex-grow">
                    <img src={nft.image} alt='NFT Image' className='aspect-square' />
                    <div className="p-4 whitespace-normal">
                      <h2 className="text-2xl font-semibold">{nft.name}</h2>
                      <div className="text-gray-400 text-xs">

                        <p >{nft.description}</p>
                        <p className='mt-4 mb-1'>by {nft.artist}</p>
                        <p>in {nft.collection}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-2xl">{nft.price} ETH</p>
                      <button
                        onClick={() => initiateBuy(nft)}
                        className="mt-4 button button-cta"
                        disabled={buying}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          :
          <h1 className="px-20 py-10 text-3xl">No items currently listed in marketplace.</h1>
        }
      </div>
    </>
  )
}
