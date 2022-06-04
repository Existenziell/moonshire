import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import MapNfts from '../../components/MapNfts'

const Nfts = ({ nfts, numberOfNfts }) => {

  return (
    <>
      <Head>
        <title>NFTs DB | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        <h1 className='mb-2'>NFTs</h1>
        <p className='text-xs mb-16'>Currently, Moonshire has {numberOfNfts} NFTs for sale.</p>

        <div className='flex flex-col items-center justify-center gap-24 text-sm'>
          <div className="flex justify-center">
            {nfts.length ?
              <MapNfts nfts={nfts} />
              :
              <h1 className="px-20 py-10 text-3xl">No items currently listed in marketplace.</h1>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase
    .from('nfts')
    .select(`*, collections(*), artists(*)`)
    .order('id', { ascending: true })
  const numberOfNfts = nfts.length

  return {
    props: { nfts, numberOfNfts }
  }
}

export default Nfts
