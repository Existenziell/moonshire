import { supabase } from '../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'
import MapNfts from '../../components/MapNfts'

const Nfts = ({ nfts }) => {

  return (
    <>
      <Head>
        <title>NFTs DB | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full'>
        {nfts?.length ?
          <MapNfts nfts={nfts} />
          :
          <div>
            <h1 className="text-3xl">No items listed in marketplace</h1>
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

  return {
    props: { nfts }
  }
}

export default Nfts
