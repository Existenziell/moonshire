import Link from "next/link"
// import { shortenAddress } from '../lib/shortenAddress'

const NftsGrid = ({ nfts }) => {
  return (
    <div className="flex flex-wrap justify-between gap-20 mt-20">
      {nfts.map((nft, i) => (
        <div key={i} className="flex flex-col justify-between mb-20 flex-grow flex-shrink basis-0 md:max-w-[calc(50vw)]">
          <Link href={`/nfts/${nft.id}`}>
            <a>
              <img
                src={nft.image_url ? nft.image_url : nft.image}
                alt='NFT Image'
                className='w-full aspect-square object-cover shadow-2xl bg-detail dark:bg-detail-dark'
              />
            </a>
          </Link>

          <div className="flex flex-col justify-between h-full">
            <h1 className='mt-8 mb-6 h-16'>{(nft.name)}</h1>
            <div className="text-detail-dark dark:text-detail">
              {/* <p>{nft.description}</p> */}
              <div className='mb-2'>
                <Link href={`/collections/${nft.collections?.id}`}>
                  <a className='link-white'>
                    {nft.collections?.title ? nft.collections.title : nft.collection}
                  </a>
                </Link>
              </div>
              <div className='mb-10'>
                <Link href={`/artists/${nft.artists?.id}`}>
                  <a className='link-white'>
                    {nft.artists?.name ? nft.artists.name : nft.artist}
                  </a>
                </Link>
              </div>
              <hr />

              {/* {nft.owner && nft.seller &&
                <>
                  <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                  <p>Seller: {shortenAddress(nft.seller)}</p>
                </>
              } */}
            </div>
            <div className="flex justify-between gap-8 items-center mt-6">
              <h1 className="mb-0 whitespace-nowrap">{nft.price} ETH</h1>
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

export default NftsGrid
