import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'

/* eslint-disable no-unused-vars */
const Artist = ({ artist, artistNfts }) => {
  /* eslint-enable no-unused-vars */

  const { id, name, headline, description, origin, public_url, created_at, numberOfNfts } = artist

  return (
    <>
      <Head>
        <title>{name} | Artist | Project Moonshire</title>
        <meta name='description' content={`${name} | Artist | Project Moonshire`} />
      </Head>

      <div className='flex flex-col items-center px-[40px] h-[calc(100vh-200px)]'>

        <div key={id} className='flex flex-col md:flex-row items-center justify-center gap-[40px] w-full'>
          <img src={public_url} alt='Artist Image' className='md:w-1/2 shadow-2xl' />
          <div className='w-1/2'>
            <h1 className='mx-auto'>{name}</h1>
            <hr className='mt-8 mb-12' />
            <p>{headline}</p>
            <p className='mt-4'>{description}</p>
            <p className='mt-4'>Origin: {origin}</p>
            <p>Number of NFTs from this artist: {numberOfNfts}</p>
            <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
          </div>
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

  const url = await getPublicUrl('artists', artist.avatar_url)
  artist.public_url = url

  return {
    props: { artist, artistNfts },
  }
}

export default Artist
