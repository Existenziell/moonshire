import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Artist = ({ artist, artistNfts }) => {
  const { id, name, headline, description, origin, public_url, created_at, numberOfNfts } = artist

  return (
    <>
      <Head>
        <title>{name} | Project Moonshire</title>
        <meta name='description' content='Artist | Project Moonshire' />
      </Head>

      <div className='px-8 pb-24 flex flex-col items-center'>

        <h1 className='mx-auto'>{name}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8'>
          <img src={public_url} alt='Artist Image' className='md:w-1/2' />
          <div>
            <p className='mt-4 text-xl'>{headline}</p>
            <hr className='border-t-2 border-lines my-8' />
            <p className='mt-4'>{description}</p>
            <p className='mt-4'>Origin: {origin}</p>
            <p>Number of NFTs from this artist: {numberOfNfts}</p>
            <p className='mt-8 text-xs'>On Moonshire since: {created_at.slice(0, 10)}</p>
          </div>
        </div>

        <h2 className='mt-28 mb-8 self-start text-3xl'>NFTs made by {name}:</h2>
        <div>
          {artistNfts.map(nft => {
            const { id, name, description, price, artists, public_url } = nft

            return (
              <Link href={`/nfts/${id}`} key={id}>
                <a>
                  <div className='hover:shadow px-6 py-4 mb-6 rounded shadow-lg hover:cursor-pointer transition-all'>
                    <div className='flex flex-col md:flex-row gap-12 items-start justify-center'>
                      <img src={public_url} alt='NFT Image' className='max-w-sm md:max-w-[200px]' />
                      <div className='w-full'>
                        <h2>{name}</h2>
                        <p className='text-tiny'>by {artists.name}</p>
                        <p className='my-4'>{description}</p>
                        <p className='text-admin-green'>{price} ETH</p>
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

export async function getStaticProps(context) {
  const id = context.params.id

  let { data: nfts } = await supabase.from('nfts').select(`*, artists(*)`).order('id', { ascending: true })
  let { data: artist } = await supabase.from('artists').select(`*`).eq('id', id).single()

  if (artist.avatar_url) {
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url
  }

  const artistNfts = nfts.filter((n => n.artist === artist.id))
  artist.numberOfNfts = artistNfts.length

  for (let nft of artistNfts) {
    const url = await getPublicUrl('nfts', nft.image_url)
    nft.public_url = url
  }

  return {
    props: { artist, artistNfts },
  }
}

export async function getStaticPaths() {
  let { data } = await supabase
    .from('artists')
    .select(`*`)

  const paths = data.map(d => ({
    params: { id: d.id.toString() },
  }))

  return { paths, fallback: false }
}

export default Artist
