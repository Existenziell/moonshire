import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import fromExponential from 'from-exponential'
import { shortenAddress } from '../../lib/shortenAddress'

const Collection = ({ collection, collectionNfts: nfts }) => {
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
        <title>{collection.title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${collection.title} | Collection | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full'>
        {nfts.length > 0 ?
          <div className="flex flex-wrap justify-evenly gap-20 mx-16 mb-20">
            {nfts.map((nft, i) => (
              <div key={i} className="flex flex-col justify-between w-min mb-44">
                <Link href={`/nfts/${nft.id}`}>
                  <a className="">
                    <img
                      src={nft.image_url ? nft.image_url : nft.image}
                      alt='NFT Image'
                      className='w-full aspect-square object-cover min-w-[400px] shadow-2xl mb-6' />
                  </a>
                </Link>

                <div className="flex flex-col justify-between h-full">
                  <p className="mb-8 h-full mt-10 text-2xl leading-relaxed">{nft.name}</p>
                  <div className="text-detail-dark dark:text-detail">
                    {/* <p>{nft.description}</p> */}
                    <div className='mb-8'>
                      <Link href={`/collections/${nft.collections.id}`}>
                        <a className='link-white'>
                          {nft.collections?.title ? nft.collections.title : nft.collection}
                        </a>
                      </Link>
                    </div>
                    <div className='mt-4 mb-10'>
                      <Link href={`/artists/${nft.artists.id}`}>
                        <a className='link-white'>
                          {nft.artists?.name ? nft.artists.name : nft.artist}
                        </a>
                      </Link>
                    </div>
                    <hr />

                    {nft.owner && nft.seller &&
                      <>
                        <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                        <p>Seller: {shortenAddress(nft.seller)}</p>
                      </>
                    }
                  </div>
                  <div className="flex justify-start gap-8 items-end">
                    <h1 className="mt-4 mb-0">{fromExponential(nft.price)} ETH</h1>
                    <Link href={`/nfts/${nft.id}`}>
                      <a className='button button-cta uppercase'>
                        View
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :
          <div className='w-full flex flex-col items-center justify-center'>
            <h1 className='mb-0'>No NFTs have been created in this collection.</h1>
            {userOwnsCollection ?
              <Link href='/nfts/create'>
                <a className='button button-detail mt-8'>
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

  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  return {
    props: { collection, collectionNfts },
  }
}

export default Collection
