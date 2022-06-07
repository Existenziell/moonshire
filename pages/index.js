import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Home = ({ artists, collections, nfts }) => {
  const [fetchedCollections, setFetchedCollections] = useState()
  const [fetchedArtists, setFetchedArtists] = useState()

  useEffect(() => {
    setFetchedArtists(artists)
    setFetchedCollections(collections)
  }, [artists, collections])

  if (!fetchedCollections) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full px-[40px]'>
        <h1 className='mb-20'>Project Moonshire</h1>

        {fetchedArtists.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8 self-start'>Featured Artists</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full'>
              {fetchedArtists.map(artist => {
                const { id, image_url } = artist
                return (
                  <Link href={`/artists/${id}`} key={id} >
                    <a className='flex max-w-sm shadow-md hover:cursor-pointer relative'>
                      {image_url &&
                        <img src={image_url} alt='Artist Image' className='rounded' />
                      }
                    </a>
                  </Link>
                )
              })}
            </div>
          </>
        }

        {fetchedCollections.length > 0 &&
          <>
            <h2 className='mt-24 border-b border-detail dark:border-detail-dark mb-8 self-start'>Moonshire Collections</h2>

            {fetchedCollections.map(collection => {
              const { id, title, headline, description, image_url } = collection

              return (
                <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                  <div>
                    <Link href={`/collections/${id}`}>
                      <a>
                        <img src={image_url} alt='Cover Image' className='aspect-square bg-cover max-w-md' />
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
                      <a className='button button-detail mt-6'>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </>
        }

        {nfts.length > 0 &&
          <div className='mt-24'>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8'>Featured NFTs</h2>
            <div className='grid grid-cols-2 md:grid-cols-8 gap-6'>
              {nfts.map(nft => {
                const { id, image_url } = nft
                return (
                  <div key={id} className='bg-detail dark:bg-detail-dark p-4 shadow-md rounded hover:cursor-pointer transition-all relative' >
                    <Link href={`/nfts/${id}`}>
                      <a className='w-full'>
                        <img src={image_url} alt='NFT Image' className='w-full block aspect-square bg-cover' />
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
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })

  for (let artist of artists) {
    const artistNfts = nfts.filter((n => n.artist === artist.id))
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.numberOfNfts = artistNfts.length
    artist.image_url = url
  }

  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    const url = await getPublicUrl('collections', collection.image_url)
    collection.numberOfNfts = collectionNfts.length
    collection.image_url = url
  }

  return {
    props: { collections, artists, nfts },
  }
}

export default Home
