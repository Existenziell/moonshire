import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Artists = ({ artists }) => {
  return (
    <>
      <Head>
        <title>Artists | Project Moonshire</title>
        <meta name='description' content="Artists | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>

        <h1>Artists</h1>
        <div className='flex flex-col items-center justify-center gap-24 text-sm'>

          {artists.map(artist => {
            const { id, name, headline, desc, origin, public_url, created_at, numberOfNfts } = artist

            return (
              <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8 mt-16'>

                <Link href={`/artists/${id}`}>
                  <a>
                    <img src={public_url} alt='Artist Image' className='max-w-sm' />
                  </a>
                </Link>
                <div>
                  <h2>{name}</h2>
                  <p className='mt-4 text-lg'>{headline}</p>
                  <hr className='border-t-2 border-lines my-8' />
                  <p className='mt-4'>{desc}</p>
                  <p className='mt-4'>Origin: {origin}</p>
                  <p>Number of NFTs from this artist: {numberOfNfts}</p>
                  <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
                  <Link href={`/artists/${id}`}>
                    <a className='button button-detail mt-8'>
                      Details
                    </a>
                  </Link>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })
  const { data: nfts } = await supabase.from('nfts').select(`*, artists(*)`).order('id', { ascending: true })

  for (let artist of artists) {
    const collectionNfts = nfts.filter((n => n.artist === artist.id))
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.numberOfNfts = collectionNfts.length
    artist.public_url = url
  }

  return {
    props: { artists },
  }
}

export default Artists
