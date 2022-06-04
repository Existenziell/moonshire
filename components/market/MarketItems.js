import { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { PulseLoader } from 'react-spinners'
import fetchMarketItems from '../../lib/market/fetchMarketItems'
import MapNfts from '../MapNfts'
import getDbIdForTokenURI from '../../lib/getDbIdForTokenURI'

export default function MarketItems() {
  const [nfts, setNfts] = useState([])
  const [numberOfNfts, setNumberOfNfts] = useState(null)
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { library: provider } = useWeb3React()

  useEffect(() => {
    if (provider) loadNfts()
  }, [provider])

  const loadNfts = async () => {
    const nfts = await fetchMarketItems(provider)
    if (nfts) {
      for (let nft of nfts) {
        const id = await getDbIdForTokenURI(nft.tokenURI)
        nft.id = id
      }
      setNfts(nfts)
      setNumberOfNfts(nfts.length)
      setLoadingState('loaded')
    }
  }

  if (loadingState === 'not-loaded') return <div className='mt-12'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <p className='text-xs mb-16'>Currently, Moonshire has {numberOfNfts} NFTs for sale.</p>
      <div className="flex justify-center">
        {nfts.length ?
          <MapNfts nfts={nfts} />
          :
          <h1 className="px-20 py-10 text-3xl">No items currently listed in marketplace.</h1>
        }
      </div>
    </>
  )
}
