import { supabase } from '../../lib/supabase'
import { useQuery } from 'react-query'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

const Artists = () => {
  async function fetchApi(...args) {
    let { data: artists } = await supabase.from('artists').select(`*`).order('created_at', { ascending: false })
    let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).order('created_at', { ascending: false })

    for (let artist of artists) {
      let collections = []
      for (let nft of nfts) {
        if (nft.artist === artist.id) collections.push(nft.collections)
      }
      const uniqueCollections = [...new Map(collections.map((item) => [item['id'], item])).values()]

      artist.collections = uniqueCollections
      artist.numberOfCollections = uniqueCollections.length

      const filteredNfts = nfts.filter(n => n.artist === artist.id)
      artist.nfts = filteredNfts
      artist.numberOfNfts = filteredNfts.length
    }
    return artists
  }

  const { status, data: artists } = useQuery(["artists"], () =>
    fetchApi()
  )

  const calcHeight = () => {
    const height = window.innerHeight - 260
    return height
  }

  if (status === "error") return <p>{status}</p>
  if (status === 'loading') return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (status === 'success' && !artists) return <h1 className="mb-4 text-3xl">No artists found</h1>

  return (
    <>
      <Head>
        <title>Artists | Project Moonshire</title>
        <meta name='description' content="Artists | Project Moonshire" />
      </Head>

      <div className='snap-container'>
        {artists.map(artist => {
          const { id, name, headline, description, avatar_url, collections, numberOfCollections, nfts, numberOfNfts } = artist

          return (
            <div key={id} className='snap-item'>
              <div className='snap-grid'>
                <Link href={`/artists/${id}`}>
                  <a className='snap-image'>
                    <Image
                      width={calcHeight()}
                      height={calcHeight()}
                      placeholder="blur"
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${avatar_url}`}
                      blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${avatar_url}`}
                      alt='Artist Image'
                    />
                  </a>
                </Link>
                <div className='snap-text'>
                  <h1>{name}</h1>
                  <hr className='mt-8 mb-12' />
                  <p>{headline}</p>
                  <p className='mt-4'>{description}</p>
                  {/* <p className='mt-4'>Origin: {origin}</p> */}
                  {/* <p>{numberOfNfts} artworks by <span className='text-white'>{name}</span></p> */}
                  {/* <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p> */}
                  <div className='mt-16'>
                    <h1 className='mb-0'>Assets</h1>
                    <hr className='my-8' />
                    <div className='flex flex-col items-start justify-start md:max-h-64 flex-wrap'>
                      <p className='mb-4'>{numberOfCollections} {numberOfCollections > 1 ? `Collections` : `Collection`}</p>
                      {collections.map(c => (
                        <Link key={c.id} href={`/collections/${c.id}`}><a className='link-white block'>{c.title}</a></Link>
                      ))}
                      <p className='mt-8 mb-4'>{numberOfNfts} {numberOfNfts > 1 ? `NFTs` : `NFT`}</p>
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
    </>
  )
}

export default Artists
