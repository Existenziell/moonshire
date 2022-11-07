import { supabase } from '../../lib/supabase'
import { useQuery } from 'react-query'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'

const Artist = () => {
  const router = useRouter()
  const { id } = router.query

  async function fetchApi(...args) {
    if (!id) return
    let { data: artist } = await supabase.from('artists').select(`*`).eq('id', id).single()
    let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).eq('artist', artist.id).order('created_at', { ascending: false })

    const collections = []
    for (let nft of nfts) {
      collections.push(nft.collections)
    }
    const uniqueCollections = [...new Map(collections.map((item) => [item['id'], item])).values()]
    artist.collections = uniqueCollections
    artist.numberOfCollections = uniqueCollections.length

    const filteredNfts = nfts.filter(n => n.artist === artist.id)
    artist.nfts = filteredNfts
    artist.numberOfNfts = filteredNfts.length

    return artist
  }

  const { status, data: artist } = useQuery(["artist", id], () => fetchApi())

  if (status === "error") return <p>{status}</p>
  if (status === 'loading') return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (status === 'success' && !artist) return <h1 className="mb-4 text-3xl">No artist found</h1>

  const { name, headline, description, avatar_url, nfts, numberOfNfts, collections, numberOfCollections, origin } = artist

  return (
    <>
      <Head>
        <title>{name} | Artist | Project Moonshire</title>
        <meta name='description' content={`${name} | Artist | Project Moonshire`} />
      </Head>

      <div className='detail-page-wrapper'>
        <div className='sized-image-wrapper'>
          <Image
            width={1000}
            height={1000}
            placeholder="blur"
            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${avatar_url}`}
            blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${avatar_url}`}
            alt='Artist Image'
          />
        </div>
        <div className='md:w-1/2 w-full'>
          <h1 className='mx-auto'>{name}</h1>
          <hr className='mt-8 mb-12' />
          <p>{headline}</p>
          <p className='mt-4'>{description}</p>
          <p className='mt-4'>Origin: {origin}</p>
          <div className='mt-16'>
            <h1 className='mb-0'>Assets</h1>
            <hr className='my-8' />
            <div className='flex flex-col items-start justify-start max-h-64 flex-wrap'>
              <p className='mb-4'>{numberOfCollections} {numberOfCollections > 1 ? `Collections` : `Collection`}</p>
              {collections.map(c => (
                <Link key={c.id} href={`/collections/${c.id}`}><a className='link-white block'>{c.title}</a></Link>
              ))}
              <p className='mb-4 mt-8'>{numberOfNfts} {numberOfNfts > 1 ? `NFTs` : `NFT`}</p>
              {nfts.map(n => (
                <Link key={n.id} href={`/nfts/${n.id}`}><a className='link-white block'>{n.name}</a></Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Artist
