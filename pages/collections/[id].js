import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts } = collection

  return (
    <>
      <Head>
        <title>Collection | Project Moonshire</title>
        <meta name='description' content='Collection | Project Moonshire' />
      </Head>

      <div className='px-8 pb-24 flex flex-col items-center'>

        <h1 className='mx-auto'>{title}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8 text-sm'>
          <img src={public_url} alt='Cover Image' className='md:w-1/2' />
          <div>
            <p className='mt-4 text-xl'>{headline}</p>
            <hr className='border-t-2 border-lines my-8' />
            <p className='mt-4'>{description}</p>
            <p className='mt-8'>2.2 ETH</p>
            <p className='text-tiny mb-8'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
            <p>Launched: {year}</p>
            <p>Number of NFTs in this collection: {numberOfNfts}</p>
          </div>
        </div>

        <h2 className='mt-28 mb-8 self-start text-3xl'>NFTs contained in this Collection:</h2>
        <div>
          {collectionNfts.map(nft => {
            const { id, name, description, price, artists, image_url } = nft
            return (
              <Link href={`/nfts/${id}`} key={id}>
                <a>
                  <div className='hover:shadow px-6 py-4 mb-6 rounded shadow-lg hover:cursor-pointer transition-all'>
                    <div className='flex flex-col md:flex-row gap-12 items-start justify-between'>
                      <img src={image_url} alt='Cover Image' className='max-w-sm md:max-w-[200px]' />
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

  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })
  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()

  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  return {
    props: { collection, collectionNfts },
  }
}

export async function getStaticPaths() {
  let { data } = await supabase
    .from('collections')
    .select(`*`)

  const paths = data.map(d => ({
    params: { id: d.id.toString() },
  }))

  return { paths, fallback: false }
}

export default Collection
