import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Releases = () => {
  const user = supabase.auth.user()

  return (
    <>
      <Head>
        <title>Releases | Project Moonshire</title>
        <meta name='description' content="Releases | Project Moonshire" />
      </Head>

      <div className='flex justify-center'>
        <h1>Releases</h1>
      </div>
    </>
  )
}

export default Releases
