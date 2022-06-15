import Link from "next/link"
import { shortenAddress } from '../lib/shortenAddress'

const MapNfts = ({ nfts }) => {

  return (
    <div className="flex flex-wrap justify-evenly gap-8">
      {nfts.map((nft, i) => (
        <div key={i} className="flex flex-col basis-0 justify-between shadow-md rounded">

          <Link href={`/nfts/${nft.id}`}>
            <a className='w-full rounded-t'>
              <img
                src={nft.image_url ? nft.image_url : nft.image}
                alt='NFT Image'
                className='w-full aspect-square object-cover rounded-t min-w-[300px]' />
            </a>
          </Link>

          <div className="p-4 bg-detail dark:bg-detail-dark flex flex-col justify-between h-full">
            <h2 className="mb-8">{nft.name}</h2>
            <div className="text-detail-dark dark:text-detail">
              {/* <p>{nft.description}</p> */}
              <div className='mt-4 mb-1'>
                by{` `}
                <Link href={`/artists/${nft.artists.id}`}>
                  <a className='link'>
                    {nft.artists?.name ? nft.artists.name : nft.artist}
                  </a>
                </Link>
              </div>
              <div>
                in{` `}
                <Link href={`/collections/${nft.collections.id}`}>
                  <a className='link'>
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
            <p className="text-2xl mt-6">{nft.price} ETH</p>
          </div>

          <Link href={`/nfts/${nft.id}`}>
            <a className='button button-detail my-4 mx-auto py-4 uppercase'>
              View
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default MapNfts
