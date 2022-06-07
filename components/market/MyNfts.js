import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import fetchMyNfts from '../../lib/contract/fetchMyNfts'

export default function MyNfts() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  const { account, library: provider } = useWeb3React()

  useEffect(() => {
    if (provider) loadNfts()
  }, [account, provider])

  const loadNfts = async () => {
    const nfts = await fetchMyNfts(provider)
    if (nfts) {
      setNfts(nfts)
      setLoadingState('loaded')
    }
  }

  const listNFT = (nft) => {
    router.push(`/nfts/resell?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'not-loaded') return <div className='mt-8 mb-12'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <div className='mb-20 flex flex-col items-start justify-start'>
        <h2 className='py-2 border-b-2 border-detail dark:border-detail-dark'>
          Owned Assets
          <span className='text-xs ml-4'>{nfts.length}</span>
        </h2>
        {nfts.length > 0 ?
          <div>
            <div className="flex flex-wrap gap-12 pt-4 flex-grow">
              {nfts.map((nft, i) => (
                <div key={i} className="w-64 shadow-lg rounded flex flex-col max-w-xs">
                  <img src={nft.image} alt='NFT Image' className='w-full aspect-square object-cover' />
                  <div className="p-4 bg-detail dark:bg-detail-dark flex flex-col justify-between h-full">
                    <h2 className="text-2xl">{nft.name}</h2>
                    <p className="text-sm mt-1 mb-6">{nft.description}</p>
                    <div className='mb-4 text-xs text-detail-dark dark:text-detail'>
                      <p>by: {nft.artist}</p>
                      <p>in: {nft.collection}</p>
                    </div>
                    <p className="text-xl">{nft.price} Eth</p>
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
