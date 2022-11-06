import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { convertEthToUsd } from "../lib/convertEthToUsd"

const NftsList = ({ nfts, display }) => {
  const [convertedNfts, setConvertedNfts] = useState([])

  const fetchUsdPrice = async () => {
    for (let nft of nfts) {
      nft.priceUSD = await convertEthToUsd(nft.price)
    }
    setConvertedNfts(nfts)
  }

  useEffect(() => {
    fetchUsdPrice()
  }, [nfts.length])

  return (
    <table className={`${display === 'list' ? `table-auto` : `hidden`} w-full mt-20`}>
      <thead className='text-left'>
        <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
          <th className='pb-8'>Media</th>
          <th className='pb-8'>Name</th>
          <th className='pb-8'>Artist</th>
          <th className='pb-8'>Collection</th>
          <th className='pb-8'>Price</th>
          <th className='pb-8'></th>
        </tr>
      </thead>
      <tbody>

        {!convertedNfts?.length &&
          <tr className='p-4 dark:text-brand'>
            <td colSpan={9}>
              No results
            </td>
          </tr>
        }

        {convertedNfts?.map((nft) => (
          <tr key={nft.tokenId + nft.name} className='relative mb-[20px]'>
            <td className='px-0 w-[90px]'>
              <Link href={`/nfts/${nft.id}`}>
                <a className='w-[60px] shadow nextimg aspect-square'>
                  <Image
                    width={60}
                    height={60}
                    placeholder="blur"
                    src={nft.image_url ? nft.image_url : nft.image}
                    blurDataURL={nft.image_url ? nft.image_url : nft.image}
                    alt='NFT Image'
                  />
                </a>
              </Link>
            </td>
            <td className='whitespace-nowrap max-w-[350px] truncate overflow-hidden overflow-ellipsis pr-12'>
              <Link href={`/nfts/${nft.id}`}>
                <a>{nft.name}</a>
              </Link>
            </td>
            <td className='whitespace-nowrap'>
              <Link href={`/artists/${nft.artists?.id}`}>
                <a className='link-white'>
                  {nft.artists?.name ? nft.artists.name : nft.artist}
                </a>
              </Link>
            </td>
            <td>
              <Link href={`/collections/${nft.collections?.id}`}>
                <a className='link-white'>
                  {nft.collections?.title ? nft.collections.title : nft.collection}
                </a>
              </Link>
            </td>
            <td className='whitespace-nowrap'>
              <span className="text-[20px]">{nft.price} ETH</span>
              <span className='text-gray-400 ml-6 relative bottom-[4px] text-sm'>(${nft.priceUSD})</span>
            </td>

            <td className='pr-0 pl-auto'>
              <div className='justify-end flex'>
                <button className='button button-cta'>
                  <Link href={`/nfts/${nft.id}`}>
                    <a>View</a>
                  </Link>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default NftsList
