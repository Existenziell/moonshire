import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import fetchMyNfts from '../../lib/contract/fetchMyNfts'
import useApp from "../../context/App"

export default function MyNfts() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  const { address, currentUser, signer } = useApp()

  useEffect(() => {
    if (signer) loadNfts()
  }, [address, signer])

  const loadNfts = async () => {
    const nfts = await fetchMyNfts(signer)
    if (nfts) {
      setNfts(nfts)
      setLoadingState('loaded')
    }
  }

  const listNFT = (nft) => {
    router.push(`/nfts/resell?id=${nft.id}&tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}&userId=${currentUser.id}`)
  }

  if (loadingState === 'not-loaded') return <div className='mt-8 mb-12'><PulseLoader color={'var(--color-cta)'} size={10} /></div>

  return (
    <>
      <div className='mb-20 flex flex-col items-start justify-start'>
        <h2 className='py-2 border-b-2 border-detail dark:border-detail-dark w-full'>
          Owned Assets
        </h2>
        {nfts.length > 0 ?
          <div>
            <div className="flex flex-wrap gap-12 pt-4 flex-grow">
              {nfts.map((nft, i) => (
                <div key={i} className="w-64 shadow-md rounded flex flex-col max-w-xs">
                  <img src={nft.image} alt='NFT Image' className='w-full aspect-square object-cover' />
                  <div className="p-4 bg-detail dark:bg-detail-dark flex flex-col justify-between h-full">
                    <h2 className="text-2xl">{nft.name}</h2>
                    <p className="text-sm mt-1 mb-6">{nft.description}</p>
                    <div className='mb-4 text-xs text-detail-dark dark:text-detail'>
                      <p>by: {nft.artist}</p>
                      <p>in: {nft.collection}</p>
                    </div>
                    <p className="text-xl">{nft.price} ETH</p>
                    <button
                      className="mt-4 button button-cta"
                      onClick={() => listNFT(nft)}
                    >
                      List
                    </button>
                    {/* <span className='text-tiny mt-2'>Listing price is 0.000001 ETH</span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          :
          <p className='text-sm mb-2 mt-3'>You don&apos;t own any items yet.</p>
        }
      </div>
    </>
  )
}
