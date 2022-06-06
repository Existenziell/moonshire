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

      <div className='flex flex-col items-center justify-center'>
        {nfts.length ?
          <>
            <MapNfts nfts={nfts} />
            <p className='text-xs mt-10'>Currently, there is a total of {numberOfNfts} NFTs for sale on Moonshire.</p>
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
