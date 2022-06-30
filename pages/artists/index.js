import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
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
        <div className='md:snap-y md:snap-mandatory md:h-[calc(100vh-200px)] md:overflow-y-scroll'>

          {artists.map(artist => {
            const { id, name, headline, description, origin, public_url } = artist
            return (
              <div key={id} className='md:snap-start md:snap-always md:h-[calc(100vh-200px)] w-full mb-40'>
                <div className={`flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]`}>
                  <div className='md:w-1/2'>
                    <img src={public_url} alt='Artist Image' className='aspect-square shadow-2xl max-h-[calc(100vh-260px)]' />
                  </div>
                  <div className='md:w-1/2'>
                    <h1>{name}</h1>
                    <hr className='mt-8 mb-12' />
                    <p>{headline}</p>
                    <p className='mt-4'>{description}</p>
                    <p className='mt-4'>Origin: {origin}</p>
                    {/* <p>{numberOfNfts} artworks by <span className='text-white'>{name}</span></p> */}
                    {/* <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p> */}
                    <Link href={`/artists/${id}`}>
                      <a className='button button-cta mt-8 mx-auto md:mr-auto md:ml-0 uppercase'>
                        Show Profile
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
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
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url
    const collectionNfts = nfts.filter((n => n.artist === artist.id))
    artist.numberOfNfts = collectionNfts.length
  }

  return {
    props: { artists },
  }
}

export default Artists
