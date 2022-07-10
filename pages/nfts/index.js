import { useRealtime, useFilter } from 'react-supabase'
import { shortenAddress } from '../../lib/shortenAddress'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Link from 'next/link'
import fromExponential from 'from-exponential'

const Nfts = () => {
  let [{ data: nfts }] = useRealtime('nfts', {
    select: {
      columns: '*, artists(*), collections(*)',
      filter: useFilter((query) => query.eq('listed', true).order('created_at', { ascending: false }))
    }
  })

  if (!nfts) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <Head>
        <title>NFTs | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full'>
        {nfts.length > 0 ?
          <div className="flex flex-wrap justify-evenly gap-20 mx-16 mb-20">
            {nfts.map((nft, i) => (
              <div key={i} className="flex flex-col justify-between w-min mb-44">
                <Link href={`/nfts/${nft.id}`}>
                  <a className="">
                    <img
                      src={nft.image_url ? nft.image_url : nft.image}
                      alt='NFT Image'
                      className='w-full aspect-square object-cover min-w-[400px] shadow-2xl mb-6' />
                  </a>
                </Link>

                <div className="flex flex-col justify-between h-full">
                  <p className="mb-8 h-full mt-10 text-2xl leading-relaxed">{nft.name}</p>
                  <div className="text-detail-dark dark:text-detail">
                    {/* <p>{nft.description}</p> */}
                    <div className='mb-8'>
                      <Link href={`/collections/${nft.collections.id}`}>
                        <a className='link-white'>
                          {nft.collections?.title ? nft.collections.title : nft.collection}
                        </a>
                      </Link>
                    </div>
                    <div className='mt-4 mb-10'>
                      <Link href={`/artists/${nft.artists.id}`}>
                        <a className='link-white'>
                          {nft.artists?.name ? nft.artists.name : nft.artist}
                        </a>
                      </Link>
                    </div>
                    <hr />

                    {nft.owner && nft.seller &&
                      <>
                        <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                        <p>Seller: {shortenAddress(nft.seller)}</p>
                      </>
                    }
                  </div>
                  <div className="flex justify-start gap-8 items-end">
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
          :
          <div className='flex flex-col items-center justify-center'>
            <h1 className="text-3xl">No items listed in marketplace</h1>
            <Link href='/nfts/create'><a className='button button-detail'>Create Asset</a></Link>
          </div>
        }
      </div>
    </>
  )
}

export default Nfts
