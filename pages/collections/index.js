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
        <p className='text-xs mb-12 text-center'>Currently, Moonshire has {numberOfCollections} active collections to be explored</p>

        <div className='flex flex-col items-center justify-center gap-16 text-sm'>
          {collections.map(collection => {
            const { id, title, headline, description, year, public_url, created_at, numberOfNfts, walletAddress } = collection

            return (
              <div key={id} className='w-full flex flex-col md:flex-row items-start justify-start gap-4 md:gap-12 text-sm bg-detail dark:bg-detail-dark rounded p-4'>
                <div className='max-w-md'>
                  <Link href={`/collections/${id}`}>
                    <a className=''>
                      <img src={public_url} alt='Cover Image' className='aspect-square bg-cover' />
                    </a>
                  </Link>
                </div>
                <div className='md:w-1/2'>
                  <h1>{title}</h1>
                  <p className=''>{headline}</p>
                  <p className='text-tiny'>{year}</p>
                  <hr className='border-t-1 border-brand-dark/10 my-8' />
                  <p className='my-4'>{description}</p>
                  <p className='mb-4'>{numberOfNfts} Items available in this collection.</p>
                  <p className='text-tiny'>Created: {created_at.slice(0, 10)}</p>
                  <p className='text-tiny mb-4'>Owner: {walletAddress}</p>
                  <Link href={`/collections/${id}`}>
                    <a className='button button-detail mx-auto md:mx-0'>View Collection</a>
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
