import { supabase } from '../../lib/supabase'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts, floorPrice, highestPrice } = collection
  const appCtx = useContext(AppContext)
  const { currentUser } = appCtx
  const [userOwnsCollection, setUserOwnsCollection] = useState(false)

  useEffect(() => {
    if (currentUser) {
      // Check if currentUser owns collection
      if (currentUser.id === collection.user) setUserOwnsCollection(true)
    }
  }, [currentUser])

  return (
    <>
      <Head>
        <title>{title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${title} | Collection | Project Moonshire`} />
      </Head>

      <div className="snap-y snap-mandatory w-full h-[calc(100vh-160px)] overflow-scroll">

        <div className='snap-start snap-always w-full h-screen flex items-start justify-center'>
          <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
            <div className="frame max-w-xl">
              <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-screen">

          <h1 className='mx-auto'>{title}</h1>
          <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-10 text-sm'>
            <img src={public_url} alt='Cover Image' className='md:w-1/2 md:max-w-md' />
            <div>
              <p className='mt-4 text-xl'>{headline}</p>
              <hr className='border-t-2 border-lines dark:border-lines-dark my-8' />
              <p className='mb-8'>{description}</p>
              <p className='mb-4'>{numberOfNfts} NFTs available</p>
              {floorPrice &&
                <p><span className='w-32 whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
              }
              {highestPrice &&
                <p className='mb-8'><span className='w-32 whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
              }
              <p>Launched: {year}</p>
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-screen">

          {collectionNfts.length ?
            <div className='flex flex-wrap items-center justify-center gap-4 w-full'>
              {collectionNfts.map(nft => {
                const { id, name, price, artists, image_url } = nft
                return (
                  <Link href={`/nfts/${id}`} key={id}>
                    <a>
                      <div className='hover:shadow px-6 py-4 mb-8 rounded shadow-lg border border-detail dark:border-detail-dark hover:cursor-pointer transition-all'>
                        <div className='flex flex-col gap-6 items-start justify-between'>
                          <img src={image_url} alt='Cover Image' className='max-w-[200px] aspect-square' />
                          <div className='flex flex-col justify-between'>
                            <h2>{name}</h2>
                            <p className='text-tiny'>by {artists.name}</p>
                            <p className='text-admin-green'>{price} ETH</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                )
              })}
            </div>
            :
            <div className='w-full'>
              <p className='text-sm mb-6'>No NFTs found in this collection.</p>
              {userOwnsCollection ?
                <Link href='/nfts/create'>
                  <a className='button button-detail'>
                    Create NFT
                  </a>
                </Link>
                :
                <div className='mt-12'>
                  <p className='text-xs max-w-xs'>
                    Unfortunately, you are not able to add NFTs to this collection,
                    since you&apos;re not the owner. But you can:
                  </p>
                  <Link href='/collections/create'>
                    <a className='button button-detail mt-4'>
                      Create your own
                    </a>
                  </Link>

                </div>
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const id = context.params.id

  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })
  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()

  // Set public IPFS url for collection cover image
  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Set Number of NFTs in collection
  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  // Set floor and highest price
  if (collectionNfts.length > 0) {
    let floorPrice = 100000
    let highestPrice = 0

    for (let nft of collectionNfts) {
      if (highestPrice < nft.price) {
        highestPrice = nft.price
      }
      if (floorPrice > nft.price) {
        floorPrice = nft.price
      }
    }
    collection.floorPrice = floorPrice
    collection.highestPrice = highestPrice
  }

  return {
    props: { collection, collectionNfts },
  }
}

export async function getStaticPaths() {
  let { data } = await supabase
    .from('collections')
    .select(`*`)

  const paths = data.map(d => ({
    params: { id: d.id.toString() },
  }))

  return { paths, fallback: false }
}

export default Collection
