import Link from "next/link"
import fromExponential from 'from-exponential'

const NftsList = ({ nfts }) => {
  return (
    <table className='table-auto w-full mt-20'>
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

        {!nfts?.length &&
          <tr className='p-4 dark:text-brand'>
            <td colSpan={9}>
              No results
            </td>
          </tr>
        }

        {nfts?.map((nft) => (
          <tr key={nft.id + nft.name} className='relative mb-[20px]'>
            <td className='px-0'>
              <Link href={`/nfts/${nft.id}`}>
                <a>
                  <img src={nft.image_url ? nft.image_url : nft.image} alt='NFT Image' className='w-[60px] shadow aspect-square bg-cover' />
                </a>
              </Link>
            </td>
            <td className='whitespace-nowrap'>{nft.name}</td>
            <td className='whitespace-nowrap'>
              <Link href={`/artists/${nft.artists?.id}`}>
                <a className='link-white'>
                  {nft.artists?.name ? nft.artists.name : nft.artist}
                </a>
              </Link>
            </td>
            <td className='whitespace-nowrap'>
              <Link href={`/collections/${nft.collections?.id}`}>
                <a className='link-white'>
                  {nft.collections?.title ? nft.collections.title : nft.collection}
                </a>
              </Link>
            </td>
            <td className='whitespace-nowrap text-[20px]'>{fromExponential(nft.price)} ETH</td>

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
