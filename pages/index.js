/* eslint-disable no-unused-vars */
import { supabase } from '../lib/supabase'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Home = ({ nfts, collections, artists }) => {
  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full px-[40px] pb-24'>

        {/* <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home1'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home2'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home3'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home4'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home5'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home6'></a>
          </Link>
        </div>

        <div className='md:snap-start md:snap-always flex items-center justify-center'>
          <Link href='/collections'>
            <a className='h-screen w-full bg-cover bg-center bg-home7'></a>
          </Link>
        </div> */}

        {collections?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8 self-start'>Featured Collections</h2>

            {collections.map((collection, idx) => {
              const { id, title, headline, description, image_url } = collection

              return (
                <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                  <div className={idx % 2 !== 0 ? `order-2` : ``}>
                    <Link href={`/collections/${id}`}>
                      <a className='block w-[300px]'>
                        <Image
                          width={300}
                          height={300}
                          placeholder="blur"
                          src={image_url}
                          blurDataURL={image_url}
                          alt='Cover Image'
                          className='aspect-square bg-cover rounded-sm shadow-2xl'
                        />
                      </a>
                    </Link>
                  </div>

                  <div className='flex flex-col flex-grow justify-between'>
                    <div className={idx % 2 !== 0 ? `text-right` : ``}>
                      <h1 className='mb-0'>{title}</h1>
                      <hr className='my-8' />
                      <p>{headline}</p>
                      <p>{description}</p>
                    </div>
                    <Link href={`/collections/${id}`}>
                      <a className={`${idx % 2 !== 0 ? `self-end` : ``} button button-cta mt-10`}>View Collection</a>
                    </Link>
                  </div>
                </div>
              )
            })}
          </>
        }

        {artists?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark my-8 self-start'>Featured Artists</h2>
            <div className='flex justify-center md:justify-start flex-wrap gap-[40px] w-full'>
              {artists.map((artist, idx) => {
                const { id, name, headline, description, public_url } = artist
                return (
                  <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                    <div className={idx % 2 !== 0 ? `order-2` : ``}>
                      <Link href={`/artists/${id}`} >
                        <a className='block w-[300px]'>
                          {public_url &&
                            <Image
                              width={300}
                              height={300}
                              placeholder="blur"
                              src={public_url}
                              blurDataURL={public_url}
                              alt='Artist Image'
                              className='aspect-square bg-cover rounded-sm shadow-2xl'
                            />
                          }
                        </a>
                      </Link>
                    </div>
                    <div className='flex flex-col flex-grow justify-between'>
                      <div className={idx % 2 !== 0 ? `text-right` : ``}>
                        <h1 className='mb-0'>{name}</h1>
                        <hr className='my-8' />
                        <p>{headline}</p>
                        <p>{description}</p>
                      </div>
                      <Link href={`/artists/${id}`}>
                        <a className={`${idx % 2 !== 0 ? `self-end` : ``} button button-cta mt-10`}>View Artist</a>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        }

        {nfts?.length > 0 &&
          <div className='mt-24 w-full'>
            <h2 className='border-b border-detail dark:border-detail-dark my-8'>Featured NFTs</h2>
            <div className='flex justify-start md:justify-start flex-wrap gap-[40px] w-full'>
              {nfts.map(nft => {
                const { id, image_url } = nft
                return (
                  <div key={id} className='relative' >
                    <Link href={`/nfts/${id}`}>
                      <a className='block w-[300px]'>
                        <Image
                          width={300}
                          height={300}
                          placeholder="blur"
                          src={image_url}
                          blurDataURL={image_url}
                          alt='NFT Image'
                          className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl'
                        />
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
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('created_at', { ascending: false })
  const { data: featuredNfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).eq('featured', true).order('created_at', { ascending: false })
  const { data: collections } = await supabase.from('collections').select(`*`).eq('featured', true).order('created_at', { ascending: false })
  const { data: artists } = await supabase.from('artists').select(`*`).eq('featured', true).order('created_at', { ascending: false })

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
  // console.log(nfts, collections, artists);

  return {
    props: { collections: notEmptyCollections, artists, nfts: featuredNfts },
  }
}

export default Home
