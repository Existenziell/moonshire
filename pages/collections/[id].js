import { supabase } from '../../lib/supabase'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts, floorPrice, highestPrice, artists } = collection
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

      <div className="snap-y snap-mandatory w-full h-[calc(100vh-160px)] overflow-y-scroll">

        <div className='snap-start snap-always w-full h-screen flex items-start justify-center px-[40px]'>
          <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
            <div className="frame max-w-xl bg-brand">
              <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-[calc(100vh-160px)] px-[40px] flex items-start">
          <div>
            <div className='flex justify-between w-full relative'>
              <div className='grid grid-rows-2 items-center'>
                <span>Name</span>
                <h1 className='my-0 py-0 whitespace-nowrap'>{title}</h1>
              </div>
              <div className='grid grid-rows-2 items-center '>
                <span>NFTs</span>
                <p>{numberOfNfts}</p>
              </div>
              <div className='grid grid-rows-2 items-center '>
                <span className='whitespace-nowrap'>Price &darr;</span>
                <p className='whitespace-nowrap'>{floorPrice} ETH</p>
              </div>
              <div className='grid grid-rows-2 items-center '>
                <span className='whitespace-nowrap'>Price	&uarr;</span>
                <p className='whitespace-nowrap'>{highestPrice} ETH</p>
              </div>
              <div className='grid grid-rows-2 items-center '>
                <span>Year</span>
                <p>{year}</p>
              </div>
              <div className='grid grid-rows-2 items-center '>
                <span>Artists</span>
                <p className='whitespace-nowrap'>{artists.join(', ')}</p>
              </div>
              <div className='absolute top-14 w-full h-[1px] bg-lines dark:bg-lines-dark'></div>
            </div>

            <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-[40px] mt-20'>
              <img src={public_url} alt='Cover Image' className='md:w-1/2 md:max-w-md' />
              <div>
                <p>{headline}</p>
                <hr className='my-8' />
                <p className='mb-8'>{description}</p>
                {floorPrice &&
                  <p><span className='w-32 whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
                }
                {highestPrice &&
                  <p className='mb-8'><span className='w-32 whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
                }
                <p>Launched: {year}</p>
                <p className='mb-4'>{numberOfNfts} NFTs available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-[calc(100vh-160px)] px-[40px] flex items-start">
          {collectionNfts.length ?
            <table className='w-full'>
              <thead className='text-left mb-44'>
                <tr className='text-tiny border-b border-lines dark:border-lines-dark py-8 my-8'>
                  <th className='pb-6'>Media</th>
                  <th className='pb-6'>Name</th>
                  <th className='pb-6'>Artist</th>
                  <th className='pb-6'>Edition</th>
                  <th className='pb-6'>Format</th>
                  <th className='pb-6'>Price</th>
                  <th className='pb-6'></th>
                </tr>
              </thead>
              <tbody>
                {collectionNfts.map(nft => (
                  <tr key={nft.id + nft.name} className='relative mt-44'>
                    <td className='pt-6 px-0'>
                      <Link href={`/nfts/${nft.id}`}>
                        <a>
                          {nft.image_url ?
                            <img src={nft.image_url} alt='NFT Image' className='w-14 rounded' />
                            :
                            "n/a"
                          }
                        </a>
                      </Link>
                    </td>
                    <td className='whitespace-nowrap pt-6'><h1 className='my-0'>{nft.name}</h1></td>
                    <td className='whitespace-nowrap pt-6'>{nft.artists?.name}</td>
                    <td className='whitespace-nowrap pt-6'>{nft.id}</td>
                    <td className='whitespace-nowrap pt-6'>{nft.format ? nft.format : `Digital`} </td>
                    <td className='whitespace-nowrap pt-6'>{nft.price} ETH</td>
                    <td>
                      <div className='flex items-end justify-end'>
                        <Link href={`/nfts/${nft.id}`}>
                          <a className='button button-detail p-0'>
                            VIEW
                          </a>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })

  // Set public IPFS url for collection cover image
  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Set Number of NFTs in collection
  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  if (collectionNfts.length > 0) {

    // Collect artists that have NFTs in this collection
    let collectionArtists = []
    for (let nft of collectionNfts) {
      collectionArtists.push(nft.artists.name)
    }

    /* eslint-disable no-undef */
    const uniqueCollectionArtists = [...new Set(collectionArtists)]
    /* eslint-enable no-undef */
    collection.artists = uniqueCollectionArtists

    // Set floor and highest price
    let floorPrice = 1000000
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
