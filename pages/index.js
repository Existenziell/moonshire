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

      <div className='flex flex-col items-center justify-center w-full pb-16'>

        <div>
          <h2 className='mt-20 mb-8'>Featured Artists</h2>
          <div className='flex flex-wrap'>
            {fetchedArtists.map(artist => {
              const { id, name, headline, image_url, numberOfNfts } = artist
              return (
                <div key={id} className='flex flex-col justify-between w-full md:w-1/2 mb-4 md:pr-4'>

                  <Link href={`/artists/${id}`}>
                    <a className='flex justify-between bg-detail dark:text-brand-dark p-4 rounded border hover:cursor-pointer hover:shadow-xl transition-all'>
                      <div className='h-full flex flex-col justify-between'>
                        <div>
                          <h2>{name}</h2>
                          <p className='mt-4'>{headline}</p>
                        </div>
                        <p className='text-tiny self-baseline'>#NFTs: {numberOfNfts}</p>
                      </div>
                      {image_url &&
                        <img src={image_url} alt='Artist Image' className='w-1/2 rounded' />
                      }
                    </a>
                  </Link>
                </div>
              )
            })}
          </div>

          <h2 className='mt-24'>Moonshire Collections</h2>
          <div className='flex flex-col items-center justify-center gap-16 text-sm'>

            {fetchedCollections.map(collection => {
              const { id, title, headline, description, year, image_url, created_at } = collection

              return (
                <div key={id} className='flex flex-col md:flex-row items-start justify-start gap-16 pt-12 max-w-3xl'>
                  <div className='w-full md:w-1/2'>
                    <Link href={`/collections/${id}`}>
                      <a className='w-full'>
                        <img src={image_url} alt='Cover Image' className='w-full block' />
                      </a>
                    </Link>
                  </div>
                  <div className='md:w-1/2'>
                    <h1 className='mb-8'>{title}</h1>
                    <p className='mt-4'>{headline}</p>
                    <p className='text-tiny'>{year}</p>
                    <hr className='border-t-2 border-lines my-8' />
                    <p className='mt-4 mb-8'>{description}</p>
                    <p className='text-tiny'>Created: {created_at.slice(0, 10)}</p>
                    <p className='text-tiny mb-8'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
                    <Link href={`/collections/${id}`}>
                      <a className='button button-detail'>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='mt-24'>
            <h2>Featured NFTs</h2>
            <div className='grid grid-cols-4 gap-6 mt-8'>
              {nfts.map(nft => {
                const { id, image_url } = nft
                return (
                  <div key={id} className='p-8 shadow rounded bg-brand-dark dark:bg-brand' >
                    <Link href={`/nfts/${id}`}>
                      <a className='w-full'>
                        <img src={image_url} alt='NFT Image' className='w-full block hover:scale-105 transition-all duration-300' />
                      </a>
                    </Link>
                  </div>
                )
              })}
            </div>
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
