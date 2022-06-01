import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { getPublicUrl } from '../lib/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Home = ({ artists, collections }) => {
  const [fetchedCollections, setFetchedCollections] = useState()
  const [fetchedArtists, setFetchedArtists] = useState()

  useEffect(() => {
    enrichArtists(artists)
    enrichCollections(collections)
  }, [artists, collections])

  const enrichArtists = async () => {
    for (let artist of artists) {
      if (artist.avatar_url) {
        const url = await getPublicUrl('artists', artist.avatar_url)
        artist.public_url = url
      }
    }
    setFetchedArtists(artists)
  }

  const enrichCollections = async () => {
    for (let collection of collections) {
      if (collection.image_url) {
        const url = await getPublicUrl('collections', collection.image_url)
        collection.public_url = url
      }
    }
    setFetchedCollections(collections)
  }

  if (!fetchedCollections) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full pb-16'>

        <div>
          <h1 className='mt-20'>Featured Artists</h1>
          <div className='flex flex-wrap'>
            {fetchedArtists.map(artist => {
              return (
                <div key={artist.id} className='flex flex-wrap justify-between w-1/2 pr-4'>
                  <div className='flex justify-between bg-detail dark:text-brand-dark p-4 rounded border hover:cursor-pointer hover:shadow-xl transition-all'>
                    <div className='h-full flex flex-col justify-between'>
                      <div>
                        <h2>{artist.name}</h2>
                        <p className='mt-4'>{artist.headline}</p>
                      </div>
                      <p className='text-tiny self-baseline'>#NFTs: {artist.numberOfNfts}</p>
                    </div>
                    {artist.public_url &&
                      <img src={artist.public_url} alt='Artist Image' className='w-1/2 rounded' />
                    }
                  </div>
                </div>
              )
            })}
          </div>

          <h1 className='mt-24'>Moonshire Collections</h1>
          <div className='flex flex-col items-center justify-center gap-16 text-sm'>

            {fetchedCollections.map(collection => {
              return (
                <div key={collection.id} className='flex flex-col md:flex-row items-center justify-start gap-8 text-sm pt-12'>
                  <img src={collection.public_url} alt='Cover Image' className='md:w-1/3' />
                  <div>
                    <h1>{collection.title}</h1>
                    <p className='mt-4'>{collection.headline}</p>
                    <hr className='border-t-2 border-lines my-8' />
                    <p className='mt-4'>{collection.desc}</p>
                    <p>2.2 ETH</p>
                    <p className='text-tiny my-8'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
                    <Link href={`/collections/${collection.id}`}>
                      <a className='button button-detail'>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

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
    artist.numberOfNfts = artistNfts.length
  }

  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    collection.numberOfNfts = collectionNfts.length
  }

  return {
    props: { collections, artists },
  }
}

export default Home
