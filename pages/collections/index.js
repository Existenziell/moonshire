import { supabase } from '../../lib/supabase'
import { useQuery } from 'react-query'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Collections = () => {
  async function fetchApi(...args) {
    let { data: collections } = await supabase.from('collections').select(`*`).order('created_at', { ascending: false })
    let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).order('created_at', { ascending: false })

    for (let collection of collections) {
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

    return collections
  }

  const { status, data: collections } = useQuery(["collections"], () => fetchApi())

  const calcHeight = () => {
    const height = window.innerHeight - 260
    return height
  }

  if (status === "error") return <p>{status}</p>
  if (status === 'loading') return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (status === 'success' && !collections) return <h1 className="mb-4 text-3xl">No collections found</h1>
  if (!collections.length) {
    return (
      <div className='flex flex-col items-center justify-center w-full'>
        <h1 className="mb-4 text-3xl">No collections found</h1>
        <Link href='/collections/create'><a className='button button-detail'>Create Collection</a></Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      <div className='snap-container'>
        {collections.map(collection => {
          const { id, title, headline, description, image_url, numberOfNfts, price, uniqueArtists } = collection

          return (
            <div key={id} className='snap-item'>
              <div className='snap-grid'>
                <Link href={`/collections/${id}`}>
                  <a className='snap-image'>
                    <Image
                      width={calcHeight()}
                      height={calcHeight()}
                      placeholder="blur"
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${image_url}`}
                      blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${image_url}`}
                      alt='Cover Image'
                    />
                  </a>
                </Link>
                <div className='snap-text'>
                  <h1>{title}</h1>
                  <hr className='mt-8 mb-12' />
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
    </>
  )
}

export default Collections
