
import { useRealtime, useFilter } from 'react-supabase'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collections = () => {
  const [fetchedCollections, setFetchedCollections] = useState()

  let [{ data: collections }] = useRealtime('collections', {
    select: { filter: useFilter((query) => query.order('created_at', { ascending: false })) }
  })
  let [{ data: nfts }] = useRealtime('nfts', { select: { columns: '*, artists(*), collections(*)' } })
  let [{ data: artists }] = useRealtime('artists')

  // Enrich each collection with numberOfNfts, public_url, price, artists
  const enrichCollections = async () => {
    for (let collection of collections) {
      const url = await getPublicUrl('collections', collection.image_url)
      collection.public_url = url
      let collectionPrice = 0.0

      if (nfts) {
        const collectionNfts = nfts.filter((n => n.collection === collection.id))
        if (collectionNfts.length > 0) {
          collection.numberOfNfts = collectionNfts.length
          let collectionArtists = []
          for (let nft of collectionNfts) {
            collectionArtists.push(nft.artists.name)
            collectionPrice = +(collectionPrice + nft.price).toFixed(12)
          }
          /* eslint-disable no-undef */
          const uniqueCollectionArtists = await [...new Set(collectionArtists)]
          /* eslint-enable no-undef */
          collection.uniqueArtists = uniqueCollectionArtists
        } else {
          collection.numberOfNfts = 0
        }
      } else {
        collection.numberOfNfts = 0
      }
      collection.price = collectionPrice
    }
    // Filter to only get collections with more than 0 NFTs
    collections = collections.filter(collection => collection.numberOfNfts > 0)
    setFetchedCollections(collections)
  }

  useEffect(() => {
    if (collections && artists && nfts) enrichCollections()
  }, [collections, artists, nfts])

  if (!fetchedCollections) return <div className='flex w-full justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      {fetchedCollections.length > 0 ?
        <div className='md:snap-y md:snap-mandatory md:h-[calc(100vh-200px)] md:overflow-y-scroll'>

          {fetchedCollections.map(collection => {
            const { id, title, headline, description, public_url, numberOfNfts, price, uniqueArtists } = collection

            return (
              <div key={id} className='md:snap-start md:snap-always md:h-[calc(100vh-200px)] w-full mb-40'>
                <div className='flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
                  <div className='md:w-1/2 w-full'>
                    <img src={public_url} alt='Cover Image' width={1000} height={1000} className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)] md:max-w-[calc(50vw-160px)] bg-detail dark:bg-detail-dark' />
                  </div>
                  <div className='md:w-1/2 w-full'>
                    <h1 className='mb-0'>{title}</h1>
                    <hr className='my-8' />
                    <p className='mb-4'>{headline}</p>
                    <p className='my-4'>{description}</p>
                    <p className='mb-4'>
                      A selection of {numberOfNfts} exclusive artworks by <span className='link-white'>{uniqueArtists?.join(', ')}</span>
                    </p>
                    <hr className='my-8' />
                    <div className='flex items-center justify-between gap-10'>
                      <h1 className='mb-0'>{price} ETH</h1>
                      <Link href={`/collections/${id}`}>
                        <a className='button button-cta md:mx-0 uppercase whitespace-nowrap'>View Collection</a>
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

export default Collections
