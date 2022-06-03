import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Breadcrumbs from '../../components/Breadcrumbs'

const Collection = ({ collection, collectionNfts }) => {
  const { id, title, headline, description, year, public_url, numberOfNfts } = collection
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Collection | Project Moonshire</title>
        <meta name='description' content='Collection | Project Moonshire' />
      </Head>

      <div className='px-8 pb-24 flex flex-col items-center relative'>
        <Breadcrumbs backPath='/collections' currentPath={router.asPath} />

        <h1 className='mx-auto'>{title}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8 text-sm'>
          <img src={public_url} alt='Cover Image' className='md:w-1/2' />
          <div>
            <p className='mt-4 text-xl'>{headline}</p>
            <hr className='border-t-2 border-lines my-8' />
            <p className='mt-4'>{description}</p>
            <p className='mt-8'>2.2 ETH</p>
            <p className='text-tiny mb-8'>{numberOfNfts} items available, last sold for 10 ETH (25.345,00 USD)</p>
            <p>Launched: {year}</p>
          </div>
        </div>

        <h2 className='mt-28 mb-8 self-start text-3xl'>NFTs in this Collection:</h2>
        <div className='flex flex-wrap items-start justify-between w-full'>
          {collectionNfts.map(nft => {
            const { id, name, description, price, artists, image_url } = nft
            return (
              <Link href={`/nfts/${id}`} key={id}>
                <a>
                  <div className='hover:shadow px-6 py-4 mb-8 rounded shadow-lg border border-detail dark:border-detail-dark hover:cursor-pointer transition-all'>
                    <div className='flex flex-col gap-6 items-start justify-between'>
                      <img src={image_url} alt='Cover Image' className='max-w-[200px]' />
                      <div className='flex flex-col justify-between'>
                        <h2>{name}</h2>
                        <p className='text-tiny'>by {artists.name}</p>
                        {/* <p className='my-4'>{description}</p> */}
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
