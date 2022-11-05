import { supabase } from '../lib/supabase'
import { useQuery } from 'react-query'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { convertEthToUsd } from '../lib/convertEthToUsd'

const Home = () => {
  async function fetchApi(...args) {
    let { data: collections } = await supabase
      .from('collections')
      .select(`*`)
      .eq('featured', true)
      .order('created_at', { ascending: false })

    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .order('created_at', { ascending: false })

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
      if (collectionPrice) {
        collection.priceUSD = await convertEthToUsd(collectionPrice)
        collection.price = collectionPrice
      }
    }
    // Filter to only get collections with more than 0 NFTs
    collections = collections.filter(collection => collection.numberOfNfts > 0)
    return collections
  }

  const { status, data: collections } = useQuery(["home"], () => fetchApi())

  if (status === "error") return <p>{status}</p>

  return (
    <>
      <Head>
        <title>Project Moonshire</title>
        <meta name='description' content="It is gonna be epic | Project Moonshire" />
      </Head>

      <div className='h-screen md:snap-y md:snap-mandatory md:overflow-y-scroll'>
        {collections?.length > 0 &&
          collections.map((collection, idx) => {
            const { id, title, image_url, uniqueArtists, price, priceUSD } = collection

            return (
              <div key={id} className={`h-screen w-full md:snap-start md:snap-always flex items-center justify-center relative`}>
                <div className='absolute w-full h-full'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${image_url}`}
                    placeholder='blur'
                    blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${image_url}`}
                    layout='fill'
                    priority={idx === 0}
                    alt='Collection Image'
                    objectFit='cover'
                  />
                </div>
                <div className='absolute bottom-[150px] right-[25px] left-[43px] flex flex-col items-end'>
                  <p className='text-8xl leading-tight text-white hidden md:block text-right'>{title}</p>
                  <div className='flex justify-between items-center w-full mt-8'>
                    <div className='hidden md:flex items-center gap-8'>
                      <div className='nextimg'>
                        <Image src='/home/thing.png' width={60} height={60} alt='Thing' />
                      </div>
                      <div className=''>Created by {` `}<br />
                        {uniqueArtists.map((artist, idx) => (
                          <Link href={`/artists/${artist.id}`} key={artist.id}>
                            <a className='link-white'>
                              {artist.name}{idx + 1 < uniqueArtists.length ? `, ` : ``}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className='flex items-center gap-12'>
                      <span className='text-4xl text-white'>{price} ETH</span>
                      <span className='text-4xl text-gray-400 hidden md:block'>${priceUSD}</span>
                      <Link href={id ? `/collections/${id}` : `/collections`}>
                        <a><button className='button button-cta'>EXPLORE</button></a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Home
