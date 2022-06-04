import Link from "next/link"
import { shortenAddress } from '../lib/shortenAddress'

const MapNfts = ({ nfts }) => {

  return (
    <div className="flex flex-wrap justify-evenly gap-8">
      {nfts.map((nft, i) => (
        <div key={i} className="w-[250px] flex flex-col justify-between shadow-xl rounded">

          <Link href={`/nfts/${nft.id}`}>
            <a className='w-full rounded-t'>
              <img
                src={nft.image_url ? nft.image_url : nft.image}
                alt='NFT Image'
                className='w-full aspect-square object-cover rounded-t' />
            </a>
          </Link>

          <div className="p-4 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold">{nft.name}</h2>
            <div className="text-gray-400 text-xs">
              <p >{nft.description}</p>
              <p className='mt-4 mb-1'>by {nft.artists?.name ? nft.artists.name : nft.artist}</p>
              <p>in {nft.collections?.title ? nft.collections.title : nft.collection}</p>
              <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
              <p>Seller: {shortenAddress(nft.seller)}</p>
            </div>
            <p className="text-2xl mt-6">{nft.price} ETH</p>
          </div>

          <Link href={`/nfts/${nft.id}`}>
            <a className='button button-detail my-4 mx-auto py-4'>
              Details
            </a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default MapNfts
