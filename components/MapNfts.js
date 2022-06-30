import Link from "next/link"
import { shortenAddress } from '../lib/shortenAddress'
import fromExponential from 'from-exponential'

const MapNfts = ({ nfts }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-20 mx-16 mb-20">
      {nfts.map((nft, i) => (
        <div key={i} className="flex flex-col justify-between w-min">

          <Link href={`/nfts/${nft.id}`}>
            <a className="">
              <img
                src={nft.image_url ? nft.image_url : nft.image}
                alt='NFT Image'
                className='w-full aspect-square object-cover min-w-[300px] shadow-2xl mb-6' />
            </a>
          </Link>

          <div className="flex flex-col justify-between h-full">
            <h2 className="mb-6 h-full">{nft.name}</h2>
            <hr />
            <div className="text-detail-dark dark:text-detail">
              {/* <p>{nft.description}</p> */}
              <div className='mt-4 mb-1'>
                Created by{` `}
                <Link href={`/artists/${nft.artists.id}`}>
                  <a className='link-white'>
                    {nft.artists?.name ? nft.artists.name : nft.artist}
                  </a>
                </Link>
              </div>
              <div>
                In{` `}
                <Link href={`/collections/${nft.collections.id}`}>
                  <a className='link-white'>
                    {nft.collections?.title ? nft.collections.title : nft.collection}
                  </a>
                </Link>

              </div>
              {nft.owner && nft.seller &&
                <>
                  <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                  <p>Seller: {shortenAddress(nft.seller)}</p>
                </>
              }
            </div>
            <div className="flex justify-between items-end">
              <h1 className="mt-4 mb-0">{fromExponential(nft.price)} ETH</h1>
              <Link href={`/nfts/${nft.id}`}>
                <a className='button button-cta uppercase'>
                  View
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MapNfts
