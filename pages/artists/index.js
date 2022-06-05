import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Artists = ({ artists, numberOfArtists }) => {
  console.log(numberOfArtists);
  return (
    <>
      <Head>
        <title>Artists | Project Moonshire</title>
        <meta name='description' content="Artists | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        <p className='text-xs mb-12 text-center'>Currently, {numberOfArtists} artists sell curated collections on Moonshire</p>
        <div className='flex flex-col items-start justify-center gap-16 text-sm'>

          {artists.map(artist => {
            const { id, name, headline, description, origin, public_url, created_at, numberOfNfts } = artist

            return (
              <div key={id} className='w-full flex flex-col md:flex-row items-start justify-center gap-4 md:gap-12 bg-detail dark:bg-detail-dark rounded p-4'>

                <Link href={`/artists/${id}`}>
                  <a>
                    <img src={public_url} alt='Artist Image' className='aspect-square bg-cover max-w-md' />
                  </a>
                </Link>
                <div className='max-w-md flex-grow'>
                  <h2>{name}</h2>
                  <p className='mt-4 text-lg'>{headline}</p>
                  <hr className='border-t-2 border-lines my-8 hidden md:block' />
                  <p className='mt-4'>{description}</p>
                  <p className='mt-4'>Origin: {origin}</p>
                  <p>Number of NFTs: {numberOfNfts}</p>
                  <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
                  <Link href={`/artists/${id}`}>
                    <a className='button button-detail mt-8 mx-auto md:mr-auto md:ml-0'>
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
  const numberOfArtists = artists.length
  console.log(numberOfArtists);

  return {
    props: { artists, numberOfArtists },
  }
}

export default Artists
