import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'
import fetchListedItems from '../../lib/contract/fetchListedItems'
import getDbIdForTokenURI from '../../lib/supabase/getDbIdForTokenURI'
import useApp from "../../context/App"
import fromExponential from 'from-exponential'

export default function MyListedNfts() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const { address, signer } = useApp()

  useEffect(() => {
    if (signer) loadNfts()
  }, [address, signer])

  const loadNfts = async () => {
    const nfts = await fetchListedItems(signer)
    if (nfts) {
      for (let nft of nfts) {
        const dbId = await getDbIdForTokenURI(nft.tokenURI)
        nft.dbId = dbId
      }

      setNfts(nfts)
      setLoadingState('loaded')
    }
  }

  if (loadingState === 'not-loaded') return <div className='mt-8 mb-12'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <div className='mt-8 mb-24 flex flex-col items-start justify-start'>
        <h2 className='py-2 border-b-2 border-detail dark:border-detail-dark w-full'>
          Listed Assets
        </h2>
        {nfts.length > 0 ?
          <div>
            <div className="flex flex-wrap gap-12 pt-4 flex-grow">
              {nfts.map((nft, i) => (
                <div key={i} className="w-64 shadow rounded flex flex-col max-w-xs">
                  <img src={nft.image} alt='NFT Image' className='w-full aspect-square object-cover' />
                  <div className="p-4 bg-detail dark:bg-detail-dark flex flex-col justify-between h-full">
                    <h2 className="text-2xl">{nft.name}</h2>
                    <p className="text-sm mt-1 mb-6">{nft.description}</p>
                    <div className='mb-4 text-xs text-detail-dark dark:text-detail'>
                      <p>by: {nft.artist}</p>
                      <p>in: {nft.collection}</p>
                    </div>
                    <p className="text-xl">{fromExponential(nft.price)} Eth</p>
                    <Link href={`/nfts/${nft.dbId}`}><a className='mt-4 button button-cta'>Details</a></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          :
          <p className='text-sm mb-2 mt-3'>No assets listed currently.</p>
        }
      </div>
    </>
  )
}
