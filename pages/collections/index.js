import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import { shortenAddress } from '../../lib/shortenAddress'
import Head from 'next/head'
import Link from 'next/link'

const Collections = ({ collections }) => {
  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      <div className='snap-y snap-mandatory w-full h-[calc(100vh-160px)] overflow-y-scroll'>
        {collections.map(collection => {
          const { id, title, headline, description, public_url, created_at, numberOfNfts, walletAddress, floorPrice, highestPrice, artists } = collection

          return (
            <div key={id} className='snap-start snap-always w-full h-[calc(100vh-160px)] flex flex-col md:flex-row items-start justify-center gap-[40px] mb-20 md:mb-0 px-[40px]'>
              <div>
                <Link href={`/collections/${id}`}>
                  <a>
                    <img src={public_url} alt='Cover Image' className='aspect-square bg-cover max-w-xs md:max-w-xl' />
                  </a>
                </Link>
              </div>
              <div className='md:w-1/2'>
                <h1>{title}</h1>
                <p className='mb-4'>{headline}</p>
                <hr className='my-8' />
                <p className='my-4'>{description}</p>
                <p className='mb-4'>{numberOfNfts} NFTs available by {artists.length > 1 ? `artists` : `artist`} {artists.join(', ')}.</p>
                {floorPrice &&
                  <p><span className='w-36 whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
                }
                {highestPrice &&
                  <p className='mb-8'><span className='w-36 whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
                }
                <p>Launched: {created_at.slice(0, 10)}</p>
                <p className='mb-4'>Owner: {shortenAddress(walletAddress)}</p>
                <Link href={`/collections/${id}`}>
                  <a className='button button-detail mx-auto mt-8 md:mx-0 uppercase'>View Collection</a>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })

  // Enrich each collection with numberOfNfts, public_url, floorPrice, highestPrice, artists
  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))

    if (collectionNfts.length > 0) {
      // Set the number of NFT in each collection
      collection.numberOfNfts = collectionNfts.length

      // Collect artists that have NFTs for each collection
      let collectionArtists = []
      for (let nft of collectionNfts) {
        collectionArtists.push(nft.artists.name)
      }

      /* eslint-disable no-undef */
      const uniqueCollectionArtists = [...new Set(collectionArtists)]
      /* eslint-enable no-undef */
      collection.artists = uniqueCollectionArtists

      // Calculate lowest and highest price of NFTs in each collection
      let floorPrice = 100000
      let highestPrice = 0

      for (let nft of collectionNfts) {
        if (highestPrice < nft.price) {
          highestPrice = nft.price
        }
        if (floorPrice > nft.price) {
          floorPrice = nft.price
        }
      }
      collection.floorPrice = floorPrice
      collection.highestPrice = highestPrice
    } else {
      collection.numberOfNfts = 0
    }

    // Get the public_url (IPFS) of the cover image for each collection
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Filter to only get collections with more than 0 NFTs
  const notEmptyCollections = collections.filter(collection => collection.numberOfNfts !== 0)

  return {
    props: { collections: notEmptyCollections },
  }
}

export default Collections
