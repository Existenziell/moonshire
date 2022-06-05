import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collections = ({ collections, numberOfCollections }) => {
  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        <p className='text-xs mb-12 text-center'>Currently, Moonshire has {numberOfCollections} active collections to be explored</p>

        <div className='flex flex-col items-center justify-center gap-16 text-sm'>
          {collections.map(collection => {
            const { id, title, headline, description, year, public_url, created_at, numberOfNfts, walletAddress, floorPrice, highestPrice } = collection

            return (
              <div key={id} className='w-full flex flex-col md:flex-row items-start justify-start gap-4 md:gap-12 text-sm bg-detail dark:bg-detail-dark rounded p-4'>
                <div className='max-w-md'>
                  <Link href={`/collections/${id}`}>
                    <a className=''>
                      <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
                    </a>
                  </Link>
                </div>
                <div className='md:w-1/2'>
                  <h1 className='mb-4'>{title}</h1>
                  <p className='mb-4'>{headline}</p>
                  <p className=''>{year}</p>
                  <hr className='border-t-1 border-brand-dark/10 dark:border-brand/10 my-8' />
                  <p className='my-4'>{description}</p>
                  <p className='mb-4'>{numberOfNfts} NFTs available in this collection.</p>
                  {floorPrice &&
                    <p><span className='w-32 whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
                  }
                  {highestPrice &&
                    <p className='mb-8'><span className='w-32 whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
                  }
                  <p className='text-tiny'>Launched: {created_at.slice(0, 10)}</p>
                  <p className='text-tiny mb-4'>Owner: {walletAddress}</p>
                  <Link href={`/collections/${id}`}>
                    <a className='button button-cta mx-auto mt-8 md:mx-0'>View</a>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*)`).order('id', { ascending: true })

  // Enrich each collection with numberOfNfts, public_url, floorPrice, highestPrice
  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    console.log(collectionNfts);
    if (collectionNfts.length > 0) {
      collection.numberOfNfts = collectionNfts.length

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

    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  const notEmptyCollections = collections.filter(collection => collection.numberOfNfts !== 0)

  // Set overall number of non empty collections
  let numberOfCollections
  numberOfCollections = notEmptyCollections.length

  return {
    props: { collections: notEmptyCollections, numberOfCollections },
  }
}

export default Collections
