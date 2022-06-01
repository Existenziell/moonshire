import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import { getPublicUrl } from '../../lib/getPublicUrl'

const Collection = ({ collection }) => {
  const { id, title, headline, desc, year, public_url, numberOfNfts } = collection

  return (
    <>
      <Head>
        <title>Collection | Project Moonshire</title>
        <meta name='description' content='Collection | Project Moonshire' />
      </Head>

      <div className='px-8 pb-24 flex flex-col items-center'>

        <h1 className='mx-auto '>{title}</h1>
        <div key={id} className='flex flex-col md:flex-row items-start justify-center gap-8 text-sm pt-12'>
          <img src={public_url} alt='Cover Image' className='md:w-1/2' />
          <div>
            <p className='mt-4'>{headline}</p>
            <hr className='border-t-2 border-lines my-8' />
            <p className='mt-4'>{desc}</p>
            <p className='mt-8'>2.2 ETH</p>
            <p className='text-tiny mb-8'>8/10 available, last sold at 10 ETH (25.345,00 USD)</p>
            <p>Launched: {year}</p>
            <p>Number of NFTs in this collection: {numberOfNfts}</p>
          </div>
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
    props: { collection },
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
