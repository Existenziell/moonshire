/* eslint-disable no-unused-vars */
import { supabase } from '../lib/supabase'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='h-full'>

        <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home1 w-full shadow">
          <Link href='/collections/ceccc272-5f26-4f8d-9e51-03e527bf3df6'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Him &amp; Her (Interconnection)</h1>
            </a>
          </Link>
        </div>

        <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home2 w-full shadow">
          <Link href='/collections/3b0cfe15-8865-4086-a7d2-4c25744913f9'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Synthetic wave fields Collection</h1>
            </a>
          </Link>
        </div>

        {/* <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home3 w-full shadow">
          <Link href='/collections/'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Newtonian fluid stimulation</h1>
            </a>
          </Link>
        </div> */}

        <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home4 w-full shadow">
          <Link href='/collections/5c7e9370-d5f3-4887-9845-a8b046dc1471'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Newtonian fluid stimulation</h1>
            </a>
          </Link>
        </div>

        {/* <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home5 w-full shadow">
          <Link href='/collections/'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Collection</h1>
            </a>
          </Link>
        </div> */}

        <div className="flex items-center justify-center md:h-screen sm:bg-fixed sm:bg-center bg-contain sm:bg-cover bg-home6 w-full shadow">
          <Link href='/collections/36ee7dd8-8629-451c-a328-090e23074de7'>
            <a className="w-full py-10 text-center bg-black/30 backdrop-blur-sm text-white">
              <h1 className='mb-0'>Cuvée Sensorium Art Editions</h1>
            </a>
          </Link>
        </div>

        {/* {collections?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark mb-8 self-start'>Featured Collections</h2>

            {collections.map((collection, idx) => {
              const { id, title, headline, description, image_url } = collection

              return (
                <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                  <div className={idx % 2 !== 0 ? `order-2` : ``}>
                    <Link href={`/collections/${id}`}>
                      <a>
                        <img src={image_url} alt='Cover Image' className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl' />
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
        } */}

        {/* {artists?.length > 0 &&
          <>
            <h2 className='border-b border-detail dark:border-detail-dark my-8 self-start'>Featured Artists</h2>
            <div className='flex justify-center md:justify-start flex-wrap gap-[40px] w-full'>
              {artists.map((artist, idx) => {
                const { id, name, headline, description, public_url } = artist
                return (
                  <div key={id} className='w-full flex flex-col md:flex-row items-center justify-between gap-[40px] mb-20'>
                    <div className={idx % 2 !== 0 ? `order-2` : ``}>
                      <Link href={`/artists/${id}`} >
                        <a>
                          {public_url &&
                            <img src={public_url} alt='Artist Image' className='aspect-square bg-cover max-w-md rounded-sm shadow-2xl' />
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
                      <Link href={`/collections/${id}`}>
                        <a className={`${idx % 2 !== 0 ? `self-end` : ``} button button-cta mt-10`}>View Collection</a>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        } */}

        {/* {nfts?.length > 0 &&
          <div className='mt-24 w-full'>
            <h2 className='border-b border-detail dark:border-detail-dark my-8'>Featured NFTs</h2>
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
        } */}

      </div>
    </>
  )
}

// export async function getServerSideProps() {
//   const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('created_at', { ascending: false })
//   const { data: featuredNfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).eq('featured', true).order('created_at', { ascending: false })
//   const { data: collections } = await supabase.from('collections').select(`*`).eq('featured', true).order('created_at', { ascending: false })
//   const { data: artists } = await supabase.from('artists').select(`*`).eq('featured', true).order('created_at', { ascending: false })

//   for (let artist of artists) {
//     const artistNfts = nfts.filter((n => n.artist === artist.id))
//     artist.numberOfNfts = artistNfts.length
//     const url = await getPublicUrl('artists', artist.avatar_url)
//     artist.public_url = url
//   }

//   for (let collection of collections) {
//     const collectionNfts = nfts.filter((n => n.collection === collection.id))
//     const url = await getPublicUrl('collections', collection.image_url)
//     collection.numberOfNfts = collectionNfts.length
//     collection.image_url = url
//   }
//   // Filter to only get collections with more than 0 NFTs
//   const notEmptyCollections = collections.filter(collection => collection.numberOfNfts !== 0)

//   return {
//     props: { collections: notEmptyCollections, artists, nfts: featuredNfts },
//   }
// }

export default Home
