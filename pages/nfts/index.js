import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'
import MapNfts from '../../components/MapNfts'

const Nfts = ({ nfts, numberOfNfts }) => {

  return (
    <>
      <Head>
        <title>NFTs DB | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='flex flex-col items-center justify-center pb-24'>
        {nfts.length ?
          <>
            <p className='text-xs mb-16'>Currently, Moonshire has {numberOfNfts} NFTs for sale.</p>
            <MapNfts nfts={nfts} />
          </>
          :
          <div>
            <h1 className="px-20 mt-10 text-3xl">No items currently listed in marketplace.</h1>
            <Link href='/nfts/create'><a className='button button-detail mx-auto'>Create Asset</a></Link>
          </div>
        }
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase
    .from('nfts')
    .select(`*, collections(*), artists(*)`)
    .eq('listed', true)
    .order('id', { ascending: true })

  const numberOfNfts = nfts.length

  return {
    props: { nfts, numberOfNfts }
  }
}

export default Nfts
