import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Collection = () => {
  const user = supabase.auth.user()

  return (
    <>
      <Head>
        <title>Collection | Project Moonshire</title>
        <meta name='description' content="Collection | Project Moonshire" />
      </Head>

      <div className='flex justify-center'>
        <h1>Collection</h1>
      </div>
    </>
  )
}

export default Collection
