import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts, floorPrice, highestPrice, artists } = collection
  const { currentUser } = useApp()
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

      <div className="snap-y snap-mandatory w-full h-[calc(100vh-140px)] overflow-y-scroll">

        <div className='snap-start snap-always w-full h-screen flex items-start justify-center px-[40px]'>
          <div className='flex items-center justify-center h-[calc(100vh-220px)]'>
            <div className="frame max-w-xl bg-brand">
              <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-[calc(100vh-140px)] px-[40px] flex items-start justify-between">
          <div className='w-full'>

            <table className='w-full'>
              <thead className='text-left mb-8'>
                <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark whitespace-nowrap'>
                  <th className='pb-6'>Name</th>
                  <th className='pb-6 pl-8'>NFTs</th>
                  <th className='pb-6 pl-8'>Price &darr;</th>
                  <th className='pb-6 pl-8'>Price &uarr;</th>
                  <th className='pb-6 pl-8'>Year</th>
                  <th className='pb-6'>Artists</th>
                </tr>
              </thead>
              <tbody>
                <tr className='whitespace-nowrap align-middle'>
                  <td className='whitespace-normal text-[30px] p-0'>{title}</td>
                  <td className='pl-8 py-0'>{numberOfNfts}</td>
                  <td className='pl-8 py-0'>{floorPrice} ETH</td>
                  <td className='pl-8 py-0'>{highestPrice} ETH</td>
                  <td className='pl-8 py-0'>{year}</td>
                  <td className='p-0'>{artists ? artists.join(', ') : `None`}</td>
                </tr>
              </tbody>
            </table>

            <div key={id} className='flex flex-col md:flex-row items-start justify-start gap-[40px] mt-20'>
              <img src={public_url} alt='Cover Image' className='md:w-1/2 md:max-w-md' />
              <div>
                <p>{headline}</p>
                <hr className='my-8' />
                <p className='mb-8'>{description}</p>
                {floorPrice &&
                  <p><span className='whitespace-nowrap inline-block'>Floor Price:</span> {floorPrice} ETH</p>
                }
                {highestPrice &&
                  <p className='mb-8'><span className='whitespace-nowrap inline-block'>Highest Price:</span> {highestPrice} ETH</p>
                }
                <p>Launched: {year}</p>
                <p className='mb-4'>{numberOfNfts} NFTs available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start snap-always w-full h-[calc(100vh-140px)] px-[40px] flex items-start">
          {collectionNfts.length ?
            <table className='w-full'>
              <thead className='text-left mb-44'>
                <tr className='text-tiny border-b pb-10 border-lines dark:border-lines-dark py-8 my-8'>
                  <th className='pb-6'>Media</th>
                  <th className='pb-6 pl-8'>Name</th>
                  <th className='pb-6 pl-8'>Artist</th>
                  <th className='pb-6 pl-8'>Edition</th>
                  <th className='pb-6 pl-8'>Format</th>
                  <th className='pb-6 pl-8'>Price</th>
                  <th className='pb-6 pl-8'></th>
                </tr>
              </thead>
              <tbody>
                {collectionNfts.map((nft, idx) => (
                  <tr key={nft.id + nft.name} className='relative mt-44 whitespace-nowrap'>
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
                    <td className='whitespace-normal pt-6 pl-8'><h1 className='my-0'>{nft.name}</h1></td>
                    <td className='pt-6 pl-8'>{nft.artists?.name}</td>
                    <td className='pt-6 pl-8'>{idx + 1}/{numberOfNfts}</td>
                    <td className='pt-6 pl-8'>{nft.format ? nft.format : `Digital`} </td>
                    <td className='pt-6 pl-8'>{nft.price} ETH</td>
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

export async function getServerSideProps(context) {
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

export default Collection
