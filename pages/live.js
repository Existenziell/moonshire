import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'

const Live = () => {
  const user = supabase.auth.user()

  return (
    <>
      <Head>
        <title>Live | Project Moonshire</title>
        <meta name='description' content="Live | Project Moonshire" />
      </Head>

      <div className='flex justify-center'>
        <h1>Live</h1>
      </div>
    </>
  )
}

export default Live
