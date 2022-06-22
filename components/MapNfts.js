import Link from "next/link"
import { shortenAddress } from '../lib/shortenAddress'

const MapNfts = ({ nfts }) => {

  return (
    <div className="flex justify-evenly gap-40 mx-16">
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
                  <a className='link text-white dark:text-cta'>
                    {nft.artists?.name ? nft.artists.name : nft.artist}
                  </a>
                </Link>
              </div>
              <div>
                In{` `}
                <Link href={`/collections/${nft.collections.id}`}>
                  <a className='link text-white'>
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
              <h1 className="mt-4 mb-0">{nft.price} ETH</h1>
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
