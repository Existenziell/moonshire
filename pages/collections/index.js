import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import Head from 'next/head'
import Link from 'next/link'

const Collections = ({ collections, numberOfCollections }) => {
  return (
    <>
      <Head>
        <title>Collections | Project Moonshire</title>
        <meta name='description' content="Collections | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center'>

        <h1 className='mb-2'>Collections</h1>
        <p className='text-xs mb-8'>Currently, Moonshire has {numberOfCollections} active collections to be explored</p>

        <div className='flex flex-col items-center justify-center gap-24 text-sm'>
          {collections.map(collection => {
            const { id, title, headline, description, year, public_url, created_at, numberOfNfts } = collection

            return (
              <div key={id} className='flex flex-col md:flex-row items-start justify-start gap-12 text-sm pt-12'>
                <div className='max-w-xl'>
                  <Link href={`/collections/${id}`}>
                    <a className='max-w-xs'>
                      <img src={public_url} alt='Cover Image' className='max-w-md' />
                    </a>
                  </Link>
                </div>
                <div className='md:w-1/2'>
                  <h1>{title}</h1>
                  <p className='mt-4'>{headline}</p>
                  <p className='text-tiny'>{year}</p>
                  <hr className='border-t-2 border-lines my-8' />
                  <p className='mt-4'>{description}</p>
                  <p className='text-tiny mt-8'>Created: {created_at.slice(0, 10)}</p>
                  <p className='text-tiny mb-8'>{numberOfNfts} Items available in this collection. Last sold at 10 ETH (25.345,00 USD)</p>
                  <Link href={`/collections/${id}`}>
                    <a className='button button-detail'>View Collection</a>
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
  const { data: collections } = await supabase.from('collections').select(`*`).order('id', { ascending: true })
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*)`).order('id', { ascending: true })

  for (let collection of collections) {
    const collectionNfts = nfts.filter((n => n.collection === collection.id))
    const url = await getPublicUrl('collections', collection.image_url)
    collection.numberOfNfts = collectionNfts.length
    collection.public_url = url
  }
  const numberOfCollections = collections.length

  return {
    props: { collections, numberOfCollections },
  }
}

export default Collections
