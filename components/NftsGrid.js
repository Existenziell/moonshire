import Image from "next/image"
import Link from "next/link"
// import { useEffect, useState } from "react"
// import { convertEthToUsd } from "../lib/convertEthToUsd"

const NftsGrid = ({ nfts, display, view }) => {
  // const [convertedNfts, setConvertedNfts] = useState([])

  // const fetchUsdPrice = async () => {
  //   for (let nft of nfts) {
  //     nft.priceUSD = await convertEthToUsd(nft.price)
  //   }
  //   setConvertedNfts(nfts)
  // }

  // useEffect(() => {
  //   fetchUsdPrice()
  // }, [nfts.length])

  return (
    <div className={`${display === 'grid' ? `grid` : `hidden`} grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-20 mt-20`}>
      {nfts?.map((nft, i) => (
        <div key={nft.id} className='mb-20'>
          <Link href={`/nfts/${nft.id}`}>
            <a className='shadow-2xl nextimg'>
              <Image
                width={1000}
                height={1000}
                placeholder="blur"
                src={nft.image_url ? nft.image_url : nft.image}
                blurDataURL={nft.image_url ? nft.image_url : nft.image}
                alt='NFT Image'
                className='w-full aspect-square object-cover bg-detail dark:bg-detail-dark'
              />
            </a>
          </Link>

          <div>
            <h1 className='mt-8 mb-6 whitespace-nowrap w-full max-w-[300px] truncate'>{nft.name}</h1>
            <div className="text-detail-dark dark:text-detail">
              <div className='mb-2'>
                <Link href={`/collections/${nft.collections.id}`}>
                  <a className='link-white'>
                    {nft.collections.title}
                  </a>
                </Link>
              </div>
              <div className='mb-10'>
                <Link href={`/artists/${nft.artists?.id}`}>
                  <a className='link-white'>
                    {nft.artists?.name}
                  </a>
                </Link>
              </div>
            </div>

            <hr />

            <div className="flex justify-between gap-8 items-center mt-6">
              <div className="flex items-center gap-4">
                <h1 className="mb-0">{nft.price} ETH</h1>
                {/* <span className='text-gray-400 text-sm'>(${nft.priceUSD})</span> */}
              </div>
              <Link href={`/nfts/${nft.id}`}>
                <a className='button button-cta uppercase'>
                  View
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div >
  )
}

export default NftsGrid
