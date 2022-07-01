import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Link from 'next/link'

/* eslint-disable no-unused-vars */
const Artist = ({ artist }) => {
  /* eslint-enable no-unused-vars */

  const { name, headline, description, public_url, nfts, numberOfNfts, collections, numberOfCollections } = artist

  return (
    <>
      <Head>
        <title>{name} | Artist | Project Moonshire</title>
        <meta name='description' content={`${name} | Artist | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] md:h-[calc(100vh-200px)]'>

        <div className='flex flex-col md:flex-row items-center justify-center gap-[40px] w-full'>
          <div className='md:w-1/2'>
            <img src={public_url} alt='Artist Image' className='aspect-square bg-cover max-h-[calc(100vh-260px)] shadow-2xl' />
          </div>
          <div className='md:w-1/2'>
            <h1 className='mx-auto'>{name}</h1>
            <hr className='mt-8 mb-12' />
            <p>{headline}</p>
            <p className='mt-4'>{description}</p>
            {/* <p className='mt-4'>Origin: {origin}</p> */}
            {/* <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p> */}
            <div className='mt-20'>
              <h1 className='mb-0'>Assets</h1>
              <hr className='my-8' />
              <p className='mb-4'>{numberOfCollections} {numberOfCollections > 1 ? `Collections` : `Collection`}</p>
              <div>
                {collections.map(c => (
                  <Link key={c.id} href={`/collections/${c.id}`}><a className='link-white block'>{c.title}</a></Link>
                ))}
              </div>
              <p className='mb-4 mt-8'>{numberOfNfts} {numberOfNfts > 1 ? `NFTs` : `NFT`}</p>
              <div>
                {nfts.map(n => (
                  <Link key={n.id} href={`/nfts/${n.id}`}><a className='link-white block'>{n.name}</a></Link>
                ))}
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

  let { data: artist } = await supabase.from('artists').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).eq('artist', artist.id).order('created_at', { ascending: false })

  if (!artist) {
    return {
      redirect: {
        permanent: false,
        destination: "/artists",
      },
      props: {}
    }
  }

  const url = await getPublicUrl('artists', artist.avatar_url)
  artist.public_url = url

  let collections = []
  for (let nft of nfts) {
    collections.push(nft.collections)
  }
  /* eslint-disable no-undef */
  let uniqueCollections = [...new Map(collections.map((item) => [item['id'], item])).values()];
  /* eslint-enable no-undef */

  artist.collections = uniqueCollections
  artist.numberOfCollections = uniqueCollections.length

  const filteredNfts = nfts.filter((n => n.artist === artist.id))
  artist.nfts = filteredNfts
  artist.numberOfNfts = filteredNfts.length

  return {
    props: { artist },
  }
}

export default Artist
