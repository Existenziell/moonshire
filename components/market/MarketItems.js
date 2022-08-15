import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import fetchMarketItems from '../../lib/contract/fetchMarketItems'
import getDbIdForTokenURI from '../../lib/supabase/getDbIdForTokenURI'
import NftsGrid from '../NftsGrid'

export default function MarketItems() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  const { address, signer, notify } = useApp()

  useEffect(() => {
    if (address) loadNfts()
    // ToDo: Remove when merging with /nft
    if (!address) {
      notify("Please connect your wallet to proceed")
      return
    }
  }, [address])

  const loadNfts = async () => {
    const nfts = await fetchMarketItems(signer)
    if (nfts) {
      for (let nft of nfts) {
        const id = await getDbIdForTokenURI(nft.tokenURI)
        nft.id = id
      }
      setNfts(nfts)
      setLoadingState('loaded')
    }
  }

  if (loadingState === 'not-loaded') return <div className='mt-12'><PulseLoader color={'var(--color-cta)'} size={10} /></div>

  return (
    <div className="flex justify-center">
      {nfts.length ?
        <NftsGrid nfts={nfts} display='grid' view='all' />
        :
        <h1 className="px-20 py-10 text-3xl">No items currently listed in marketplace.</h1>
      }
    </div>
  )
}
