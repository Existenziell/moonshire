import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Artists = ({ artists }) => {
  return (
    <>
      <Head>
        <title>Artists | Project Moonshire</title>
        <meta name='description' content="Artists | Project Moonshire" />
      </Head>

      {artists.length ?
        <div className='flex flex-col items-center justify-start px-[40px]'>
          <div className='flex flex-col items-start justify-center gap-20 w-full'>

            {artists.map(artist => {
              const { id, name, headline, description, origin, avatar_url, created_at, numberOfNfts } = artist

              return (
                <div key={id} className='w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-[40px] h-[calc(100vh-160px)]'>

                  <Link href={`/artists/${id}`}>
                    <a className='aspect-square bg-cover shadow-2xl md:w-[calc(50vw-100px)] flex-shrink-0'>
                      <img src={avatar_url} alt='Artist Image' className='' />
                    </a>
                  </Link>
                  <div className='flex-grow'>
                    <h1>{name}</h1>
                    <p className='mt-4'>{headline}</p>
                    <hr className='my-8' />
                    <p className='mt-4'>{description}</p>
                    <p className='mt-4'>Origin: {origin}</p>
                    <p>{numberOfNfts} artworks by <span className='text-white'>{name}</span></p>
                    <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
                    <Link href={`/artists/${id}`}>
                      <a className='button button-cta mt-8 mx-auto md:mr-auto md:ml-0 uppercase'>
                        View Artworks
                      </a>
                    </Link>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
        :
        <div>
          <h1 className="text-3xl mx-auto w-max">No artists found</h1>
        </div>
      }
    </>
  )
}

export async function getServerSideProps() {
  const { data: artists } = await supabase.from('artists').select(`*`).order('id', { ascending: true })
  const { data: nfts } = await supabase.from('nfts').select(`*, artists(*)`).order('id', { ascending: true })

  for (let artist of artists) {
    const collectionNfts = nfts.filter((n => n.artist === artist.id))
    artist.numberOfNfts = collectionNfts.length
  }

  return {
    props: { artists },
  }
}

export default Artists
