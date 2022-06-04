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
        <h1>Project Moonshire</h1>
        <p className='text-sm max-w-sm mx-auto text-justify mb-20'>Project Moonshire Is A Web3 White-Label Platform Disrupting The 2.0 Status Quo: A Cutting Edge, Decentralised Monetising Service For Content Creators Running On The Rinkeby Blockchain.</p>
        <div>
          <h2 className='border-b border-detail dark:border-detail-dark mb-8'>Featured Artists</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full'>
            {fetchedArtists.map(artist => {
              const { id, name, headline, image_url, numberOfNfts } = artist
              return (
                <Link href={`/artists/${id}`} key={id} >
                  <a className=' flex max-w-sm bg-detail dark:bg-detail-dark p-4 rounded shadow-xl hover:cursor-pointer hover:shadow-sm transition-all relative'>
                    <h2 className='whitespace-nowrap absolute top-2 right-2 text-sm bg-black/20 backdrop-blur px-4 py-2'>{name}</h2>
                    {image_url &&
                      <img src={image_url} alt='Artist Image' className='rounded' />
                    }
                  </a>
                </Link>
              )
            })}
          </div>

          <h2 className='mt-24 border-b border-detail dark:border-detail-dark mb-8'>Moonshire Collections</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12'>

            {fetchedCollections.map(collection => {
              const { id, title, headline, description, year, image_url, created_at, numberOfNfts } = collection

              return (
                <div key={id} className='flex flex-col md:flex-row items-start justify-start gap-8 bg-detail dark:bg-detail-dark rounded p-4'>
                  <div className='w-full md:w-1/2'>
                    <Link href={`/collections/${id}`}>
                      <a className=''>
                        <img src={image_url} alt='Cover Image' className='aspect-square bg-cover' />
                      </a>
                    </Link>
                  </div>
                  <div className='md:w-1/2 h-full flex flex-col justify-between'>
                    <div>
                      <h2 className='md:text-2xl'>{title}</h2>
                      <p className='text-tiny mb-8'>{numberOfNfts} NFTs</p>
                      <p className='text-xs'>{description}</p>
                    </div>
                    <Link href={`/collections/${id}`}>
                      <a className='button button-cta mt-4'>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='mt-24'>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8'>Featured NFTs</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              {nfts.map(nft => {
                const { id, name, image_url } = nft
                return (
                  <div key={id} className='bg-detail dark:bg-detail-dark p-4 shadow-xl rounded hover:cursor-pointer hover:shadow-sm transition-all relative' >
                    <h2 className='whitespace-nowrap absolute top-2 right-2 text-sm bg-black/20 backdrop-blur px-4 py-2'>{name}</h2>
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
