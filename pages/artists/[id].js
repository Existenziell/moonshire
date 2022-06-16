import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Artist = ({ artist, artistNfts }) => {
  const { id, name, headline, description, origin, avatar_url, created_at, numberOfNfts } = artist

  return (
    <>
      <Head>
        <title>{name} | Artist | Project Moonshire</title>
        <meta name='description' content={`${name} | Artist | Project Moonshire`} />
      </Head>

      <div className='flex flex-col items-center px-[40px]'>

        <h1 className='mx-auto'>{name}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-10'>
          <img src={avatar_url} alt='Artist Image' className='md:w-1/2' />
          <div>
            <p className='mt-4 text-xl'>{headline}</p>
            <hr className='my-8' />
            <p className='mt-4'>{description}</p>
            <p className='mt-4'>Origin: {origin}</p>
            <p>Number of NFTs from this artist: {numberOfNfts}</p>
            <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
          </div>
        </div>

        <h2 className='mt-28 mb-8 self-start text-3xl'>NFTs made by {name}:</h2>
        <div className='flex flex-wrap items-center gap-4 w-full'>
          {artistNfts.map(nft => {
            const { id, name, price, artists, image_url } = nft
            return (
              <Link href={`/nfts/${id}`} key={id}>
                <a>
                  <div className='max-w-lg w-full px-6 py-4 mb-6 rounded border border-detail dark:border-detail-dark shadow-md hover:cursor-pointer transition-all'>
                    <div className='flex flex-col gap-4 items-start justify-center'>
                      <img src={image_url} alt='NFT Image' className='max-w-[200px] aspect-square' />
                      <div className='w-full'>
                        <h2 className='mt-0'>{name}</h2>
                        <p className='text-tiny'>by {artists.name}</p>
                        <p className='mt-4'>{price} ETH</p>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            )
          })}

        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: nfts } = await supabase.from('nfts').select(`*, artists(*)`).order('id', { ascending: true })
  let { data: artist } = await supabase.from('artists').select(`*`).eq('id', id).single()
  if (!artist) {
    return {
      redirect: {
        permanent: false,
        destination: "/artists",
      },
      props: {}
    }
  }
  const artistNfts = nfts.filter((n => n.artist === artist.id))
  artist.numberOfNfts = artistNfts.length

  return {
    props: { artist, artistNfts },
  }
}

export default Artist
