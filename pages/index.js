import { supabase } from '../lib/supabase'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Home = ({ artists, collections, nfts }) => {
  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full px-[40px] pb-24'>
        {collections?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8 self-start'>Featured Collections</h2>

            {collections.map(collection => {
              const { id, title, headline, description, image_url } = collection

              return (
                <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                  <div>
                    <Link href={`/collections/${id}`}>
                      <a>
                        <img src={image_url} alt='Cover Image' className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl' />
                      </a>
                    </Link>
                  </div>

                  <div className='h-full flex flex-col flex-grow justify-between'>
                    <div>
                      <h1>{title}</h1>
                      <p>{headline}</p>
                      <hr className='my-4' />
                      <p>{description}</p>
                    </div>
                    <Link href={`/collections/${id}`}>
                      <a className='button button-cta mt-6'>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </>
        }

        {artists?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8 self-start'>Featured Artists</h2>
            <div className='flex justify-center md:justify-start flex-wrap gap-[40px] w-full'>
              {artists.map(artist => {
                const { id, public_url } = artist
                return (
                  <Link href={`/artists/${id}`} key={id} >
                    <a>
                      {public_url &&
                        <img src={public_url} alt='Artist Image' className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl' />
                      }
                    </a>
                  </Link>
                )
              })}
            </div>
          </>
        }

        {nfts?.length > 0 &&
          <div className='mt-24 w-full'>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8'>Featured NFTs</h2>
            <div className='flex justify-start md:justify-start flex-wrap gap-[40px] w-full'>
              {nfts.map(nft => {
                const { id, image_url } = nft
                return (
                  <div key={id} className='relative' >
                    <Link href={`/nfts/${id}`}>
                      <a className='w-full'>
                        <img src={image_url} alt='NFT Image' className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl' />
                      </a>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        }

      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).eq('featured', true).order('id', { ascending: true })
  const { data: collections } = await supabase.from('collections').select(`*`).eq('featured', true).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).eq('featured', true).order('id', { ascending: true })

  for (let artist of artists) {
    const artistNfts = nfts.filter((n => n.artist === artist.id))
    artist.numberOfNfts = artistNfts.length
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url
  }

  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    const url = await getPublicUrl('collections', collection.image_url)
    collection.numberOfNfts = collectionNfts.length
    collection.image_url = url
  }

  // Filter to only get collections with more than 0 NFTs
  const notEmptyCollections = collections.filter(collection => collection.numberOfNfts !== 0)

  return {
    props: { collections: notEmptyCollections, artists, nfts },
  }
}

export default Home
