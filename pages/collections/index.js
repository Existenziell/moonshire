import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'
import fromExponential from 'from-exponential'

const Collections = ({ collections }) => {
  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      {collections.length > 0 ?
        <div className='md:snap-y md:snap-mandatory md:h-[calc(100vh-200px)] md:overflow-y-scroll'>

          {collections.map(collection => {
            const { id, title, headline, description, public_url, numberOfNfts, price, uniqueArtists } = collection
            return (
              <div key={id} className='md:snap-start md:snap-always md:h-[calc(100vh-200px)] w-full mb-40'>
                <div className={`flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]`}>
                  <div className='md:w-1/2'>
                    <img src={public_url} alt='Cover Image' className='aspect-square shadow-2xl max-h-[calc(100vh-260px)]' />
                  </div>
                  <div className='md:w-1/2'>
                    <h1 className='mb-0'>{title}</h1>
                    <hr className='my-8' />
                    <p className='mb-4'>{headline}</p>
                    <p className='my-4'>{description}</p>
                    <p className='mb-4'>
                      A selection of {numberOfNfts} exclusive artworks by <span className='link-white'>{uniqueArtists.join(', ')}</span>
                    </p>
                    <hr className='my-8' />
                    <div className='flex items-center gap-10'>
                      <h1 className='mb-0'>{fromExponential(price)} ETH</h1>
                      {/* <div>
                        {floorPrice &&
                          <p><span className='w-36 whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
                        }
                        {highestPrice &&
                          <p><span className='w-36 whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
                        } 
                      </div> */}
                      <Link href={`/collections/${id}`}>
                        <a className='button button-cta mx-auto md:mx-0 uppercase'>View Collection</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        :
        <div className='flex flex-col items-center justify-center w-full'>
          <h1 className="mb-2 text-3xl">No collections found</h1>
          <p className='text-tiny mb-8'>If you don&apos;t see your collection here, make sure it has active NFTs attributed to it.</p>
          <Link href='/collections/create'><a className='button button-detail'>Create Collection</a></Link>
        </div>
      }
    </>
  )
}

export async function getServerSideProps() {
  const { data: collections } = await supabase.from('collections').select(`*`).order('created_at', { ascending: false })
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`)

  // Enrich each collection with numberOfNfts, public_url, floorPrice, highestPrice, artists
  for (let collection of collections) {

    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
    let collectionPrice = '0.0'

    if (nfts) {
      const collectionNfts = nfts.filter((n => n.collection === collection.id))

      if (collectionNfts.length > 0) {
        // Set the number of NFT in each collection
        collection.numberOfNfts = collectionNfts.length

        // Collect artists that have NFTs for each collection
        let collectionArtists = []
        for (let nft of collectionNfts) {
          collectionArtists.push(nft.artists.name)
          let price = fromExponential(nft.price)
          collectionPrice = parseFloat(collectionPrice) + parseFloat(price)
        }
        /* eslint-disable no-undef */
        const uniqueCollectionArtists = await [...new Set(collectionArtists)]
        collection.uniqueArtists = uniqueCollectionArtists
        /* eslint-enable no-undef */

        // Calculate lowest and highest price of NFTs in each collection
        // let floorPrice = 100000
        // let highestPrice = 0
        // for (let nft of collectionNfts) {
        //   if (highestPrice < nft.price) {
        //     highestPrice = nft.price
        //   }
        //   if (floorPrice > nft.price) {
        //     floorPrice = nft.price
        //   }
        // }
        // collection.floorPrice = floorPrice
        // collection.highestPrice = highestPrice
      } else {
        collection.numberOfNfts = 0
      }
    } else {
      collection.numberOfNfts = 0
    }
    collection.price = collectionPrice
  }

  // Filter to only get collections with more than 0 NFTs
  const notEmptyCollections = collections.filter(collection => collection.numberOfNfts !== 0)

  return {
    props: { collections: notEmptyCollections },
  }
}

export default Collections
