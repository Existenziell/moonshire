import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import fromExponential from 'from-exponential'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts, price, floorPrice, highestPrice, artists } = collection
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

      <div className="md:snap-y md:snap-mandatory w-full md:h-[calc(100vh-200px)] overflow-y-scroll">

        {/* <div className='md:snap-start md:snap-always w-full h-screen flex items-start justify-center px-[40px]'>
          <div className='flex items-center justify-center h-[calc(100vh-220px)]'>
            <div className="frame max-w-xl bg-brand">
              <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
            </div>
          </div>
        </div> */}

        <div className="hidden md:flex md:snap-start md:snap-always w-full md:h-[calc(100vh-140px)] px-[20px] md:px-[40px] items-start">
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
                            <img src={nft.image_url} alt='NFT Image' className='rounded-sm shadow-2xl w-24' />
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
                    <td className='pt-6 pl-8'>{fromExponential(nft.price)} ETH</td>
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
            <div className='w-full flex flex-col items-center justify-center'>
              <h1 className='mb-0'>No NFTs have been created in this collection.</h1>
              {userOwnsCollection ?
                <Link href='/nfts/create'>
                  <a className='button button-detail'>
                    Create NFT
                  </a>
                </Link>
                :
                <div className='mt-4 flex flex-col items-center'>
                  <p className=''>
                    Unfortunately, you are not able to add NFTs to this collection,
                    since you&apos;re not the owner.
                  </p>
                  <p className=''> Instead you can:</p>
                  <Link href='/collections/create'>
                    <a className='button button-detail mt-8 uppercase'>
                      Create collection
                    </a>
                  </Link>
                </div>
              }
            </div>
          }
        </div>

        {/* Mobile */}
        <div className="flex md:hidden w-full px-10 ">
          {collectionNfts.length &&
            <div className='flex flex-wrap justify-evenly items-center w-full gap-4'>
              {collectionNfts.map((nft, idx) => (
                <div key={idx} className="flex flex-col justify-between w-1/3 h-full">
                  <Link href={`/nfts/${nft.id}`}>
                    <a>
                      <img
                        src={nft.image_url ? nft.image_url : nft.image}
                        alt='NFT Image'
                        className='w-full aspect-square object-cover shadow-2xl mb-6' />
                    </a>
                  </Link>

                  <div className="flex flex-col justify-between h-full">
                    <p className="mb-6 h-full">{nft.name}</p>
                    <hr />
                    <div className="flex justify-between items-end">
                      <p className="mt-4">{fromExponential(nft.price)} ETH</p>
                    </div>
                  </div>
                </div>
              ))
              }
            </div>
          }
        </div>

        <div className="md:snap-start md:snap-always w-full md:h-[calc(100vh-140px)] px-[40px] flex items-start justify-between mt-40 md:mt-0 ">
          <div className='w-full'>

            <table className='w-full'>
              <thead className='text-left mb-8'>
                <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark whitespace-nowrap'>
                  <th className='pb-6'>Name</th>
                  <th className='pb-6 pl-8'>NFTs</th>
                  <th className='pb-6 pl-8'>Price</th>
                  {/* <th className='pb-6 pl-8'>Price &darr;</th>
                  <th className='pb-6 pl-8'>Price &uarr;</th> */}
                  <th className='pb-6 pl-8 hidden md:table-cell'>Year</th>
                  <th className='pb-6 hidden md:table-cell'>Artists</th>
                </tr>
              </thead>
              <tbody>
                <tr className='whitespace-nowrap align-middle'>
                  <td className='whitespace-normal p-0'><h1 className='mb-0'>{title}</h1></td>
                  <td className='pl-8 py-0'>{numberOfNfts}</td>
                  <td className='pl-8 py-0'>{fromExponential(price)} ETH</td>
                  {/* <td className='pl-8 py-0'>{fromExponential(floorPrice)} ETH</td>
                  <td className='pl-8 py-0'>{fromExponential(highestPrice)} ETH</td> */}
                  <td className='pl-8 py-0 hidden md:table-cell'>{year}</td>
                  <td className='p-0 hidden md:table-cell'>{artists ? artists.join(', ') : `None`}</td>
                </tr>
              </tbody>
            </table>

            <div key={id} className='flex flex-col md:flex-row items-start justify-start gap-[40px] mt-20'>
              <img src={public_url} alt='Cover Image' className='md:w-1/2 md:max-w-xl' />
              <div>
                <p>{headline}</p>
                <hr className='my-8' />
                <p className='mb-8'>{description}</p>
                {floorPrice &&
                  <p><span className='whitespace-nowrap inline-block'>Floor Price:</span> {fromExponential(floorPrice)} ETH</p>
                }
                {highestPrice &&
                  <p className='mb-8'><span className='whitespace-nowrap inline-block'>Highest Price:</span> {fromExponential(highestPrice)} ETH</p>
                }
                {/* <p>Launched: {year}</p>
                <p className='mb-4'>{numberOfNfts} NFTs available</p> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })

  if (!collection) {
    return {
      redirect: {
        permanent: false,
        destination: "/collections",
      },
      props: {}
    }
  }

  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Set Number of NFTs in collection
  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  let collectionPrice = '0.0'
  if (collectionNfts) {

    // Collect artists that have NFTs in this collection
    let collectionArtists = []
    for (let nft of collectionNfts) {
      collectionArtists.push(nft.artists.name)
      let price = fromExponential(nft.price)
      collectionPrice = parseFloat(collectionPrice) + parseFloat(price)
    }
    collection.price = collectionPrice

    /* eslint-disable no-undef */
    const uniqueCollectionArtists = [...new Set(collectionArtists)]
    /* eslint-enable no-undef */
    collection.artists = uniqueCollectionArtists

    // Set floor and highest price
    // let floorPrice = 1000000
    // let highestPrice = 0

    // for (let nft of collectionNfts) {
    //   if (highestPrice < nft.price) {
    //     highestPrice = nft.price
    //   }
    //   if (floorPrice > nft.price) {
    //     floorPrice = nft.price
    //   }
    // }
    // collection.floorPrice = floorPrice
    // collection.highestPrice = highestPrice
  }

  return {
    props: { collection, collectionNfts },
  }
}

export default Collection
