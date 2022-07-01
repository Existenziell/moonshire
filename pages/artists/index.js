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
            const { id, name, headline, description, public_url, collections, numberOfCollections, nfts, numberOfNfts } = artist
            return (
              <div key={id} className='md:snap-start md:snap-always md:h-[calc(100vh-200px)] w-full mb-40'>
                <div className={`flex flex-col md:flex-row items-center justify-center gap-[40px] px-[20px] md:px-[40px]`}>
                  <div className='md:w-1/2'>
                    <img src={public_url} alt='Artist Image' className='aspect-square shadow-2xl max-h-[calc(100vh-260px)]' />
                  </div>
                  <div className='md:w-1/2'>
                    <h1>{name}</h1>
                    <hr className='mt-8 mb-12' />
                    <p>{headline}</p>
                    <p className='mt-4'>{description}</p>
                    {/* <p className='mt-4'>Origin: {origin}</p> */}
                    {/* <p>{numberOfNfts} artworks by <span className='text-white'>{name}</span></p> */}
                    {/* <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p> */}
                    {/* <Link href={`/artists/${id}`}>
                      <a className='button button-cta mt-8 mx-auto md:mr-auto md:ml-0 uppercase'>
                        Show Profile
                      </a>
                    </Link> */}
                    <div className='mt-16'>
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
  const { data: artists } = await supabase.from('artists').select(`*`).order('created_at', { ascending: false })
  const { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).order('created_at', { ascending: false })

  for (let artist of artists) {
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url

    let collections = []
    for (let nft of nfts) {
      if (nft.artist === artist.id) collections.push(nft.collections)
    }
    /* eslint-disable no-undef */
    let uniqueCollections = [...new Map(collections.map((item) => [item['id'], item])).values()];
    /* eslint-enable no-undef */

    artist.collections = uniqueCollections
    artist.numberOfCollections = uniqueCollections.length

    const filteredNfts = nfts.filter((n => n.artist === artist.id))
    artist.nfts = filteredNfts
    artist.numberOfNfts = filteredNfts.length
  }

  return {
    props: { artists },
  }
}

export default Artists
