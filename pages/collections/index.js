
import { useRealtime, useFilter } from 'react-supabase'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Collections = () => {
  const [fetchedCollections, setFetchedCollections] = useState()

  let [{ data: collections }] = useRealtime('collections', {
    select: { filter: useFilter((query) => query.order('created_at', { ascending: false })) }
  })
  const [{ data: nfts }] = useRealtime('nfts', { select: { columns: '*, artists(*), collections(*)' } })
  const [{ data: artists }] = useRealtime('artists')

  // Enrich each collection with numberOfNfts, public_url, price, artists
  const enrichCollections = async () => {
    for (let collection of collections) {
      const url = await getPublicUrl('collections', collection.image_url)
      collection.public_url = url
      let collectionPrice = 0.0

      if (nfts) {
        const collectionNfts = nfts.filter(n => n.collection === collection.id)
        if (collectionNfts.length > 0) {
          collection.numberOfNfts = collectionNfts.length
          const collectionArtists = []
          for (let nft of collectionNfts) {
            collectionArtists.push(nft.artists)
            // Prevent JS floating point madness...
            collectionPrice = +(collectionPrice + nft.price).toFixed(12)
          }
          // Filter deep inside the array of objects for artist.name
          const uniqueCollectionArtists = collectionArtists.filter((artist, index, array) => array.findIndex(a => a.name === artist.name) === index)
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

  const calcHeight = () => {
    const height = window.innerHeight - 260
    return height
  }

  if (!fetchedCollections) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>

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
              <div key={id} className='md:snap-start md:snap-always md:h-[calc(100vh-300px)] w-full mb-40'>
                <div className='flex flex-col md:flex-row items-center justify-start gap-[40px] px-[20px] md:px-[40px]'>
                  <Link href={`/collections/${id}`}>
                    <a className='shadow-2xl nextimg bg-detail dark:bg-detail-dark'>
                      <Image
                        width={calcHeight()}
                        height={calcHeight()}
                        placeholder="blur"
                        src={public_url}
                        blurDataURL={public_url}
                        alt='Cover Image'
                      />
                    </a>
                  </Link>
                  <div className='md:w-1/2 w-full'>
                    <h1 className='mb-0'>{title}</h1>
                    <hr className='my-8' />
                    <p className='mb-4'>{headline}</p>
                    <p className='my-4'>{description}</p>
                    <div className='mb-4'>
                      A selection of {numberOfNfts} exclusive artworks by{` `}
                      {uniqueArtists.length === 1 ?
                        <Link href={`/artists/${uniqueArtists.at(0).id}`}>
                          <a className='link-white'>
                            {uniqueArtists.at(0).name}
                          </a>
                        </Link>
                        :
                        uniqueArtists.map((artist, idx) => (
                          <div className='inline-block' key={artist.id}>
                            <Link key={artist.id} href={`/artists/${artist.id}`}>
                              <a className='link-white'>
                                {artist.name}
                              </a>
                            </Link>
                            {uniqueArtists.length > idx + 1 &&
                              <span className='pr-2'>, {`  `}</span>
                            }
                          </div>
                        ))
                      }
                    </div>
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
          <h1 className="mb-4 text-3xl">No collections found</h1>
          <Link href='/collections/create'><a className='button button-detail'>Create Collection</a></Link>
        </div>
      }
    </>
  )
}

export default Collections
